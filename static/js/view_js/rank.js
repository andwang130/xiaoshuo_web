function get_rank() {

    $.get('/get_rank',function(arg){
        data=arg.data;

        week_data=data.week_data;
        new_data=data.new_data;
        collect_data=data.collect_data;
        click_data=data.click_data;
        Recharge_data=data.Recharge_data;
        Finish_data=data.Finish_data;
        data_list=[week_data,Finish_data,new_data,Recharge_data,click_data,collect_data];
        rank_list=$('.rank-list');
        console.log(data_list);
        for(i in data_list){
            ul_=$(rank_list[i]).find('div ul')
            html=''
           for(j in data_list[i]){
                    ul_data=data_list[i][j]
                    num=Number(j)+1
                    html += '<li><span class="num'+num+'">'+num+'</span><a class="name" href="/book.html?bookid='+ul_data.id+'" target="_blank">'+ul_data.bookname+'</a></li>'
                console.log(ul_data)

           }
          $(rank_list[i]).find('div ul').html(html)

        }
    })
    
}
$(document).ready(
    function () {
        login_chek();
        get_rank();
    }
)