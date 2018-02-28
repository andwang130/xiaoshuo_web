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
    $('#combo-input1').val(text)
    $('#combo-input1').attr('data-value',bookid)
}
// function input_show2() {
//     var text=$(this).text()
//     var bookid=$(this).attr('data-value')
//     $('#combo-input2').val(text)
//     $('#combo-input2').attr('data-value',bookid)
// }
function get_Follows(page) {
    bookid=$('#combo-input1').attr('data-value')
    $.get('/authon/get_follows',{'bookid':bookid,'page':page},function (arg) {
        if(page==1){
            $('.all em').text(arg.count)
            $('.record ul li span').text(arg.Yesterday_count)

        }
        datas=arg.data
        html=''
        for(i in datas){
            data=datas[i]

            html+='<tr><td colspan="1">'+data.name+'</td><td colspan="1">'+data.set_time+'</td><</tr>'
            $('#incomeList').append(html)
        }
        $('#incomeList').html(html)
        pages=page_fun(Number(arg.count),10)
        fenzu(page,pages)
          $('.lbf-pagination-item').click(function () {
            page_=$(this).find('a').attr('data-page')
            get_Follows(page_)

        })
        $('.lbf-pagination-go').click(function () {
            page_go=$('.lbf-pagination-input').val()
            get_Follows(page_go)

        })

    })
}
function get_books() {
    $.get('/authon/get_books',function (arg) {
        data=arg.data
        if(data.length<1){
            return
        }
        var html1=''
        var html2=''
        for(i in data){
            html1+='<dd class="option-item book_income" data-index="1" data-value="'+data[i].id+'">'+data[i].bookname+'</dd>';


        }
        console.log(html1)
         $('#combo-dropdown1').html(html1)
        $('.book_income').click(input_show)

    })
}
$(document).ready(function () {
    logon_chek()
    get_books()
     $('.combo-select').click(seset_show)
    $('#searchTakeList').click(
        function () {
            get_Follows(1)
        }
    )
})