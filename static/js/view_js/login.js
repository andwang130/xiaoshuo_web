function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

// user
var user_Boolean = false;
var password_Boolean = false;
var varconfirm_Boolean = false;
var emaile_Boolean = false;
var Mobile_Boolean = false;
$('.reg_user').blur(function(){
  if ((/\S{2,16}$/).test($(".reg_user").val())){
    $('.user_hint').html("✔").css("color","green");
    user_Boolean = true;
  }else {
    $('.user_hint').html("×").css("color","red");
    user_Boolean = false;
  }
});
// password
$('.reg_password').blur(function(){
  if ((/\S{6,16}$/).test($(".reg_password").val())){
    $('.password_hint').html("✔").css("color","green");
    password_Boolean = true;
  }else {
    $('.password_hint').html("×").css("color","red");
    password_Boolean = false;
  }
});


// password_confirm
$('.reg_confirm').blur(function(){
  if (($(".reg_password").val())==($(".reg_confirm").val())){
    $('.confirm_hint').html("✔").css("color","green");
    varconfirm_Boolean = true;
  }else {
    $('.confirm_hint').html("×").css("color","red");
    varconfirm_Boolean = false;
  }
});


// Email
$('.reg_email').blur(function(){
  if ((/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/).test($(".reg_email").val())){
    $('.email_hint').html("✔").css("color","green");
    emaile_Boolean = true;
  }else {
    $('.email_hint').html("×").css("color","red");
    emaile_Boolean = false;
  }
});


// Mobile
$('.reg_mobile').blur(function(){
  if ((/^1[34578]\d{9}$/).test($(".reg_mobile").val())){
    $('.mobile_hint').html("✔").css("color","green");
    Mobile_Boolean = true;
  }else {
    $('.mobile_hint').html("×").css("color","red");
    Mobile_Boolean = false;
  }
});


// click
$('.red_button').click(function(){
    var data={
        'user':$('.reg_user').val(),
        'pswd':$('.reg_confirm').val(),
        'email':$('.reg_email').val(),
        'Phone':$('.reg_mobile').val()
    }
    var regi_data=JSON.stringify(data)
  if(user_Boolean && password_Boolean && varconfirm_Boolean && emaile_Boolean && Mobile_Boolean == true){
    $.ajax({
        url:'/register',
        type:'POST',
        contentType:'application/json',
        dataType:'JSON',
        data:regi_data,
        headers:{
            'X-XSRFTOKEN':get_cookie('_xsrf')
        },
        success:function (arg) {
            if(arg.eercode=='0'){
                alert('注册成功')
            }
            if (arg.eercode=='100'){
                alert('用户已存在')
            }
s
        }


    })
  }else {
    alert("请完善信息");
  }
});

$('#submit').click(function () {
    var user=$('#user').val()
    var pswd=$('#pswd').val()
    if(!user){
        $('#login_warning').html('请输入用户名')
        $('#login_warning').attr('display','block')
        return;
    }
     if(!pswd){
        $('#login_warning').html('请输入密码')
        $('#login_warning').attr('display','block')
         return;

    }
    if (!user&&!pswd){
        $('#login_warning').html('用户名和密码不可为空')
        $('#login_warning').attr('display','block')
        return;
    }
    var data={'user':user,'pswd':pswd}
    JSON_data=JSON.stringify(data)
    $.ajax(
        {
            url:'/login',
            type:'POST',
            contentType:'application/json',
            dataType:'JSON',
            data:JSON_data,
            headers:{
                'X-XSRFTOKEN':get_cookie('_xsrf')
            },
            success:function (arg) {
                if(arg.eercode==0){
                    location.reload()
                    return
                }
                else{
                     $('#login_warning').html(arg.eermesg)
                }

            }


        }
    )

})
$('#sign-out').click(sign_out)
var login_type=1
function login_chek () {
    $.ajax(
        {
            url:'/longin_info',
            type:'POST',
            dataType:'JSON',
            headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg) {
                if(arg.eercode==0){
                    login_type=arg.eercode
                    $('.link').attr('href','/user/my_books.html')
                    $('.openlogin').attr('src','https://shp.qpic.cn/readnovel/0/1/100')
                    $('#j-userWrap').mouseover(function () {

                        $('#j-userDownDrop').css('display',' block')
                    })
                      $('.j-goCharge').attr('href','/user/appId.html')
                     $('#j-userWrap').mouseout(function () {

                        $('#j-userDownDrop').css('display','none')
                    })
                    $('.head-shelf').click(function () {
                        window.location.href='/user/my_books.html'
                    })
                }
                else {
                    $('.j-goCharge').click(
                        function () {
                              $('.openlogin').click()

                        }
                    )
                       $('.head-shelf').click(function () {
                            $('.openlogin').click()

                       })
                }
            }

        }
    )

}
function sign_out() {
    $.get('/sign_out',function (arg) {
      location.reload()

    })

}
