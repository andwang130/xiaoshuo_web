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
window.onload=function () {
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
function get_chapterinof() {
    $(this).siblings('.act').removeClass('act')
    $(this).attr('class','act')
    Chapter_id=$(this).attr('data-value')
     $.get('/authon/get_Chapter_info',{'charid': Chapter_id}, function (arg) {

        data = arg.data
        $('#chapterTitle').text(data.chapter_title)
        $('#chapterContent').html(data.conten)

    })
}
function get_chapter() {
    var bookid=codequry()['bookid']
    $.get('/authon/get_recycl',{'bookid':bookid},function (arg) {
        var html=''
        data=arg.data
        for(i in data){
            html+='<li data-node="newDraftItem" data-value="'+data[i].id+'"><div class="sectionBox"><p><em>'+data[i].chapter_title+'</em></p><p class="f12"><i>&nbsp;</i></p></div></li>'
        }
        $('#draftList').html(html)
        $('#draftList li').click(get_chapterinof)



    })

}
function delete_chapter() {
    chapteid=$('#draftList .act').attr('data-value')
    json_data=JSON.stringify({'chaptrid':chapteid})
    $.ajax(
        {
            url:'/authon/delete_chapter',
            data:json_data,
            contentType:'application/json',
            type:'POST',
            headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg) {
                if(arg.eercode==0){
                    location.reload()
                }

            }
        }
    )

}
function recovery() {
     chapteid=$('#draftList .act').attr('data-value')
    json_data=JSON.stringify({'chaptrid':chapteid})
    $.ajax(
        {
            url:'/authon/chapter_recovery',
            data:json_data,
            contentType:'application/json',
            type:'POST',
            headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            success:function (arg) {
                if(arg.eercode==0){
                    location.reload()
                }

            }
        }
    )
}
$(document).ready(function () {
    $('.current').html('<span>'+codequry()['bookname']+'</span>')
    $('#modify').attr('href','/authon/bookmodify.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname']);
    $('#addtype').attr('href','/authon/addtype.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname']);
    $('#recycle').attr('href','/authon/recycle.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname']);
    $('#allChapter').attr('href','/authon/allChapter.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname']);
        get_chapter()
    $('#deleteChapterBtn').click(delete_chapter)
    $('#recoverChapterBtn').click(recovery)

})