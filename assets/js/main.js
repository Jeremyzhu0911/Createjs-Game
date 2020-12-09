document.body.addEventListener('touchmove', function (evt) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    evt.preventDefault()
}, {
    passive: false
})


var G = {
    GAEvent: function (_eventAction, _eventCategory, _eventLable) {
        gtag('event', _eventAction, {
            'event_category': _eventCategory,
            'event_label': _eventLable
        });
        // console.log("event_category:" + _eventCategory + "///event_label:" + _eventAction);
    },
}

/**
 *
 * 识别移动设备
 * 检测相应的设备。
 * */
var canvas = document.getElementById('Canvas');

var ua = navigator.userAgent;

var system = {
    win: false,
    mac: false,
    x11: false,
    //mobile
    iphone: false,
    ipad: false,
    ios: false,
    android: false,
    winMobile: false
};

var p = navigator.platform;
system.win = p.indexOf('Win') == 0;
system.mac = p.indexOf('Mac') == 0;
system.x11 = (p == 'x11') || (p.indexOf('Linux') == 0);

system.iphone = ua.indexOf('iPhone') > -1;
system.ipad = ua.indexOf('iPad') > -1;
system.android = ua.indexOf('Android') > -1;

var viewHeight, viewWidth, proportion;

function getViewPort() {
    viewHeight = window.innerHeight || document.documentElement.clientHeight;
    viewWidth = window.innerWidth || document.documentElement.clientWidth;
    document.body.style.width = viewWidth;
    proportion = (viewWidth / 750);
    canvas.width = viewWidth;
    canvas.height = viewHeight;

}

function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function init() {
    getViewPort();
    main();
}


$(window).resize(getViewPort);

//创建一个舞台，得到一个参考的画布
var stage = new createjs.Stage(canvas);
var gif_image = new Array();
var Gif, shape, share_icon, share_text;

//控制 ture 正常运行，false回调结果
var isvalid = getQueryVariable("transcode");
var username = "@" + foowwLocalStorage.get("nick");
var usernum = 0;
var money_index = 1;
var moneys = 5;
var keyBoard;

function main() {

    var manifest;
    var preload;

    //构建显示对象的容器
    var container = new createjs.Container();
    var loadingbox = new createjs.Shape(),
        loadingbg = new createjs.Shape(),
        loadingsp = new createjs.Shape();

    var page2background = new createjs.Bitmap("./assets/images/common/page2background.jpg");
    page2background.x = (canvas.width - 750 * proportion) / 2;
    page2background.y = (canvas.height - 1624 * proportion) / 2;
    page2background.scaleX = proportion;
    page2background.scaleY = proportion;

    //加载loading 
    loadingbox.graphics.beginFill('#73033d').rr((canvas.width - 460 * proportion) / 2, (canvas.height - 44 *
        proportion) / 2, 460 * proportion, 44 * proportion, 22 * proportion);
    loadingbg.graphics.beginFill('#000').rr((canvas.width - 450 * proportion) / 2, (canvas.height - 34 *
        proportion) / 2, 450 * proportion, 34 * proportion, 17 * proportion);

    // 跑动的书
    var loading_book = new createjs.Bitmap("./assets/images/page1/book.png");
    loading_book.x = (canvas.width - 440 * proportion) / 2;
    loading_book.y = (canvas.height - 64 * proportion) / 2;
    loading_book.scaleX = proportion;
    loading_book.scaleY = proportion;

    //手
    var loading_shou1 = new createjs.Bitmap("./assets/images/page1/shou1.png");
    loading_shou1.x = (canvas.width - 450 * proportion) / 2 + 450 * proportion - 59 * proportion;
    loading_shou1.y = (canvas.height - 60 * proportion) / 2;
    loading_shou1.scaleX = proportion;
    loading_shou1.scaleY = proportion;
    var loading_shou2 = new createjs.Bitmap("./assets/images/page1/shou2.png");
    loading_shou2.x = (canvas.width - 450 * proportion) / 2 + 450 * proportion - 59 * proportion;
    loading_shou2.y = (canvas.height - 60 * proportion) / 2;
    loading_shou2.scaleX = proportion;
    loading_shou2.scaleY = proportion;

    var progressText = new createjs.Text("", "40px Arial", "#fff");
    progressText.y = (canvas.height - progressText.getMeasuredHeight() * proportion) / 2 + 44 * proportion *
        1.5;

    var loading_title = new createjs.Bitmap("./assets/images/page1/title.png");
    loading_title.x = (canvas.width - 308 * proportion) / 2;
    loading_title.y = (canvas.height - 53 * proportion) / 2 - 44 * proportion * 1.5;
    loading_title.scaleX = proportion;
    loading_title.scaleY = proportion;

    //定义相关JSON格式文件列表
    function setupManifest() {
        manifest = [{
            src: "./assets/images/page1/title.png",
            id: "title"
        }, {
            src: "./assets/images/page1/book.png",
            id: "loading_book"
        }, {
            src: "./assets/images/page1/shou1.png",
            id: "shou1"
        }, {
            src: "./assets/images/page1/shou2.png",
            id: "shou2"
        }, {
            src: "./assets/music/GoWest.mp3",
            id: "GoWest"
        }];
        for (var i = 1; i < 10; i++) {
            manifest.push({
                src: "./assets/images/gifing/gif" + i + ".png",
                id: 'gifing' + i
            })
        };
        for (var i = 1; i < 5; i++) {
            manifest.push({
                src: "./assets/images/books/book" + i + ".png",
                id: 'book' + i
            })
        };
        manifest.push({
            src: "./assets/images/common/page2background.jpg",
            id: "page2background"
        }, {
            src: "./assets/images/page2/cooperation.png",
            id: "page2_cooperation"
        }, {
            src: "./assets/images/page2/title.png",
            id: "page2_title"
        }, {
            src: "./assets/images/page2/title2.png",
            id: "page2_title2"
        }, {
            src: "./assets/images/page2/volume.png",
            id: "page2_volume"
        }, {
            src: "./assets/images/common/desk.jpg",
            id: "page3_desk"
        }, {
            src: "./assets/images/common/black.png",
            id: "page3_black"
        }, {
            src: "./assets/images/common/lights.png",
            id: "page3_lights"
        }, {
            src: "./assets/images/common/desklamp.png",
            id: "page3_desklamp"
        }, {
            src: "./assets/images/common/toy.png",
            id: "page3_toy"
        }, {
            src: "./assets/images/common/logo.png",
            id: "page5_logo"
        }, {
            src: "./assets/music/Light_Switch.mp3",
            id: "Light_Switch"
        }, {
            src: "./assets/images/page3/arrow.png",
            id: "page3_arrow"
        }, {
            src: "./assets/images/page3/button0.png",
            id: "page3_button0"
        }, {
            src: "./assets/images/page3/button.png",
            id: "page3_button"
        }, {
            src: "./assets/images/page3/bingqiling.png",
            id: "page3_bingqiling"
        }, {
            src: "./assets/images/page3/cahan.png",
            id: "page3_cahan"
        }, {
            src: "./assets/images/page3/kiss.png",
            id: "page3_kiss"
        }, {
            src: "./assets/images/page3/qinqin.png",
            id: "page3_qinqin"
        }, {
            src: "./assets/images/page3/qunzi.png",
            id: "page3_qunzi"
        }, {
            src: "./assets/images/page3/nielian.png",
            id: "page3_nielian"
        }, {
            src: "./assets/images/page3/lightbulb0.png",
            id: "page3_lightbulb0"
        }, {
            src: "./assets/images/page3/lightbulb1.png",
            id: "page3_lightbulb1"
        }, {
            src: "./assets/images/page3/lightbulb2.png",
            id: "page3_lightbulb2"
        }, {
            src: "./assets/images/page3/warn1.png",
            id: "page3_warn1"
        }, {
            src: "./assets/images/page3/warn2.png",
            id: "page3_warn2"
        }, {
            src: "./assets/images/moneyBtn-s28d7d2c7f7.png",
            id: "rescue_moneyBtn"
        }, {
            src: "./assets/images/button.png",
            id: "rescue_button"
        }, {
            src: "./assets/images/page5/helptext.png",
            id: "page5_helptext"
        }, {
            src: "./assets/music/diary.mp3",
            id: "diary"
        });
        for (var i = 1; i <= 11; i++)
            manifest.push({
                src: "./assets/images/book/cut" + i + ".png",
                id: 'cut' + i
            });
        for (var i = 11; i < 217; i++)
            manifest.push({
                src: "./assets/images/book_conter/conter" + i + ".png",
                id: 'book_conter' + (i - 11)
            });
        for (var i = 0; i <= 7; i++)
            manifest.push({
                src: "./assets/images/rescue/H5-copy" + i + ".jpg",
                id: 'rescue' + i
            });
    }

    //开始预加载
    function startPreload() {
        preload = new createjs.LoadQueue(true);
        //注意加载音频文件需要调用如下代码行
        preload.installPlugin(createjs.Sound);
        preload.on("fileload", handleFileLoad);
        preload.on("progress", handleFileProgress);
        preload.on("complete", loadComplete);
        preload.on("error", loadError);
        preload.loadManifest(manifest);

    }

    //处理单个文件加载
    function handleFileLoad(event) {
        var mymusic;
        if (event.item.id == "GoWest") {
            if (is_weixn()) {
                if (typeof window.WeixinJSBridge ==
                    "object" &&
                    typeof window.WeixinJSBridge
                        .invoke ==
                    "function"
                ) {
                    window.
                        WeixinJSBridge
                        .invoke(
                            'getNetworkType', {}, () => {
                                mymusic = createjs.Sound.play("GoWest");
                                mymusic.loop = -1;
                            })
                }
            } else {
                mymusic = createjs.Sound.play("GoWest");
                mymusic.loop = -1;
            }
        }
        if (event.item.id == "gifing9") {
            for (var i = 1; i < 10; i++) {
                gif_image[i - 1] = preload.getResult("gifing" + i);
            }
            mask_gif(gif_image)
            container.addChild(Gif);
        }
    }

    //处理加载错误：大家可以修改成错误的文件地址，可在控制台看到此方法调用
    function loadError(evt) {
        console.log("加载出错！", evt.text);
    }

    //已加载完毕进度
    function handleFileProgress(event) {
        progressText.text = (preload.progress * 100 | 0) + " %";
        progressText.x = canvas.width / 2 - progressText.getMeasuredWidth() / 2;
        // console.log(ratio*canvas.width / 100 * (preload.progress * 100 | 0));
        if ((preload.progress * 100 | 0) > 10) {
            loadingsp.graphics.beginFill('#8d0657').rr((canvas.width - 450 * proportion) / 2, (canvas.height -
                34 * proportion) / 2, 450 * proportion / 100 * (preload.progress * 100 | 0), 34 *
            proportion, 17 * proportion);
        } else {
            loadingsp.graphics.beginFill('#8d0657').rr((canvas.width - 450 * proportion) / 2, (canvas.height -
                34 * proportion) / 2, 450 * proportion / 100 * 10, 34 * proportion, 17 * proportion);
        }
        if ((preload.progress * 100 | 0) > 10 && (preload.progress * 100 | 0) < 85) {
            loading_book.x = (canvas.width - 440 * proportion) / 2 + 450 * proportion / 100 * (preload
                .progress * 100 | 0) - proportion * 102 / 2;
        }
        container.addChild(loadingbox, loadingbg, loadingsp, progressText, loading_shou1, loading_book,
            loading_shou2, loading_title);
        stage.addChild(container);
    }

    //全度资源加载完毕
    function loadComplete(event) {
        console.log("已加载完毕全部资源");
        Animate_Conter_page2();
        container.removeAllChildren();
        stage.update();
    }

    if (isvalid != '') {
        Animate_Conter_out_share();
    } else {
        setupManifest();
        startPreload();
    }


    function Animate_Conter_page2() {
        //给canvas 3 填充背景
        stage.addChild(page2background);
        stage.update();

        //给canvas 1添加内容
        //创建一个集合
        var container = new createjs.Container();

        var books_shadow = new createjs.Bitmap(preload.getResult("book1"));
        books_shadow.x = (canvas.width - 603 * proportion) / 2;
        books_shadow.y = (canvas.height - 317 * proportion) / 2;
        books_shadow.scaleX = proportion;
        books_shadow.scaleY = proportion;
        books_shadow.alpha = 0;

        createjs.Tween.get(books_shadow)
            .wait(2000)
            .to({
                alpha: 1
            }, 1000)

        //被风吹的书本
        var books_image = new Array();
        for (var i = 1; i < 5; i++) {
            books_image[i - 1] = preload.getResult("book" + i);
        }

        var books = new createjs.SpriteSheet({
            "images": books_image,
            "frames": {
                width: 603,
                height: 317,
                spacing: 0,
                count: 4
            },
            "animations": {
                walk: {
                    frames: [0, 1, 2, 2, 1, 0, 0, 1, 2, 3, 3, 2, 1, 0]
                },
                shoot: {
                    frames: [0, 4, 5, 6],
                    next: "walk",
                    speed: 0.5
                }
            },
            "framerate": 7
        });
        var book = new createjs.Sprite(books, "walk");
        book.scaleX = proportion;
        book.scaleY = proportion;
        book.x = (canvas.width - books._frameWidth * proportion) / 2;
        book.y = (canvas.height - books._frameHeight * proportion) / 2;
        book.framerate = 5;
        book.alpha = 0;
        createjs.Tween.get(book)
            .wait(2000)
            .to({
                alpha: 1
            }, 1000).call(handle);

        var i = 5,
            j = 5,
            f = true;

        function handle() {
            createjs.Ticker.addEventListener("tick", handleComplete);
        }

        function handleComplete() {

            if (i == 30) {
                f = false
            }
            if (i >= 5 && f) {
                i += 1;
                if (j < 30)
                    j += 1;
            } else {
                i--;
                if (i == 5)
                    f = true
            }
            //发光
            books_shadow.shadow = new createjs.Shadow("rgb(49 107 125 / 0.9)", i * proportion, (0 - i / 2) *
                proportion, i * 2 *
            proportion);
            //阴影
            book.shadow = new createjs.Shadow("rgb(0 0 0 / 0.4)", 0 * proportion, j * proportion, 30 / 2 *
                proportion);

        }

        //提示内容
        var page2_title2 = new createjs.Bitmap(preload.getResult("page2_title2"));
        page2_title2.x = (canvas.width - 344 * proportion) / 2;
        page2_title2.y = (canvas.height - 53 * proportion) / 2 - books._frameHeight * proportion + 53 *
            proportion;
        page2_title2.scaleX = proportion;
        page2_title2.scaleY = proportion;
        page2_title2.alpha = 0;
        createjs.Tween.get(page2_title2)
            .wait(1200)
            .to({
                alpha: 1
            }, 1000);

        //标题
        var page2_title = new createjs.Bitmap(preload.getResult("page2_title"));
        page2_title.x = (canvas.width - 576 * proportion) / 2;
        page2_title.y = (canvas.height - 134 * proportion) / 2 - books._frameHeight * proportion - 53 *
            proportion;
        page2_title.scaleX = proportion;
        page2_title.scaleY = proportion;
        page2_title.alpha = 0;
        createjs.Tween.get(page2_title)
            .wait(500)
            .to({
                alpha: 1
            }, 1000);

        //声音提醒
        var page2_volume = new createjs.Bitmap(preload.getResult("page2_volume"));
        page2_volume.x = (canvas.width - 412 * proportion) / 2;
        page2_volume.y = (canvas.height - 59 * proportion) / 2 + books._frameHeight * proportion - 59 *
            proportion;
        page2_volume.scaleX = proportion;
        page2_volume.scaleY = proportion;
        page2_volume.alpha = 0;
        createjs.Tween.get(page2_volume)
            .wait(2500)
            .to({
                alpha: 1
            }, 1000);

        //声音提醒
        var page2_cooperation = new createjs.Bitmap(preload.getResult("page2_cooperation"));
        page2_cooperation.x = (canvas.width - 623 * proportion) / 2;
        page2_cooperation.y = (canvas.height - 143 * proportion) / 2 + books._frameHeight * proportion + 143 *
            proportion;
        page2_cooperation.scaleX = proportion;
        page2_cooperation.scaleY = proportion;
        page2_cooperation.alpha = 0;
        createjs.Tween.get(page2_cooperation)
            .wait(3000)
            .to({
                alpha: 1
            }, 1000);

        book.addEventListener("click", bookClick);

        function bookClick() {
            G.GAEvent('Click', 'Intro', 'Start');
            // 鼠标点击事件
            container.removeAllChildren();
            stage.removeChild(page2background);
            Animate_Conter_page3()
        }

        container.addChild(books_shadow, book, page2_title2, page2_title, page2_volume);
        container.addChild(page2_cooperation);
        stage.addChild(container);
    }

    function Animate_Conter_page3() {

        // black 遮照
        var Filter_black = new createjs.Bitmap(preload.getResult("page3_black"));
        Filter_black.x = 0;
        Filter_black.y = 0;
        Filter_black.scaleX = canvas.width / 750;
        Filter_black.scaleY = canvas.height / 1334;

        //给canvas 3 填充背景
        var bg_image = new createjs.Bitmap(preload.getResult("page3_desk"));
        bg_image.x = 0;
        bg_image.y = -20 * proportion;
        bg_image.scaleX = proportion * 0.85;
        bg_image.scaleY = proportion * 0.85;
        bg_image.alpha = 0;
        createjs.Tween.get(bg_image).to({
            alpha: 1
        }, 1000).call(function () {
            createjs.Tween.get(bg_image)
                .to({
                    x: (canvas.width - 1079 * proportion * 0.85) / 2,
                }, 1500).call(bg_image_big);
        })

        function bg_image_big() {
            createjs.Tween.get(bg_image)
                .wait(500)
                .to({
                    x: (canvas.width - 1079 * proportion * 0.9) / 2,
                    scaleX: proportion * 0.9,
                    scaleY: proportion * 0.9
                }, 1500);
        }

        //台灯
        var desklamp = new createjs.Bitmap(preload.getResult("page3_desklamp"));
        desklamp.x = 630 * proportion * 0.85;
        desklamp.y = 180 * proportion * 0.75;
        desklamp.scaleX = proportion * 0.75;
        desklamp.scaleY = proportion * 0.75;
        desklamp.alpha = 0;
        desklamp.shadow = new createjs.Shadow("rgb(27 69 82 / 0.8)", proportion * 10, proportion * 20,
            proportion *
            10);
        createjs.Tween.get(desklamp).to({
            alpha: 1
        }, 1000).call(function () {
            createjs.Tween.get(desklamp)
                .to({
                    x: 630 * proportion * 0.85 + (canvas.width - 1079 * proportion * 0.85) / 2,
                }, 1500).call(desklamp_big);
        })

        function desklamp_big() {
            createjs.Tween.get(desklamp)
                .wait(500)
                .to({
                    y: 150 * proportion * 0.9,
                    scaleX: proportion * 0.9,
                    scaleY: proportion * 0.9
                }, 1500);
        }

        //灯光
        var lights = new createjs.Bitmap(preload.getResult("page3_lights"));
        lights.alpha = 0;
        lights.x = (canvas.width - 750 * proportion * 2.38) / 2;
        lights.y = 50 * proportion;
        lights.scaleX = proportion * 2.14;
        lights.scaleY = proportion * 2.14;

        // 玩具
        var toy = new createjs.Bitmap(preload.getResult("page3_toy"));
        toy.x = 0;
        toy.y = 180 * proportion * 0.75;
        toy.scaleX = proportion * 0.75;
        toy.scaleY = proportion * 0.75;
        toy.alpha = 0;
        createjs.Tween.get(toy).to({
            alpha: 1
        }, 1000).call(function () {
            createjs.Tween.get(toy)
                .to({
                    x: (canvas.width - 1079 * proportion * 0.85) / 2,
                }, 1500).call(toy_big);
        })

        function toy_big() {
            createjs.Tween.get(toy)
                .wait(500)
                .to({
                    x: -306 * proportion * 0.9 / 2,
                    y: 150 * proportion * 0.9,
                    scaleX: proportion * 0.9,
                    scaleY: proportion * 0.9
                }, 1500);
        }

        //被翻开的书本
        var book_image = new Array();
        for (var i = 1; i < 12; i++) {
            book_image[i - 1] = preload.getResult("cut" + i);
        }
        var books = new createjs.SpriteSheet({
            "images": book_image,
            "frames": {
                width: 1400,
                height: 1296,
                spacing: 0
            },
            "animations": {
                run: [0, 10, 'end'],
                start: [0],
                end: [10]
            },
            "framerate": 10
        });
        var book = new createjs.Sprite(books, "start");
        book.scaleX = proportion * 0.5;
        book.scaleY = proportion * 0.5;
        book.skewX = -6;
        book.skewY = -6;
        book.alpha = 0;
        book.x = (canvas.width - 1400 * proportion * 0.5) / 2 + (canvas.width - 1079 * proportion * 0.85) / 2;
        book.y = proportion * 300;

        book.shadow = new createjs.Shadow("rgb(27 69 82 / 0.8)", proportion * 30, proportion * 60, proportion *
            15);
        createjs.Tween.get(book).to({
            alpha: 1
        }, 1000).call(function () {
            createjs.Tween.get(book)
                .to({
                    x: (canvas.width - 1400 * proportion * 0.5) / 2 + (canvas.width - 1079 *
                        proportion * 0.85),
                    y: proportion * 300
                }, 1500).call(book_big);
        })

        function book_big() {
            createjs.Tween.get(book)
                .wait(500)
                .to({
                    x: (canvas.width - 1400 * proportion * 0.6) / 2 + (canvas.width - 1079 * proportion *
                        0.9) /
                        1.5,
                    y: proportion * 300,
                    scaleX: proportion * 0.6,
                    scaleY: proportion * 0.6,
                    skewX: 0,
                    skewY: 0
                }, 1500).call(arrow_show);
        }
        container.addChild(bg_image, book, toy, desklamp, Filter_black);
        stage.update()

        // 书本提示打开
        var arrow = new createjs.Bitmap(preload.getResult("page3_arrow"));
        arrow.alpha = 0;
        arrow.x = (canvas.width - 214 * proportion) / 2 + 214 * proportion / 2;
        arrow.y = proportion * 750;
        arrow.scaleX = proportion;
        arrow.scaleY = proportion;

        //提示
        var tips_text = new createjs.Text("当你察觉事情不对，请立刻按下", "36px Arial", "#fff");
        tips_text.x = (canvas.width - tips_text.getMeasuredWidth()) / 2;
        tips_text.y = 1000 * proportion;
        tips_text.alpha = 0;

        //提示图片
        var tips_img = new createjs.Bitmap(preload.getResult("page3_button0"));
        tips_img.alpha = 0;
        tips_img.x = (canvas.width - 276 * proportion) / 2;
        tips_img.y = 1070 * proportion;
        tips_img.scaleX = proportion;
        tips_img.scaleY = proportion;

        // 紧急救助button
        var help_btn = new createjs.Bitmap(preload.getResult("page3_button"));
        help_btn.alpha = 0;
        help_btn.x = (canvas.width - 302 * proportion) / 2;
        help_btn.y = 1080 * proportion;
        help_btn.scaleX = proportion;
        help_btn.scaleY = proportion;

        function arrow_show() {
            arrow.addEventListener("click", arrowClick);
            book.addEventListener("click", arrowClick);
            createjs.Tween.get(arrow, {
                loop: true
            })
                .to({
                    alpha: 1
                }, 800)
            createjs.Tween.get(tips_text)
                .wait(500)
                .to({
                    alpha: 1
                }, 800)
            createjs.Tween.get(tips_img)
                .wait(1000)
                .to({
                    alpha: 1
                }, 800)
        }

        // 书本内容
        var book_conter_image = new Array();
        for (var i = 0; i < 206; i++) {
            book_conter_image[i] = preload.getResult("book_conter" + i);
        }
        var book_img = new createjs.SpriteSheet({
            "images": book_conter_image,
            "frames": {
                width: 392,
                height: 614,
                spacing: 0
            },
            "animations": {
                p1: [0, 13, 'p1_stop'],
                p1_stop: [13],
                p2: [14, 20, 'p2_stop'],
                p2_stop: [20],
                p3: [21, 33, 'p3_stop'],
                p3_stop: [33], //冰淇淋
                p4: [34, 48, 'p4_stop'],
                p4_stop: [48], //擦汗
                p5: [49, 50, 'p5_stop'],
                p5_stop: [50],
                p6: [51, 58, 'p6_stop'],
                p6_stop: [58],
                p7: [59, 69, 'p7_stop'],
                p7_stop: [69],
                p8: [70, 74, 'p8_stop'],
                p8_stop: [74],
                p9: [75, 81, 'p9_stop'],
                p9_stop: [81], //kiss
                p10: [82, 91, 'p10_stop'],
                p10_stop: [91],
                p11: [92, 103, 'p11_stop'],
                p11_stop: [103],
                p12: [104, 110, 'p12_stop'],
                p12_stop: [110],
                p13: [111, 116, 'p13_stop'],
                p13_stop: [116], //qinqin
                p14: [117, 127, 'p14_stop'],
                p14_stop: [127],
                p15: [128, 132, 'p15_stop'],
                p15_stop: [132],
                p16: [133, 140, 'p16_stop'],
                p16_stop: [140],
                p17: [141, 149, 'p17_stop'],
                p17_stop: [149],
                p18: [150, 159, 'p18_stop'],
                p18_stop: [159],
                p19: [160, 164, 'p19_stop'],
                p19_stop: [164], //shenshou
                p20: [165, 166, 'p20_stop'],
                p20_stop: [166],
                p21: [167, 172, 'p21_stop'],
                p21_stop: [172],
                p22: [173, 175, 'p22_stop'],
                p22_stop: [175],
                p23: [176, 180, 'p23_stop'],
                p23_stop: [180],
                p24: [181, 190, 'p24_stop'],
                p24_stop: [190],
                p25: [191, 197, 'p25_stop'],
                p25_stop: [197],
                p26: [198, 205, 'p26_stop'],
                p26_stop: [205], //nielian
                start: [0],
                end: [205]
            },
            "framerate": 5
        });
        var book_conter = new createjs.Sprite(book_img, "start");
        book_conter.alpha = 0;
        book_conter.x = (canvas.width - 392 * proportion * 1.15) / 2 - 30 * proportion * 1.15;
        book_conter.y = 280 * proportion;
        book_conter.scaleX = proportion * 1.15;
        book_conter.scaleY = proportion * 1.15;

        // 书本内容图标
        var book_bingqiling = new createjs.Bitmap(preload.getResult("page3_bingqiling"));
        book_bingqiling.x = (canvas.width - 70 * proportion * 1.15) / 2 - 93 * proportion * 1.15;
        book_bingqiling.y = 354 * proportion * 1.15;
        book_bingqiling.scaleX = proportion * 1.15;
        book_bingqiling.scaleY = proportion * 1.15;
        book_bingqiling.alpha = 0;

        var book_cahan = new createjs.Bitmap(preload.getResult("page3_cahan"));
        book_cahan.x = (canvas.width - 21 * proportion * 1.15) / 2 - 100 * proportion * 1.15;
        book_cahan.y = 394 * proportion * 1.15;
        book_cahan.scaleX = proportion * 1.15;
        book_cahan.scaleY = proportion * 1.15;
        book_cahan.alpha = 0;

        var book_kiss = new createjs.Bitmap(preload.getResult("page3_kiss"));
        book_kiss.x = (canvas.width - 23 * proportion * 1.15) / 2 - 90 * proportion * 1.15;
        book_kiss.y = 512 * proportion * 1.15;
        book_kiss.scaleX = proportion * 1.15;
        book_kiss.scaleY = proportion * 1.15;
        book_kiss.alpha = 0;

        var book_qinqin = new createjs.Bitmap(preload.getResult("page3_qinqin"));
        book_qinqin.x = (canvas.width - 63 * proportion * 1.15) / 2 - 24 * proportion * 1.15;
        book_qinqin.y = 575 * proportion * 1.15;
        book_qinqin.scaleX = proportion * 1.15;
        book_qinqin.scaleY = proportion * 1.15;
        book_qinqin.alpha = 0;

        var book_qunzi = new createjs.Bitmap(preload.getResult("page3_qunzi"));
        book_qunzi.x = (canvas.width - 70 * proportion * 1.15) / 2 + 158 * proportion * 1.15;
        book_qunzi.y = 671 * proportion * 1.15;
        book_qunzi.scaleX = proportion * 1.15;
        book_qunzi.scaleY = proportion * 1.15;
        book_qunzi.alpha = 0;

        var book_nielian = new createjs.Bitmap(preload.getResult("page3_nielian"));
        book_nielian.x = (canvas.width - 59 * proportion * 1.15) / 2 + 118 * proportion * 1.15;
        book_nielian.y = 776 * proportion * 1.15;
        book_nielian.scaleX = proportion * 1.15;
        book_nielian.scaleY = proportion * 1.15;
        book_nielian.alpha = 0;

        var Sound_position = 0;
        var controller = 0;
        var myInstance, time, timeout;

        function arrowClick() {
            G.GAEvent('Click', 'Hint', 'Open');
            book.removeEventListener("click", arrowClick)
            container.removeChild(arrow, tips_text, tips_img);
            book.gotoAndPlay("run");
            //放大所有
            createjs.Tween.get(bg_image)
                .to({
                    x: (0 - 540.8) * proportion,
                    y: -150 * proportion,
                    scaleX: proportion * 1.2,
                    scaleY: proportion * 1.3
                }, 1400);
            createjs.Tween.get(toy)
                .to({
                    x: (0 - 612) * proportion / 2,
                    y: 0 * proportion,
                    scaleX: proportion,
                    scaleY: proportion
                }, 1400);
            createjs.Tween.get(desklamp)
                .to({
                    x: 500 * proportion,
                    y: 0 * proportion,
                    scaleX: proportion * 1.2,
                    scaleY: proportion * 1.2
                }, 1400);
            createjs.Tween.get(book)
                .to({
                    x: proportion * -700,
                    y: proportion * -20,
                    scaleX: proportion * 1.1,
                    scaleY: proportion * 1.1
                }, 1400).call(book_stop);

            createjs.Tween.get(help_btn)
                .wait(2300)
                .to({
                    alpha: 1
                }, 500);

            var GAhelp = 'Help_0';

            function book_stop() {
                // book.gotoAndStop("end");
                createjs.Sound.stop();
                myInstance = createjs.Sound.play("diary");
                container.addChild(book_conter, book_bingqiling, book_cahan, book_kiss,
                    book_qinqin, book_qunzi, book_nielian);
                time = setInterval(function () {
                    Sound_position = parseInt(myInstance.position);

                    //段落1
                    if (Sound_position > 0 && Sound_position < 150) {
                        createjs.Tween.get(book_conter)
                            .to({
                                alpha: 1
                            }, 500).call(function () {
                                book_conter.gotoAndPlay("p1");
                            });
                    }

                    if (Sound_position > 5500 && Sound_position < 5700) {
                        book_conter.gotoAndPlay("p2");
                    }

                    if (Sound_position > 8500 && Sound_position < 8700) {
                        book_conter.gotoAndPlay("p3");
                        createjs.Tween.get(book_bingqiling)
                            .wait(2600)
                            .to({
                                alpha: 1
                            }, 500)
                    }

                    if (Sound_position > 12000 && Sound_position < 12200) {
                        book_conter.gotoAndPlay("p4");
                        createjs.Tween.get(book_cahan)
                            .wait(3200)
                            .to({
                                alpha: 1
                            }, 500)
                    }

                    //段落2
                    if (Sound_position > 17300 && Sound_position < 17500) {
                        book_conter.gotoAndPlay("p5");
                    }
                    if (Sound_position > 18200 && Sound_position < 18400) {
                        book_conter.gotoAndPlay("p6");
                    }
                    if (Sound_position > 21500 && Sound_position < 21700) {
                        book_conter.gotoAndPlay("p7");
                    }
                    if (Sound_position > 25500 && Sound_position < 25700) {
                        book_conter.gotoAndPlay("p8");
                    }
                    if (Sound_position > 29000 && Sound_position < 29200) {
                        book_conter.gotoAndPlay("p9");
                        createjs.Tween.get(book_kiss)
                            .wait(1600)
                            .to({
                                alpha: 1
                            }, 500)
                    }
                    if (Sound_position > 31200 && Sound_position < 31400) {
                        book_conter.gotoAndPlay("p10");
                    }
                    if (Sound_position > 34200 && Sound_position < 34400) {
                        book_conter.gotoAndPlay("p11");
                    }
                    if (Sound_position > 39200 && Sound_position < 39400) {
                        book_conter.gotoAndPlay("p12");
                    }
                    if (Sound_position > 41700 && Sound_position < 41900) {
                        book_conter.gotoAndPlay("p13");
                        createjs.Tween.get(book_qinqin)
                            .wait(1300)
                            .to({
                                alpha: 1
                            }, 500)
                    }
                    if (Sound_position > 44000 && Sound_position < 44200) {
                        book_conter.gotoAndPlay("p14");
                    }

                    //段落3
                    if (Sound_position > 50000 && Sound_position < 50200) {
                        book_conter.gotoAndPlay("p15");
                    }
                    if (Sound_position > 51200 && Sound_position < 51400) {
                        book_conter.gotoAndPlay("p16");
                    }
                    if (Sound_position > 54000 && Sound_position < 54200) {
                        book_conter.gotoAndPlay("p17");
                    }
                    if (Sound_position > 57500 && Sound_position < 57700) {
                        book_conter.gotoAndPlay("p18");
                    }
                    if (Sound_position > 61200 && Sound_position < 61400) {
                        book_conter.gotoAndPlay("p19");
                        createjs.Tween.get(book_qunzi)
                            .wait(500)
                            .to({
                                alpha: 1
                            }, 500)
                    }
                    if (Sound_position > 62800 && Sound_position < 63000) {
                        book_conter.gotoAndPlay("p20");
                    }
                    if (Sound_position > 63300 && Sound_position < 63500) {
                        book_conter.gotoAndPlay("p21");
                    }
                    if (Sound_position > 66500 && Sound_position < 66700) {
                        book_conter.gotoAndPlay("p22");
                    }
                    if (Sound_position > 67800 && Sound_position < 68000) {
                        book_conter.gotoAndPlay("p23");
                    }
                    if (Sound_position > 69300 && Sound_position < 69500) {
                        book_conter.gotoAndPlay("p24");
                    }
                    if (Sound_position > 72900 && Sound_position < 73100) {
                        book_conter.gotoAndPlay("p25");
                    }
                    if (Sound_position > 74900 && Sound_position < 75100) {
                        book_conter.gotoAndPlay("p26");
                        createjs.Tween.get(book_nielian)
                            .wait(1500)
                            .to({
                                alpha: 1
                            }, 500)
                    }
                }, 100)

                myInstance.on("complete", function () {
                    clearInterval(time);
                    timeout = setTimeout(() => {
                        Sound_position = 99999;
                        help_btn_load();
                    }, 8000);
                })
            }

            help_btn.addEventListener("click", help_btn_load);

            function help_btn_load() {
                clearInterval(time);
                clearInterval(timeout);
                createjs.Sound.stop();
                var mymusic = createjs.Sound.play("GoWest");
                mymusic.loop = 20;

                book_conter.gotoAndStop("end");
                book_bingqiling.alpha = 1;
                book_cahan.alpha = 1;
                book_kiss.alpha = 1;
                book_qinqin.alpha = 1;
                book_qunzi.alpha = 1;
                book_nielian.alpha = 1;

                if (Sound_position < 17300) {
                    controller = 1;
                    GAhelp = 'Help_1';
                } else if (Sound_position < 50000) {
                    controller = 2;
                    GAhelp = 'Help_2';
                } else if (Sound_position <= 77907) {
                    controller = 3;
                    GAhelp = 'Help_3';
                }
                G.GAEvent('Click', 'Text', GAhelp);

                container.removeChild(desklamp);
                container.removeChild(help_btn);
                container.addChild(desklamp, lights)
                stage.update();

                //紧急救助

                var img = [preload.getResult("page3_lightbulb0"), preload.getResult("page3_lightbulb0"),
                preload.getResult("page3_lightbulb1"), preload.getResult("page3_lightbulb2")
                ]

                var lightbulb = new createjs.Bitmap(img[controller]);
                lightbulb.alpha = 0;
                lightbulb.x = (canvas.width - 342 * proportion) / 2;
                lightbulb.y = 300 * proportion;
                lightbulb.scaleX = proportion;
                lightbulb.scaleY = proportion;

                var num_text = ["您的无意识", "您的超高 警觉", "您的普通警觉", "您的警觉需提高"],
                    num_text2 = ["可能导致3亿儿童中", "成功解救3亿儿童中", "成功解救3亿儿童中", "只能解救3亿儿童中"],
                    num = [100000000, 30000000, 10000000, 3000000],
                    num2 = [10000000, 3000000, 1000000, 300000],
                    text_color = ['#FFFFFF', '#f40c28'];
                var text_num = 0,
                    text_num2 = 0;
                if (controller != 0) {
                    text_num = num[controller - 1];
                    text_num2 = num2[controller - 1];
                    text_color = ['#2d516e', '#032846'];

                    createjs.Sound.play("Light_Switch");

                    createjs.Tween.get(lights)
                        .wait(500)
                        .to({
                            alpha: 1
                        }, 500);

                    createjs.Tween.get(lightbulb)
                        .wait(1500)
                        .to({
                            alpha: 1
                        }, 500);
                } else {
                    //给canvas 3 填充背景
                    container.addChild(page2background);
                    container.addChild(Gif);

                    //警告图
                    var warn1 = new createjs.Bitmap(preload.getResult("page3_warn1"));
                    warn1.x = (canvas.width - 211 * proportion) / 2;
                    warn1.y = -124 * proportion;
                    warn1.scaleX = proportion;
                    warn1.scaleY = proportion;
                    createjs.Tween.get(warn1)
                        .to({
                            y: 150 * proportion + 124 * proportion / 3 + 124 * proportion / 5
                        }, 400).call(warn1_Animate);

                    function warn1_Animate() {
                        createjs.Tween.get(warn1)
                            .wait(100)
                            .to({
                                y: 150 * proportion + 124 * proportion / 3
                            }, 200);
                    }

                    var warn2 = new createjs.Bitmap(preload.getResult("page3_warn2"));
                    warn2.x = -376 * proportion;
                    warn2.y = 150 * proportion + 124 * proportion;
                    warn2.scaleX = proportion;
                    warn2.scaleY = proportion;
                    createjs.Tween.get(warn2)
                        .to({
                            x: (canvas.width - 376 * proportion) / 2 + 376 * proportion / 5
                        }, 400).call(warn2_Animate);

                    function warn2_Animate() {
                        createjs.Tween.get(warn2)
                            .wait(100)
                            .to({
                                x: (canvas.width - 376 * proportion) / 2
                            }, 200);
                    }

                    container.addChild(warn1, warn2);
                }

                var help_end = new createjs.Text("", "42px Arial", text_color[0]);
                help_end.text = num_text[controller];
                help_end.x = (canvas.width - help_end.getMeasuredWidth()) / 2;
                help_end.y = 500 * proportion;
                help_end.alpha = 0;
                createjs.Tween.get(help_end)
                    .wait(2000)
                    .to({
                        alpha: 1
                    }, 500);
                var help_ends = new createjs.Text("", "42px Arial", text_color[0]);
                help_ends.text = num_text2[controller];
                help_ends.x = (canvas.width - help_ends.getMeasuredWidth()) / 2;
                help_ends.y = 520 * proportion + help_end.getMeasuredHeight();
                help_ends.alpha = 0;
                createjs.Tween.get(help_ends)
                    .wait(2000)
                    .to({
                        alpha: 1
                    }, 500);

                var help_end_p1 = new createjs.Text("可能受性侵的孩子", "34px Arial", text_color[0]);
                help_end_p1.x = (canvas.width - help_end_p1.getMeasuredWidth()) / 2;
                help_end_p1.y = 620 * proportion + help_end.getMeasuredHeight() + help_ends.getMeasuredHeight();
                help_end_p1.alpha = 0;
                createjs.Tween.get(help_end_p1)
                    .wait(2500)
                    .to({
                        alpha: 1
                    }, 500);

                var help_end_p1_num = new createjs.Text("", "120px Arial", text_color[1]);
                help_end_p1_num.y = 650 * proportion + help_end.getMeasuredHeight() + help_ends
                    .getMeasuredHeight() + help_end_p1.getMeasuredHeight();
                help_end_p1_num.alpha = 0;
                createjs.Tween.get(help_end_p1_num)
                    .wait(3000)
                    .to({
                        alpha: 1
                    }, 500).call(help_end_p1_num_fu);

                function help_end_p1_num_fu() {
                    if (controller != 0) help_end_p1_num_fu_down()
                    else help_end_p1_num_fu_up()
                }

                function help_end_p1_num_fu_up() {
                    help_end_p1_num.text = fmoney(text_num, 0);
                    help_end_p1_num.x = (canvas.width - help_end_p1_num.getMeasuredWidth()) / 2;
                    if (text_num < num[controller + 1]) {
                        text_num += Math.floor(Math.random() * (num[controller + 1] - text_num) / 5 + 1);
                        createjs.Ticker.addEventListener("tick", help_end_p1_num_fu_up);
                    }
                }

                function help_end_p1_num_fu_down() {
                    help_end_p1_num.text = fmoney(text_num, 0);
                    help_end_p1_num.x = (canvas.width - help_end_p1_num.getMeasuredWidth()) / 2;
                    if (text_num > num[controller]) {
                        text_num -= Math.floor(Math.random() * (text_num - num[controller]) / 5 + 1);
                        createjs.Ticker.addEventListener("tick", help_end_p1_num_fu_down);
                    }
                }

                var help_end_p2 = new createjs.Text("可能受插入式性虐待的孩子", "34px Arial", text_color[0]);
                help_end_p2.x = (canvas.width - help_end_p2.getMeasuredWidth()) / 2;
                help_end_p2.y = 700 * proportion + help_end.getMeasuredHeight() + help_ends
                    .getMeasuredHeight() +
                    help_end_p1.getMeasuredHeight() + help_end_p1_num.getMeasuredHeight();
                help_end_p2.alpha = 0;
                createjs.Tween.get(help_end_p2)
                    .wait(3500)
                    .to({
                        alpha: 1
                    }, 500);

                var help_end_p2_num = new createjs.Text("", "120px Arial", text_color[1]);
                help_end_p2_num.x = (canvas.width - help_end_p2_num.getMeasuredWidth()) / 2;
                help_end_p2_num.y = 730 * proportion + help_end.getMeasuredHeight() + help_ends
                    .getMeasuredHeight() +
                    help_end_p1.getMeasuredHeight() + help_end_p1_num.getMeasuredHeight() + help_end_p2
                        .getMeasuredHeight();
                help_end_p2_num.alpha = 0;
                createjs.Tween.get(help_end_p2_num)
                    .wait(4000)
                    .to({
                        alpha: 1
                    }, 500).call(help_end_p2_num_fu);

                function help_end_p2_num_fu() {
                    if (controller != 0) help_end_p2_num_fu_down()
                    else help_end_p2_num_fu_up()
                }

                function help_end_p2_num_fu_up() {
                    help_end_p2_num.text = fmoney(text_num2, 0);
                    help_end_p2_num.x = (canvas.width - help_end_p2_num.getMeasuredWidth()) / 2;
                    if (text_num2 < num2[controller + 1]) {
                        text_num2 += Math.floor(Math.random() * (num2[controller + 1] - text_num2) / 5 + 1);
                        createjs.Ticker.addEventListener("tick", help_end_p2_num_fu_up);
                    }
                }

                function help_end_p2_num_fu_down() {
                    help_end_p2_num.text = fmoney(text_num2, 0);
                    help_end_p2_num.x = (canvas.width - help_end_p2_num.getMeasuredWidth()) / 2;
                    if (text_num2 > num2[controller]) {
                        text_num2 -= Math.floor(Math.random() * (text_num2 - num2[controller]) / 5 + 1);
                        createjs.Ticker.addEventListener("tick", help_end_p2_num_fu_down);
                    }
                }

                var help_end_p3 = new createjs.Text("及时察觉，才能及时解救 !", "40px Arial", text_color[0]);
                help_end_p3.x = (canvas.width - help_end_p3.getMeasuredWidth()) / 2;
                help_end_p3.y = 780 * proportion + help_end.getMeasuredHeight() + help_ends
                    .getMeasuredHeight() +
                    help_end_p1.getMeasuredHeight() + help_end_p1_num.getMeasuredHeight() + help_end_p2_num
                        .getMeasuredHeight();
                help_end_p3.alpha = 0;

                if (controller == 0)
                    createjs.Tween.get(help_end_p3)
                        .wait(4500)
                        .to({
                            alpha: 1
                        }, 500);

                createjs.Tween.get(help_end_p3)
                    .wait(4500)
                    .to({}, 8000).call(Animate_Conter_page4);

                container.addChild(lightbulb, help_end, help_ends, help_end_p1, help_end_p1_num, help_end_p2,
                    help_end_p2_num, help_end_p3);
                stage.update();
            }
        }

        container.addChild(arrow, tips_text, tips_img, help_btn);

        stage.addChild(container);
    }

    function Animate_Conter_page4() {
        container.removeAllChildren();

        var rescue_image = new Array();
        for (var i = 0; i < 8; i++) {
            rescue_image[i] = preload.getResult("rescue" + i);
        }
        var rescueimg = new createjs.SpriteSheet({
            "images": rescue_image,
            "frames": {
                width: 1442,
                height: 1334,
                spacing: 0
            },
            "animations": {
                run: [0, 7],
                end: [7]
            },
            "framerate": 10
        });
        var rescue = new createjs.Sprite(rescueimg, "run");
        rescue.x = (canvas.width - rescueimg._frameWidth * proportion) / 2;
        rescue.y = 0;
        rescue.scaleX = proportion;
        rescue.scaleY = canvas.height / 1334;

        createjs.Tween.get(rescue)
            .to({}, 700).call(function () {
                rescue.gotoAndStop("end");
            });

        var rescue_logo = new createjs.Bitmap(preload.getResult("page5_logo"))
        rescue_logo.x = (canvas.width - 600 * proportion) / 2;
        rescue_logo.y = (canvas.height - 897 * proportion) / 2 - 105 * proportion;
        rescue_logo.alpha = 0;
        rescue_logo.scaleX = proportion;
        rescue_logo.scaleY = proportion;
        createjs.Tween.get(rescue_logo)
            .wait(800)
            .to({
                alpha: 1
            }, 1000);

        var helptext = new createjs.Bitmap(preload.getResult("page5_helptext"))
        helptext.x = (canvas.width - 646 * canvas.width / 433 / 1.8) / 2;
        helptext.y = (canvas.height - 897 * canvas.width / 433 / 1.8) / 2 - 105 * canvas.width / 433 / 1.8 +
            897 *
            canvas.width / 433 / 1.8;
        helptext.alpha = 0;
        helptext.scaleX = canvas.width / 433 / 1.8;
        helptext.scaleY = canvas.width / 433 / 1.8;
        createjs.Tween.get(helptext)
            .wait(1300)
            .to({
                alpha: 1
            }, 1000);

        // 捐款按钮

        var moneyBtnImg = new createjs.SpriteSheet({
            "images": [preload.getResult("rescue_moneyBtn")],
            "frames": {
                width: 148,
                height: 67,
                spacing: 0
            },
            "animations": {
                money5_1: [6],
                money5_2: [7],
                money10_1: [0],
                money10_2: [1],
                money20_1: [2],
                money20_2: [3],
                money50_1: [4],
                money50_2: [5],
            }
        });
        var rescue_moneyBtn5 = new createjs.Sprite(moneyBtnImg, "money5_1");
        rescue_moneyBtn5.x = (canvas.width - 674 * canvas.width / 433 / 1.8) / 2;
        rescue_moneyBtn5.y = (canvas.height - 897 * canvas.width / 433 / 1.8) / 2 + 897 * canvas.width / 433 /
            1.8 -
            105 * canvas.width / 433 / 1.8;
        rescue_moneyBtn5.alpha = 0;
        rescue_moneyBtn5.scaleX = canvas.width / 433 / 1.8;
        rescue_moneyBtn5.scaleY = canvas.width / 433 / 1.8;

        var rescue_moneyBtn10 = new createjs.Sprite(moneyBtnImg, "money10_1");
        rescue_moneyBtn10.x = (canvas.width - 674 * canvas.width / 433 / 1.8) / 2 + 148 * canvas.width / 433 /
            1.8 +
            (674 * canvas.width / 433 / 1.8 - 148 * canvas.width / 433 / 1.8 * 4) / 3;
        rescue_moneyBtn10.y = (canvas.height - 897 * canvas.width / 433 / 1.8) / 2 + 897 * canvas.width / 433 /
            1.8 -
            105 * canvas.width / 433 / 1.8;
        rescue_moneyBtn10.alpha = 0;
        rescue_moneyBtn10.scaleX = canvas.width / 433 / 1.8;
        rescue_moneyBtn10.scaleY = canvas.width / 433 / 1.8;

        var rescue_moneyBtn20 = new createjs.Sprite(moneyBtnImg, "money20_1");
        rescue_moneyBtn20.x = (canvas.width - 674 * canvas.width / 433 / 1.8) / 2 + 148 * canvas.width / 433 /
            1.8 *
            2 + (674 * canvas.width / 433 / 1.8 - 148 * canvas.width / 433 / 1.8 * 4) / 3 * 2;
        rescue_moneyBtn20.y = (canvas.height - 897 * canvas.width / 433 / 1.8) / 2 + 897 * canvas.width / 433 /
            1.8 -
            105 * canvas.width / 433 / 1.8;
        rescue_moneyBtn20.alpha = 0;
        rescue_moneyBtn20.scaleX = canvas.width / 433 / 1.8;
        rescue_moneyBtn20.scaleY = canvas.width / 433 / 1.8;

        var rescue_moneyBtn50 = new createjs.Sprite(moneyBtnImg, "money50_1");
        rescue_moneyBtn50.x = (canvas.width - 674 * canvas.width / 433 / 1.8) / 2 + 148 * canvas.width / 433 /
            1.8 *
            3 + (674 * canvas.width / 433 / 1.8 - 148 * canvas.width / 433 / 1.8 * 4);
        rescue_moneyBtn50.y = (canvas.height - 897 * canvas.width / 433 / 1.8) / 2 + 897 * canvas.width / 433 /
            1.8 -
            105 * canvas.width / 433 / 1.8;
        rescue_moneyBtn50.alpha = 0;
        rescue_moneyBtn50.scaleX = canvas.width / 433 / 1.8;
        rescue_moneyBtn50.scaleY = canvas.width / 433 / 1.8;

        //捐款守护
        var rescue_btnImg = new createjs.SpriteSheet({
            "images": [preload.getResult("rescue_button")],
            "frames": {
                width: 674,
                height: 105,
                spacing: 0
            },
            "animations": {
                btn1: [0],
                btn2: [1]
            }
        });
        var rescue_btn = new createjs.Sprite(rescue_btnImg, "btn1");
        rescue_btn.x = (canvas.width - 674 * canvas.width / 433 / 1.8) / 2;
        rescue_btn.y = (canvas.height - 897 * canvas.width / 433 / 1.8) / 2 + 897 * canvas.width / 433 / 1.8;
        rescue_btn.alpha = 0;
        rescue_btn.scaleX = canvas.width / 433 / 1.8;
        rescue_btn.scaleY = canvas.width / 433 / 1.8;
        createjs.Tween.get(rescue_btn)
            .wait(1500)
            .to({
                alpha: 1
            }, 1000);

        rescue_btn.addEventListener("click", rescue_btnClick);

        function rescue_btnClick() {
            G.GAEvent('Click', 'Donate', 'DonateToHelp');

            rescue_btn.removeEventListener("click", rescue_btnClick);
            createjs.Tween.get(helptext)
                .wait(500)
                .to({
                    alpha: 0
                }, 500);
            createjs.Tween.get(rescue_moneyBtn5)
                .wait(500)
                .to({
                    alpha: 1
                }, 500);
            createjs.Tween.get(rescue_moneyBtn10)
                .wait(500)
                .to({
                    alpha: 1
                }, 500);
            createjs.Tween.get(rescue_moneyBtn20)
                .wait(500)
                .to({
                    alpha: 1
                }, 500);
            createjs.Tween.get(rescue_moneyBtn50)
                .wait(500)
                .to({
                    alpha: 1
                }, 500);
            rescue_moneyBtn5.addEventListener("click", rescue_moneyBtn5Click);

            function rescue_moneyBtn5Click() {
                rescue_moneyBtn5.gotoAndStop("money5_2");
                rescue_moneyBtn10.gotoAndStop("money10_1");
                rescue_moneyBtn20.gotoAndStop("money20_1");
                rescue_moneyBtn50.gotoAndStop("money50_1");
                money_index = 1;
                moneys = 5;

                rescue_btn.gotoAndStop("btn2");
            }
            rescue_moneyBtn10.addEventListener("click", rescue_moneyBtn10Click);

            function rescue_moneyBtn10Click() {
                rescue_moneyBtn5.gotoAndStop("money5_1");
                rescue_moneyBtn10.gotoAndStop("money10_2");
                rescue_moneyBtn20.gotoAndStop("money20_1");
                rescue_moneyBtn50.gotoAndStop("money50_1");
                money_index = 2;
                moneys = 10;

                rescue_btn.gotoAndStop("btn2");
            }
            rescue_moneyBtn20.addEventListener("click", rescue_moneyBtn20Click);

            function rescue_moneyBtn20Click() {
                rescue_moneyBtn5.gotoAndStop("money5_1");
                rescue_moneyBtn10.gotoAndStop("money10_1");
                rescue_moneyBtn20.gotoAndStop("money20_2");
                rescue_moneyBtn50.gotoAndStop("money50_1");
                money_index = 3;
                moneys = 20;

                rescue_btn.gotoAndStop("btn2");
            }
            rescue_moneyBtn50.addEventListener("click", rescue_moneyBtn50Click);

            function rescue_moneyBtn50Click() {
                rescue_moneyBtn5.gotoAndStop("money5_1");
                rescue_moneyBtn10.gotoAndStop("money10_1");
                rescue_moneyBtn20.gotoAndStop("money20_1");
                rescue_moneyBtn50.gotoAndStop("money50_2");
                money_index = 4;
                G.GAEvent('Click', 'Donate', 'Submit_' + money_index);
                
                keyBoard = new weiKeyBoard(rescue_moneyBtn50, false, 12);

                keyBoard.createKeyBoard();//创建键盘

                rescue_btn.gotoAndStop("btn2");
            }
            rescue_btn.addEventListener("click", gopayMoney);
        }

        function gopayMoney() {
            G.GAEvent('Click', 'Donate', 'Submit_' + money_index);
            if(money_index == 4)
                moneys = keyBoard.getRealValue();
            $.ajax({
                type: 'POST',
                url: '/qq20/api/public/index.php?s=index/index/createOrder',
                dataType: 'json',
                data: {
                    nick: foowwLocalStorage.get("nick"),
                    openid: 'wxce5edeb4e8056804',
                    money: moneys
                },
                async: false,
                timeout: 300,
                success: function (res) {
                    if (res.money != undefined || res.money != '' || res.money != null)
                        moneys = res.money
                    location.href = "https://ssl.gongyi.qq.com/m/weixin/gopaylts.html?pid=215883&money=" + moneys +
                        "&bid=100000362&sign=b25005f4febb9da0a1d6a36c4d84da40&ref_url=/index.html&btr=" + res.order_no;
                },
                error: function (xhr, type) {
                    location.href = "https://ssl.gongyi.qq.com/m/weixin/gopaylts.html?pid=215883&money=" + moneys +
                        "&bid=100000362&sign=b25005f4febb9da0a1d6a36c4d84da40&ref_url=/index.html";
                }
            });
        }

        container.addChild(rescue, rescue_logo, helptext, rescue_moneyBtn5, rescue_moneyBtn10,
            rescue_moneyBtn20,
            rescue_moneyBtn50, rescue_btn);

        //给canvas 1添加内容
        stage.addChild(container);
    }

    function Animate_Conter_out_share() {
        var order_no = getQueryVariable("btr");
        var time = Date.parse(new Date()).toString(); //获取到毫秒的时间戳，精确到毫秒
        time = time.substr(0, 10); //精确到秒
        if (order_no != '') {
            $.get('/qq20/api/public/index.php?s=index/index/getOrderInfo&order_no=' + order_no + "&_=" + time)
                .done(
                    function (data) {
                        console.log(data)
                        if (data.return_code && data.return_code == 0 && data.rank) {
                            usernum = parseInt(data.rank + 88757);
                        }
                    })
        }

        //动画
        manifest = [{
            id: "GoWest",
            src: "./assets/music/GoWest.mp3"
        }, {
            src: "./assets/images/page5/book.png",
            id: "page5_book"
        }, {
            src: "./assets/images/page5/shareBtn.png",
            id: "page5_shareBtn"
        }];
        for (var i = 0; i <= 7; i++)
            manifest.push({
                src: "./assets/images/rescue/H5-copy" + i + ".jpg",
                id: 'rescue' + i
            });

        var queue = new createjs.LoadQueue(true);

        var image = queue.getResult("rescue");
        //注意加载音频文件需要调用如下代码行
        queue.installPlugin(createjs.Sound);
        queue.on("fileload", function (event) {
            if (event.item.id == "GoWest")
                createjs.Sound.play("GoWest");
        });
        queue.on("progress", function () {
            console.log((queue.progress * 100 | 0) + " %")
        });
        queue.on("complete", function () {
            var rescue_image = new Array();
            for (var i = 0; i < 8; i++) {
                rescue_image[i] = queue.getResult("rescue" + i);
            }
            var rescueimg = new createjs.SpriteSheet({
                "images": rescue_image,
                "frames": {
                    width: 1442,
                    height: 1334,
                    spacing: 0
                },
                "animations": {
                    run: [0, 7],
                    end: [7]
                },
                "framerate": 10
            });
            var rescue = new createjs.Sprite(rescueimg, "run");
            rescue.x = (canvas.width - rescueimg._frameWidth * proportion) /
                2;
            rescue.y = 0;
            rescue.scaleX = proportion;
            rescue.scaleY = canvas.height / 1334;

            createjs.Tween.get(rescue)
                .to({}, 700).call(function () {
                    rescue.gotoAndStop("end");
                });
            var rescue_book, text1, text2, text3, text4, text5;

            if (usernum === 0)
                text2 = new createjs.Text("感谢您为公益献出您的爱心",
                    "38px Arial", "#fff");
            else
                text2 = new createjs.Text("成为第" + usernum + "位守护者",
                    "38px Arial", "#fff");
            text2.x = (canvas.width - text2.getMeasuredWidth()) / 2;
            text2.y = (canvas.height - text2.getMeasuredHeight()) / 2;
            text2.alpha = 0;
            createjs.Tween.get(text2)
                .wait(1400)
                .to({
                    alpha: 1
                }, 500);

            text1 = new createjs.Text("谢谢 " + username + " 天使",
                "38px Arial", "#fff");
            text1.x = (canvas.width - text1.getMeasuredWidth()) / 2;
            text1.y = (canvas.height - text1.getMeasuredHeight()) / 2 -
                text1.getMeasuredHeight() / 2 - 30 *
                canvas
                    .width / 433 / 1.8;
            text1.alpha = 0;
            createjs.Tween.get(text1)
                .wait(1100)
                .to({
                    alpha: 1
                }, 500);

            rescue_book = new createjs.Bitmap(
                queue.getResult("page5_book"))
            rescue_book.x = (canvas.width - 381 * canvas.width / 433 /
                1.8) / 2;
            rescue_book.y = (canvas.height - 200 * canvas.width / 433 /
                1.8) / 2 - 200 * canvas.width / 433 /
                1.8 /
                2 - text2.getMeasuredHeight() / 2 - text1
                    .getMeasuredHeight() - 30 * canvas
                        .width / 433 / 1.8 * 3;
            rescue_book.alpha = 0;
            rescue_book.scaleX = canvas.width / 433 / 1.8;
            rescue_book.scaleY = canvas.width / 433 / 1.8;
            rescue_book.shadow = new createjs.Shadow("rgb(27 69 82 / 0.8)",
                proportion * -15, proportion * 15,
                proportion *
                15);
            createjs.Tween.get(rescue_book)
                .wait(800)
                .to({
                    alpha: 1
                }, 1000);

            text3 = new createjs.Text("让更多的孩子们", "38px Arial", "#fff");
            text3.x = (canvas.width - text3.getMeasuredWidth()) / 2;
            text3.y = (canvas.height - text3.getMeasuredHeight()) / 2 +
                text3.getMeasuredHeight() / 2 + 90 *
                canvas
                    .width / 433 / 1.8;
            text3.alpha = 0;
            createjs.Tween.get(text3)
                .wait(1700)
                .to({
                    alpha: 1
                }, 500);
            text4 = new createjs.Text("在本应温暖的童年里", "38px Arial", "#fff");
            text4.x = (canvas.width - text4.getMeasuredWidth()) / 2;
            text4.y = (canvas.height - text4.getMeasuredHeight()) / 2 +
                text3.getMeasuredHeight() / 2 + 90 *
                canvas
                    .width / 433 / 1.8 + text4.getMeasuredHeight() + 30 * canvas
                        .width / 433 / 1.8;
            text4.alpha = 0;
            createjs.Tween.get(text4)
                .wait(2000)
                .to({
                    alpha: 1
                }, 500);
            text5 = new createjs.Text("继续向阳成长", "38px Arial", "#fff");
            text5.x = (canvas.width - text5.getMeasuredWidth()) / 2;
            text5.y = (canvas.height - text4.getMeasuredHeight()) / 2 +
                text3.getMeasuredHeight() / 2 + 90 *
                canvas
                    .width / 433 / 1.8 + text4.getMeasuredHeight() * 2 + 30 *
                    canvas
                        .width / 433 / 1.8 * 2;
            text5.alpha = 0;
            createjs.Tween.get(text5)
                .wait(2300)
                .to({
                    alpha: 1
                }, 500);

            rescue_share = new createjs.Bitmap(
                queue.getResult("page5_shareBtn"))
            rescue_share.x = (canvas.width - 622 * proportion / 1.5) / 2;
            rescue_share.y = (canvas.height - 117 * proportion / 1.5) / 2 +
                117 * proportion / 1.5 + +text3
                    .getMeasuredHeight() / 2 + 90 * canvas
                        .width / 433 / 1.8 + text4.getMeasuredHeight() * 3 + 30 *
                        canvas
                            .width / 433 / 1.8 * 3;
            rescue_share.alpha = 0;
            rescue_share.scaleX = proportion / 1.5;
            rescue_share.scaleY = proportion / 1.5;
            createjs.Tween.get(rescue_share)
                .wait(2600)
                .to({
                    alpha: 1
                }, 1000);
            rescue_share.addEventListener("click", share_fn);

            container.addChild(rescue, rescue_book, text1, text2, text3,
                text4, text5, rescue_share);
            stage.addChild(container);
        });
        queue.on("error", loadError);
        queue.loadManifest(manifest);
    }

    function share_fn() {
        G.GAEvent("click", "Share", "ShareToHelp")
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(0, 0, canvas.width, canvas.height);
        shape.alpha = 0;

        share_icon = new createjs.Bitmap("./assets/images/common/share_icon.png");
        share_icon.x = canvas.width - 68 * proportion - 65 * proportion;
        share_icon.y = 35 * proportion;
        share_icon.alpha = 0;
        share_icon.scaleX = proportion;
        share_icon.scaleY = proportion;

        share_text = new createjs.Bitmap("./assets/images/common/share_text.png");
        share_text.x = (canvas.width - 658 * proportion) / 2;
        share_text.y = 146 * proportion;
        share_text.alpha = 0;
        share_text.scaleX = proportion;
        share_text.scaleY = proportion;

        createjs.Tween.get(shape)
            .to({
                alpha: 0.6
            }, 500)

        createjs.Tween.get(share_icon)
            .to({
                alpha: 1
            }, 500).call(function () {
                createjs.Tween.get(share_icon, {
                    loop: true
                })
                    .to({
                        x: canvas.width - 68 * proportion - 55 * proportion,
                        y: 25 * proportion
                    }, 500)
            })

        createjs.Tween.get(share_text)
            .to({
                alpha: 1
            }, 500)


        shape.addEventListener("click", clear_share);
        share_icon.addEventListener("click", clear_share);
        share_text.addEventListener("click", clear_share)

        function clear_share() {
            container.removeChild(shape, share_icon, share_text);
        }

        container.addChild(shape, share_icon, share_text);
        stage.addChild(container);
    }

    //监听事件，30fps更新stage
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stage);
}

function mask_gif(gif_image) {
    // 背景特效 烦恼雪花GIF
    var gif_animate = new createjs.SpriteSheet({
        "images": gif_image,
        "frames": {
            width: 750,
            height: 1333,
            spacing: 0,
            count: 8
        },
        "animations": {
            run: [0, 7]
        }
    });
    Gif = new createjs.Sprite(gif_animate, "run");
    Gif.x = 0;
    Gif.y = 0;
    Gif.alpha = 0.3;
    Gif.framerate = 10;
    Gif.scaleX = canvas.width / gif_animate._frameWidth;
    Gif.scaleY = canvas.height / gif_animate._frameHeight;
}

function fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("");
    // return t.split("").reverse().join("") + "." + r;
}