from handlers.Basehandel import Basehandel
from modls import User,Autho
from uuit.Session import Session
class LoginHandel(Basehandel):
    def post(self, *args, **kwargs):
        email=self.get_json.get('user')
        pswd=self.get_json.get('pswd')
        user_=self.session_db.query(User).filter(User.email==email,User.pswd==pswd).first()
        if user_:
            session=Session(self)
            session.data['name']=user_.name
            session.data['user_id']=user_.id
            session.save()
            data={'eercode':0,'eermesg':'登陆成功'}
        else:
            data={'eercode':100,'eermesg':'账号或者密码错误'}
        self.write(data)
class Authon_LoginHandel(Basehandel):
    def post(self):
        email=self.get_json.get('email')
        pswd=self.get_json.get('pswd')
        autho_=self.session_db.query(Autho).filter(Autho.email==email,Autho.pswd==pswd).first()
        if autho_:
            session=Session(self,'autho_session_id')
            session.data['name']=autho_.name
            session.data['authon_id']=autho_.id
            session.save()
            Return_data={'eercode':0,'eermesg':'登陆成功'}
        else:
            Return_data={'eercode':100,'eermesg':'邮箱或者密码错误'}
        self.write(Return_data)
class Longin_InfoHandel(Basehandel):
    def post(self):
        session=Session(self)
        name=session.data.get('name',None)
        if name:
            Return_data={'eercode':0,'name':name}
        else:
            Return_data={'eercode':100,'name':'NULL'}
        self.write(Return_data)
class Authon_Login_InfoHandel(Basehandel):
    def post(self):
        session = Session(self,'autho_session_id')
        name = session.data.get('name', None)
        if name:
            Return_data = {'eercode': 0, 'name': name}
        else:
            Return_data = {'eercode': 100, 'name': 'NULL'}
        self.write(Return_data)
class Sign_OutHandel(Basehandel):
    def get(self):
        session=Session(self)
        session.clear()
        Retrun_data={'eercode':0,'eermegs':'注销登陆'}
        self.write(Retrun_data)
class Authon_Sign_OutHandel(Basehandel):
    def get(self):
        session=Session(self,'autho_session_id')
        session.clear()
        Retrun_data={'eercode':0,'eermegs':'注销登陆'}
        self.write(Retrun_data)