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
$('#headPhotoBox').mousemove(function () {
    $('.userBox').attr('style','display: block;')
})
$('#headPhotoBox').mouseout(function () {
    $('.userBox').removeAttr('style')
})
function listBox_opne(event) {
     event.stopPropagation();
    $('.drop-list-box').attr('style','display: block;')
    
}
function listBox_close() {
    if($('.drop-list-box').attr('style')=='display: block;'){
        $('.drop-list-box').removeAttr('style')
    }
            $('.drop-list-box ul li a').click(lists_li_a)

}
function lists_li_a(event) {
    event.stopPropagation();
    text=$(this).text()
    id=$(this).attr('data-volumeid')
    html='<span id="selectedVolume"  data-volumeid="'+id+'">'+text+'</span>'
    $('.drop-down').html(html)
    $('.drop-list-box').removeAttr('style')

}
function maskUI_open(event) {
    html='<div class="muban" style="z-index: 999999; position: fixed; left: 0px; top: 0px; background-color: rgb(0, 0, 0); margin: 0px; padding: 0px; width: 1519px; height: 1095px; opacity: 0.5;"></div>'
    $('.maskUI').before(html)
    event.stopPropagation();
    $('.maskUI').attr('style', 'z-index: 1000000; position: fixed; left: 569.5px; top: -7.5px;')

}
function maskUI_close(event) {
    $('.muban').remove()
     event.stopPropagation();
     $('.maskUI').removeAttr('style')

}
function get_Catalog() {
    var bookid=codequry()['bookid']
    $.get('/authon/get_Catalog',{'bookid':bookid},function (arg) {
       data=arg.data
        html=''
        html_new='<span id="selectedVolume"  data-volumeid="'+data[data.length-1].id+'">'+data[data.length-1].Catalog_title+'</span>'

        for(i in data){
           html+='<li><a data-volumeid="'+data[i].id+'" data-vipflag="-1" href="javascript:">'+data[i].Catalog_title+'</a></li>'

        }
        $('.drop-list-box ul').html(html)
        $('.drop-down').html(html_new)
    })

}
function add_Catalog() {
    var bookid=codequry()['bookid']
    var conten=$('#conten').val()
    var Cataloh_title=$('#Catalog').val()
    var json_data=JSON.stringify({'bookid':bookid,'Cataloh_title':Cataloh_title,'conten':conten})
    $.ajax({
        url:'/authon/add_Catalog',
        contentType: 'application/json',
        type: 'POST',
        dataType: 'JSON',
        headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
        data: json_data,
        success: function (arg) {
            if (arg.eercode == 0) {
                location.reload()
            }
        }
    })


}
$(document).ready(function () {
    get_Catalog()
    $('.current').html('<span>'+codequry()['bookname']+'</span>')
    $('#modify').attr('href','/authon/bookmodify.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#addtype').attr('href','/authon/addtype.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#recycle').attr('href','/authon/recycle.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#allChapter').attr('href','/authon/allChapter.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#confirm').click(add_Catalog)
    $('.drop-down').click(listBox_opne)
    $('*').not($('.drop-down'),$('.drop-list-box ul li a')).click(listBox_close)
    $('#openCreateVolumePopupBtn').click(maskUI_open)
    $('.closePopup').click(maskUI_close)




$('#null').click(function () {
     $('.act').removeClass('act')
    $(this).addClass('act')
     $('#chapterTitleInput').val('')
    $('#chapterContentInput').val('')
    }
)
        function li_cilick() {
      $('.chapter_li').click(function () {
                    charid=$(this).children('.IDINPUT').val()
                    $('.act').removeClass('act')
                    $(this).addClass('act')
                    $.get('/authon/get_Chapter_info',{'charid':charid},function (arg) {
                        $('#chapterTitleInput').val(arg.data.chapter_title)
                        $('#chapterContentInput').val(arg.data.conten)


                    })
                })
}
 $('#showPublishPopupBtn').click(function () {
    var Chapter= $('#chapterTitleInput').val()
    var  content=$('#chapterContentInput').val()
     var Catalog_id=$('#selectedVolume').attr('data-volumeid')
     if(Chapter&&content){
         var data = {'bookid': codequry()['bookid'], 'Chapter': Chapter, 'conten': content,'Catalog_id':Catalog_id}
         var json_data = JSON.stringify(data)
         $.ajax({
         url: '/authon/add_Chapter',
         contentType: 'application/json',
         dataType: 'JSON',
         type: 'POST',
         data: json_data,
         headers: {'X-XSRFTOKEN': get_cookie('_xsrf')},
         success: function (arg) {
             if (arg.eercode == 0) {
                 alert('添加成功')
             }

         }
     })
         return
 }
 else {
        alert('请输入标题和内容')
     }
})

    $.ajax({
        url:'/authon/login_info',
        type:'POST',
        dataType:'JSON',
        headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
        success:function (arg) {
            $('.userName').text(arg.name)

        }
    })

}

)

