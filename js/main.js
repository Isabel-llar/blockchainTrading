window.onload = function () {

    var chooseNode = document.getElementById("chooseNode"); //获取视频资源选择下拉框的id
    var tradeRecordsTable = document.getElementById("tradeRecordsTable"); //获取表格的id
    var tbody = document.getElementById("tbody");
    var data = []; //表格数据数组
    var tradeSituation = document.getElementById("tradeSituation"); //获取视频可交易状态下拉框id

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
    var nowHash = document.getElementById("nowHash");

    var user = getCookie("username"); //存储在Cookie中的用户名
    var publicKey = getCookie("publicKey"); //存储在Cookie中的主机公钥
    username.innerHTML = "你好！" + user;
    nowHash.innerHTML = "当前节点的公钥：" + publicKey;

    //获得本地视频列表并显示在表格和下拉列表中
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://47.96.172.216:8080/node/get_video_list?userHash=" + publicKey, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var jsonReturn = JSON.parse(xhr.responseText);
            if(jsonReturn.code == 200){
                for (var i in jsonReturn.info){

                    //根据接收到的信息数量创建表格里的行
                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);

                    //获取表格需展示的每一列数据
                    var videoId = jsonReturn.info[i].id;
                    var videoName = jsonReturn.info[i].videoName;
                    var videoSize = jsonReturn.info[i].videoSize;
                    var videoHash = jsonReturn.info[i].hash;
                    var videoPrice = jsonReturn.info[i].videoPrice;
                    var videoCreationTime = jsonReturn.info[i].createTime;
                    var videoAccessTime = jsonReturn.info[i].interviewTime;
                    var videoModificationTime = jsonReturn.info[i].updateTime;
                    var signature = jsonReturn.info[i].adminSign;
                    var signatureTime = jsonReturn.info[i].signTime;

                    //将所有列数据存进数组里
                    var datas = [videoId, videoName, videoSize, videoHash, videoPrice, videoCreationTime, videoAccessTime, videoModificationTime, signature, signatureTime];

                    for (var i in datas){
                        //根据接收到的列数据数量创建表格每一行里的列
                        var td = document.createElement("td");
                        tr.appendChild(td);
                        td.innerHTML = datas[i];
                    }

                    //将视频id和name放进下拉框中
                    var option = document.createElement("option");
                    option.innerHTML = videoId + "-" + videoName;
                    chooseNode.appendChild(option);
                }

                //将所有视频信息放入二维数组中
                for (var i=1; i<tradeRecordsTable.rows.length; i++){
                    for (var j=0; j<tradeRecordsTable.rows[i].cells.length; j++){
                        if(!data[i-1]){
                            data[i-1] = new Array();
                        }
                        data[i-1][j] = tradeRecordsTable.rows[i].cells[j].innerHTML;
                    }
                }
                // console.log(data);
            }
        }
    }

    //选择单个视频资源
    var chooseVideo = document.getElementById("chooseVideo");
    chooseVideo.onclick = function () {
        //根据被选中的下拉框选项显示表中的视频资源
        var index = chooseNode.selectedIndex; //获取选中的下拉框选项索引

        //获取视频id
        var chooseVideoIdPlace = chooseNode.options[index].innerHTML.indexOf("-");
        var chooseVideoId = chooseNode.options[index].innerHTML.substring(0, chooseVideoIdPlace);

        //获取表格中的视频id
        for (var i=0; i<data.length; i++){
            if (chooseVideoId == data[i][0]){
                //清空表格的内容
                tbody.innerHTML = "";

                //将选中的行的内容打印出来
                var tr = document.createElement("tr");
                tbody.appendChild(tr);
                for(var j in data[i]){
                    var td = document.createElement("td");
                    td.innerHTML = data[i][j];
                    tr.appendChild(td);
                }
            }
        }
    }

    //选择全部视频资源
    var chooseAllVideo = document.getElementById("chooseAllVideo");
    chooseAllVideo.onclick = function () {
        tbody.innerHTML = "";
        for (var i in data){
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (var j in data[i]){
                var td = document.createElement("td");
                td.innerHTML = data[i][j];
                tr.appendChild(td);
            }
        }
    }

    //修改视频价格
    var updatePrice = document.getElementById("updatePrice");
    updatePrice.onclick = function () {
        //获取选中的下拉框选项索引
        var index = chooseNode.selectedIndex;
        //获取视频id
        var chooseVideoIdPlace = chooseNode.options[index].innerHTML.indexOf("-");
        var chooseVideoId = chooseNode.options[index].innerHTML.substring(0, chooseVideoIdPlace);
        //获取修改视频的价格
        var price = document.getElementById("price").value;
        var postText = {
            "id":chooseVideoId,
            "videoPrice":price,
            "nodePublicKey":publicKey
        };

        //请求修改视频价格接口
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://47.96.172.216:8080/node/update_video_price", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(postText));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonResult = JSON.parse(xhr.responseText);
                if(jsonResult.code == 200){
                    //刷新页面
                    location.href = "main.html";
                    alert("修改成功！");
                }else {
                    alert("修改失败！原因是：" + jsonResult.message);
                }
            }
        }
    }

    //修改视频可交易状态
    var tradable;
    var updateTradable = document.getElementById("updateTradable");
    updateTradable.onclick = function () {
        //获取选中的下拉框选项索引
        var index = chooseNode.selectedIndex;
        //获取视频id
        var chooseVideoIdPlace = chooseNode.options[index].innerHTML.indexOf("-");
        var chooseVideoId = chooseNode.options[index].innerHTML.substring(0, chooseVideoIdPlace);

        //获取可交易状态
        var index1 = tradeSituation.selectedIndex;
        var tradableValue = tradeSituation.options[index1].value;
        if(tradableValue == 1){
            tradable = true;
        }else {
            tradable = false;
        }

        var postText = {
            "id":chooseVideoId,
            "tradable":tradable,
            "nodePublicKey":publicKey
        };

        //请求更新视频的可交易状态接口
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://47.96.172.216:8080/node/update_video_state", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(postText));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonResult = JSON.parse(xhr.responseText);
                if(jsonResult.code == 200){
                    location.href = "main.html";
                    alert("修改成功！返回message：" + jsonResult.message);
                }else {
                    alert("修改失败！原因是：" + jsonResult.message);
                }
            }
        }
    }
}