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

function get_Chapter_info(Chapter_id) {
    $.get('/authon/get_Chapter_info',{'charid': Chapter_id}, function (arg) {

        data = arg.data
        $('.newVolume h3').text(data.chapter_title)
        $('.volumeForm').html(data.conten)

    })
}
function get_Cagtalog_info(cagtalog_id) {

    $.get('/authon/get_Cagtalog_info',{'cagtalog_id':cagtalog_id},function (arg) {
        data=arg.data
        $('.newVolume h3').text(data.catalog_title)
        $('.volumeForm').html(data.conten)
    })

}
function get_Catalog() {
    var bookid=codequry()['bookid']
    $.get('/authon/get_allCatalog',{'bookid':bookid},function (arg) {
       data=arg.data
        var lengths=0
        for(i in data){
           Catalo=data[i]
            lengths+=Catalo.chapters.length
            chapters=Catalo.chapters
           Catalo_html='<div class="volume" data-node="volumeItem" data-volumeid="'+Catalo.catalog_id+'">\n' +
               '                                    <div class="volumeBox">\n' +
               '                                        <p><cite></cite>'+Catalo.catalog+'<span>共'+Catalo.chapters.length+'章</span></p>\n' +
               '                                            <p class="f12">\n' +
               '                                                                                            </p>\n' +
               '                                </div>\n' +
               '                                </div>'

        $('#chapterList').append(Catalo_html)
            chapte_html='<div class="sectionWrap show" data-node="chapterItemList" style="display: none;">'
            for(j in chapters){
               chapte=chapters[j]
               chapte_html+='<li data-node="chapterItem" data-volumeid="'+chapte.chapter_id+'"  class="">\n' +
            '                                                                                        <div class="sectionBox">\n' +
            '                                                <p><em>'+chapte.chapter_title+'</em></p>\n' +
            '                                                <p class="f12"><i>'+chapte.set_time+'</i>共字</p>\n' +
            '                                            </div>\n' +
            '                                        </li>                                '


            }
            Catalo_html+='</div>'
              $('#chapterList').append(chapte_html)

        }
        $('.titleBox').html('<p>共 '+data.length+' 卷， '+lengths+'章</p>')
        $('.volume').click(function () {
            cagtalog_id=$(this).attr('data-volumeid')
            $(this).next().toggle(500)
            get_Cagtalog_info(cagtalog_id)


        })
        $('.sectionWrap li').click(function () {
              $(this).addClass('act')
            chapte_id=$(this).attr('data-volumeid')
            get_Chapter_info(chapte_id)

        }

        )


    })

}
function chaper_recycle() {
    chapetid=$('.sectionWrap .act').attr('data-volumeid')
    json_data=JSON.stringify({'chapetid':chapetid})
    $.ajax({
            url: '/authon/chaper_recycle',
            data: json_data,
            contentType:'application/json',
            headers:{'X-XSRFTOKEN':get_cookie('_xsrf')},
            type:'POST',
            success:function (arg) {
                if(arg.eercode==0){
                    location.reload()
                }

            }
        }

    )

}
$(document).ready(function () {
    logon_chek()
     $('.current').html('<span>'+codequry()['bookname']+'</span>')
    $('#modify').attr('href','/authon/bookmodify.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#addtype').attr('href','/authon/addtype.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#recycle').attr('href','/authon/recycle.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    $('#allChapter').attr('href','/authon/allChapter.html?bookid='+codequry()['bookid']+'&bookname='+codequry()['bookname'])
    get_Catalog()
    $('#deleteVolumeBtn').click(chaper_recycle)

})
