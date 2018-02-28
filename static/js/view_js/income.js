$('#headPhotoBox').mousemove(function () {
    $('.userBox').attr('style','display: block;')
})
$('#headPhotoBox').mouseout(function () {
    $('.userBox').removeAttr('style')
})
function seset_show () {
    $(this).find('dl').toggle()
    

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
function input_show () {
    var text=$(this).text()
    var bookid=$(this).attr('data-value')
    $('.combo-input').val(text)
    $('.combo-input').attr('data-value',bookid)
}
function get_books() {
    $.get('/authon/get_books',function (arg) {
        data=arg.data
        for(i in data){
            html='<dd class="option-item book_income" data-index="1" data-value="'+data[i].id+'">'+data[i].bookname+'</dd>'
            $('.combo-dropdown').append(html)
        }
        $('.book_income').click(input_show)
        
    })
}
function get_income(page) {
    bookid=$('.combo-input').attr('data-value')
    data={'bookid':bookid,'page':page}
    $.get('/get_income',data,function (arg) {
        data=arg.data
        html=''
        for(i in data){
            html+='<tr>\n' +
                '        <td colspan="1">'+data[i].set_time+'</td>\n' +
                 ' <td colspan="1">'+data[i].income_num+'</td>\n' +
             '<td colspan="1">'+data[i].title+'</td>\n' +
                '    </tr>'

        }
           $('#incomeList').html(html)
        pages=page_fun(Number(arg.count),10)
        fenzu(page,pages)
        $('.lbf-pagination-item').click(function () {
            page_=$(this).find('a').attr('data-page')
            get_income(page_)

        })
        $('.lbf-pagination-go').click(function () {
            page_go=$('.lbf-pagination-input').val()
            get_income(page_go)

        })

    })

}
$(document).ready(function () {
    
    logon_chek()
    get_books()
    $('#searchBtn').click(function () {
        get_income(1)
    })
    $('.combo-select').click(seset_show)
    
})