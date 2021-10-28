window.onload = function () {

    //设置Cookie中存储的用户名及其保存天数
    function setCookie(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
    }

    var xhr;
    if (window.XMLHttpRequest) {
        xhr=new XMLHttpRequest();
    }
    else {
        xhr=new ActiveXObject("Microsoft.XMLHttp");
    }
    //登录
    var loginPost = document.getElementById("login_btn");
    loginPost.onclick = function () {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var postText = {
            "username":username,
            "password":password
        }

        xhr.open("POST", "http://47.96.172.216:8080/node/user_login", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(postText));

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonResult = JSON.parse(xhr.responseText);
                if(jsonResult.code == 200){
                    //利用cookie存储该主机（节点）的公钥
                    setCookie("publicKey", jsonResult.info.publicKey, 30)
                    location.href = "main.html";
                    alert("登录成功！");
                }else {
                    alert("登录失败！失败原因为：" + jsonResult.message);
                }
            }
        }

        //利用cookie存储用户名
        setCookie("username", username, 30);
    }


}