
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
       page_html+='<li class="lbf-pagination-item"><a href="javascript:;" data-page="'+next_page+'" class="lbf-pagination-next lbf-pagination-disabled">&gt;</a></li></ul><div class="lbf-pagination-jump"><input type="text" class="lbf-pagination-input" value="1"><a href="javascript:;" class="lbf-pagination-go">GO</a></div></div>'
       $('#page-container').html(page_html)
}
function next_do() {
    page=$(this).attr('data-page')
    get_mybooks(page)

}
function next_go() {
    page=$('.lbf-pagination-input').val()
    get_mybooks(page)

}
function get_mybooks(page) {
    json_data=JSON.stringify({'page':page})
    $.ajax(
        {
            url:'/user/get_mybooks',
            type:'POST',
            dataType:'JSON',
            contentType:'application/json',
            data:json_data,
            headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg) {
                data=arg.data
                if(data.length>0){
                   console.log(data)
                    html='<table class="shelf-table"><colgroup><col width="20px"><col width="20px"><col width="240px"><col width="370px"><col width="100px"></colgroup><tbody>'
                    for(i in data) {
                       html+= '<tr class="" data-bookid="8954810703487803">\n' +
                        '                                <td></td>\n' +
                        '                                <td>\n' +
                        '                                    <input class="input-checkbox" data-value="'+data[i].id+'" id="book1" type="checkbox">\n' +
                        '                                </td>\n' +
                        '                                <td>\n' +
                        '                                    <label class="label" for="book1">\n' +
                        '                                        <div class="cf">\n' +
                        '                                            <div class="book-img">\n' +
                        '                                                <a href="/book.html?bookid='+data[i].id+'" target="_blank">\n' +
                        '                                                    <img src="//qidian.qpic.cn/qdbimg/349573/c_8954810703487803/150" alt="一咬定情：异能萌妃，抱一抱">\n' +
                        '                                                    \n' +
                        '                                                    <i class="">连载中</i>\n' +
                        '                                                </a>\n' +
                        '                                            </div>\n' +
                        '                                            <div class="info">\n' +
                        '                                                <h3><a href="/book.html?bookid='+data[i].id+'" target="_blank">'+data[i].bookname+'</a></h3>\n' +
                        '                                                <p>玉楼人醉</p>\n' +
                        '                                            </div>\n' +
                        '                                        </div>\n' +
                        '                                    </label>\n' +
                        '                                </td>\n' +
                        '                                <td>\n' +
                        '                                    <label class="label" for="book1">\n' +
                        '                                        <div class="btn">\n' +
                        '                                            \n' +
                        '                                            <a class="pink-btn" href="/book.html?bookid='+data[i].id+'" target="_blank">继续阅读</a>\n' +
                        '                                            \n' +
                        '                                            <div class="hide-btn">\n' +
                        '                                                <a class="del-btn" href="javascript:" data-value="'+data[i].id+'">删除</a>\n' +
                        '                                            </div>\n' +
                        '                                        </div>\n' +
                        '                                    </label>\n' +
                        '                                </td>\n' +
                        '                            </tr>'
                    }
                   html+='</tbody></table>'
                    $('.no-data').html(html)
                    $('.no-data').attr('class','bookshelf-list-wrap')
                }
                $('.head-tab h1').text('我的书架（'+arg.count+'）')
               count=page_fun(arg.count,5)
                fenzu(page,count)
                $('.lbf-pagination-item a').click(next_do)
        $('.lbf-pagination-go').click(next_go)
         $('.del-btn').click(function () {
            del_id=$(this).attr('data-value')
            $.get('/user/delete_bookBth',{'bookid':del_id},function (arg) {
                if(arg.eercode==0){
                    location.reload()
                }

            })

        })
            }

        }

    )

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
function checkbox() {
    if($('#j-bottomAll').attr('checked'))
    {
        $('.input-checkbox').attr('checked','checked')
    }
    else {
                $('.input-checkbox').removeAttr('checked')

    }

}
function delete_bookth() {
    var arrt_id=[]
  $('.input-checkbox:checked').each(function (i) {

    arrt_id[i]=$(this).attr('data-value')

    })
    console.log(arrt_id)
    json_data=JSON.stringify({'bookids':arrt_id})
    $.ajax(
        {
            url:'/user/delete_bookBth',
            type:'POST',
            dataType:'JSON',
            data:json_data,
            contentType:'application/json',
              headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg) {
                if(arg.eercode==0)
                {
                    location.reload()
                }

            }
        }
    )
}
$(document).ready(function () {
    login_chek()
    get_mybooks(1)
    $('#j-bottomAll').click(checkbox)
    $('#j-delAllBtn').click(delete_bookth)
})