function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
$('#headPhotoBox').mousemove(function () {
    $('.userBox').attr('style','display: block;')
})
$('#headPhotoBox').mouseout(function () {
    $('.userBox').removeAttr('style')
})
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
    var page_html='<div class="pagination"><ul class="lbf-pagination-item-list"><li class="lbf-pagination-item"><a href="javascript:;" data-page="'+up_page+'"class="lbf-pagination-prev lbf-pagination-disabled">&lt;</a></li>'

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
       page_html+='<li class="lbf-pagination-item"><a href="javascript:;" data-page="'+next_page+'" class="lbf-pagination-next lbf-pagination-disabled">&gt;</a></li></ul><div class="lbf-pagination-jump"><input type="text" class="lbf-pagination-input"  value="'+page+'"><a href="javascript:;" class="lbf-pagination-go">GO</a></div></div>'
       $('#pager').html(page_html)
}
function get_books(page) {
      $.get('/authon/get_books',{'page':page},function (arg) {
    var html=''
    var data=arg.data
    for(i in data){
        html+='<tr class="active"><td></td><td class="tl"><div class="work-photo"><a href="#" target="_blank"><img src="https://ccstatic-1252317822.file.myqcloud.com/bookcoverimg/2018-02-11/default_5a7fef190dce2.png" width="83" height="108" alt="作品封面"> </a> </div> <p class="work-name">'
        html+='<a href="/authon/bookmodify.html?bookid='+data[i].id+'&bookname='+data[i].bookname+'" target="_blank">'+data[i].bookname+'</a>'
         html+='</p></td><td class="tl"><a href="javascript:">无最新章节</a></td><td><em>'+data[i].booktype+'</em></td><td><em class="Num">0</em></td><td>新建</td><td><div class="dib-wrap"><a class="button blue" href="/authon/addtype.html?bookid='+data[i].id+'&bookname='+data[i].bookname+'"><span class="icon"></span><i>写新章节</i></a><a class="button white" url-chapter="/booknovels/chaptermanage/CBID/9829212004976303.html" data-catid="20001" href="javascript:">" + "<span class="icon"></span><i>已发布章节</i></a></div></td></tr>'
    }
    $('#novelList').html(html)
    pages=page_fun(arg.count,5)
          fenzu(pages,page)
           $('.lbf-pagination-item').click(function () {
            page_=$(this).find('a').attr('data-page')
            get_books(page_)

        })
        $('.lbf-pagination-go').click(function () {
            page_go=$('.lbf-pagination-input').val()
            get_books(page_go)

        })
})

}
$(document).ready(function () {
     logon_chek()
    get_books(1)



})