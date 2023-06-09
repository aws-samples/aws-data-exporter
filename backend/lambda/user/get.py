from http import HTTPStatus
from common import make_response


def handler(event, context):
    claims = event['requestContext']['authorizer']['claims']
    print(claims)
    if claims.get('custom:Downloadable'):
        if claims['custom:Downloadable'] == 'true':
            return make_response(
                status_code=HTTPStatus.OK,
                body={
                    'downloadable': True,
                    'email': claims['email']
                }
            )
        else:
            return make_response(
                status_code=HTTPStatus.OK,
                body={
                    'downloadable': False,
                    'email': claims['email']
                }
            )
    else:
        return make_response(
            status_code=HTTPStatus.NOT_FOUND
        )
