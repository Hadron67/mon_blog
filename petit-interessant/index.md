---
title: 低趣百科
date: 2016-04-29 17:08:30
---
欢迎来到低趣百科！这里我把“低趣”词汇的解释和用法示意写在这里面了

<textarea id="wikicode"></textarea>
<button id="btn-parse">parse</button>
<div id="wiki-container"></div>


<script src="pedia/js/wikiparser.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<script>
(function($){
    'use strict';
    var parser = new wikiParser.Parser();
    parser.options.queryUrl = '/petit-interessant/';
    $('#btn-parse').click(function(){
        $('#wiki-container').html(parser.parse($('#wikicode').val()));
    });
})(jQuery);
</script>
