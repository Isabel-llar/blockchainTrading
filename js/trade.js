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

    console.log(publicKey);

    //请求获得用户Eth接口
    var balance = document.getElementById("balance");
    //获得本地视频列表并显示在表格和下拉列表中
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://47.96.172.216:8080/node/get_eth_balance?userHash=" + publicKey, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var jsonReturn = JSON.parse(xhr.responseText);
            if(jsonReturn.code == 200){
                balance.innerHTML = jsonReturn.info;
            }
        }
    }

    //查看交易记录
    var tradeRecords = document.getElementById("tradeRecords");
    tradeRecords.onclick = function () {
        location.href = "transactionRecords.html";
    }

}