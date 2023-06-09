import boto3
from http import HTTPStatus
import os

from common import make_response
from report.get_by_id import get_report_by_id

REPORT_TABLE_NAME = os.environ['REPORT_TABLE_NAME']
REPORT_ID_INDEX_NAME = os.environ['REPORT_ID_INDEX_NAME']
dynamodb = boto3.resource('dynamodb')
report_table = dynamodb.Table(REPORT_TABLE_NAME)


def get_my_report(user_id):
    """
    Retrieve my reports
    """
    response = report_table.query(
        KeyConditionExpression='userId = :userId and begins_with(sortKey, :sortKey)',
        ExpressionAttributeValues={
            ':userId': user_id,
            ':sortKey': 'timestamp'
        },
        ScanIndexForward=False  # 時系列で降順に取得する
    )
    reports = []
    for item in response['Items']:
        report = {}
        report['reportId'] = item['reportId']
        report['reportName'] = item['reportName']
        report['tableName'] = item['tableName']
        report['conditions'] = item['conditions']
        report['columns'] = item['columns']
        report['reportTime'] = item['sortKey'].split('#')[-1]
        reports.append(report)
    return reports


def get_shared_report(user_id):
    """
    Retrieving reports shared by other users
    """
    response = report_table.query(
        KeyConditionExpression='userId = :userId and begins_with(sortKey, :sortKey)',
        ExpressionAttributeValues={
            ':userId': user_id,
            ':sortKey': 'shared'
        },
        ScanIndexForward=False  # 時系列で降順に取得する
    )
    reports = []
    for item in response['Items']:
        report_id = item['sortKey'].split('#')[-1]
        report = get_report_by_id(report_id)
        reports.append(report)
    return reports


def handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    report_type = event['queryStringParameters']['type']

    try:
        if report_type == 'my':
            report = get_my_report(user_id)
        elif report_type == 'shared':
            report = get_shared_report(user_id)
        return make_response(
            status_code=HTTPStatus.OK,
            body={'report': report}
        )
    except Exception as e:
        print(e)
        return make_response(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
