// 剩余额度
let total = 0;
// 选中文件大小
let use = 0;
// 从 URL中截取域名
let url = window.location.href;
let urlSplit = url.split("/");
let domain = urlSplit[0] + "//" + urlSplit[2];
// 书籍编号
let bookIndex = urlSplit[urlSplit.length - 1].replace(".htm", "")
// 当前等待下载文件的数量
let downloadCount = 0;

$(document).ready(function () {
    // 看看有没有书籍简介
    let deckDom = $("#desc_text");
    if (deckDom.length) {
        // 有书籍简介说明是书籍页面，可以下载。等待500毫秒进行初始化
        setTimeout(() => {
            // 默认跳转到kindle下载页面
            $("#nav_mobi").trigger("click");
            // 正则匹配出剩余额度
            total = $("#quota_login").text().match(/\d+/);

            // 下面两行空白的占位置，直接删除
            let table = $(".book_list");
            let tr = $(table[1]).find("tr")
            tr[0].remove();
            tr[1].remove();

            // 注入插件说明和按钮
            let innerHTML = "<p style='font-size: 20px; color:#F56C6C;position:fixed;top:100px;left:10px;background-color: #EBEEF5;padding: 10px;border: 1px solid #DCDFE6'>"
            innerHTML += "批量下载 <br>(已选 / 剩余 : <span id='use'>0 M</span> / " + total + " M)";
            innerHTML += "<br><span style='font-size: 12px'>选中后点击下载即可批量下载</span><br>";
            innerHTML += "<span style='font-size: 12px'>注意不要超过剩余额度</span><br>";
            innerHTML += "<span style='font-size: 12px'>非VIP用户下载有数量限制，一次不建议下载太多</span><br>";
            innerHTML += "<span style='font-size: 12px'>每30S下载一个，不要关闭本页面。</span><br>";
            innerHTML += "<span id='warn' style='font-size: 12px;display: none'>额度不够了哦!</span><br>";
            innerHTML += "<button style='margin-left: 10px;margin-right: 10px' id='allSelect'> 全选 </button>";
            innerHTML += "<button style='margin-right: 10px' id='allNoSelect'> 全不选 </button>";
            innerHTML += "<button id='download'> 下载 </button>";
            innerHTML += "</p>"
            deckDom.html(deckDom.html() + innerHTML);

            // 给当前页面所有复选框添加点击事件
            $("input:checkbox").each(function () {
                $(this).click(function () {
                    let mobiCheck = $("#nav_mobi").hasClass("tab_check");
                    let epubCheck = $("#nav_epub").hasClass("tab_check");
                    if (!mobiCheck && !epubCheck) {
                        alert("请点击下载选项卡")
                        return
                    }
                    updateUse();
                });
            })

            // 全选
            $('#allSelect').on('click', function () {
                let mobiCheck = $("#nav_mobi").hasClass("tab_check");
                let epubCheck = $("#nav_epub").hasClass("tab_check");
                if (!mobiCheck && !epubCheck) {
                    alert("请点击下载选项卡")
                    return
                }
                $("input:checkbox").attr("checked", "true");
                updateUse();
            });

            // 全不选
            $('#allNoSelect').on('click', function () {
                let mobiCheck = $("#nav_mobi").hasClass("tab_check");
                let epubCheck = $("#nav_epub").hasClass("tab_check");
                if (!mobiCheck && !epubCheck) {
                    alert("请点击下载选项卡")
                    return
                }
                $("input:checkbox").removeAttr("checked");
                updateUse()
            });

            // 点击下载按钮
            $('#download').on('click', function () {
                let mobiCheck = $("#nav_mobi").hasClass("tab_check");
                let epubCheck = $("#nav_epub").hasClass("tab_check");
                if (!mobiCheck && !epubCheck) {
                    alert("请点击下载选项卡")
                    return
                }
                // kindle是1，epub是2
                let type = 1;
                if (epubCheck) {
                    type = 2;
                }
                // 验证上次下载的文件是否处理完
                if (downloadCount > 0) {
                    alert("当前正在下载，不要重复点击！")
                    return;
                }
                // 获取选中的复选框
                let checkVolDom = $("input[name='checkbox_vol']:checked");
                // 选中文件数量
                downloadCount = checkVolDom.length;
                // 太坑了，网速限制也就罢了，连下载数量都有限制。这里每30秒下载一个。
                let count = 0;
                checkVolDom.each(function () {
                    download($(this).val(), 30000 * count++, type);
                });
            });
        }, 500);
    }
});

/**
 * 下载
 */
function download(val, timeout, type) {
    let waitDownload = setTimeout(() => {
        // 下载一个减一个
        downloadCount--;
        // 打开新窗口下载
        window.open(domain + "/down/" + bookIndex + "/" + val + "/1/" + type + "/1-0/", "_blank");
        clearTimeout(waitDownload);
    }, timeout);
}

/**
 * 更新选中文件大小
 */
function updateUse() {
    use = 0;
    // 获取选中的复选框
    $("input[name='checkbox_vol']:checked").each(function () {
        // 在当前框框附近找到自己的大小
        let text = $(this).parent().prev().find(".filesize").html();
        // 累加
        use += +text.split(" ")[0].match(/\d+/);
    });
    $("#use").html(use + " M");
    if (use > total) {
        $("#warn").show();
    } else {
        $("#warn").hide();
    }
}