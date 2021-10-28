window.onload = function () {

    //获取Cookie中存储的用户名
    function getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
    }
    //将Cookie中存储的用户名和该主机节点的公钥显示在前端
    var username = document.getElementById("username");
    var user = getCookie("username"); //存储在Cookie中的用户名
    var publicKey = getCookie("publicKey"); //存储在Cookie中的主机公钥
    username.innerHTML = "你好！" + user;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://47.96.172.216:8080/node/block/query_deal_list?userHash=" + publicKey, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var jsonReturn = JSON.parse(xhr.responseText);
            if(jsonReturn.code == 200){
                // var tradeRecordsTable = document.getElementById("tradeRecordsTable");
                var tbody = document.getElementById("tbody");
                for(var i in jsonReturn.info){

                    //根据接收到的信息数量创建表格里的行
                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);

                    //获取表格需展示的每一列数据
                    var tradeHash = jsonReturn.info[i].hash;
                    var videoId = jsonReturn.info[i].video.id;
                    var videoName = jsonReturn.info[i].video.videoName;
                    var videoSize = jsonReturn.info[i].video.videoSize;
                    var videoPrice = jsonReturn.info[i].video.videoPrice;
                    var videoHash = jsonReturn.info[i].video.hash;
                    var timeStamp = jsonReturn.info[i].timeStamp;
                    var serverName = jsonReturn.info[i].video.serverName;
                    var inputKey = jsonReturn.info[i].inputKey;
                    var receiveKey = jsonReturn.info[i].receiveKey;

                    //将列数据存进数组里
                    var datas = [tradeHash, videoId, videoName, videoSize, videoPrice, videoHash, timeStamp, serverName, inputKey, receiveKey];

                    //根据接收到的列数据数量创建表格每一行里的列
                    for(var i in datas){
                        var td = document.createElement("td");
                        tr.appendChild(td);
                        td.innerHTML = datas[i];
                    }
                }
            }
        }
    }

    //返回
    var returnToTrade = document.getElementById("returnToTrade");
    returnToTrade.onclick = function () {
        location.href = "trade.html";
    }
}