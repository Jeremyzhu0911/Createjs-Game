(function () {
    var spid_wx = "SZ00000012";
    var callback_url = "https://" + location.host + "/qq20/";
    var base_wx_url = "//" + location.host + "/cgi-bin/wx_privilege";
    var weixin_code_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxce5edeb4e8056804&redirect_uri=" + encodeURIComponent(callback_url) + "&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect";
    if (foowwLocalStorage.get("nick") == null || foowwLocalStorage.get("nick") == '') {
        if (getQueryVariable("code") == '') {
            window.location.replace(weixin_code_url);
        } else {
            $.ajax({
                type: 'GET',
                url: base_wx_url,
                dataType: 'json',
                data: {
                    code: getQueryVariable("code"),
                    spid: spid_wx,
                    cmd: 'user',
                    code_t: 'info',
                },
                async: false,
                timeout: 300,
                success: function (data) {
                    nickname = data.nick;
                    if (!nickname) {
                        window.location.replace(weixin_code_url);
                        return;
                    }
                    foowwLocalStorage.set("nick", decodeURIComponent(nickname), new Date().getTime() + 1 * 3600 * 1000);
                },
                error: function (xhr, type) {
                    window.location.replace(weixin_code_url);
                    console.log('jssdk error!')
                }
            });
        }
    }
})()