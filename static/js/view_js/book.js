function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
function codequry() {
    var search=decodeURI(document.location.search)
    code_data=search.replace(/(^\?)/,'').split('&').reduce(function (result,itme) {
    data=itme.split('=')
        result[data[0]]=data[1]
        return result
    },{})
    return code_data

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
       page_html+='<li class="lbf-pagination-item"><a href="javascript:;" data-page="'+next_page+'" class="lbf-pagination-next lbf-pagination-disabled">&gt;</a></li></ul><div class="lbf-pagination-jump"><input type="text" class="lbf-pagination-input" value="1"><a href="javascript:;" class="lbf-pagination-go">GO</a></div></div>'
       $('#page-container').html(page_html)
}
function get_bookinfo () {
    $.get('/get_book_info',{'bookid':codequry()['bookid']},function (arg) {
        book=arg.data.book
        authon=arg.data.authon
        $('h1 em').text(book.bookname)
        $('#to_book').text(book.bookname)
        $('#to_booktype').text(book.booktype)
        $('#bookmax').text(authon.bookmax)
        $('#tiems').text(authon.times)
        $('.J-getJumpUrl img').attr('src',book.book_img)
        $('.intro').text(book.introduce)
        $('#authonname').text(authon.name)
        $('.writer').text(authon.name+' 著')
        tag_html='<i class="blue">'+book.action+'</i>'
        tag_html+='<i class="org">'+book.free+'</i>'
        tag_html+='<i>'+book.booktype+'</i>'
        $('.tag').html(tag_html)
        font_num=Number(book.font_num)/1000
        $('.total span').text(font_num)
    })
}
function get_Chapters() {
    $.get('/get_Chapters',{'bookid':codequry()['bookid']},function (arg) {
        data=arg.data
        var html=''
        var catalog_lengt=0
        var chaptes_lengt=0
        if(data.length>0) {
            lengths=0
            for(i in data){

                Catalo=data[i]
                chaptes=Catalo.Chapters
                if(chaptes.length>0){
                     catalog_lengt=i
                      catalog_html='<div class="volume"><div class="cover"></div>'
                    catalog_html+='<h3>正文卷<i>·</i>共'+chaptes.length+'章</h3><ul class="cf" id="Chapt">'
                    lengths+=chaptes.length
                    for(j in chaptes){
                    catalog_html+='<li data-rid="1">' +
                        '<a href="/bookconten.html?ChaptID='+chaptes[j].chapte_id+'" target="_blank" >'+chaptes[j].chapter_title+'</a>  ' +
                        ' </li>'
                        chaptes_lengt=j
                    }
                    catalog_html+='</ul></div>'
                 $('.volume-wrap').append( catalog_html)
                     $('#J-catalogCount').text('(' + lengths + ')')
            $('#newchapt').text(data[catalog_lengt].Chapters[chaptes_lengt].chapter_title)
            $('#newchapt').attr('href', '/bookconten.html?ChaptID=' + data[catalog_lengt].Chapters[chaptes_lengt].chapte_id)
            $('#J-get').attr('href', '/bookconten.html?ChaptID=' + data[catalog_lengt].Chapters[0].chapte_id)
                }
            }


            }


    })

}

function addbook() {
    if(login_type==0){
        bookid=codequry()['bookid']
        data={'bookid':bookid}
        json_data=JSON.stringify(data)
        $.ajax({
            url:'/addbookBtn',
            contentType:'application/json',
            type:'POST',
            dataType:'JSON',
            data:json_data,
            headers:{ 'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg) {
                if(arg.eercode==0){
                    alert('添加成功')
                }

            }


        })

    }
    else {
        document.getElementsByClassName('openlogin')[0].click()
    }


}
function sendCommentWrap_show()
{
    if(login_type==0) {
        $('#j-sendCommentWrap').attr('style', 'height: 214px')
    }
    else {
  document.getElementsByClassName('openlogin')[0].click()
    }

}
function get_Other() {
    $.get('/getOther',{'now_bookid':codequry()['bookid']},function (arg) {
        data=arg.data
        for(i in data) {
            html = '<li id="item'+i+'" data-rid="1" style="transition: transform 300ms linear; backface-visibility: hidden; transform: translateX(-100%);">\n' +
                '                                            <div class="book-img">\n' +
                '                                                <a href="/book/25377889000533901" target="_blank"><img src="//qidian.qpic.cn/qdbimg/349573/c_25377889000533901/90">\n' +
                '                                                </a>\n' +
                '                                            </div>\n' +
                '                                            <div class="text">\n' +
                '                                                <h4><a href="/book/25377889000533901" target="_blank">'+data[i].bookname+'</a></h4>\n' +
                '                                                <p class="red"><a href="javascript:" target="_blank"></a></p>\n' +
                '                                                <p>'+data[i].introduce+'</p>\n' +
                '                                                <a class="border-btn add-book" href="javascript:" data-bookid="'+data[i].bookid+'">加入书架</a>\n' +
                '                                            </div>\n' +
                '                                        </li>'
            $('#workSlides_ul').append(html)
        }
    })

}
function sendCommentWrap_colcr() {

     $('#j-sendCommentWrap').removeAttr('style')
}
function cheks() {
    $('#cheks .act').removeClass('act')
    $(this).addClass('act')
    if ($(this).attr('class').indexOf('j_catalog_block')>=0)
    {
        $('#j-catalogWrap').removeClass('hidden')
        $('#bookconten').addClass('hidden')
    }
    else {
         $('#bookconten').removeClass('hidden')
        $('#j-catalogWrap').addClass('hidden')

    }



}
function addcomment() {
    data={'bookid':codequry()['bookid'],'title':$("#j-commentTitle").val(),'conten':$('#j-commentContent').val()}
    json_data=JSON.stringify(data)
    $.ajax({
        url:'/addcomment',
        contentType:'application/json',
        type:'post',
        dataType:'JSON',
        data:json_data,
        headers:{ 'X-XSRFTOKEN':get_cookie('_xsrf')},
        success:function (arg) {
            if(arg.eercode==0){
                location.reload()
            }

        }
    })
}
function next_do() {
    page=$(this).attr('data-page')
    getcomment(page)

}
function next_go() {
    page=$('.lbf-pagination-input').val()
    getcomment(page)

}
function getcomment(page) {
    $.get('/getcomment',{'bookid':codequry()['bookid'],'page':page},function (arg) {
        data=arg.data
        $('#comment_dl').html('')
        for(i in data){
            html='<dd data-tid="175615358705795188">\n' +
                '            <div class="user-photo">\n' +
                '                <a href="javascript:"><img src="//shp.qpic.cn/readnovel/0/801000059446_0/100"></a>\n' +
                '            </div>\n' +
                '            <div class="comment-info">\n' +
                '                <h4>来自<a class="user-name default">'+data[i].username+'</a><i>·</i><em>01-30 23:08</em></h4>\n' +
                '                <h5><a class="" href="/book/7987318804042503/thread/175615358705795188" target="_blank">\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '                    <i class="title">'+data[i].Comment_title+'</i></a></h5>\n' +
                '                <p>'+data[i].conten+'</p>\n' +
                '            </div>\n' +
                '        </dd>'
        $('#comment_dl').append(html)
        }

        count=page_fun(arg.count,10)
        fenzu(page,count)
        $('.lbf-pagination-item a').click(next_do)
        $('.lbf-pagination-go').click(next_go)


    })

}
function get_income() {

    $.get('/get_income',{'bookid':codequry()['bookid']},function (arg) {
        data=arg.data;
        var income_html='';
        for(i in data){
            data_re=data[i].title.split('打赏了')
            var name=data_re[0]
                cion=data_re[1]
            income_html+='<li class="" title="toto"><b>'+name+'</b><cite>打赏了<strong>'+cion+'</strong>阅币</cite></li>'
        }
        $('.fans-slide').html(income_html)
        $('#rewardNum').text(arg.count)

    })
}
function work_act() {
    $(this).siblings('.act').removeAttr('class')
    $(this).attr('class','act')
}
function panel_show() {
     $('.lbf-panel').toggle()
        $('.lbf-overlay').toggle()
}
function a_reward() {
    coin= $('.reward-list ul .act').attr('data-reward')
    bookid=codequry()['bookid']
    data={'coin':coin,'bookid':bookid}
    json_data=JSON.stringify(data)
    $.ajax({
        url:'/user/areward',
        data:json_data,
        contentType:'application/json',
        type:'POST',
        headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
        success:function (arg) {
            if(arg.eercode==0){
                alert('打赏成功')
            }

        }
    })
    
}
$(document).ready(function () {
    get_bookinfo()
    get_income()
    get_Chapters()
     login_chek ()
    getcomment(1)
    get_Other()

    $('#j-commentTitle').click(sendCommentWrap_show)
    $('#j-commentHide').click(sendCommentWrap_colcr)
    $('#cheks li').click(cheks)
    $('#addBookBtn').click(addbook)
    $('#addcomment').click(addcomment)
    $('#rewardBtn').click(panel_show)
    $('.lbf-panel-close').click(panel_show)
    $('.reward-list ul li').click(work_act)
    $('#voteReward').click(a_reward)

})