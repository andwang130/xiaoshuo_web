from handlers.Basehandel import Basehandel
from modls import Bookes
import random
from settings import CACHE_EXPIRES_SECONDS
import json
class GET_IndexHandel(Basehandel):
    def get(self):
        ret=self.application.redis.get('index')
        if ret:
                ret=json.loads(ret)
                return self.write(ret)
        else:
            random_num=random.randint(1,100)
            index_num=5
            Hot_Books=self.session_db.query(Bookes).order_by(Bookes.collect_num).limit(9)
            now_time=self.session_db.query(Bookes).order_by(Bookes.set_time.desc()).limit(6)
            Hot_lits=[{'id':book.id,'bookname':book.bookname,'introduce':book.introduce,'book_img':book.book_img,'booktype':book.booktype} for book in Hot_Books]
            now_list=[{'id':book.id,'bookname':book.bookname,'introduce':book.introduce,'book_img':book.book_img,'booktype':book.booktype} for book in now_time]

            typelist=['现代言情','古代言情','游戏竞技','玄幻言情','悬疑灵异','N次元','灵异','科幻']
            data_list = []
            for i in typelist:
                books=self.session_db.query(Bookes).filter(Bookes.booktype==i).limit(index_num)
                data_list.append({i:[{'id':book.id,'bookname':book.bookname,'introduce':book.introduce,'book_img':book.book_img} for book in books]})
            Retun_data={'eercode':0,'eermesg':'请求成功','data':{'Hot':Hot_lits,'booklist':data_list,'NOW':now_list}}
            self.write(Retun_data)
            json_data=json.dumps(Retun_data)
            self.application.redis.setex('index',CACHE_EXPIRES_SECONDS,json_data)


