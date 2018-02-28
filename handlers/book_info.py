from handlers.Basehandel import Basehandel
from modls import Bookes,Autho,Chapter,Follows,Comment,User,Catalog,Income,Recharge
import logging
from uuit.Session import Session
from uuit.coomons import Parameter_error,get_now,Data_eeror
from sqlalchemy import func
import datetime
from  settings import CACHE_EXPIRES_SECONDS
import json
class GET_BookInfoHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
        except Exception as e:
            logging.error(e)
            Return_data={'eercode':400,'eermegs':'参数错误'}
            self.write(Return_data)
            return
        book=self.session_db.query(Bookes).filter(Bookes.id==bookid).first()
        book_data={
              'id':book.id,
              'bookname':book.bookname,
              'booktype':book.booktype,
              'introduce':book.introduce,
              'booktag':book.booktag,
              'book_img':book.book_img,
              'book_sex':book.book_sex,
              'collect_num':book.collect_num,
              'set_time':str(book.set_time),
              'authoid':book.authoid,
              'action':book.action,
                'free':book.free,
                'font_num':book.font_num,
              }
        authon=self.session_db.query(Autho).filter(Autho.id==book_data['authoid']).first()
        book_max=self.session_db.query(Bookes).filter(Bookes.authoid==authon.id).count()
        times=(datetime.datetime.now()-authon.set_time).days
        authon_data={'id':authon.id,'name':authon.name,'authon_type':authon.authon_type,'bookmax':book_max,'times':times}
        Return_data={'eercode':0,'eermegs':'请求成功','data':{'book':book_data,'authon':authon_data}}
        self.write(Return_data)
class GET_ChaptersHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
        except Exception as e:
            logging.error(e)
            Return_data = {'eercode': 400, 'eermegs': '参数错误'}
            self.write(Return_data)
            return
        catalogs=self.session_db.query(Catalog.id,Catalog.Catalog_title).filter(Catalog.bookid==bookid).all()
        data_list=[]
        for catalog in catalogs:
            data={'catalog_id':catalog.id,'catalog_title':catalog.Catalog_title}
            data['Chapters']=[]
            Chapters=self.session_db.query(Chapter).filter(Chapter.Catalog_id==catalog.id).all()
            for chapte in Chapters:
                chapte_data={'chapte_id':chapte.id,'chapter_title':chapte.chapter_title}
                data['Chapters'].append(chapte_data)
            data_list.append(data)
        Return_data={'eercode':0,'eermegs':'请求成功','data':data_list}
        self.write(Return_data)


class GET_ContenHandel(Basehandel):
    def get(self):
        try:
            chapteID=int(self.get_argument('ChaptID'))
        except Exception as e:
            logging.error(e)
            Return_data = {'eercode': 400, 'eermegs': '参数错误'}
            self.write(Return_data)
            return

        Chapte=self.session_db.query(Chapter).filter(Chapter.id==chapteID).first()
        chapte_data={'id':Chapte.id,'chapter_title':Chapte.chapter_title,'conten':Chapte.conten,'set_time':str(Chapte.set_time),'count':len(Chapte.conten)}
        up_chpte=self.session_db.query(Chapter.id).filter(Chapter.booke_id==Chapte.booke_id,Chapter.set_time<Chapte.set_time).first()
        next_chpte=self.session_db.query(Chapter.id).filter(Chapter.booke_id == Chapte.booke_id, Chapter.set_time>Chapte.set_time).first()
        if up_chpte:
            chapte_data['up_id']=up_chpte.id
        else:
            chapte_data['up_id']='NULL'
        if next_chpte:
            chapte_data['next_id']=next_chpte.id
        else:
            chapte_data['next_id'] ='NULL'
        book=self.session_db.query(Bookes.bookname,Bookes.id,Bookes.authoid,Bookes.booktype).filter(Bookes.id==Chapte.booke_id).first()
        book_data={'id':book.id,'bookname':book.bookname,'booktype':book.booktype}
        authon=self.session_db.query(Autho.id,Autho.name).filter(Autho.id==book.authoid).first()
        authon_data={'id':authon.id,'name':authon.name}
        Return_data = {'eercode': 0, 'eermegs': '请求成功', 'data':{'chapte_data':chapte_data,'authon_data':authon_data,'book_data':book_data}}
        self.write(Return_data)
class Add_BookBtnHandel(Basehandel):
    def post(self):
        try:
            bookid=int(self.get_json.get('bookid'))
        except Exception as e:
            logging.error(e)
            Return_data = {'eercode': 400, 'eermegs': '参数错误'}
            self.write(Return_data)
            return
        session=Session(self)
        userid=session.data['user_id']
        if self.session_db.query(Follows).filter(Follows.follow_nameid==userid,Follows.follow_booke==bookid).first():
            Return_data = {'eercode': 100, 'eermegs': '已经存在'}
            self.write(Return_data)
            return
        follows=Follows(follow_nameid=userid,follow_booke=bookid,set_time=get_now())
        self.session_db.add(follows)
        self.session_db.query(Bookes).filter(Bookes.id==bookid).update({Bookes.collect_num:Bookes.collect_num+1})
        try:
            self.session_db.commit()
            Return_data = {'eercode': 0, 'eermegs': '加入书架成功'}
        except Exception as e:
            self.session_db.rollback()
            logging.error(e)
            Return_data = {'eercode': 200, 'eermegs': '数据库错误'}
        self.write(Return_data)

class Add_CommentHandle(Basehandel):
    def post(self):
        try:
            bookid=int(self.get_json.get('bookid'))
            title=self.get_json.get('title')
            conten=self.get_json.get('conten')
        except Exception as e:
            Parameter_error(self,e) #参数错误的公共函数
            return
        session=Session(self)
        userid=session.data['user_id']
        comment=Comment(Comment_title=title,conten=conten,set_time=get_now(),bookid=bookid,userid=userid)
        self.session_db.add(comment)
        try:
            self.session_db.commit()
            Return_data = {'eercode': 0, 'eermegs': '留言成功'}
            self.write(Return_data)
        except Exception as e:
            Data_eeror(self,e)
class GET_CommentHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
            page=int(self.get_argument('page'))-1
        except Exception as e:
            Parameter_error(self,e)
            return
        count=self.session_db.query(Comment).filter(Comment.bookid==bookid).count()
        comment=self.session_db.query(Comment).filter(Comment.bookid==bookid).order_by(Comment.set_time.desc()).offset(page*10).limit(10)
        comment_data=[{'Comment_title':i.Comment_title,'conten':i.conten,'set_time':str(i.set_time),'username':self.session_db.query(User.name).filter(User.id==i.userid).first().name} for i in comment]
        Return_data={'eercode':0,'eermegs':'获取评论成功','data':comment_data,'count':count}
        self.write(Return_data)


class GET_Otherhandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('now_bookid'))
        except Exception as e:
            Parameter_error(self,e)
            return
        books=self.session_db.query(Bookes).filter(Bookes.id!=bookid).limit(4)
        book_data=[{'bookid':book.id,'bookname':book.bookname,'bookimg':book.book_img,'introduce':book.introduce} for book in books]
        Return_data={'eercode':0,'eermegs':'请求成功','data':book_data}
        self.write(Return_data)
class GET_freeAllHandel(Basehandel):
    def get(self):
        try:
            booktype=self.get_argument('booktype',None)
            font_num=self.get_argument('font_num',None)
            action=self.get_argument('action',None)
            update_time=self.get_argument('update_time',None)
            page=int(self.get_argument('page'))-1
            book_sex=self.get_argument('book_sex')
            free=self.get_argument('free')
            order_by=self.get_argument('order_by')
            get_tyep=self.get_argument('type',None)
            if order_by=='综合':
                order_by=Bookes.id
            if order_by=='字数':
                order_by=Bookes.font_num
            if order_by=='点击':
                order_by=Bookes.collect_num
            if order_by=='时间':
                order_by=Bookes.set_time
        except Exception as e:
            Parameter_error(self,e)
            return
        TIMES='2018-2-23 0:00:00'
        if not update_time:
            update_time =TIMES
        else:
            update_time = datetime.datetime.strftime((datetime.datetime.now() - datetime.timedelta(days=int(update_time))), '%Y-%m-%d %H:%M:%S')
        if not font_num:
            font_le =-1
            font_lt = 10000000000
        else:
            font_list = font_num.split('-')
            font_le = int(font_list[0]) * 10000
            font_lt = font_list[1]
            if font_lt != '$':
                font_lt = int(font_lt) * 10000
            else:
                font_lt = 10000000000
        if free=='免费':
            if get_tyep=='all':
                count=self.session_db.query(Bookes).filter(Bookes.free == '免费', Bookes.book_sex == book_sex).count()
                books = self.session_db.query(Bookes).filter(Bookes.free == '免费', Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(
                    page * 10).limit(10)
            else:
                if booktype and action:
                    count=self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.booktype == booktype, Bookes.action == action,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.booktype == booktype, Bookes.action == action,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                         10)
                elif booktype and not action:
                    count=self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.booktype == booktype,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.booktype == booktype,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                        10)
                elif not booktype and action:
                    count=self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.action == action, Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.action == action, Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                         10)
                else:
                    count=self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.free == '免费',Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                         10)
        elif free=='all':
            if get_tyep == 'all':
                count=self.session_db.query(Bookes).filter(Bookes.book_sex == book_sex).count()
                books = self.session_db.query(Bookes).filter(Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(
                    page * 10).limit(10)
            else:
                if booktype and action:
                    count=self.session_db.query(Bookes).filter(Bookes.booktype == booktype, Bookes.action == action,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.booktype == booktype, Bookes.action == action,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                          10)
                elif booktype and not action:
                    count=self.session_db.query(Bookes).filter(Bookes.booktype == booktype,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.booktype == booktype,
                                                                 Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                        10)
                elif not booktype and action:
                    count=self.session_db.query(Bookes).filter(Bookes.action == action, Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.action == action, Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                        10)
                else:
                    count= self.session_db.query(Bookes).filter(Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).count()
                    books = self.session_db.query(Bookes).filter(Bookes.set_time > update_time,
                                                                 Bookes.font_num > font_le, Bookes.font_num < font_lt,
                                                                 Bookes.book_sex == book_sex).order_by(order_by.desc()).offset(page * 10).limit(
                         10)
        books_data=[{
                    'id':book.id,
                    'bookname':book.bookname,
                     'booktype':book.booktype,
                     'introduce':book.introduce,
                     'book_img':book.book_img,
                     'action':book.action,
                     'font_num':book.font_num} for book in books]
        Return_data={'eercode':0,'eermegs':'成功','data':books_data,'count':count}
        self.write(Return_data)

class GET_IncomeHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
            page=self.get_argument('page',None)
            if page:
                page=int(page)-1
        except Exception as e:
            Parameter_error(self,e)
            return
        count=self.session_db.query(Income).filter(Income.income_booke==bookid).count()
        if page:
            incomes = self.session_db.query(Income).filter(Income.income_booke == bookid).order_by(Income.set_time.desc()).offset(page*10).limit(10)
        else:
            incomes=self.session_db.query(Income).filter(Income.income_booke==bookid).order_by(Income.set_time.desc()).limit(10)
        income_data=[{'id':income.id,'title':income.income_title,'income_num':income.income_num,'set_time':str(income.set_time)} for income in incomes]
        Return_data={'eercode':0,'eermegs':'成功','data':income_data,'count':count}
        self.write(Return_data)


class GET_RankHandel(Basehandel):
    def get(self):
        ret=self.application.redis.get('rank') #获取缓存
        if not ret:  #如果缓存为空才去数据库找
            now_time=datetime.datetime.now() #获取今天的时间
            week=now_time.strftime('%w')#获取今天的星期数
            new_time=(now_time-datetime.timedelta(days=int(week)+1)).strftime('%Y-%m-%d %H:%M:%S')#或者这个星期的第一天
            week_BOOks=self.session_db.query(Bookes).filter(Bookes.set_time>new_time).order_by(Bookes.set_time.desc()).limit(10)
            week_data=[{'id':book.id,'bookname':book.bookname} for book in week_BOOks]
            Finish_Books=self.session_db.query(Bookes).filter(Bookes.action=='完本').order_by(Bookes.set_time.desc()).limit(10)
            Finish_data = [{'id': book.id, 'bookname': book.bookname} for book in Finish_Books]
            new_books=self.session_db.query(Bookes).order_by(Bookes.set_time.desc()).limit(10)
            new_data = [{'id': book.id, 'bookname': book.bookname} for book in new_books]
            collect_num_Books=self.session_db.query(Bookes).order_by(Bookes.collect_num).limit(10)
            collect_data=[{'id': book.id, 'bookname': book.bookname} for book in collect_num_Books]
            Recharge_max=self.session_db.query(Recharge.rech_bookid,func.count(Recharge.rech_bookid)).limit(10) #聚合查询，查询重复rech_bookid的数据为一组
            book_ids=(i.rech_bookid for i in Recharge_max)
            Recharge_Books=self.session_db.query(Bookes).filter(Bookes.id.in_(book_ids))
            Recharge_data=[{'id': book.id, 'bookname': book.bookname} for book in Recharge_Books]
            click_data=collect_data
            Return_data={'eercode':0,'eermegs':'成功','data':{'click_data':click_data,
                                                           'Recharge_data':Recharge_data,
                                                          'collect_data':collect_data,
                                                            'new_data':new_data,
                                                            'Finish_data':Finish_data,
                                                            'week_data':week_data
                                                            }}
            self.write(Return_data)

            self.application.redis.setex('rank', CACHE_EXPIRES_SECONDS, json.dumps(Return_data))  #保存到缓存
        else:#有缓存，直接返回缓存：
            ret=json.loads(ret)
            self.write(ret)






