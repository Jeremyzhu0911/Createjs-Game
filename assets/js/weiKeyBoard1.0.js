//自定义键盘（模拟微信支付）
//原：王伟      现：修改版
//版本：1.0

(function ($) {
    var __FILE__ = $("script")[$("script").length - 1].src;//获取当前文件路径
    ///
    //$ele:使用键盘的控件
    //isRandom:是否生成随机键盘。默认false
    //maxLength：值的长度
    window.weiKeyBoard = function ($ele, isRandom, maxLength, $showVal) {

        this.$ele = $ele;
        this.trueValue = "";
        this.maxLength = maxLength;
        this.isRandom = isRandom ? isRandom : false;
        this.$showVal = $showVal ? $showVal: $(".moneys");
    }
    var numMap = {};
    weiKeyBoard.prototype.createKeyBoard = function () {
        var me = this;
        var $ele = me.$ele;
        var maxLength = me.maxLength;
        var isRandom = me.isRandom;
        var $showVal = me.$showVal ? $showVal: $(".moneys");

        var lastIndex = __FILE__.lastIndexOf("/");
        var rootPath = __FILE__.substring(0, lastIndex + 1);
        var imgURL = './assets/images/weiKeyBoard/';
        numMap = {};
        if ($("#weiKeyBoard").length != 0) {
            $("#weiKeyBoard").remove();
        }
        if (isRandom) {
            $("body").append(' <table id="weiKeyBoard"><tr><td colspan="3" id="firstTd" style="background-image: url(' + imgURL + 'v.png);background-size:30px; height:30px;background-repeat:no-repeat;background-position:center">&nbsp;</td></tr><tr ><td colspan="2" class="moneys">¥ '+me.trueValue+'</td><td colspan="1" class="btnMoney">完成</td></tr><tr><td class="weiKeyNum">' + random() + '</td><td class="weiKeyNum">' + random() + '</td><td class="weiKeyNum">' + random() + '</td></tr><tr><td class="weiKeyNum">' + random() + '</td><td class="weiKeyNum">' + random() + '</td><td class="weiKeyNum">' + random() + '</td></tr><tr><td class="weiKeyNum">' + random() + '</td><td class="weiKeyNum">' + random() + '</td><td class="weiKeyNum">' + random() + '</td></tr><tr><td style="background-color:#dfdfdf;text-align:center"  class="weiKeyNum">.</td><td class="weiKeyNum">' + random() + '</td><td style="background-color: #dfdfdf; background-image: url(' + imgURL + 'back.png);background-repeat:no-repeat;background-position:center;background-size:45px;" value="back" class="weiKeyNum"></td></tr></table>');
        } else {
            $("body").append(' <table id="weiKeyBoard"><tr><td colspan="3" id="firstTd" style="background-image: url(' + imgURL + 'v.png);background-size:30px; height:30px;background-repeat:no-repeat;background-position:center">&nbsp;</td></tr><tr ><td colspan="2" class="moneys">¥ '+me.trueValue+'</td><td colspan="1" class="btnMoney">完成</td></tr><tr><td class="weiKeyNum">1</td><td class="weiKeyNum">2</td><td class="weiKeyNum">3</td></tr><tr><td class="weiKeyNum">4</td><td class="weiKeyNum">5</td><td class="weiKeyNum">6</td></tr><tr><td class="weiKeyNum">7</td><td class="weiKeyNum">8</td><td class="weiKeyNum">9</td></tr><tr><td style="background-color:#dfdfdf;text-align:center"  class="weiKeyNum">.</td><td class="weiKeyNum">0</td><td style="background-color: #dfdfdf; background-image: url(' + imgURL + 'back.png);background-repeat:no-repeat;background-position:center;background-size:45px;" value="back" class="weiKeyNum"></td></tr></table>');
        }
        

        $("#firstTd").click(function () {
            $("#weiKeyBoard").hide();
        });
        $(".weiKeyNum").bind("touchstart", function () {
            $(this).css("background-color", "#808080");
            if (me.onKeyPress) {
                me.onKeyPress($(this).text(), Math.floor(Math.random() * 10));
                return;
            }
            if ($(this).text()) {
                if ($(".moneys").text().length != maxLength) {
                    me.trueValue = me.trueValue + $(this).text();
                    $(".moneys").text('¥ '+me.trueValue)
                }
            } else {
                var value = $(this).attr("value");
                if (value == "back" && $(".moneys").text().length > 2) {
                    var moneysText = $(".moneys").text();
                    $(".moneys").text(moneysText.substring(0, moneysText.length - 1));
                    me.trueValue = me.trueValue.substring(0, me.trueValue.length - 1);
                }
            }

        });
        $(".weiKeyNum").bind("touchend", function () {
            if ($(this).text()) {
                $(this).css("background-color", "#ffffff");
            } else {
                $(this).css("background-color", " #dfdfdf");
            }
        });
        $(".btnMoney").bind("touchstart", function(){
            $.ajax({
                type: 'POST',
                url: '/qq20/api/public/index.php?s=index/index/createOrder',
                dataType: 'json',
                data: {
                    nick: foowwLocalStorage.get("nick"),
                    openid: foowwLocalStorage.get("openid"),
                    money: me.trueValue
                },
                async: false,
                timeout: 300,
                success: function (res) {
                    // if (res.money != undefined || res.money != '' || res.money != null)
                    //     moneys = res.money
                    location.href = "https://ssl.gongyi.qq.com/m/weixin/gopaylts.html?pid=215883&money=" + me.trueValue +
                        "&bid=100000362&sign=b25005f4febb9da0a1d6a36c4d84da40&ref_url=/index.html&btr=" + res.order_no;
                },
                error: function (xhr, type) {
                    location.href = "https://ssl.gongyi.qq.com/m/weixin/gopaylts.html?pid=215883&money=" + me.trueValue +
                        "&bid=100000362&sign=b25005f4febb9da0a1d6a36c4d84da40&ref_url=/index.html";
                }
            });
        })
    }

    weiKeyBoard.prototype.getRealValue = function () {
        return this.trueValue;
    }

    //按键点击事件
    //参数1：realValue:真是值
    //参数2：rendomValue:随机值，即假值
    weiKeyBoard.prototype.onKeyPress = undefined;

    function random() {
        var result = null;
        var nowNum = Math.floor(Math.random() * 10);
        if (numMap[nowNum.toString()]) {
            result = random();
        } else {
            result = nowNum;
        }
        numMap[nowNum.toString()] = true;
        return result;
    }



})(jQuery);