function get_cookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function () {
    login_chek()
    $.get('/index',function (arg) {
        var now_data=arg.data.NOW;
        for (i in now_data){
        silder_con='<li class="silder_panel clearfix"><a class="f_l" href="/book.html?bookid='+now_data[i].id+'"><img src="'+now_data[i].book_img+'"></a>\n' +
            '        <div class="silder_intro f_r">\n' +
            '          <h3> <strong><a href="/book.html?bookid='+now_data[i].id+'">'+now_data[i].bookname+'</a></strong> <span>Prompt</span> </h3>\n' +
            '          <p>'+now_data[i].introduce+'</p>\n' +
            '          <a class="silder_play"></a></div>\n' +
            '      </li>'
            silder_nav='<li style="opacity: 0.5;" class=""><a href="#"><img src="'+now_data[i].book_img+'"></a></li>'
        $('.silder_con').append(silder_con)
            $('.silder_nav').append(silder_nav)


        }
        var data_hot=arg.data.Hot
        var arry=[0,3,6]
        html=''
        for (i in arry) {
            i=Number(arry[i])
            html+= '<ul>\
                    <li data-rid="1" style="height: 144px">\
                        <div class="book-img"><a href="/book.html?bookid='+ data_hot[0+i].id + '" data-eid="qd_F23" data-bid="' + data_hot[0+i].id + '" target="_blank">\
                            <img src="' + data_hot[0+i].book_img + '" alt="">\
                        </a></div><div class="book-info">\
                        <h4><a href="/book.html?bookid='+data_hot[0+i].id+'" data-eid="qd_F24" data-bid="' + data_hot[0+i].id + '" target="_blank" title=' + data_hot[0+i].bookname + '>' + data_hot[0+i].bookname + '</a></h4><p>' + data_hot[0].introduce.replace(/<[^>]+>/g,"" )+ '</p>\
                        <div class="state-box cf"><i>'+data_hot[0+i].booktype+'</i></div></div></li>\
                        <li data-rid="2" style="height: 144px">\
                        <div class="book-img"><a href="/book.html?bookid=' + data_hot[1+i].id + '" data-eid="qd_F23" data-bid="' + data_hot[1+i].id + '" target="_blank">\
                            <img src="' + data_hot[1+i].book_img + '" alt="">\
                        </a></div><div class="book-info">\
                        <h4><a href="/book.html?bookid=' + data_hot[1+i].id + '" data-eid="qd_F24" data-bid="' + data_hot[1+i].id + '" target="_blank" title=' + data_hot[1].bookname + '>' + data_hot[1].bookname + '</a></h4><p>' + data_hot[1].introduce.replace(/<[^>]+>/g,"") + '</p>\
                        <div class="state-box cf"><i>'+data_hot[2+i].booktype+'</i></div></div></li>\
                        <li data-rid="3" style="height: 144px">\
                        <div class="book-img"><a href="/book?bookid=' + data_hot[2+i].id + '" data-eid="qd_F23" data-bid="' + data_hot[2+i].id + '" target="_blank">\
                            <img src="' + data_hot[2+i].book_img + '" alt="">\
                        </a></div><div class="book-info">\
                        <h4><a href="/book.html?bookid=' + data_hot[2+i].id + '" data-eid="qd_F24" data-bid="' + data_hot[2+i].id + '" target="_blank" title=' + data_hot[2+i].bookname + '>' + data_hot[2+i].bookname + '</a></h4><p>' + data_hot[2+i].introduce.replace(/<[^>]+>/g,"") + '</p>\
                        <div class="state-box cf"><i>'+data_hot[2+i].booktype+'</i></div></div></li>\
                </ul>'

        }
        $('#hot').html(html)
        data_list=arg.data.booklist

        ul_1=[0,1,2,3]
        ul_2=[4,5,6,7]
        ul_num=[ul_1,ul_2]
        for(ul in ul_num) {
            console.log(ul)
              html='<ul class="mb30 cf">'
            for (i in ul_num[ul])
        {
            i=ul_num[ul][i]
            for(key in data_list[i]) {
                data_key = key
                data_value = data_list[i][key]
                console.log(data_key,data_value)
            }
            if (data_value.length>4) {
                html += '<li class="hover-icon"> <dl> <dd class="top" data-rid="1"> <h6>' + data_key + '<em class="icon icon-xdyq"></em></h6>\
        <div class="book-wrap cf" style="height: 104px" ;=""> <div class="book-info fl">\
        <h4><a href="/book.html?bookid='+data_value[0].id+'" target="_blank" data-eid="qd_A117" data-bid="6840096203735101" title="' + data_value[0].bookname + '">' + data_value[0].bookname + '</a></h4>\
            <p>' + data_value[0].introduce + '</p>\
            </div>\<div class="book-cover">\
                                <a class="link" href="/book.html?bookid='+data_value[0].id+' data-eid="qd_A117" target="_blank" data-bid="/book/6840096203735101"><img src="' + data_value[0].book_img + '" alt="' + data_value[0].bookname + '">\
                                </a>\
                                <span></span>\
                            </div>\
                        </div>\
                        </dd>\
                        <dd data-rid="2">\
                        <i><a href="/book.html?bookid=' + data_value[1].id + '" target="_blank">' + data_value[1].bookname + '</a></i></dd>\
                        <dd data-rid="3"><i><a href="/book.html?bookid=' + data_value[2].id + '" target="_blank">' + data_value[2].bookname + '</a></i></dd>\
                        <dd data-rid="4"><i><a href="/book.html?bookid=' + data_value[3].id + '" target="_blank">' + data_value[3].bookname + '</a></i>\
                    </dd>\
                        <dd data-rid="5">\
                        <i><a href="/book/?=' + data_value[4].id + '"target="_blank">' + data_value[4].bookname + '</a></i></dd>\
                    </dl>\
                </li>'
            }
            else {
                html+= '<li class="hover-icon"> <dl> <dd class="top" data-rid="1"> <h6>' + data_key + '<em class="icon icon-xdyq"></em></h6>\
                        </dd>\
                        <dd data-rid="2">\
                    </dl>\
                </li>'

            }
            }

            html+='</ul>'
            $('.hot-book-list-wrap').append(html)
             }


             $(function(){
	var sWidth = $("#slider_name").width();
	var len = $("#slider_name .silder_panel").length;
	var index = 0;
	var picTimer;

	var btn = "<a class='prev'>Prev</a><a class='next'>Next</a>";
	$("#slider_name").append(btn);

	$("#slider_name .silder_nav li").css({"opacity":"0.6","filter":"alpha(opacity=60)"}).mouseenter(function() {
		index = $("#slider_name .silder_nav li").index(this);
		showPics(index);
	}).eq(0).trigger("mouseenter");

	$("#slider_name .prev,#slider_name .next").css({"opacity":"0.2","filter":"alpha(opacity=20)"}).hover(function(){
		$(this).stop(true,false).animate({"opacity":"0.6","filter":"alpha(opacity=60)"},300);
	},function() {
		$(this).stop(true,false).animate({"opacity":"0.2","filter":"alpha(opacity=20)"},300);
	});


	// Prev
	$("#slider_name .prev").click(function() {
		index -= 1;
		if(index == -1) {index = len - 1;}
		showPics(index);
	});

	// Next
	$("#slider_name .next").click(function() {
		index += 1;
		if(index == len) {index = 0;}
		showPics(index);
	});

	//
	$("#slider_name .silder_con").css("width",sWidth * (len));

	// mouse
	$("#slider_name").hover(function() {
		clearInterval(picTimer);
	},function() {
		picTimer = setInterval(function() {
			showPics(index);
			index++;
			if(index == len) {index = 0;}
		},3000);
	}).trigger("mouseleave");

	// showPics
	function showPics(index) {
		var nowLeft = -index*sWidth;
		$("#slider_name .silder_con").stop(true,false).animate({"left":nowLeft},300);
		$("#slider_name .silder_nav li").removeClass("current").eq(index).addClass("current");
		$("#slider_name .silder_nav li").stop(true,false).animate({"opacity":"0.5"},300).eq(index).stop(true,false).animate({"opacity":"1"},300);
	}
});
    })

})