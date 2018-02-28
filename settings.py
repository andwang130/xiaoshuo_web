import os
settings={
    # 'debug':True,
    'static_path':os.path.join(os.path.dirname(__file__),'static'),#静态文件件模板路径配置
    'template_path':os.path.join(os.path.dirname(__file__),'templates'), #HTML文件路径
    'cookie_secret':'61oETzKXQ241sfshdhgfhfhfg',#安全cookie的加密值
    'xsrf_cookies':True,#开启xsrfy验证
    'login_url':'/login'  #为登陆时跳转的路由，
}
conf_redis={
    'host':'127.0.0.1',
    'port':6379
}
SESSION_EXPIRES_SECONDS=86400             #Session的过期时间秒\
CACHE_EXPIRES_SECONDS=3600              #缓存的过期时间
logg_file=os.path.join(os.path.dirname(__file__),'logs.log')
log_level = "debug"