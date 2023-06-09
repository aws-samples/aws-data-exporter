from common import create_connection, make_response
from http import HTTPStatus

# Convert Redshift (Postgres) types for a frontend
column_type_alias = {
    'bigint': 'number',
    'bigserial': 'number',
    'bit': 'string',
    'bit varying': 'string',
    'boolean': 'string',
    'box': 'string',
    'bytea': 'string',
    'character': 'string',
    'character varying': 'string',
    'cidr': 'string',
    'circle': 'string',
    'date': 'date',
    'double precision': 'number',
    'inet': 'string',
    'integer': 'number',
    'interval': 'string',
    'json': 'string',
    'jsonb': 'string',
    'line': 'string',
    'lseg': 'string',
    'macaddr': 'string',
    'macaddr8': 'string',
    'money': 'number',
    'numeric': 'number',
    'path': 'string',
    'pg_lsn': 'string',
    'pg_snapshot': 'string',
    'point': 'string',
    'polygon': 'string',
    'real': 'number',
    'smallint': 'number',
    'smallserial': 'number',
    'serial': 'number',
    'text': 'string',
    'time': 'date',
    'time with time zone': 'date',
    'time without time zone': 'date',
    'timestamp': 'date',
    'timestamp with time zone': 'date',
    'timestamp without time zone': 'date',
    'tsquery': 'string',
    'tsvector': 'string',
    'txid_snapshot': 'string',
    'uuid': 'string',
    'xml': 'string',
}


def handler(event, context):
    table_name = event['pathParameters']['tableName']
    conn = create_connection()
    cur = conn.cursor()

    # Get column names and types by specifying the table name
    try:
        cur.execute(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = %s ORDER BY ordinal_position", [table_name])
        results = cur.fetchall()
        columns = []
        for result in results:
            columns.append(
                {'name': result[0], 'type': column_type_alias[result[1]]})
    except Exception as e:
        return make_response(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            body={'message': e}
        )
    finally:
        cur.close()
        conn.close()

    return make_response(
        status_code=HTTPStatus.OK,
        body={'tableName': table_name, 'columns': columns}
    )
