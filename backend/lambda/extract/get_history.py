import boto3
from http import HTTPStatus
import os

from common import make_response

HISTORY_TABLE_NAME = os.environ['HISTORY_TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
history_table = dynamodb.Table(HISTORY_TABLE_NAME)


def get_extraction_history(user_id):
    """
    Retrieve the extraction history in chronological order by specifying the user ID.
    """
    responses = history_table.query(
        KeyConditionExpression='userId = :userId',
        ExpressionAttributeValues={':userId': user_id},
        ScanIndexForward=False  # 時系列で降順に取得する
    )
    if not responses.get('Items'):
        return []

    history_records = []
    for response in responses['Items']:
        history_record = {}
        history_record['tableName'] = response['tableName']
        history_record['conditions'] = response['conditions']
        history_record['columns'] = response['columns']
        history_record['extractionTime'] = response['timestamp']
        history_records.append(history_record)
    return history_records


def handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']

    history_records = get_extraction_history(user_id)
    return make_response(
        status_code=HTTPStatus.OK,
        body={'historyRecords': history_records}
    )
