function money_coick() {
    $(this).siblings('.act').removeAttr('class')
    $(this).addClass('act')
    money=$(this).attr('data-amount')
    $('.j_deal_price').text('¥'+money)
    $('#pay').attr('data-method',money)
}
function item_box_down() {
    money=$(this).val()
    money_bi=Number(money)*1000
    $('.j_coins').text(String(money_bi)+'阅读币')
    $('.j_deal_price').text('¥'+money)
    $('#pay').attr('data-method',money)


}
function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function login_chek () {
    $.ajax(
        {
            url:'/longin_info',
            type:'POST',
            dataType:'JSON',
            headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg) {
                if(arg.eercode!=0)
                {

                    window.location.href='/index.html'
                }
                else {
                    $('.account-wrap p span').text(arg.name)
                }


                }
            }

            )

}
function add_appid() {
    money=$('#pay').attr('data-method')
    data={'money':money}
    $.ajax(
        {
            url:'/user/Recharge',
            data:data,
            type:'POST',
            headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg){
             alert('充值成功')

            }
        }
    )

}
$(document).ready(function () {
    login_chek()
    $('#money-list-1 li').click(money_coick)
    $('.item-box').keyup(item_box_down)
    $('#pay').click(add_appid)

})