window.onload = function () {
    //获取表格身体部分id
    var tbody = document.getElementById("tbody");
    var chooseOtherNode = document.getElementById("chooseOtherNode");
    var tradeVideo = document.getElementById("tradeVideo");

    //获取Cookie中存储的用户名
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    //将Cookie中存储的用户名和该主机节点的公钥显示在前端
    var username = document.getElementById("username");
    var user = getCookie("username"); //存储在Cookie中的用户名
    username.innerHTML = "你好！" + user;
    var publicKey = getCookie("publicKey"); //存储在Cookie中的主机公钥

    //将其他用户节点列表绑定在下拉列表中
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://47.96.172.216:8080/node/get_all_node", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var jsonReturn = JSON.parse(xhr.responseText);
            if(jsonReturn.code == 200){
                for (var i in jsonReturn.info){

                    var otherUsersHash = jsonReturn.info[i].hash;
                    var nodeName = jsonReturn.info[i].nodeName;

                    //将视频hash和nodeName放进下拉框中
                    var option = document.createElement("option");
                    option.innerHTML = nodeName;
                    option.value = otherUsersHash;
                    chooseOtherNode.appendChild(option);
                }
            }
        }
    }

    //请求其他节点视频列表接口
    var findVideoList = document.getElementById("findVideoList");
    findVideoList.onclick = function () {
        //获取选中的下拉框选项索引
        var index = chooseOtherNode.selectedIndex;
        var chooseNodeName = chooseOtherNode.options[index].innerHTML;
        var chooseNodeHash = chooseOtherNode.options[index].value;

        var postText = {
            "nodeName":chooseNodeName,
            "hash":chooseNodeHash
        }

        // console.log(postText);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://47.96.172.216:8080/node/get_other_video_list", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(postText));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonReturn = JSON.parse(xhr.responseText);
                if(jsonReturn.code == 200){
                    for (var i in jsonReturn.info) {

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

                        for (var i in datas) {
                            //根据接收到的列数据数量创建表格每一行里的列
                            var td = document.createElement("td");
                            tr.appendChild(td);
                            td.innerHTML = datas[i];
                        }

                        var tradeDiv = document.getElementById("tradeDiv");
                        tradeDiv.style.display = "block";

                        //将视频id和name放进下拉框中
                        var option = document.createElement("option");
                        option.innerHTML = videoId + "-" + videoName;
                        option.value = videoId;
                        tradeVideo.appendChild(option);
                    }
                }
            }
        }
    }

    //发起交易
    var tradeWithOther = document.getElementById("tradeWithOther");
    tradeWithOther.onclick = function () {
        //根据被选中的下拉框选项显示表中的视频资源
        var index = tradeVideo.selectedIndex; //获取选中的下拉框选项索引
        var videoId = tradeVideo.options[index].value;
        //获取选中的下拉框选项索引
        var index = chooseOtherNode.selectedIndex;
        var chooseNodeHash = chooseOtherNode.options[index].value;

        var postText = {
            "nodePublicKey":chooseNodeHash,
            "id":videoId,
            "selfPublicKey":publicKey
        };

        //获得本地视频列表并显示在表格和下拉列表中
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://47.96.172.216:8080/node/deal_video", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(postText));
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && xhr.status == 200){
                var jsonReturn = JSON.parse(xhr.responseText);
                if(jsonReturn.code == 200){
                    alert("交易成功！账户剩余coin为：" + jsonReturn.info);
                    location.href = "otherUsersHome.html";
                }else {
                    alert("交易失败！原因为：" + jsonReturn.message);
                }
            }
        }
    }

}