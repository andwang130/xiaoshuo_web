function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
function logon_chek() {
    $.ajax({
        url:'/authon/login_info',
        type:'POST',
        dataType:'JSON',
        headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
        success:function (arg) {
            if(arg.eercode==0) {
                $('.userName').text(arg.name)
                $('.end a').attr('href','#')
                $('.end a').click(
                  function () {

                $.get('/authon/Sign_Out',function (arg) {
                          location.reload()

                })

            }
            )
            }
            else {
                window.location.href='/authon/authon_login.html'
            }

        }
    })
}


