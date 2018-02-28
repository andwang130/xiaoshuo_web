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
$(document).ready(function () {
    logon_chek()
    $('.current').html('<span>'+codequry()['bookname']+'</span>')
    $('#modify').attr('href','/authon/bookmodify.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#addtype').attr('href','/authon/addtype.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#recycle').attr('href','/authon/recycle.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#allChapter').attr('href','/authon/allChapter.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])

$('#headPhotoBox').mousemove(function () {
    $('.userBox').attr('style','display: block;')
})
$('#headPhotoBox').mouseout(function () {
    $('.userBox').removeAttr('style')
})

var bookid=codequry()['bookid']
    console.log(bookid)
    $.get('/authon/get_bookinfo',{'bookid':bookid},function (arg) {
        var data=arg.data
        $('#bookname').text(data.bookname)
        $('#booktype').text(data.booktype)
        $('#booktag').text(data.booktag)
        $('#introduce').text(data.introduce)
        $('.select-level span').text(data.free)
        $('#font_num p').text(data.font_num)
        $('#collect_num p').text(data.collect_num)







    })

})