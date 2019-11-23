var host="http://47.106.187.85/"
var testHost="http://localhost:8089/"
var isdebug=true;//是否调试状态
if (isdebug){
    host=testHost;
}
var body = jQuery('body');
var st = 0;
var lastSt = 0;
var navText = ['<i class="mdi mdi-chevron-left"></i>', '<i class="mdi mdi-chevron-right"></i>'];
var iconspin = '<i class="fa fa-spinner fa-spin"></i> ';
var iconcheck = '<i class="fa fa-check"></i> ';
var iconwarning = '<i class="fa fa-warning "></i> ';

window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.loadHidden = false;

jQuery(function() {
  'use strict';
  carousel();
  slider();
  megaMenu();
  categoryBoxes();
  picks();
  offCanvas();
  search();
  pagination();
  sidebar();
  userinit();
  signup_popup();
  share_pop();
});

jQuery(window).scroll(function() {
  'use strict';
  if (body.hasClass('navbar-sticky') || body.hasClass('navbar-sticky_transparent')) {
    window.requestAnimationFrame(navbar);
  }
});

document.addEventListener('lazyloaded', function (e) {
  var options = {
    disableParallax: /iPad|iPhone|iPod|Android/,
    disableVideo: /iPad|iPhone|iPod|Android/,
    speed: 0.1,
  };
  
  if (
    jQuery(e.target).parents('.hero').length ||
    jQuery(e.target).hasClass('hero')
  ) {
    jQuery(e.target).jarallax(options);
  }

  if (
    (jQuery(e.target).parent().hasClass('module') && jQuery(e.target).parent().hasClass('parallax')) ||
    jQuery(e.target).parent().hasClass('entry-navigation')
  ) {
    jQuery(e.target).parent().jarallax(options);
  }
});


function open_signup_popup(){
  var el= $("#popup-signup")
  var popuphtml = el.html();
  Swal.fire({
    html: popuphtml,
    showConfirmButton: false,
    width: 340,
    padding: '0',
    onBeforeOpen: () => {
        el.empty();
    },
    onClose: () => {
        el.html(popuphtml);
    }
  })
}

function signup_popup(){
  'use strict';
   var token=sessionStorage.getItem("token");
/*登陆按钮*/
  $(".login-btn").on("click", function(event) {
      if(token==null){
          event.preventDefault();
          open_signup_popup()
      }else{
          /*进入个人中心*/
          self.location="user.html"
      }
  });
    $(".outlogin-btn").on("click", function(event) {
        event.preventDefault();
        sessionStorage.clear();
        self.location="index.html"
    });
/*发布*/
    $(".release-btn").on("click", function(event) {
        if(token==null){
            event.preventDefault();
            open_signup_popup()
        }else{
            /*开始发布*/
            self.location="release.html";
        }
    });
  $(".must-log-in a").on("click", function(event) {
      event.preventDefault();
      open_signup_popup()
  });
  
  $(".comment-reply-login").on("click", function(event) {
      event.preventDefault();
      open_signup_popup()
  });
  

  $(document).on('click', ".nav-tabs a", function (event) {
    event.preventDefault()
    var _this = $(this)
    var toggle = _this.data("toggle")
    var _parent =_this.parent()
    var _tab_signup =$(".tab-content #signup")
    var _tab_login =$(".tab-content #login")

    _parent.addClass("active");
    _parent.siblings().removeClass("active");

    if (toggle == 'login') {
      _tab_login.addClass("active");
      _tab_login.siblings().removeClass("active");
    }
    if (toggle == 'signup') {
      _tab_signup.addClass("active");
      _tab_signup.siblings().removeClass("active");
    }
  })

  //登录处理
  $(document).on('click', ".go-login", function (event) {
    var _this = $(this)
    var deft = _this.text()
    _this.html(iconspin+deft)
    $.post(host+"user/login", {
        "user_name": $("input[name='username']").val(),
        "user_pwd": $("input[name='password']").val()
    }, function(data) {
        if (data.meta.success) {
          _this.html(iconcheck+data.data.message)
            sessionStorage.setItem("token",data.data.token);
            sessionStorage.setItem("userName",data.data.userName);
            sessionStorage.setItem("userIntegral",data.data.userIntegral);
          setTimeout(function(){
              location.reload()
          },200)
        }else{
          _this.html(iconwarning+data.meta.message)
          setTimeout(function(){
              _this.html(deft)
          },2000)
        }
    });
  })
  //注册处理
  $(document).on('click', ".go-register", function (event) {
    var _this = $(this)
    var deft = _this.text()
    var user_name = $("input[name='user_name']").val();
    var user_email = $("input[name='user_email']").val();
    var user_pass = $("input[name='user_pass']").val();
    var user_pass2 = $("input[name='user_pass2']").val();
    var captcha = $("input[name='captcha']").val();
    _this.html(iconspin+deft)
    // 验证用户名
    if( !is_check_name(user_name) ){
      _this.html(iconwarning+'用户名格式错误')
      setTimeout(function(){_this.html(deft)},2000)
      return false;
    }
    //验证邮箱
    if( !is_check_mail(user_email) ){
      _this.html(iconwarning+'邮箱格式错误')
      setTimeout(function(){_this.html(deft)},2000)
      return false;
    }
    if(!is_check_pass(user_pass,user_pass2)){
      _this.html(iconwarning+'两次密码不一致')
      setTimeout(function(){_this.html(deft)},2000)
      return false;
    }
    // 验证OK
    $.post(caozhuti.ajaxurl, {
        "action": "user_register",
        "user_name": user_name,
        "user_email": user_email,
        "user_pass": user_pass,
        "captcha": captcha,
    }, function(data) {
        if (data.status == 1) {
          _this.html(iconcheck+data.msg)
          setTimeout(function(){location.reload()},1000)
        }else{
          _this.html(iconwarning+data.msg)
          setTimeout(function(){_this.html(deft)},2000)
        }
    });
  })
}

function share_pop() {

  $('.btn-bigger-cover').on('click', function(event){
      event.preventDefault();
      var _this = $(this)
      var deft = _this.html()
      _this.html(iconspin)

      $.ajax({
        url: caozhuti.ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: _this.data(),
        }).done(function (data) {
          if (data.s == 200) {
            Swal.fire({
              html: '<img class="swal2-image" src="'+data.src+'" alt="" style="display: flex;border-radius: 4px;box-shadow:0 34px 20px -24px rgba(0, 0, 0, 0.2);"><a href="'+data.src+'" download="海报" class="btn"><i class="fa fa-cloud-download"></i> 下载封面</a>',
              width: 350,
              showCancelButton: false,
              showConfirmButton:false,
              showCloseButton: true
            })
            _this.html(deft)
          } else {
            alert( data.m );
            _this.html(deft)
          }
      }).fail(function () {
          alert('Error：网络错误，请稍后再试！');
      })

  });

}

function userinit() {
    'use strict';
    //用户中心 修改个人信息
    $('[etap="submit_info"]').on('click', function () {
        var _this = $(this)
        var deft = _this.text()
        var email = $("input[name='email']").val();
        var nickname = $("input[name='nickname']").val();
        var user_avatar_type = $("input[name='user_avatar_type']:checked").val();
        var phone = $("input[name='phone']").val();
        var qq = $("input[name='qq']").val();
        var description = $("textarea[name='description']").val();
        var captcha = $("input[name='edit_email_cap']").val();
        _this.html(iconspin + deft)
        $.post(caozhuti.ajaxurl,
            {
                nickname: nickname,
                email: email,
                phone: phone,
                qq: qq,
                description: description,
                user_avatar_type: user_avatar_type,
                captcha: captcha,
                action: 'edit_user_info'
            },
            function (data) {
                if (data == '1') {
                    _this.html(deft)
                    Swal.fire({
                        type: 'success',
                        title: '修改成功',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(function () {
                        location.reload()
                    }, 1000)
                } else {
                    _this.html(deft)
                    swal.fire({
                        type: 'error',
                        title: data
                    })
                }
            }
        );
    });

    // 头像上传
    $("#addPic").change(function (e) {
        var _this = $(this)
        var nonce = _this.data("nonce")
        var file = e.currentTarget.files[0];
        // console.log(file)
        //结合formData实现图片预览
        var sendData = new FormData();
        sendData.append('nonce', nonce);
        sendData.append('action', 'update_avatar_photo');
        sendData.append('file', file);

        const Toast = Swal.mixin({
            toast: true,
            showConfirmButton: false,
            timer: 3000
        });

        $.ajax({
            url: caozhuti.ajaxurl,
            type: 'POST',
            cache: false,
            data: sendData,
            processData: false,
            contentType: false
        }).done(function (res) {
            if (res.status == 1) {
                Toast.fire({
                    type: 'success',
                    title: res.msg
                })
                setTimeout(function () {
                    location.reload()
                }, 1000)
            } else {
                Toast.fire({
                    type: 'error',
                    title: res.msg
                })
            }

        }).fail(function (res) {
            Toast.fire({
                type: 'error',
                title: '网络错误'
            })
        });

    });

    // 发送验证码 用户中心
    $(".edit_email_cap").on("click", function () {
        var _this = $(this)
        var deft = _this.text()
        var user_email = $("input[name='email']").val()
        _this.html(iconspin + deft)
        //验证邮箱
        if (!is_check_mail(user_email)) {
            Swal.fire({
                type: 'error',
                title: '邮箱格式错误'
            })
            return false;
        }
        $.post(caozhuti.ajaxurl, {
            "action": "captcha_email",
            "user_email": user_email
        }, function (data) {
            if (data.status == 1) {
                _this.html(deft)
                Swal.fire({
                    type: 'success',
                    title: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
                // _this.html(data.msg)
                _this.attr("disabled", "true");
            } else {
                _this.html(deft)
                Swal.fire({
                    type: 'error',
                    title: data.msg
                })
            }
        });
    });

    // 发送验证码 注册
    $(document).on('click', ".go-captcha_email", function (event) {
        var _this = $(this)
        var deft = _this.text()
        var user_email = $("input[name='user_email']").val()
        _this.html(iconspin + deft)
        _this.attr("disabled", "true");
        //验证邮箱
        if (!is_check_mail(user_email)) {
            _this.html(iconwarning + '邮箱错误')
            setTimeout(function () {
                _this.html(deft)
                _this.removeAttr("disabled")
            }, 3000)
            return false;
        }
        $.post(caozhuti.ajaxurl, {
            "action": "captcha_email",
            "user_email": user_email
        }, function (data) {
            if (data.status == 1) {
                _this.html(iconcheck + '发送成功')
                setTimeout(function () {
                    _this.html(deft)
                }, 3000)
            } else {
                _this.html(iconwarning + data.msg)
                setTimeout(function () {
                    _this.html(deft)
                    _this.removeAttr("disabled")
                }, 3000)
            }
        });
    });
    //推广中心 复制按钮
    var btn = document.getElementById('refurl');
    if (btn) {
        var href = $('#refurl').data("clipboard-text");
        var clipboard = new ClipboardJS(btn);
        clipboard.on('success', function (e) {
            const Toast = Swal.mixin({
                toast: true,
                showConfirmButton: false,
                timer: 3000
            });
            Toast.fire({
                type: 'success',
                title: '复制成功：' + href
            })
        });
        clipboard.on('error', function (e) {
            const Toast = Swal.mixin({
                toast: true,
                showConfirmButton: false,
            });
            Toast.fire({
                type: 'error',
                title: '复制失败：' + href
            })
        });
    }
    //修改密码
    $('.go-repassword').on('click', function (event) {
        event.preventDefault()
        var _this = $(this)
        var deft = _this.html()
        var password = $("input[name='password']").val();
        var new_password = $("input[name='new_password']").val();
        var re_password = $("input[name='re_password']").val();
        _this.html(iconspin + deft)
        if (!(password && new_password && re_password)) {
            _this.html(deft)
            Swal.fire('', '请输入完整密码', 'warning')
            return false;
        }
        if (new_password != re_password) {
            _this.html(deft)
            Swal.fire('', '两次输入新密码不一致', 'warning')
            return false;
        }

        $.post(caozhuti.ajaxurl,
            {
                password: password,
                new_password: new_password,
                re_password: re_password,
                action: 'edit_repassword'
            },
            function (data) {
                if (data == '1') {
                    _this.html(deft)
                    Swal.fire('', '修改成功', 'success').then((result) => {
                        if (result.value) {
                            location.reload()
                        }
                    })
                } else {
                    _this.html(deft)
                    Swal.fire('', data, 'error')
                }
            }
        );

    });
}
function navbar() {
  'use strict';
  st = jQuery(window).scrollTop();
  var adHeight = jQuery('.ads.before_header').outerHeight();
  var navbarHeight = jQuery('.site-header').height();
  var stickyTransparent = jQuery('.navbar-sticky_transparent.with-hero');
  var adsBeforeHeader = jQuery('.navbar-sticky.ads-before-header, .navbar-sticky_transparent.ads-before-header');
  var stickyStickyTransparent = jQuery('.navbar-sticky.navbar-slide, .navbar-sticky_transparent.navbar-slide');

  if (st > (navbarHeight + adHeight)) {
    stickyTransparent.addClass('navbar-sticky');
  } else {
    stickyTransparent.removeClass('navbar-sticky');
  }

  if (st > adHeight) {
    adsBeforeHeader.addClass('stick-now');
  } else {
    adsBeforeHeader.removeClass('stick-now');
  }

  if (st > lastSt && st > (navbarHeight + adHeight + 100)) {
    stickyStickyTransparent.addClass('slide-now');
  } else {
    if (st + jQuery(window).height() < jQuery(document).height()) {
      stickyStickyTransparent.removeClass('slide-now');
    }
  }

  lastSt = st;
}

function carousel() {
  'use strict';
  jQuery('.carousel.module').owlCarousel({
    autoHeight: true,
    dots: false,
    margin: 30,
    nav: true,
    navSpeed: 500,
    navText: navText,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
    },
  });
}

function slider() {
  'use strict';

  var autoplayOptions = {
    autoplay: true,
    autoplaySpeed: 800,
    loop: true,
  };

  var bigSlider = jQuery('.slider.big.module');
  var bigSliderOptions = {
    animateOut: 'fadeOut',
    dots: false,
    items: 1,
    nav: true,
    navText: navText,
  };
  bigSlider.each(function(i, v) {
    if (jQuery(v).hasClass('autoplay')) {
      var bigSliderAuto = Object.assign(autoplayOptions, bigSliderOptions);
      jQuery(v).owlCarousel(bigSliderAuto);
    } else {
      jQuery(v).owlCarousel(bigSliderOptions);
    }
  });

  var centerSlider = jQuery('.slider.center.module');
  var centerSliderOptions = {
    center: true,
    dotsSpeed: 800,
    loop: true,
    margin: 20,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
    },
  };
  centerSlider.each(function(i, v) {
    if (jQuery(v).hasClass('autoplay')) {
      var centerSliderAuto = Object.assign(autoplayOptions, centerSliderOptions);
      jQuery(v).owlCarousel(centerSliderAuto);
    } else {
      jQuery(v).owlCarousel(centerSliderOptions);
    }
  });

  var thumbnailSlider = jQuery('.slider.thumbnail.module');
  var thumbnailSliderOptions = {
    dotsData: true,
    dotsSpeed: 800,
    items: 1,
  };
  thumbnailSlider.each(function(i, v) {
    if (jQuery(v).hasClass('autoplay')) {
      var thumbnailSliderAuto = Object.assign(autoplayOptions, thumbnailSliderOptions);
      jQuery(v).owlCarousel(thumbnailSliderAuto);
    } else {
      jQuery(v).owlCarousel(thumbnailSliderOptions);
    }
  });
}

function megaMenu() {
  'use strict';

  var options = {
    items: 5,
    margin: 15,
  };

  jQuery('.menu-posts').not('.owl-loaded').owlCarousel(options);
  var scroller = $('.rollbar')

  $(window).scroll(function() {
      var h = document.documentElement.scrollTop + document.body.scrollTop
      h > 200 ? scroller.fadeIn() : scroller.fadeOut();
  })
  $('[etap="to_top"]').on('click', function(){
    $('html,body').animate({
            scrollTop: 0
        }, 300)
  })

  //tap_dark
  $(document).on('click', ".tap-dark", function (event) {
    var _this = $(this)
    var deft = _this.html()
    _this.html(iconspin)
   

    $.ajax({
        url: caozhuti.ajaxurl,
        type: 'POST',
        dataType: 'html',
        data: {
            "is_ripro_dark": $('body').hasClass('ripro-dark') === true ? '0' : '1',
            action: 'tap_dark'
        },
    })
    .done(function(response) {
        toggleDarkMode()
        _this.html(deft)
    })


  })

}


function toggleDarkMode() {
    $('body').toggleClass('ripro-dark')
    if (!$('body').hasClass('ripro-dark')) {

    } else {

    }
}

function categoryBoxes() {
  'use strict';
  jQuery('.category-boxes').owlCarousel({
    dots: false,
    margin: 30,
    nav: false,
    navSpeed: 500,
    navText: navText,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1230: {
        items: 4,
      },
    },
  });
}

function picks() {
  'use strict';
  jQuery('.picked-posts').not('.owl-loaded').owlCarousel({
    autoHeight: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplaySpeed: 500,
    autoplayTimeout: 3000,
    items: 1,
    loop: true,
  });
}

function offCanvas() {
  'use strict';

  var burger = jQuery('.burger');
  var canvasClose = jQuery('.canvas-close');

  jQuery('.main-menu .nav-list').slicknav({
    label: '',
    prependTo: '.mobile-menu',
  });

  burger.on('click', function() {
    body.toggleClass('canvas-opened');
    body.addClass('canvas-visible');
    dimmer('open', 'medium');
  });

  canvasClose.on('click', function() {
    if (body.hasClass('canvas-opened')) {
      body.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });

  jQuery('.dimmer').on('click', function() {
    if (body.hasClass('canvas-opened')) {
      body.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });

  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27 && body.hasClass('canvas-opened')) {
      body.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });
}
/*搜索*/
function search() {
  'use strict';

  var searchContainer = jQuery('.main-search');
  var searchField = searchContainer.find('.search-field');

  jQuery('.search-open').on('click', function() {
    body.addClass('search-open');
    searchField.focus();
  });

  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27 && body.hasClass('search-open')) {
      body.removeClass('search-open');
    }
  });

  jQuery('.search-close').on('click', function() {
    if (body.hasClass('search-open')) {
      body.removeClass('search-open');
    }
  });

  jQuery(document).mouseup(function(e) {
    if (!searchContainer.is(e.target) && searchContainer.has(e.target).length === 0 && body.hasClass('search-open')) {
      body.removeClass('search-open');
    }
  });
}


/*侧边栏*/
function pagination() {
  'use strict';

  var wrapper = jQuery('.posts-wrapper');
  var button = jQuery('.infinite-scroll-button');
  var options = {
    append: wrapper.selector + ' > *',
    debug: false,
    hideNav: '.posts-navigation',
    history: false,
    path: '.posts-navigation .nav-previous a',
    prefill: true,
    status: '.infinite-scroll-status',
  };

  if (body.hasClass('pagination-infinite_button')) {
    options.button = button.selector;
    options.prefill = false;
    options.scrollThreshold = false;

    wrapper.on('request.infiniteScroll', function (event, path) {
      button.html(caozhuti.infinite_loading);
    });

    wrapper.on('load.infiniteScroll', function (event, response, path) {
      button.html(caozhuti.infinite_load);
    });
  }

  if ((body.hasClass('pagination-infinite_button') || body.hasClass('pagination-infinite_scroll')) && body.hasClass('paged-next')) {
    wrapper.infiniteScroll(options);
  }
}
/*侧边栏*/
function sidebar() {
  'use strict';
    var navbarHeight = jQuery('.site-header').height();
    var topHeight = 0;

    jQuery('.container .sidebar-column').theiaStickySidebar({
      // Settings
      additionalMarginTop: navbarHeight+topHeight
    });

}
/*主题切换*/
function dimmer(action, speed) {
  'use strict';

  var dimmer = jQuery('.dimmer');

  switch (action) {
    case 'open':
      dimmer.fadeIn(speed);
      break;
    case 'close':
      dimmer.fadeOut(speed);
      break;
  }
}

/*判断用户名是否合法*/
function is_check_name(str) {    
    return /^[\w]{3,16}$/.test(str) 
}
/*判断邮箱是否合法*/
function is_check_mail(str) {
    return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str)
}
/*判断密码是否一致*/
function is_check_pass(str1,str2) {
    if (str1.length < 6) {
        return false;
    }
    if (str1 =! str2) {
       return false; 
    }
    return true;
}
/*分类点击*/
function filterCategoryClick(data) {
    var childs = document.getElementById("category").children
    for (i = 1; i < childs.length; i++) {
        if (data == i) {
            childs[i].children[0].setAttribute("class", "on");
            getWechatList(i-1,null);
        } else {
            childs[i].children[0].setAttribute("class", "");
        }
    }
}
function getWechatList(type,user_id){
    $.ajax({
        url: host+"wechat/getWechatList",
        type: 'GET',
        dataType: 'json',
        data: {
            "type":type,
            "user_id":user_id
        },
    }).done(function(response) {
        if (response.meta.success){
         feedList(response.data,user_id)
        }
    });
}
function feedList(data,user_id) {
    var div=document.getElementById("feed-list");
    div.innerHTML="";
    for (i=0;i<data.length;i++){
        var itemDiv=document.createElement("div");
        itemDiv.setAttribute("class","col-sm-6 col-md-4 col-lg-3")
        var article=document.createElement("article")
        article.setAttribute("class","post post-grid post-450 type-post status-publish format-standard has-post-thumbnail hentry category-work category-tool tag-121 tag-118 tag-117 tag-110")
        article.setAttribute("id","post-450")
        var entryMedia=document.createElement("div");
        var placeholder=document.createElement("div");
        placeholder.setAttribute("class","placeholder");
        var img=document.createElement("img");
        var a=document.createElement("a");
        a.setAttribute("href","#")
        img.setAttribute("class","lazyload");
        //http://localhost:63342/web/static/picture/user_wechat_qcode.jpg
        img.setAttribute("data-src",data[i].qcode_url);
        img.setAttribute("src","data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
        a.append(img)
        placeholder.append(a)
        var entryWrapper=document.createElement("div");
        entryWrapper.setAttribute("class","entry-wrapper");

        var entryHeader=document.createElement("header");
        entryHeader.setAttribute("class","entry-header");
        var h2=document.createElement("h2");
        h2.setAttribute("class","entry-title");
        h2.innerHTML="<a rel=\"bookmark\">"+data[i].title+"</a>";
        var entry_meta=document.createElement("div");
        entry_meta.setAttribute("class","entry-meta");
        var text="微信群"
        if (data[i].wx_type==1){
            text="公众号";
        }
        entry_meta.innerHTML="   <span class=\"meta-category\">\n" +
            "                                                        <a href=\"\" rel=\"category\">  <i class=\"dot\"></i>"+text+"</a>\n" +
            "                                                        </span>";
        entryHeader.append(entry_meta);
        entryHeader.append(h2);

        var entryExcerpt=document.createElement("div");
        entryExcerpt.innerHTML="  <div style=\"background: #0d95e8; margin-top: 10px;margin-bottom: 10px;border-radius:5px \">\n" +
            "                                                <span ><h4 style=\"color: #FFFFFF;padding: 5px\">发布日期："+data[i].create_time.slice(0, 10)+"</h4></span>\n" +
            "                                            </div>";
        entryWrapper.append(entryHeader)
        entryWrapper.append(entryExcerpt)
        entryMedia.append(placeholder);
        article.append(entryMedia);
        article.append(entryWrapper);
        itemDiv.append(article);
        div.append(itemDiv);
    }
}