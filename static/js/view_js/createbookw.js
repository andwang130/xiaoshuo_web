$('#selectedNovelTagList').click(function () {
    $('#novelTagPopup').attr('style','z-index: 1000001; position: fixed; left: 469.5px; top:25px;')

})
$('#novelTagPopup_closeBtn').click(function () {
      $('#novelTagPopup').attr('style','display:none')

})
$('.tagFilter a').click(function () {
    $(this).siblings('.act').removeAttr('class')
    $(this).attr('class','act')

})
$('#novelTagPopup_confirmBtn').click(function () {
    var tag=$('.tagFilter .act');
    var lengt= tag.length
    var text_tag='';
    var i=0
    while(i<lengt){

        text_tag+=tag[i].text+';'
        i++
    }
    $('#tagIdListHidden').val(text_tag)
    $('#selectedNovelTagList').text(text_tag)
        $('#novelTagPopup').attr('style','display:none')


}
)
$('#headPhotoBox').mousemove(function () {
    $('.userBox').attr('style','display: block;')
})
$('#headPhotoBox').mouseout(function () {
    $('.userBox').removeAttr('style')
})

$('#createNovelBtn').click(function () {
    var bookname=$('#bookName').val()
    var booktype=$('#novelMainCategorySelect option:selected').text()
    var booktag=$('#tagIdListHidden').val()
    var introduce=$('#introduction').val()
    var free=$('#freeSelect option:selected').text()
    if(bookname.length>15||bookname.length<6){
    alert('作品名称不能大于15个字小于6个字')
        return
    }
    if(!booktype){
        alert('作品类型不可为空')
        return
    }
    if(introduce.length>300||introduce.length<30){
        alert('请输入简介，内容大于30小于300')
        return
    }
    var data={'bookname':bookname,'booktype':booktype,'booktag':booktag,'introduce':introduce,'book_sex':'女生','free':free}
    var json_data=JSON.stringify(data)
    $.ajax({
        url:'/authon/add_book',
        type:'POST',
        contentType:'application/json',
        dataType:'JSON',
        headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
        data:json_data,
        success:function (arg) {
            if(arg.eercode==0){
                window.location.href='/authon/createbookjump.html'
            }
            if(arg.eercode==100)
            {
                alert('该作品已经存在')
            }
        }
    })

})
$(document).ready(function () {
     logon_chek()

})