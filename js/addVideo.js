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
    username.innerHTML = "你好！" + user;

    // console.log(user);
    
    //上传视频文件
    // var videoFile = document.querySelector('#video');
    // videoFile.onchange = function () {
    //     var videoFileReader = new FileReader();
    //     var videoFileType = this.files[0].type;
    //     videoFileReader.onload = function () {
    //         console.log(this.result);
    //     }
    //     console.log(this.files[0]);
    //     videoFileReader.readAsDataURL(this.files[0]);
    //
    // }
    // console.dir(videoFile);

    var videoFile = document.getElementById("video");
    var fileUploadBtn = document.getElementById("fileUploadBtn");

    videoFile.onchange = function () {
        var videoFileInput = this.files[0];
        console.log(videoFileInput);

        var formData = new FormData();
        formData.append('video', videoFileInput);
        console.log(formData);

        fileUploadBtn.onclick = function () {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://47.96.172.216:8080/node/add_video", true);
            // xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var jsonResult = JSON.parse(xhr.responseText);
                    if(jsonResult.code == 200){
                        alert("上传视频成功！视频的hash码为：" + jsonResult.info);
                        location.href = "addVideo.html";
                    }else {
                        alert("上传失败！原因是：" + jsonResult.message);
                    }
                }
            }
        }
    }
}