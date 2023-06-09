import boto3
from http import HTTPStatus
import os

from common import make_response, NotFoundError

REPORT_TABLE_NAME = os.environ['REPORT_TABLE_NAME']
REPORT_ID_INDEX_NAME = os.environ['REPORT_ID_INDEX_NAME']
dynamodb = boto3.resource('dynamodb')
report_table = dynamodb.Table(REPORT_TABLE_NAME)


def get_report_by_id(report_id):
    """
    Retrieve a report by specifying the report ID
    """
    response = report_table.query(
        IndexName=REPORT_ID_INDEX_NAME,
        KeyConditionExpression='reportId = :reportId',
        ExpressionAttributeValues={
            ':reportId': report_id
        }
    )
    if response.get('Count', 0) >= 1:
        report = {}
        report['reportId'] = report_id
        report['reportName'] = response['Items'][0]['reportName']
        report['tableName'] = response['Items'][0]['tableName']
        report['conditions'] = response['Items'][0]['conditions']
        report['columns'] = response['Items'][0]['columns']
        report['reportTime'] = response['Items'][0]['sortKey'].split('#')[-1]
        return report
    else:
        raise NotFoundError('Report not found')


def handler(event, context):
    report_id = event['pathParameters']['reportId']

    try:
        report = get_report_by_id(report_id)
        return make_response(
            status_code=HTTPStatus.OK,
            body={'report': report}
        )
    except NotFoundError as e:
        return make_response(
            status_code=HTTPStatus.NOT_FOUND,
            body={
                'message': e.args[0]
            }
        )
    except Exception as e:
        print(e)
        return make_response(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
