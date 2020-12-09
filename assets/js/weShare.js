(function () {
    var spid_wx = "SZ00000012";
    var base_wx_url = "//" + location.host + "/cgi-bin/wx_privilege";
    $.ajax({
        type: 'GET',
        url: base_wx_url,
        dataType: 'json',
        data: {
            spid: spid_wx,
            cmd: 'page',
            url: location.href
        },
        timeout: 300,
        success: function (res) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appid, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.noncestr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: [
                    'updateAppMessageShareData',
                    'updateTimelineShareData',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            var shareDetail = {
                title: "菁菁等你来解救！",
                imgUrl: 'https://' + window.location.host + '/qq20/assets/images/logo.jpg',
                desc: "还给她一个美好的童年吧",
                href: 'https://' + window.location.host + '/qq20/'
            }
            wx.ready(function () {
                wx.updateAppMessageShareData({
                    title: shareDetail.title, // 分享标题
                    link: shareDetail.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareDetail.imgUrl, // 分享图标
                    desc: shareDetail.desc,
                    success: function (res) {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function (res) {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.updateTimelineShareData({
                    title: shareDetail.title, // 分享标题
                    link: shareDetail.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: shareDetail.imgUrl, // 分享图标
                    desc: shareDetail.desc,
                    success: function (res) {
                        // 用户确认分享后执行的回调函数
                        //alert("share success")
                    },
                    cancel: function (res) {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        }
    })
})()