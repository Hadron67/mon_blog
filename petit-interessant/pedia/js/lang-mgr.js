var lmgr = (function($){
    'use strict';
    var a = {};
   
    
    var zh = {
        'title' : '低趣百科，自由的低趣百科全书',
        'read' : '阅读',
        'view-source' : '查看源码',
        'home-page' : '首页',
        'main-page' : '主页',
        'discuss' : '讨论',
        'print' : '打印/导出',
        'language' : '语言',
        'featured-content' : '特色内容',
        'random-article' : '随机文章',
        'print-export' : '打印/导出',
        'create-book' : '创建书',
        'download-pdf' : '作为pdf下载',
        'other-projects' : '其他项目',
        'search' : '搜索',
        'search-wiki' : '搜索低趣百科 [f]',
        'search-goto' : '跳转到相应的页面（如果存在）',
        'creat-account' : '创建账户',
        'login' : '登录',
        'not-logged-in' : '还没登录',
        'not-found' : '词条不存在',
        'not-found-content' : '不好意思，词条"%s"在低趣百科里面不存在。',
        'redir' : '重定向自：'
    };
    var lang = zh;
    a._ = function(s){
         return lang[s];
    }
    a.setLang = function(l){
        switch(l){
            case 'zh':
                lang = zh;
                a.lang = 'zh';
                break;
        }
    }
    a.doRefresh = function(){
        $.each($('.lang-mgr'),function(){
            $(this).html(a._($(this).attr('data-lang')));
        });
        $.each($('.lang-mgr-title'),function(){
            $(this).attr('title') = a._($(this).attr('data-lang'));
        });
    }
    a.lang = 'zh';
    return a;
})(jQuery);
