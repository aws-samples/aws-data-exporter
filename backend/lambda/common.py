import boto3
from datetime import date, datetime
from decimal import Decimal
import json
import os
import psycopg2
from urllib.parse import urlparse


REDSHIFT_HOST = os.environ['REDSHIFT_HOST']
SECRET_ID = os.environ['SECRET_ID']


class NotFoundError(Exception):
    pass


def default_proc(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime) or isinstance(obj, date):
        return obj.isoformat()
    raise TypeError


def get_secret():
    client = boto3.client('secretsmanager')
    secret = json.loads(client.get_secret_value(
        SecretId=SECRET_ID)['SecretString'])
    return secret


def create_connection():
    secret = get_secret()
    conn = psycopg2.connect(
        host=REDSHIFT_HOST,
        port=secret['port'],
        database=secret['database'],
        user=secret['user'],
        password=secret['password']
    )
    return conn


def make_response(status_code, body=None):
    return {
        'isBase64Encoded': False,
        'statusCode': status_code,
        'body': json.dumps(body, ensure_ascii=False, default=default_proc) if body else '',
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }
