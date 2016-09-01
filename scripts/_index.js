$(document).ready(function(){

    //初始化后 nowdays为当天的日期ID
    localStorage.nowdays = dateIDGet();

    //初始渲染当天日程
    render();

    //添加当前日期
    addDateP();

    //body:hover 上菜单栏出现及隐藏效果
    $('body').hover(function(){
        $('header').addClass('headerShow');
    },function(){
        $('header').removeClass('headerShow');
    });

    //左箭头点击 前一天
    $('#left').click(function(){
        var today = localStorage.nowdays,
            dateID = dateIDGet(-1);
        localStorage.nowdays = dateID;
        addDateP();
        render();
    });
    //右箭头点击 下一天
    $('#right').click(function(){
        var today = localStorage.nowdays,
            dateID = dateIDGet(1);
        localStorage.nowdays = dateID;
        addDateP();
        render();
    });

    //点击+号添加条目
    $('#addItem').click(function(event){
        var inputItem = prompt('请输入一条新记录:');
        if(inputItem !== null){
            addStorage(localStorage.nowdays, inputItem);
            render();
        }
    });

    //点击×号添加条目
    $('#deleteItem').click(function(event){
        if($(this).hasClass('delete')){
            $(this).removeClass('delete');
            $(this).html('&#xe607;');

            deleteStorage(localStorage.nowdays, localStorage.temp);
            render();
            //删掉临时缓存
            localStorage.removeItem('temp');
        }else{
            $(this).addClass('delete');
            $(this).html('&#xe61f;');
            //创建临时缓存，保护数据
            localStorage.temp = '';
        }
    });

    //事件代理，监听日程条目的点击事件
    $('.content').click(function(event){
        var that = event.target;
        if(that.tagName == 'P' || that.tagName == 'DEL'){
            var number = parseInt($(that).children('span').html());
            if($('#deleteItem').hasClass('delete')){
                // temp保存将要删除的位置
                var temp = localStorage.temp;
                //如果该数已存在则翻转
                if(temp.indexOf(number) == -1){
                    temp += number;
                    //用类名标记是否选择
                    $(that).addClass('hasMark');
                }else{
                    temp = temp.replace(number,'');
                    //用类名标记是否选择
                    $(that).removeClass('hasMark');
                }
                localStorage.temp = temp;
            }else{
                changeStorage('_' + localStorage.nowdays, number);
                render();
            }
        }
    });
});


/**
 * 根据localStorage信息渲染条目信息
 * @return {[type]} [description]
 */
function render(){
    var nowdaysID = localStorage.nowdays,
        dateItem = localStorage[nowdaysID] ? localStorage[nowdaysID].split(',') : [],
        dateRes = localStorage['_' + nowdaysID] ? localStorage['_' + nowdaysID].split(',') : [];
    //清空原始内容
    $('.content').html('');
    //遍历数组渲染
    if(dateItem && dateItem.length !== 0){
        for(var i = 0, len = dateItem.length; i < len; i++){
            var newTag;
            //如果结果为1 说明已完成
            if(dateRes[i] == 1){
                //已完成用删除线标签
                newTag = document.createElement('del');
            }else{
                newTag = document.createElement('p');
            }
            newTag.innerHTML = '<span>'+ (i + 1) +'.&nbsp;</span>'+ dateItem[i];
            newTag.className = "items";
            $('.content').append(newTag);
        }
    }

}

/**
 * 添加备忘录的日期
 */
function addDateP(){
    var today = localStorage.nowdays;
    $('.date').html(todayGet(today));
}

/**
 * 改变storage中指定位置的值
 * @param  {[type]} name   [storage的键名]
 * @param  {[type]} number [指定位置 从1开始]
 * @return {[type]}        [description]
 */
function changeStorage(name, number){
    var data = localStorage[name].split(',');
    data[number - 1] = (data[number - 1] == 1) ? 0 : 1;
    localStorage[name] = data;
}

/**
 * 删除storage中指定位置的信息
 * @param  {[type]} dateID [日期ID]
 * @param  {[type]} number [指定位置 从1开始]
 * @return {[type]}        [description]
 */
function deleteStorage(dateID, number){
    var dateItem,
        dateRes,
        delList;

    if(localStorage[dateID] && localStorage['_' + dateID]){
        //从localStorage读取数据
        dateItem = localStorage[dateID].split(',');
        dateRes = localStorage['_' + dateID].split(',');
        //删除指定位置的数据
        delList =  number.split('').sort(function(a,b){return b - a;});
        for(var i = 0, len = delList.length; i < len; i++){
            dateItem.splice(delList[i] - 1,1);
            dateRes.splice(delList[i] - 1,1);
        }
        //重新写入数据
        localStorage[dateID] = dateItem;
        localStorage['_' + dateID] = dateRes;
    }
}

/**
 * 给storage添加信息
 * @param {[type]} dateID  需要添加信息的dateID
 * @param {[type]} message 需要添加的信息
 */
function addStorage(dateID, message){
    var dateItem,
        dateRes;
    if(!localStorage[dateID] && !localStorage['_' + dateID]){
        dateItem = [];
        dateRes =  [];
    }else{
        dateItem = localStorage[dateID].split(',');
        dateRes = localStorage['_' + dateID].split(',');
    }
    dateItem.push(message);
    dateRes.push(0);
    localStorage[dateID] = dateItem;
    localStorage['_' + dateID] = dateRes;
}

/**
 * 获取日期ID
 * @param  {[number]} [days] 可选参数，相对于今天的天数位移
 * @return {[number]]}      返回日期的ID用于localStorage
 */
function dateIDGet(days){
    if(arguments.length === 0){
        var mydate = new Date();
        mydate.setHours(0,0,0,0);
        var dateID = Date.parse(mydate) / 100000;
        return dateID;
    }

    var nowdays = localStorage.nowdays;
    if(days && (typeof days == 'number')){
        // +864 下一天
        return (+nowdays + (days * 864));
    }else{
        return nowdays;
    }
}

/**
 * 获取日期
 * @param  {[number]} [dateID] 日期的ID值
 * @return {[string]} 日期字符串
 */
function todayGet(dateID){
    var mydate = new Date(),
        today;
    //如果传入ID,用毫秒数设置日期
    if(dateID){
        mydate.setTime(dateID * 100000);
    }
    //若未传入参数则传回今天的日期
    today = ( (mydate.getMonth() + 1) + '月' + mydate.getDate()+'日');
    return today;
}
