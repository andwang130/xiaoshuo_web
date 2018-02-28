import uuid
import logging
import json
from settings import SESSION_EXPIRES_SECONDS
class Session():
    def __init__(self,request_handle,user_ssid='session_id'):
        self.user_ssid=user_ssid
        self.request_handle=request_handle
        self.session_id=self.request_handle.get_secure_cookie(self.user_ssid) #获取cookie中的的session_id
        if not self.session_id: #如果没有就新创建一个
            self.session_id='sess_id'+uuid.uuid4().hex
            self.data={}
        else:#如果存在。就从redis中把数据取出来放到data当中
            try:
                json_data=self.request_handle.application.redis.get(self.session_id)
            except Exception as e:
                logging.error(e)
                print(e)
            if not json_data: #如果json_data数据为空
                self.data={}
            else:
                self.data=json.loads(json_data)
    def save(self):
        try:
            str_data=json.dumps(self.data)
            self.request_handle.application.redis.setex(self.session_id,SESSION_EXPIRES_SECONDS,str_data)
        except Exception as e:
            logging.error(e)
        else:
            self.request_handle.set_secure_cookie(self.user_ssid,self.session_id)

    def clear(self):
        try:
            self.request_handle.application.redis.delete(self.session_id)
        except Exception as e:
            logging.error(e)
        self.request_handle.clear_cookie(self.user_ssid)


