function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
$('#login').click(
    function () {
        var email=$('#email').val()
        var pswd=$('#password').val()
        if (!email){
            alert('请输入账号')
            return
        }
        if(!pswd){
            alert('请输入密码')
        }
        if(email&&pswd){
            var data={'email':email,'pswd':pswd}
            var json_data=JSON.stringify(data)
            $.ajax(
                {
                    url:'/authon/login',
                    type:'POST',
                    contentType:'application/json',
                    dataType:'JSON',
                    headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},

                    data:json_data,
                    success:function (arg) {
                        if(arg.eercode==0){
                            window.location.href='/authon/index.html'
                        }

                    }

                }
            )
        }


    }
)

