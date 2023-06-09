import boto3
from http import HTTPStatus
import json
import os
import uuid

from common import make_response, NotFoundError

REPORT_TABLE_NAME = os.environ['REPORT_TABLE_NAME']
REPORT_ID_INDEX_NAME = os.environ['REPORT_ID_INDEX_NAME']
USER_POOL_ID = os.environ['USER_POOL_ID']
dynamodb = boto3.resource('dynamodb')
cognito = boto3.client('cognito-idp')
report_table = dynamodb.Table(REPORT_TABLE_NAME)


def share_report(user_id, shared_user_email, report_id):
    """
    Share reports with other users
    """
    # Get a user ID from email address
    response = cognito.list_users(
        UserPoolId=USER_POOL_ID,
        Filter=f'email="{shared_user_email}"'
    )

    if not response.get('Users') or len(response['Users']) == 0:
        raise NotFoundError('User to share not found')

    for attribute in response['Users'][0]['Attributes']:
        if attribute['Name'] == 'sub':
            shared_user_id = attribute['Value']

    # Checks if the specified report ID exists, and if so, shares it
    response = report_table.query(
        IndexName=REPORT_ID_INDEX_NAME,
        KeyConditionExpression='reportId = :reportId',
        ExpressionAttributeValues={
            ':reportId': report_id
        },
        Select='COUNT'
    )

    if response.get('Count', 0) == 0:
        raise NotFoundError('Report not found')

    report_table.put_item(
        Item={
            'userId': shared_user_id,
            'sortKey': f'shared#{report_id}',
            'sharingUserId': user_id
        }
    )


def handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    report_id = event['pathParameters']['reportId']
    body = json.loads(event['body'])
    shared_user_email = body['sharedUserEmail']

    try:
        share_report(user_id, shared_user_email, report_id)
        return make_response(
            status_code=HTTPStatus.OK
        )
    except NotFoundError as e:
        return make_response(
            status_code=HTTPStatus.NOT_FOUND,
            body={'message': e.args[0]}
        )
    except Exception as e:
        print(e)
        return make_response(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
