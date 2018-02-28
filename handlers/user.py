from handlers.Basehandel import Basehandel
from modls import Follows,Bookes,User,Recharge,Autho,Income,RechaRecord
from uuit.Session import Session
from uuit.coomons import Parameter_error,Data_eeror,get_now,required_login

class GET_MybooksHandel(Basehandel):
    @required_login
    def post(self):
        page=int(self.get_json.get('page'))-1
        session=Session(self)
        userid=session.data.get('user_id')
        if not userid:
            return
        conut=self.session_db.query(Follows).filter(Follows.follow_nameid==userid).count()
        follows=self.session_db.query(Follows).filter(Follows.follow_nameid==userid).offset(page*5).limit(5)
        data_list=[]
        for i in follows:
            book=self.session_db.query(Bookes).filter(Bookes.id==i.follow_booke).first()
            data={
                'bookname':book.bookname,
                'id':book.id
            }
            data_list.append(data)
        Retrun_data={'eercode':0,'eermegs':'请求成功','data':data_list,'count':conut}
        self.write(Retrun_data)
class Recharge_Handel(Basehandel):
    @required_login
    def post(self):
        try:
            money=int(self.get_argument('money'))*100
        except Exception as e:
            Parameter_error(self,e)
            return
        session=Session(self)
        userid=session.data.get('user_id')
        rechaRecord=RechaRecord(coin=money,userid=userid,set_time=get_now())
        self.session_db.add(rechaRecord)
        self.session_db.query(User).filter(User.id==userid).update({User.coin:User.coin+money})
        try:
            self.session_db.commit()
            Return_data={'eercode':0,'eermegs':'请求成功'}
            self.write(Return_data)
        except Exception as e:
            Data_eeror(self,e)
            return
class Areward_Handel(Basehandel):
    @required_login
    def post(self):
        try:
            bookid=int(self.get_json.get('bookid'))
            coin=int(self.get_json.get('coin'))
        except Exception as e:
            Parameter_error(self,e)
            return
        session=Session(self)
        userid=session.data.get('user_id')
        if self.session_db.query(User).filter(User.id==userid).first().coin-coin<0:
            Return_data={'eercode':300,'eermegs':'大佬你的余额不足'}
            self.write(Return_data)
            return
        book=self.session_db.query(Bookes).filter(Bookes.id==bookid).first() #查询该书
        self.session_db.query(User).filter(User.id==userid).update({User.coin:User.coin-coin}) #修改用户的阅读币
        title='打赏了%s'%book.bookname
        recharge=Recharge(rech_title=title,rech_num=coin,rech_bookid=bookid,userid=userid,set_time=get_now())#创建一个消费记录
        self.session_db.add(recharge)
        self.session_db.query(Autho).filter(Autho.id==book.authoid).update({Autho.coin:Autho.coin+coin})#修改作者的阅读币
        title='%s打赏了%s'%(session.data.get('name'),coin)
        income=Income(income_title=title,authoid=book.authoid,income_booke=bookid,set_time=get_now(),income_num=coin)
        self.session_db.add(income)
        try:
            self.session_db.commit()
            Return_data = {'eercode': 0, 'eermegs': '打赏成功'}
            self.write(Return_data)
        except Exception as e:
            Data_eeror(self,e)
            return
class GET_CionmaxHandel(Basehandel):
    @required_login
    def get(self):
        session=Session(self)
        userid=session.data.get('user_id')
        user=self.session_db.query(User.coin).filter(User.id==userid).first()
        data={'cion':user.coin}
        Return_data={'eercode':0,'eermegs':'成功','data':data}
        self.write(Return_data)
class GET_ConsumptionHandel(Basehandel):
    @required_login
    def get(self):
        try:
            page=int(self.get_argument('page'))-1
            session = Session(self)
            userid = session.data.get('user_id')
        except Exception as e:
            Parameter_error(self,e)
            return
        count=self.session_db.query(Recharge).filter(Recharge.userid == userid).count()
        recharges= self.session_db.query(Recharge).filter(Recharge.userid == userid).offset(page*10).limit(10)
        recharge_data=[{'id':recharge.id,'rech_title':recharge.rech_title,'rech_num':recharge.rech_num,'set_time':str(recharge.set_time)} for recharge in recharges]
        Return_data={'eercode':0,'eermegs':'成功','data':recharge_data,'count':count}
        self.write(Return_data)
class GET_RechaRecordHandel(Basehandel):
    @required_login
    def get(self):
        try:
            page=int(self.get_argument('page'))-1
            session = Session(self)
            userid = session.data.get('user_id')
        except Exception as e:
            Parameter_error(self,e)
            return
        count=self.session_db.query(RechaRecord).filter(RechaRecord.userid == userid).count()
        RechaRecord_list= self.session_db.query(RechaRecord).filter(RechaRecord.userid == userid).offset(page*10).limit(10)
        recharge_data=[{'id':recharge.id,'coin':recharge.coin,'set_time':str(recharge.set_time)} for recharge in RechaRecord_list]
        Return_data={'eercode':0,'eermegs':'成功','data':recharge_data,'count':count}
        self.write(Return_data)
class DELETE_bookBthHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
        except Exception as e:
            Parameter_error(self,e)
        userid=Session(self).data.get('user_id')
        self.session_db.query(Follows).filter(Follows.follow_booke==bookid,Follows.follow_nameid==userid).delete()
        try:
            self.session_db.commit()
            Return_data={'eercode':0,'eermegs':'删除成功'}
            self.write(Return_data)
            return
        except Exception as e:
            Data_eeror(self,e)
            return

    def post(self):
        bookids=self.get_json.get('bookids')
        if not bookids:
            Parameter_error(self,'参数错误')
            return
        else:
            userid = Session(self).data.get('user_id')
            bookids=tuple(bookids)
            self.session_db.query(Follows).filter(Follows.follow_booke.in_(bookids),Follows.follow_nameid == userid).delete(synchronize_session=False)
            try:
                self.session_db.commit()
                Return_data = {'eercode': 0, 'eermegs': '删除成功'}
                self.write(Return_data)
                return
            except Exception as e:
                Data_eeror(self,e)
                return

