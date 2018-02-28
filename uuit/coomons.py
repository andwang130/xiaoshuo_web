import datetime
import logging
from uuit.Session import Session
def get_now():
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
def Parameter_error(handel,e):
    logging.error(e)
    Return_data = {'eercode': 400, 'eermegs': '参数错误'}
    handel.write(Return_data)
def Data_eeror(handel,e):
    logging.error(e)
    handel.session_db.rollback()
    Return_data = {'eercode': 200, 'eermegs': '数据库错误'}
    handel.write(Return_data)
def required_login(fun):
    def wrapper(handel,*args,**kwargs):
        if not handel.get_current_user():
            handel.write({'eercode':405,'eermegs':'用户未登陆'})
        else:
            fun(handel,*args,*kwargs)

    return wrapper
def get_session_authonid(handel):
    session=Session(handel,'autho_session_id')
    authonid=session.data['authon_id']
    return authonid
