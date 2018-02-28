from tornado.web import RequestHandler,StaticFileHandler
import modls
import json
from uuit.Session import Session
class Basehandel(RequestHandler):
    def initialize(self): #initialize方法，最先执行
        self.session_db=modls.sessiondb() #定义一个SQLalchemy的session对象
    def prepare(self):
        if self.request.headers.get('Content-Type','').startswith('application/json'): #判断headers头是否是json类型
            self.get_json=json.loads(self.request.body)
    def set_default_headers(self):#设置headers
        self.set_header('Content-Type','application/json;charset=UTF-8')  #设置返回的数据为JSON格式
    def get_current_user(self): #判断是否登陆
        session=Session(self)
        return session.data

    def on_finish(self):
        self.session_db.close()
class StaticFileBaseHandler(StaticFileHandler):  #静态文件处理类
    def __init__(self,*args,**kwargs):
        super(StaticFileBaseHandler,self).__init__(*args,**kwargs)
        self.xsrf_token  #给静态文件增一个xsrf_token的cookie
