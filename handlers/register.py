from handlers.Basehandel import Basehandel
from modls import User,Autho
from uuit.coomons import get_now
import logging
class RegisteHandlers(Basehandel):
    def post(self):
        user=self.get_json.get('user')
        pswd=self.get_json.get('pswd')
        email=self.get_json.get('email')
        Phone=self.get_json.get('Phone')
        if self.session_db.query(User).filter(User.name==user).first():
            Return_data={'eercode':100,'eermesg':'该用户已经存在'}
            self.write(Return_data)
            return
        user=User(name=user,pswd=pswd,email=email,Phone=Phone,set_time=get_now())
        try:
            self.session_db.add(user)
            self.session_db.commit()
            Return_data = {'eercode': 0, 'eermesg': '注册成功'}
        except:
            self.session_db.rollback()  #失败 ，回滚
            Return_data={'eercode':200,'eermesg':'数据库错误'}
        self.write(Return_data)
class Authon_RegistHandlers(Basehandel):
    def post(self):
        email=self.get_json.get('email')
        name=self.get_json.get('name')
        pswd=self.get_json.get('pswd')
        if self.session_db.query(Autho).filter(Autho.email==email).first():
            Return_data={'eercode':100,'eermesg':'该邮箱已经注册'}
            self.write(Return_data)
            return
        authon=Autho(email=email,name=name,pswd=pswd,set_time=get_now())
        self.session_db.add(authon)
        try:
            self.session_db.commit()
            Return_data={'eercode':0,'eermesg':'注册成功'}
        except Exception as e:
            Return_data = {'eercode':200,'eermesg':'数据库错误'}
            logging.error(e)
            self.session_db.rollback()#回滚
        self.write(Return_data)

