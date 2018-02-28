$('#headPhotoBox').mousemove(function () {
    $('.userBox').attr('style','display: block;')
})
$('#headPhotoBox').mouseout(function () {
    $('.userBox').removeAttr('style')
})
