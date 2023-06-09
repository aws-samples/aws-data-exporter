import boto3
from datetime import datetime
from http import HTTPStatus
import json
import os
import uuid

from common import make_response

REPORT_TABLE_NAME = os.environ['REPORT_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
report_table = dynamodb.Table(REPORT_TABLE_NAME)


def save_report(columns, conditions, user_id, table_name, report_name):
    """
    Save a report to DynamoDB
    """
    report_id = str(uuid.uuid4())

    try:
        report_table.put_item(
            Item={
                'userId': user_id,
                'sortKey': f'timestamp#{datetime.now().isoformat()}',
                'reportId': report_id,
                'tableName': table_name,
                'reportName': report_name,
                'columns': columns,
                'conditions': conditions
            }
        )
        return report_id
    except Exception as e:
        print(e)


def handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    body = json.loads(event['body'])
    conditions, columns, table_name, report_name = body['conditions'], body[
        'columns'], body['tableName'], body['reportName']

    try:
        report_id = save_report(columns, conditions,
                                user_id, table_name, report_name)
        return make_response(
            status_code=HTTPStatus.OK,
            body={
                'reportId': report_id
            }
        )
    except:
        return make_response(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
