from handlers import login,Basehandel,register,autho_book,index,book_info,user
import os
urls=[
    (r'^/index$',index.GET_IndexHandel),
    (r'^/get_book_info$',book_info.GET_BookInfoHandel),
    (r'^/get_Chapters$',book_info.GET_ChaptersHandel),
    (r'^/get_conten$',book_info.GET_ContenHandel),
    (r'^/get_income$',book_info.GET_IncomeHandel),
    (r'^/get_rank$',book_info.GET_RankHandel),
    (r'^/login$',login.LoginHandel),
    (r'^/sign_out$',login.Sign_OutHandel),
    (r'^/register$',register.RegisteHandlers),
    (r'^/longin_info$',login.Longin_InfoHandel),
    (r'/addcomment$',book_info.Add_CommentHandle),
    (r'/getcomment$',book_info.GET_CommentHandel),
    (r'^/getOther$',book_info.GET_Otherhandel),
    (r'^/getfreeall$',book_info.GET_freeAllHandel),
    (r'^/user/get_mybooks$',user.GET_MybooksHandel),
    (r'^/user/Recharge$',user.Recharge_Handel),
    (r'^/user/areward$',user.Areward_Handel),
    (r'^/user/get_cionmax$',user.GET_CionmaxHandel),
    (r'^/user/consumption$',user.GET_ConsumptionHandel),
    (r'^/user/get_Recharge$',user.GET_RechaRecordHandel),
    (r'^/user/delete_bookBth',user.DELETE_bookBthHandel),
    (r'^/addbookBtn$',book_info.Add_BookBtnHandel),
    (r'^/authon/login_info$',login.Authon_Login_InfoHandel),
    (r'^/authon/login$',login.Authon_LoginHandel),
    (r'^/authon/Sign_Out$',login.Authon_Sign_OutHandel),#作者退出登陆
    (r'^/authon/regist$',register.Authon_RegistHandlers),#作者注册
    (r'^/authon/add_book$', autho_book.Add_BookHandel),
    (r'^/authon/get_books$',autho_book.GET_BooksHandel),
    (r'^/authon/get_Chapter$',autho_book.GET_ChapterHandel),
    (r'^/authon/get_Chapter_info$',autho_book.GET_chapinfoHandel),
    (r'^/authon/chaper_recycle',autho_book.Chaper_recycleHandel),
    (r'^/authon/get_recycl',autho_book.GET_recyclHandel),
    (r'^/authon/get_bookinfo$',autho_book.GET_BookHandel),
    (r'^/authon/add_Chapter$',autho_book.Add_Chapter),
    (r'^/authon/get_Catalog$',autho_book.GET_CatalogHandel),
    (r'^/authon/get_allCatalog$',autho_book.GET_CatalogAllHandel),
    (r'^/authon/get_follows$',autho_book.GET_FollowsHandel),
    (r'^/authon/get_Cagtalog_info$',autho_book.GET_CataloginfoHandel),
    (r'^/authon/add_Catalog$',autho_book.ADD_CatalogHandel),
    (r'^/authon/chapter_recovery$',autho_book.Chapter_recoveryHandel),
    (r'^/authon/delete_chapter$',autho_book.DELETE_ChaperHandel),
    (r'/(.*?)',Basehandel.StaticFileBaseHandler,{'path':os.path.join(os.path.dirname(__file__),'templates'),'default_filename':'index.html'}),
    (r'/user/(.*?)',Basehandel.StaticFileBaseHandler,{'path':os.path.join(os.path.dirname(__file__),'templates/user')}),
    (r'/authon/(.*?)',Basehandel.StaticFileBaseHandler,{'path':os.path.join(os.path.dirname(__file__),'templates/authon'),'default_filename':'autho_login.html'}),
    # (r'(.*?)',Basehandel.StaticFileBaseHandler,{'path':os.path.join(os.path.dirname(__file__),'templates/authon/404.html')})
]