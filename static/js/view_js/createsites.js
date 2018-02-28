$('#headPhotoBox').mousemove(function () {
    $('.userBox').attr('style','display: block;')
})
$('#headPhotoBox').mouseout(function () {
    $('.userBox').removeAttr('style')
})

$('#submitCreatebook').click(function () {
    var site = $('input:radio:checked').val();
    if(!site)
    {
        _dialog.alert('请选择目标读者');
        return;
    }



        if(site=='1'){
            window.location.href='/authon/createbook.html'
        }
        else{
            window.location.href='/authon/createbookw.html'
        }


});
$(document).ready(function () {
    logon_chek()

})