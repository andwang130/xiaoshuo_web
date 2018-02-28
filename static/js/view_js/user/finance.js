function get_cionmax() {
    $.get('/user/get_cionmax',function (arg) {
        data=arg.data
        $('.balance').text(data.cion)
    })
}
function page_fun(conut,num) {
    pages=conut%num
    if(pages!=0){
        pages=parseInt(conut/num)+1
    }
    else {
        pages=parseInt(conut/num)
    }
    return pages


}
function fenzu(page,pages) {
   if(page>5)
    {
     i=page-2
        if(page+3<pages){
         pages=page+3
        }

   }
    i=1
    page=parseInt(page)
    up_page=page-1
    if (up_page==0){
        up_page=1
    }
    next_page=page+1
    if(next_page>pages){
         next_page=pages
    }
    var page_html='<div class="lbf-pagination"><ul class="lbf-pagination-item-list"><li class="lbf-pagination-item"><a href="javascript:;" data-page="'+up_page+'"class="lbf-pagination-prev lbf-pagination-disabled">&lt;</a></li>'

    while(i<=pages)
        {
            if(i==page) {
                page_html += '<li class="lbf-pagination-item"><a data-page="' + i + '" href="javascript:;" class="lbf-pagination-page  lbf-pagination-current">'+i+'</a></li>'
            }
            else {
                page_html += '<li class="lbf-pagination-item"><a data-page="' + i + '" href="javascript:;" class="lbf-pagination-page">'+i+'</a></li>'

            }

            i++
        }
       page_html+='<li class="lbf-pagination-item"><a href="javascript:;" data-page="'+next_page+'" class="lbf-pagination-next lbf-pagination-disabled">&gt;</a></li></ul><div class="lbf-pagination-jump"><input type="text" class="lbf-pagination-input" value="'+page+'"><a href="javascript:;" class="lbf-pagination-go">GO</a></div></div>'
       $('#page-container').html(page_html)
}

function get_consump(page) {

    $.get('/user/consumption',{'page':page},function (arg) {
        data=arg.data
        count=arg.count
        th=$('thead tr th')
        $(th[0]).text('消费金额')
        $(th[1]).text('消费时间')
       $(th[2]).text('备注')
        html=''
        for(i in data){
            html+='<tr>\n' +
                '    <td>'+data[i].rech_num+'</td>\n' +
                '    <td>'+data[i].set_time+'</td>\n' +
                '    <td>'+data[i].rech_title+'</td>\n' +
                '    \n' +
                '</tr>'

        }
         $('tbody').html(html)
        pages=page_fun(count,10)
        fenzu(page,pages)
        $('.lbf-pagination-item').click(function () {
            page_=$(this).find('a').attr('data-page')
            get_consump(page_)
        })
        $('.lbf-pagination-go').click(function () {
            page_input=$('.lbf-pagination-input').val()
            get_consump(page_input)
            
        })

    })
}
function get_Recharge(page) {
    $.get('/user/get_Recharge',{'page':page},function (arg) {
         data=arg.data
        count=arg.count
        th=$('thead tr th')
        $(th[0]).text('充值金额')
        $(th[1]).text('充值时间')
       $(th[2]).text('')
        html=''
        for(i in data){
            html+='<tr>\n' +
                '    <td>'+data[i].coin+'</td>\n' +
                '    <td>'+data[i].set_time+'</td>\n' +
                '    \n' +
                '</tr>'

        }
         $('tbody').html(html)
        pages=page_fun(count,10)
        fenzu(page,pages)
        $('.lbf-pagination-item').click(function () {
            page_=$(this).find('a').attr('data-page')
            get_Recharge(page_)
        })
        $('.lbf-pagination-go').click(function () {
            page_input=$('.lbf-pagination-input').val()
            get_Recharge(page_input)

        })

    })
    
}
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
                    $('#sign-out').click(sign_out)
                }
                else {
                    window.location.href='/index.html'
                    $('.j-goCharge').click(
                        function () {
                              $('.openlogin').click()

                        }
                    )
                }
            }

        }
    )

}
$(document).ready(function () {
    login_chek()

    get_cionmax()
    get_consump(1)
    $('#j-payBtn').click(function () {
        $('#j-buyBtn').removeClass('act')
        $(this).addClass('act')
        get_Recharge(1)

    })
    $('#j-buyBtn').click(function () {
        $('#j-payBtn').removeClass('act')
        $(this).addClass('act')
        get_consump(1)
    })
})