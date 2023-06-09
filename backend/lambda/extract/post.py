import boto3
from datetime import datetime
from http import HTTPStatus
import json
import os
from psycopg2 import sql
import uuid

from common import create_connection, make_response

HISTORY_TABLE_NAME = os.environ['HISTORY_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
history_table = dynamodb.Table(HISTORY_TABLE_NAME)
MAX_ROWS_SIZE = 5000


def create_where_statement(conditions):
    """
    Convert extraction conditions to SQL WHERE statements
    """
    if not conditions:
        return None
    clauses = []
    # DB table and column names are stored in "identifiers",
    # and conditional values are stored in "params".
    identifiers, params = [], []
    for condition in conditions:
        # String conditions
        if condition['type'] == 'string':
            if condition['operator'] == 'eq':
                op = ' = '
            elif condition['operator'] == 'neq':
                op = ' <> '
            elif condition['operator'] == 'contains':
                op = ' LIKE '
                condition['value'] = '%' + \
                    condition['value'] + '%'
            clause = f"{{}} {op} %s"
            identifiers.append(sql.Identifier(condition['columnName']))
            params.append(condition['value'])

        # Number conditions
        elif condition['type'] == 'number':
            if condition['operator'] == 'eq':
                op = ' = '
            elif condition['operator'] == 'neq':
                op = ' <> '
            elif condition['operator'] == 'gt':
                op = ' > '
            elif condition['operator'] == 'lt':
                op = ' < '
            elif condition['operator'] == 'gte':
                op = ' >= '
            elif condition['operator'] == 'lte':
                op = ' <= '
            clause = f"{{}} {op} %s"
            identifiers.append(sql.Identifier(condition['columnName']))
            params.append(condition['value'])

        # Absolute date conditions
        elif condition['type'] == 'absoluteDate':
            clause = "{}::date BETWEEN %s AND %s"
            identifiers.append(sql.Identifier(condition['columnName']))
            params.extend([condition['startDate'], condition['endDate']])

        # Reletive date (N value specified) conditions
        elif condition['type'] == 'relativeDateN':
            if condition['period'] == 'day':
                clause = "{} = CURRENT_DATE - INTERVAL %s"
                identifiers.append(sql.Identifier(condition['columnName']))
                params.append(str(condition['n']) + condition['period'])

            else:
                clause = "{} >= date_trunc(%s, CURRENT_DATE) - INTERVAL %s AND {} < date_trunc(%s, CURRENT_DATE) - INTERVAL %s"
                identifiers.extend([sql.Identifier(
                    condition['columnName']), sql.Identifier(condition['columnName'])])
                params.extend([condition['period'], str(condition['n']) + condition['period'],
                               condition['period'], str(int(condition['n']) - 1) + condition['period']])

        # Relative date (today, yesterday, last week, last month, last year) conditions
        elif condition['type'] == 'relativeDate':
            if condition['period'] == 'today':
                n = 0
                period = 'day'
            elif condition['period'] == 'yesterday':
                n = 1
                period = 'day'
            elif condition['period'] == 'lastWeek':
                n = 1
                period = 'week'
            elif condition['period'] == 'lastMonth':
                n = 1
                period = 'month'
            elif condition['period'] == 'lastYear':
                n = 1
                period = 'year'
            clause = "{} >= date_trunc(%s, CURRENT_DATE) - INTERVAL %s AND {} < date_trunc(%s, CURRENT_DATE) - INTERVAL %s"
            identifiers.extend([sql.Identifier(
                condition['columnName']), sql.Identifier(condition['columnName'])])
            params.extend([period, str(n) + period,
                          period, str(n - 1) + period])

        # Time conditions
        elif condition['type'] == 'time':
            clause = "{}::time BETWEEN %s AND %s"
            identifiers.append(sql.Identifier(condition['columnName']))
            params.extend([condition['startTime'], condition['endTime']])

        clauses.append(clause)

    return 'WHERE ' + ' AND '.join(clauses), identifiers, params


def create_select_statement(columns, table_name):
    """
    Convert columns to extract to SQL SELECT statements
    """
    if not columns:
        return None
    identifiers = list(map(sql.Identifier, columns)) + \
        [sql.Identifier(table_name)]
    return 'SELECT ' + ', '.join(['{}'] * len(columns)) + ' FROM {} ', identifiers


def save_extraction_history(columns, conditions, user_id, table_name):
    """
    Store extraction history (extracted columns and conditions) in DynamoDB
    """
    extraction_id = str(uuid.uuid4())

    history_table.put_item(
        Item={
            'userId': user_id,
            'timestamp': datetime.now().isoformat(),
            'extractionId': extraction_id,
            'tableName': table_name,
            'columns': columns,
            'conditions': conditions
        }
    )


def handler(event, context):
    conn = create_connection()
    cur = conn.cursor()
    body = json.loads(event['body'])
    conditions, columns, table_name = body['conditions'], body['columns'], body['tableName']
    user_id = event['requestContext']['authorizer']['claims']['sub']

    select_statement, select_identifiers = create_select_statement(
        columns, table_name)
    where_statement, where_identifiers, params = create_where_statement(
        conditions)
    if select_statement is None or where_statement is None:
        return make_response(
            status_code=HTTPStatus.BAD_REQUEST,
            body={'message': 'Bad Request'}
        )

    try:
        # Execute extraction
        statement = select_statement + \
            where_statement + f'LIMIT {MAX_ROWS_SIZE}'
        identifiers = select_identifiers + where_identifiers
        cur.execute(sql.SQL(statement).format(*identifiers), params)
        results = cur.fetchall()
        # Return error if the number of columns of data to be retrieved exceeds a certain size
        if len(results) > MAX_ROWS_SIZE:
            return make_response(
                status_code=HTTPStatus.BAD_REQUEST,
                body={'message': 'Expected response size is too large.'}
            )
        items = []
        for result in results:
            items.append(result)

        # Save extraction history
        save_extraction_history(columns, conditions, user_id, table_name)

    except Exception as e:
        print(e)
        return make_response(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            body={'message': 'Internal Server Error'}
        )
    finally:
        cur.close()
        conn.close()

    return make_response(
        status_code=HTTPStatus.OK,
        body={'items': items}
    )
