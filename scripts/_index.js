$(document).ready(function(){

    //body:hover 上菜单栏出现及隐藏效果
    $('body')
        .hover(function(){
            $('header').addClass('headerShow');
            console.log(1);
        },function(){
            $('header').removeClass('headerShow');
            console.log(2);
        })
})
