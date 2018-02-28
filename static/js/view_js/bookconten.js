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

function get_conten() {
    $.get('/get_conten',{'ChaptID':codequry()['ChaptID']},function (arg) {
        chapte_data=arg.data.chapte_data
        authon_data=arg.data.authon_data
        book_data=arg.data.book_data
        $('.j_chapterName').text(chapte_data.chapter_title)
        $('.read-content').html(chapte_data.conten)
        $('#autho_name').text(authon_data.name)
        $('#bookname').text( book_data.bookname)
        $('#mulu').attr('href','/book.html?bookid='+book_data.id)
        $('#bookname').attr('href','/book.html?bookid='+book_data.id)
        $('.j_chapterWordCut').text(chapte_data.count)
        $('.j_updateTime').text(chapte_data.set_time)
        $('#bookImg').text(book_data.bookname)
        $('#bookImg').attr('href','/book.html?bookid='+book_data.id)
        $('#j_chanId').text(book_data.booktype)

        if(chapte_data.up_id!='NULL'){
            $('#j_chapterPrev').attr('href','/bookconten.html?ChaptID='+chapte_data.up_id)
        }
        else {
             $('#j_chapterPrev').addClass('disabled')
        }
        if(chapte_data.next_id!='NULL'){
            $('#j_chapterNext').attr('href','/bookconten.html?ChaptID='+chapte_data.next_id)
        }
        else {
             $('#j_chapterNext').addClass('disabled')
        }
    })

}
$(document).ready(
    function () {
        login_chek()
        get_conten()

    }
)