import sqlalchemy
from sqlalchemy import Column,String,Integer,ForeignKey,VARCHAR,TEXT,DATETIME,FLOAT,Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship,sessionmaker
import datetime

engine=create_engine('mysql+pymysql://root:ANDWANG130.@127.0.0.1:3306/testsql?charset=utf8',encoding='utf-8')  #建立连接
Base=declarative_base()  #生产基类
class User(Base):#普通用户表
    __tablename__='user'
    id=Column(Integer,primary_key=True,autoincrement=True)
    name=Column(String(20),nullable=False)
    pswd=Column(String(25),nullable=False)
    email=Column(String(25),nullable=False)
    coin=Column(Integer,default=0)
    Phone=Column(String(13),nullable=False)
    set_time = Column(DATETIME,nullable=False)
class Vips(Base): #VIP表，和用户是一对多关系，外键为用户ID
    __tablename__='vips'
    id=Column(Integer,primary_key=True,autoincrement=True)
    open_time=Column(DATETIME,nullable=False) #开通时间
    close_time=Column(DATETIME,nullable=False) #到期时间
    userid=Column(Integer,ForeignKey('user.id'))
class RechaRecord(Base):
    __tablename__='rechaRecord'
    id=Column(Integer,primary_key=True,autoincrement=True)
    set_time = Column(DATETIME, nullable=False)
    userid=Column(Integer,ForeignKey('user.id'))
    coin=Column(Integer,nullable=False)
class Recharge(Base):#用户消费表
    __tablename__='recharge'
    id=Column(Integer,primary_key=True,autoincrement=True)
    rech_title=Column(String(25),nullable=False)
    rech_num=Column(Integer,nullable=False)
    rech_bookid=Column(Integer,ForeignKey('bookes.id'))
    userid=Column(Integer,ForeignKey('user.id'))
    set_time=Column(DATETIME,nullable=False)
class Autho(Base):#作者表
    __tablename__='autho'
    id= Column(Integer, primary_key=True, autoincrement=True)
    authon_type=Column(Enum('签约','普通'),default='普通')
    email=Column(String(25),nullable=False)
    name=Column(String(20),nullable=False)
    pswd=Column(String(25),nullable=False)
    coin=Column(Integer,default=0)
    set_time = Column(DATETIME,nullable=False)
class BookTypes(Base): #书类型表
    __tablename__='booktypes'
    id=Column(Integer,primary_key=True,autoincrement=True)
    type_name=Column(String(25),nullable=True)
class Bookes(Base): #书表
    __tablename__='bookes'
    id=Column(Integer,primary_key=True,autoincrement=True)
    bookname=Column(String(25),nullable=False)
    booktype=Column(String(25),nullable=False)
    introduce=Column(String(1000),nullable=False)
    booktag=Column(String(25))
    book_img=Column(String(80))
    book_sex=Column(Enum('男生','女生'))
    font_num=Column(Integer,default=0,nullable=False)
    action=Column(Enum('连载','完本'),default='连载')
    free=Column(Enum('免费','vip'),default='免费')
    collect_num=Column(Integer,default=0)
    set_time=Column(DATETIME,nullable=False)
    authoid=Column(Integer,ForeignKey('autho.id',ondelete='CASCADE'))  #添加外键关系
    # autho=relationship('Autho',backref='book_autho') #添加关系反查。不会再数据库中体现
class Chapter(Base):#章节表
    __tablename__='chapter'
    id=Column(Integer,primary_key=True,autoincrement=True)
    chapter_title=Column(String(25),nullable=False)
    conten=Column(TEXT,nullable=False)
    set_time = Column(DATETIME,nullable=False)
    font_num=Column(Integer,nullable=False)
    recycle=Column(Enum('flass','true'),default='flass')
    booke_id=Column(Integer,ForeignKey('bookes.id',ondelete='CASCADE'))
    Catalog_id=Column(Integer,ForeignKey('catalog.id',ondelete='CASCADE'))
    booke=relationship('Bookes',backref='chap_booke')
class Catalog(Base):
    __tablename__='catalog'
    id=Column(Integer,primary_key=True,autoincrement=True)
    Catalog_title=Column(String(25),nullable=False)
    conten=Column(String(300),nullable=False)
    bookid=Column(Integer,ForeignKey('bookes.id',ondelete='CASCADE'))
class Comment(Base):
    __tablename__='comment'
    id=Column(Integer,primary_key=True,autoincrement=True)
    Comment_title=Column(String(25),nullable=False)
    conten=Column(TEXT,nullable=False)
    set_time=Column(DATETIME,nullable=False)
    bookid=Column(Integer,ForeignKey('bookes.id'),onupdate='CASCADE')
    userid=Column(Integer,ForeignKey('user.id'),onupdate='CASCADE')
class Follows(Base): #关注小说表,多对多关系，一个用户可以关注多本书，一本书可以被多个用户关注，用一张表，两个外键来代表多对多的关系
    __tablename__='follows'
    id=Column(Integer,primary_key=True,autoincrement=True)
    follow_nameid=Column(ForeignKey('user.id',ondelete='CASCADE'))
    follow_booke=Column(ForeignKey('bookes.id'),onupdate='CASCADE')
    set_time=Column(DATETIME)
    # current=Column(ForeignKey())
class Income(Base):#作者收入表
    __tablename__='income'
    id=Column(Integer,primary_key=True,autoincrement=True)
    set_time = Column(DATETIME,nullable=False)
    income_title=Column(String(25),nullable=False)
    authoid=Column(Integer,ForeignKey('autho.id',ondelete='CASCADE'))
    autho=relationship('Autho',backref='book_autho') #添加关系反查。不会再数据库中体现
    income_booke=Column(Integer,ForeignKey('bookes.id'))
    income_num=Column(Integer,nullable=False) #nullable等于False不可为空
Base.metadata.create_all(engine)
sessiondb=sessionmaker(bind=engine)