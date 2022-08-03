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
    let deckDom = $("#desc_text");
    if (deckDom.length) {
        setTimeout(() => {
            $("#nav_mobi").trigger("click");
            total = $("#quota_login").text().match(/\d+/);

            let table = $(".book_list");
            let tr = $(table[1]).find("tr")
            tr[0].remove();
            tr[1].remove();

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

            $('#download').on('click', function () {
                let mobiCheck = $("#nav_mobi").hasClass("tab_check");
                let epubCheck = $("#nav_epub").hasClass("tab_check");
                if (!mobiCheck && !epubCheck) {
                    alert("请点击下载选项卡")
                    return
                }
                let type = 1;
                if (epubCheck) {
                    type = 2;
                }
                if (downloadCount > 0) {
                    alert("当前正在下载，不要重复点击！")
                    return;
                }
                let checkVolDom = $("input[name='checkbox_vol']:checked");
                downloadCount = checkVolDom.length;
                let count = 0;
                checkVolDom.each(function () {
                    download($(this).val(), 30000 * count++, type);
                });
            });
        }, 500);
    }
});

function download(val, timeout, type) {
    let waitDownload = setTimeout(() => {
        downloadCount--;
        window.open(domain + "/down/" + bookIndex + "/" + val + "/1/" + type + "/1-0/", "_blank");
        clearTimeout(waitDownload);
    }, timeout);
}

function updateUse() {
    use = 0;
    $("input[name='checkbox_vol']:checked").each(function () {
        let text = $(this).parent().prev().find(".filesize").html();
        use += +text.split(" ")[0].match(/\d+/);
    });
    $("#use").html(use + " M");
    if (use > total) {
        $("#warn").show();
    } else {
        $("#warn").hide();
    }
}