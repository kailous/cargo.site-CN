// 点击按钮setup后弹出输入框请求设置变量home
document.getElementById('Setup').addEventListener('click', function() {
    var home = prompt("请输入你的主页地址", "");
    if (home != null) {
        localStorage.setItem("home", home);
    }
});
// 点击按钮edit后打开home/edit
document.getElementById('Edit').addEventListener('click', function() {
    var home = localStorage.getItem("home");
    if (home != null) {
        window.open(home+'edit', '_blank');
    }
});
// 点击按钮view后打开home
document.getElementById('View').addEventListener('click', function() {
    var home = localStorage.getItem("home");
    if (home != null) {
        window.open(home, '_blank');
    }
});
// 将home的值插入到 span#home
document.getElementById('home').innerText = localStorage.getItem("home");