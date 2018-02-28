function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
function enableSubmit(bool){

if(bool)$("#submit").removeAttr("disabled");

else $("#submit").attr("disabled","disabled");

}

function v_submitbutton(){

if($("#agree").attr("checked")!="checked") {

enableSubmit(false);

$(".readagreement-wrap").css("outline","1px solid #f99");

return;

}else{$(".readagreement-wrap").css("outline","1px solid #9f9");}

for(f in flags) if(!flags[f]) {enableSubmit(false); return;}

enableSubmit(true);

}

function showAgreement(){

$("#readagreement").removeAttr("onclick");

$("#agreement").show();

$("#agreement iframe").attr("src","http://www.baidu.com");//此处为链接地址

}

function agree(){

$("#agreement").hide();

$("#readagreement").attr("onclick","showAgreement();");

if($("#agree").attr("checked")!="checked") $("#agree").trigger("click");

}

function onReadAgreementClick(){

return;

if($("#agree").attr("checked")){

$("#agree").removeAttr("checked");

}else{

$("#agree").attr("checked","checked");

}

v_submitbutton();

}

var flags = [false,false,false,false];

//邮箱验证，网上找到的正则

var RegEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

function lineState(name,state,msg){

if(state=="none"){$("#line_"+name+" .input div").attr("class","none"); return;}

if(state=="corect"){$("#line_"+name+" .input div").attr("class","corect");return;}

$("#line_"+name+" .input span").text(msg);$("#line_"+name+" .input div").attr("class","error");

}

function v_account(){

var account = $("#account").val();

if(!RegEmail.test(account)) {lineState("account","error","邮箱格式不正确"); flags[0]=false;enableSubmit(false);}

else{lineState("account","corect","");flags[0] = true;}

v_submitbutton();

}

function v_name(){

var name = $("#name").val();

if(name.length==0) {lineState("name","error","不得为空"); flags[1]=false;}

else{

if(name.length>32) {lineState("name","error","必须少于32个字符"); flags[1]=false;}

else{lineState("name","corect",""); flags[1] = true;}

}

v_submitbutton();

}

function v_password(){

var password = $("#password").val();

if(password.length<6) {lineState("password","error","必须多于或等于6个字符"); flags[2]=false;}

else{

if(password.length>16){lineState("password","error","必须少于或等于16个字符"); flags[2]=false;}

else{

lineState("password","corect","");

flags[2] = true;

}

}

v_repeat();

v_submitbutton();

}

function v_repeat(){

if(!flags[2]) {lineState("repeat","none",""); return;}

if($("#password").val()!=$("#repeat").val()) {lineState("repeat","error","密码不一致"); flags[3]=false;}

else{

lineState("repeat","corect","");

flags[3] = true;

}

v_submitbutton();

}
function adaptValue(){

return true;

}
$('#from_on').submit(function () {
    var email=$('#account').val()
    var name=$('#name').val()
    var password=$('#password').val()
    var data={'email':email,'name':name,'pswd':password}
    var json_data=JSON.stringify(data)
    $.ajax({
        url:'/authon/regist',
        contentType:'application/json',
        dataType:'JSON',
        type:'POST',
        data:json_data,
        headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
        success:function (arg) {
            if(arg.eercode==0){
                alert('注册成功')
            }
            else if(arg.eercode==100)
            {
                alert('该邮箱已经注册')
            }

        }

    })
    return;

    }
)
