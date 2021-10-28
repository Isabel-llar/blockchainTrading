window.onload = function () {

    //注册
    var registerPost = document.getElementById("register_btn");
    registerPost.onclick = function () {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var postText = {
            "username":username,
            "password":password
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://47.96.172.216:8080/node/user_register", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(postText));

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonResult = JSON.parse(xhr.responseText);
                if(jsonResult.code == 200){
                    location.href = "login.html";
                    alert("注册成功！");
                }else {
                    alert("注册失败！失败原因为：" + jsonResult.message);
                }
            }
        }
    }
}