
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
    get_freeall(page)

}
function next_go() {
    page=$('.lbf-pagination-input').val()
    get_freeall(page)

}

function get_freeall(page) {
    var book_sex=$('.site .act').text();
     var booktype=$('.selected p a[type="category"]').text();
    var font_size=$('.selected p a[type="size"]').text();
    var order_by=$('.sort-wrap .act').text();
    if(font_size=='30万以下') font_size='0-30';
    if(font_size=='30~50万') font_size='30-50';
    if(font_size=='50~100万') font_size='50-100';
    if(font_size=='100~200万') font_size='100-200';
    if(font_size=='200万以上') font_size='200-$';
    var action=$('.selected p a[type="action"]').text();
    var update_time=$('.selected p a[type="update"]').text();
    if(update_time=='三日内') update_time=3;
    if(update_time=='七日内') update_time=7;
    if(update_time=='半月内') update_time=15;
    if(update_time=='一月内') update_time=30;
    var data={};
    if(booktype) data['booktype']=booktype;
     if(font_size) data['font_num']=font_size;
    if(action) data['action']=action;
    if(update_time) data['update_time']=update_time;
    if(booktype==''&&font_size==''&&action==''&&update_time=='') data['type']='all';
    data['page']=page;
    data['book_sex']=book_sex;
    data['free']='all';
    data['order_by']=order_by;
    $.get('/getfreeall',data,function (arg) {
        html='';
        data=arg.data;
        for(i in data){
            html+='<li>\n' +
                '                <div class="book-img">\n' +
                '                    <a href="/book/8273997504565303" target="_blank" >\n' +
                '                        <img src="'+data[i].book_img+'" ">\n' +
                '                    </a>\n' +
                '                </div>\n' +
                '                <div class="book-info" style="height: 134px">\n' +
                '                    <h3><a href="/book.html?bookid='+data[i].id+'" target="_blank" >'+data[i].bookname+'</a></h3>\n' +
                '                    <p class="tag"><span class="org">'+data[i].booktype+'</span><span class="red">'+data[i].action+'</span><span class="blue">'+data[i].font_num+'</span></p>\n' +
                '                    <p class="intro">'+data[i].introduce+'</p>\n' +
                '                </div>\n' +
                '            </li>'
        }
        $('.right-book-list ul').html(html)
         count=page_fun(arg.count,10)
        fenzu(page,count)
            $('.lbf-pagination-item a').click(next_do)
        $('.lbf-pagination-go').click(next_go)
    })

}
function work_act() {
    $(this).siblings('.act').removeAttr('class')
    $(this).attr('class','act')
    var tag=$('.work-filter ul .act a')
    i=0
    var html=''
    while (i<tag.length){
        var tag_text=tag[i].text
        if(tag_text!='全部'){
            type=$(tag[i]).parent().parent().attr('type')
             html+='<a class="all" href="javascript:" type="'+type+'">'+tag_text+'</a>'
        }
        i++
    }
    $('.selected p').html(html)
    get_freeall(1)

}
function sort_act(){
    $('.sort-wrap .act').removeAttr('class')
     $(this).attr('class','act')
    get_freeall(1)

}


window.onload=function () {
    login_chek()
    $('.work-filter ul li').click(work_act)
    $('.sort-wrap a').click(sort_act)
    get_freeall(1)

}