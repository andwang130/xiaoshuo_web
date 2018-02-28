from handlers.Basehandel import Basehandel
from uuit.Session import Session
from modls import Bookes,Chapter,Catalog,Follows,User
from uuit.coomons import get_now,Parameter_error,Data_eeror,get_session_authonid
import logging
import datetime
class Add_BookHandel(Basehandel): #作者添加作品
    def post(self):
        bookname=self.get_json.get('bookname')
        booktype=self.get_json.get('booktype')
        booktag=self.get_json.get('booktag')
        book_sex=self.get_json.get('book_sex')
        introduce=self.get_json.get('introduce')
        free=self.get_json.get('free')
        authonid=get_session_authonid(self)
        bookimg='https://qidian.qpic.cn/qdbimg/349573/c_6233251403829601/180'
        if self.session_db.query(Bookes).filter(Bookes.bookname==bookname).first():
            Return_data={'eercode':100,'eermegs':'该作品名字已经存在'}
            self.write(Return_data)
            return
        book=Bookes(bookname=bookname,booktype=booktype,introduce=introduce,booktag=booktag,set_time=get_now(),authoid=authonid,book_sex=book_sex,free=free,book_img=bookimg)
        self.session_db.add(book)
        book_id = self.session_db.query(Bookes.id).filter(Bookes.bookname == bookname).first().id
        catalog = Catalog(Catalog_title='第一卷', bookid=book_id,conten='默认创建的第一卷')
        self.session_db.add(catalog)
        try:
            self.session_db.commit()
            Return_data = {'eercode': 0, 'eermegs':'创建作品成功'}
        except Exception as e:
            print(e)
            self.session_db.rollback()
            Return_data={'eercode':200,'eermegs':'数据库错误'}
        self.write(Return_data)
class GET_BooksHandel(Basehandel):
    def get(self):
        try:
            page=self.get_argument('page',None)
            if page:
                page=int(page)-1
        except Exception as e:
            Parameter_error(self,e)
            return
        authoID=Session(self,'autho_session_id').data['authon_id']
        if page:
            authon_data=self.session_db.query(Bookes).filter(Bookes.authoid==authoID).offset(page*5).limit(5)
        else:
            authon_data = self.session_db.query(Bookes).filter(Bookes.authoid == authoID).limit(5)
        pages=self.session_db.query(Bookes).filter(Bookes.authoid==authoID).count()
        data_list=[]
        for i in authon_data:
            data={
                'id':i.id,
                'bookname':i.bookname,
                'booktype':i.booktype,

            }
            data_list.append(data)
        Return_data={'eercode':0,'eermegs':'请求成功','data':data_list,'count':pages}
        self.write(Return_data)
class GET_ChapterHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
            Catalog_id=self.get_argument('Catalog_id',None)
        except:
            Return_data = {'eercode': 400, 'eermesg': '参数错误'}
            self.write(Return_data)
            return
        if Catalog_id:
            chapters=self.session_db.query(Chapter).filter(Chapter.booke_id==bookid,Chapter.Catalog_id==int(Catalog_id))
        else:
            chapters = self.session_db.query(Chapter).filter(Chapter.booke_id == bookid)
        data_list=[]
        for i in chapters:
            data={
                'id':i.id,
                'chapter_title':i.chapter_title,
            }
            data_list.append(data)
        Return_data={'eercode':0,'eercode':'请求成功','data':data_list}
        self.write(Return_data)
class ADD_CatalogHandel(Basehandel):
    def post(self):
        try:
            bookid=int(self.get_json.get('bookid'))
            cataloh_title=self.get_json.get('Cataloh_title')
            conten=self.get_json.get('conten')
        except Exception as e:
            Parameter_error(self,e)
            return
        catalog=Catalog(bookid=bookid,Catalog_title=cataloh_title,conten=conten)
        self.session_db.add(catalog)
        try:
            self.session_db.commit()
            Return_data={'eercode':0,'eermegs':'请求成功'}
            self.write(Return_data)
            return
        except Exception as e:
            Data_eeror(self,e)
            return

class GET_CatalogAllHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
        except Exception as e:
            Parameter_error(self,e)
        CatalogS=self.session_db.query(Catalog).filter(Catalog.bookid==bookid).all()
        data_list=[]
        for Catalo in CatalogS:
            chapters=self.session_db.query(Chapter.id,Chapter.chapter_title,Chapter.set_time).filter(Chapter.Catalog_id==Catalo.id,Chapter.recycle=='flass')
            data={'catalog':Catalo.Catalog_title,'catalog_id':Catalo.id}
            data['chapters']=[]
            for chapte in chapters:
                chapters_data={'chapter_id':chapte.id,'chapter_title':chapte.chapter_title,'set_time':str(chapte.set_time)}
                data['chapters'].append(chapters_data)
            data_list.append(data)
        Return_data={'eercode':0,'eermegs':'请求成功','data':data_list}
        self.write(Return_data)
class GET_CatalogHandel(Basehandel):
    def get(self):
        try:
            bookid = int(self.get_argument('bookid'))
        except Exception as e:
            Parameter_error(self,e)
            return
        catalogs=self.session_db.query(Catalog).filter(Catalog.bookid==bookid).all()
        catalog_data=[{'id':catalog.id,'Catalog_title':catalog.Catalog_title,'bookid':catalog.bookid} for catalog in catalogs ]
        Return_data = {'eercode': 0, 'eercode': '请求成功', 'data': catalog_data}
        self.write(Return_data)

class GET_CataloginfoHandel(Basehandel):
    def get(self):
        try:
            catalog_id=int(self.get_argument('cagtalog_id'))
        except Exception as e:
            Parameter_error(self,e)
            return
        catalog=self.session_db.query(Catalog).filter(Catalog.id==catalog_id).first()
        catalog_data={'catalog_title':catalog.Catalog_title,'conten':catalog.conten}
        Return_data={'eercode':0,'eermegs':'请求成功','data':catalog_data}
        self.write(Return_data)
class GET_chapinfoHandel(Basehandel):
    def get(self):
        try:
            charid=int(self.get_argument('charid'))
        except Exception as e:
            logging.error(e)
            Return_data={'eercode':200,'eermesg':'参数错误'}
            self.write(Return_data)
            return
        chapter=self.session_db.query(Chapter).filter(Chapter.id==charid).first()
        data={'id':chapter.id,'chapter_title':chapter.chapter_title,'conten':chapter.conten}
        Return_data={'eercode':0,'eermesg':'查询成功','data':data}
        self.write(Return_data)
class GET_BookHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
        except Exception as e:
            Rertun_data={'eercode':400,'eermegs':'参数错误'}
            logging.error(e)
            self.write(Rertun_data)
            return
        book=self.session_db.query(Bookes).filter(Bookes.id==bookid).first()
        data={'bookname':book.bookname,
              'booktype':book.booktype,
              'introduce':book.introduce,
              'booktag':book.booktag,
              'set_time':str(book.set_time),
              'font_num':book.font_num,
              'free':book.free,
              'collect_num':book.collect_num,

              }
        Rertun_data={'eercode':0,'eermesg':'请求成功','data':data}
        self.write(Rertun_data)
class Add_Chapter(Basehandel):
    def post(self):
        try:
            bookid=int(self.get_json.get('bookid'))
            chapter_title=self.get_json.get('Chapter')
            conten=self.get_json.get('conten')
            catalog_id=int(self.get_json.get('Catalog_id'))
        except Exception as e:
            Parameter_error(self,e)
            return
        font_num=len(conten)
        chapter=Chapter(booke_id=bookid,chapter_title=chapter_title,conten=conten,set_time=get_now(),Catalog_id=catalog_id,font_num=font_num)
        self.session_db.add(chapter)
        self.session_db.query(Bookes).filter(Bookes.id==bookid).update({Bookes.font_num:Bookes.font_num+font_num})
        try:
            self.session_db.commit()
            Retrun_data={'eercode':0,'eermegs':'添加章节成功'}
        except:
            self.session_db.rollback()
            Retrun_data = {'eercode': 200, 'eermegs': '数据库错误'}
        self.write(Retrun_data)
class GET_FollowsHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
            page=int(self.get_argument('page'))-1
        except Exception as e:
            Parameter_error(self,e)
            return
        Yesterday=(datetime.datetime.now()-datetime.timedelta(days=1))
        Yesterday_1=Yesterday.strftime('%Y-%m-%d 23:59:59')
        Yesterday_2=Yesterday.strftime('%Y-%m-%d 00:00:00')

        followss=self.session_db.query(Follows).filter(Follows.follow_booke==bookid).offset(page*10).limit(10)
        Return_data={}
        if not page:
            Yesterday_count=self.session_db.query(Follows).filter(Follows.follow_booke==bookid,
                                                                  Follows.set_time<Yesterday_1,
                                                                  Follows.set_time>Yesterday_2).count()
            count = self.session_db.query(Follows).filter(Follows.follow_booke == bookid).count()
            Return_data['count']=count
            Return_data['Yesterday_count']=Yesterday_count
        data_list=[]
        for follow in followss:
            user=self.session_db.query(User.name).filter(User.id==follow.follow_nameid).first()
            data={'name':user.name,'set_time':follow.set_time}
            data_list.append(data)
        Return_data['eercode']=0
        Return_data['eermegs']='成功'
        Return_data['data']=data_list
        self.write(Return_data)
class Chaper_recycleHandel(Basehandel):
    def post(self):
        try:
            Chaperid=int(self.get_json.get('chapetid'))
        except Exception as e:
            Parameter_error(self,e)
            return
        authonid = get_session_authonid(self)
        bookid = self.session_db.query(Chapter.booke_id).filter(Chapter.id == Chaperid).first().booke_id
        if self.session_db.query(Bookes).filter(Bookes.id == bookid, Bookes.authoid == authonid).first():
            self.session_db.query(Chapter).filter(Chapter.id==Chaperid).update({Chapter.recycle:'true'})
            try:
                self.session_db.commit()
                Retrun_data={'eercode':0,'eermegs':'成功'}
                self.write(Retrun_data)
            except Exception as e:
                Data_eeror(self,e)
                return
        else:
            Return_data = {'eercode': 110, 'eermegs': '这条数据不属于你'}
            self.write(Return_data)
class GET_recyclHandel(Basehandel):
    def get(self):
        try:
            bookid=int(self.get_argument('bookid'))
        except Exception as e:
            Parameter_error(self,e)
            return
        recycs=self.session_db.query(Chapter).filter(Chapter.booke_id==bookid,Chapter.recycle=='true').all()
        recyc_data=[{'chapter_title':recy.chapter_title,'id':recy.id} for recy in recycs]
        Retrun_data = {'eercode': 0, 'eermegs': '成功','data':recyc_data}
        self.write(Retrun_data)
class Chapter_recoveryHandel(Basehandel):
    def post(self):
        try:
            Chaperid =int(self.get_json.get('chaptrid'))
        except Exception as e:
            Parameter_error(self, e)
            return

        authonid = get_session_authonid(self)
        bookid = self.session_db.query(Chapter.booke_id).filter(Chapter.id == Chaperid).first().booke_id
        if self.session_db.query(Bookes).filter(Bookes.id == bookid, Bookes.authoid == authonid).first():
            self.session_db.query(Chapter).filter(Chapter.id == Chaperid).update({Chapter.recycle: 'flass'})
            try:
                self.session_db.commit()
                Retrun_data = {'eercode': 0, 'eermegs': '成功'}
                self.write(Retrun_data)
            except Exception as e:
                Data_eeror(self, e)
                return
        else:
            Return_data = {'eercode': 110, 'eermegs': '这条数据不属于你'}
            self.write(Return_data)
class DELETE_ChaperHandel(Basehandel):
    def post(self):
        try:
            chaperid=int(self.get_json.get('chaptrid'))
        except Exception as e:
            Parameter_error(self,e)
        authonid=get_session_authonid(self)
        bookid=self.session_db.query(Chapter.booke_id).filter(Chapter.id==chaperid).first().booke_id
        if self.session_db.query(Bookes).filter(Bookes.id==bookid,Bookes.authoid==authonid).first():
            self.session_db.query(Chapter).filter(Chapter.id==chaperid).delete()
            try:
                self.session_db.commit()
                Return_data={'eercode':0,'eermegs':'成功'}
                self.write(Return_data)
            except Exception as e:
                Data_eeror(self,e)
                return
        else:
            Return_data={'eercode':110,'eermegs':'你不能删除不属于你的'}
            self.write(Return_data)










