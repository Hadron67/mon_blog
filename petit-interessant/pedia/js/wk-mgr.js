(function($){
    'use strict';
    var wparser = new wikiParser.Parser();
    var currentsource = undefined;
    var currentcontent = undefined;
    var currentword = undefined;
    wparser.options.queryUrl = window.location.pathname;
    
    $.getScript('http://115.159.100.67:8000/output/datas.js').done(function(){
        $('#wiki-content').html('加载完成');
        doRoute();
        $('#searchform').submit(function(e){
            recherche('wiki');
        });
    });
    
    function recherche(word){
        var wiki = pDB.DATAs[word];
        if(wiki != undefined){
            currentword = word;
            currentsource = wiki;
            doRenderWiki(word,wiki);
        }
        else{
            var redir = pDB.ReDir[word];
            if(redir != undefined ){
                currentword = redir;
                currentsource = wiki = pDB.DATAs[redir];
                doRenderWikiWithRedir(redir,word,wiki);
                //doRenderWiki(redir,wiki);
            }
            else{
                //var 
                renderIlnyapas(word);
            }
        }
    }
    
    function doRoute(){
        var request = GetRequest();
        request['page'] = request['page'] ? request['page'] : 'main';
        switch(request['page']){
            case 'main':
                var w = request['word'];
                if(w){
                    recherche(w);
                }
                else
                    doRenderHome();
                break;
            case 'search':
                var w = request['search'];
                if(w){
                    recherche(w);
                }
                else
                    renderIlnyapas(w);
                break;
                
        }
    }
    
    function GetRequest() {
        var url = location.search;
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    
    function doRenderHome(){
        currentsource = pDB.page['主页'];
        currentcontent = getHomeContent(wparser.parse(currentsource));
        $('#containt').html(currentcontent);
    }
    
    function doRenderWiki(title,content){
        currentsource = content;
        currentcontent = getContentWithTitle(title,wparser.parse(content));
        $('#containt').html(currentcontent);
    }
    
        
    function doRenderWikiWithRedir(title,from1,content){
        currentsource = content;
        var a = '<div class="siteSub">' + lmgr._('redir') + '"' + from1 + '"</div>';
        currentcontent = getContentWithTitle(title,a + wparser.parse(content));
        $('#containt').html(currentcontent);
    }
    
    function getContentWithTitle(title,content){
        return '<a id="top"></a><div id="siteNotice"><div id="centralNotice"></div></div><h1 id="firstHeading">' + title + '</h1><div id="wiki-content" class="mw-body-content">' + content + '</div>';
    }
    
    function getHomeContent(content){
        return '<a id="top"></a><div id="siteNotice"><div id="centralNotice"></div></div><div id="wiki-content" class="mw-body-content">' + content + '</div>';
    }
    function renderIlnyapas(word){
        currentsource = '';
        currentcontent = getContentWithTitle(lmgr._('not-found'),'<p>' + lmgr._('not-found-content').replace('%s',word) + '</p>');
        
        $('#containt').html(currentcontent);
    }
        
    function doRenderSource(word,source){
        var s = '<textarea readonly accesskey="," id="wikisource" cols="80" rows="25" dir="ltr">' + source + '</textarea>'
        $('#containt').html(getContentWithTitle(lmgr._('view-source') + ':' + word,s));
    }
    
    $('#ca-view').click(function(){
        $(this).addClass('selected');
        $('#ca-viewsource').removeClass('selected');
        $('#containt').html(currentcontent);
    });
    
    $('#ca-viewsource').click(function(){
        $(this).addClass('selected');
        $('#ca-view').removeClass('selected');
        doRenderSource(currentword,currentsource);
    });
    
    
    
    
})(jQuery);

