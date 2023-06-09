from common import create_connection, make_response
from http import HTTPStatus


def handler(event, context):
    conn = create_connection()
    cur = conn.cursor()

    # Get a list of Redshift table names
    try:
        cur.execute(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
        tables = [table[0] for table in cur.fetchall()]
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
        body={'tables': tables}
    )
