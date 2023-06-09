import csv
from http import HTTPStatus
import json
import os
import uuid

from common import make_response


def create_csv(columns, table):
    """
    Create csv from columns and table information received from client
    """

    csv_file_path = f'/tmp/{str(uuid.uuid4())}'
    with open(csv_file_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(columns)
        writer.writerows(table)

    return csv_file_path


def handler(event, context):
    body = json.loads(event['body'])
    claims = event['requestContext']['authorizer']['claims']
    if (not claims.get('custom:Downloadable')) or (claims['custom:Downloadable'] == 'false'):
        return make_response(
            status_code=HTTPStatus.FORBIDDEN
        )

    columns, table = body['columns'], body['table']
    if columns is None or table is None:
        return make_response(
            status_code=HTTPStatus.BAD_REQUEST
        )

    csv_file_path = create_csv(columns, table)

    with open(csv_file_path) as f:
        csv_content = f.read()
        response = {
            "statusCode": HTTPStatus.OK,
            "headers": {
                "Content-Type": "text/csv",
                'Access-Control-Allow-Origin': '*'
            },
            "body": csv_content
        }

    try:
        os.remove(csv_file_path)
    except Exception as e:
        print(e)

    return response
