/*点击分类*/
var host="http://47.106.187.85/"
var host2="http://localhost:8089/"
function categoryClick(data){
    if (data==1){
        feedList();
    }else{
        document.getElementById("feed-list").innerHTML="";
    }
}

var ul=document.getElementById("category");
var li=document.createElement("li")
li.innerHTML="<a class=\"on\" onclick=\"categoryClick(1)\">微信群</a>"
ul.append(li)

$.ajax({
    url: host,
    type: 'GET',
    dataType: 'json',
    data: {
        "type":10
    },
}).done(function(response) {
    if (response.meta.success){
        feedList(response.data)
    }
   });
function feedList(data) {
    var div=document.getElementById("feed-list");
    for (i=0;i<data.length;i++){
        var itemDiv=document.createElement("div");
        itemDiv.setAttribute("class","col-sm-6 col-md-4 col-lg-3")
        var article=document.createElement("article")
        article.setAttribute("class","post post-grid post-450 type-post status-publish format-standard has-post-thumbnail hentry category-work category-tool tag-121 tag-118 tag-117 tag-110")
        article.setAttribute("id","post-450")
        var entryMedia=document.createElement("div");
        entryMedia.setAttribute("class","entry-media");
        var placeholder=document.createElement("div");
        placeholder.setAttribute("class","placeholder");
        var img=document.createElement("img");
        var a=document.createElement("a");
        a.setAttribute("href","#")
        img.setAttribute("class","lazyload");
        img.setAttribute("data-src","static/picture/wechat_qcode.jpg");
        img.setAttribute("src","data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
        a.append(img)
        placeholder.append(a)
        var entryWrapper=document.createElement("div");
        entryWrapper.setAttribute("class","entry-wrapper");

        var entryExcerpt=document.createElement("div");
        entryExcerpt.setAttribute("class","entry-excerpt u-text-format");
        entryExcerpt.append(data[i].user_name+"Pandownload软件关停公告\n很多小伙伴在说，最近这段时间，使用Pando...\n");
        entryWrapper.append(entryExcerpt)

        entryMedia.append(placeholder);
        article.append(entryMedia);
        article.append(entryWrapper);
        itemDiv.append(article);
        div.append(itemDiv);
    }
}