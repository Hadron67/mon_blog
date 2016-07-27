mw.loader.implement("mediawiki.util",function($,jQuery,require,module){(function(mw,$){'use strict';var util={init:function(){util.$content=(function(){var i,l,$node,selectors;selectors=['.mw-body-primary','.mw-body','#mw-content-text','body'];for(i=0,l=selectors.length;i<l;i++){$node=$(selectors[i]);if($node.length){return $node.first();}}return util.$content;}());},rawurlencode:function(str){str=String(str);return encodeURIComponent(str).replace(/!/g,'%21').replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/\*/g,'%2A').replace(/~/g,'%7E');},escapeId:function(str){str=String(str);return util.rawurlencode(str.replace(/ /g,'_')).replace(/%3A/g,':').replace(/%/g,'.');},wikiUrlencode:function(str){return util.rawurlencode(str).replace(/%20/g,'_').replace(/%3B/g,';').replace(/%40/g,'@').replace(/%24/g,'$').replace(/%21/g,'!').replace(/%2A/g,'*').replace(/%28/g,'(').replace(/%29/g,')').replace(/%2C/g,',').replace(/%2F/g,'/').replace(/%7E/g,'~').replace(/%3A/g,':');},
getUrl:function(pageName,params){var titleFragmentStart,url,query,fragment='',title=typeof pageName==='string'?pageName:mw.config.get('wgPageName');titleFragmentStart=title.indexOf('#');if(titleFragmentStart!==-1){fragment=title.slice(titleFragmentStart+1);title=title.slice(0,titleFragmentStart);}if(params){query=$.param(params);}if(query){url=title?util.wikiScript()+'?title='+util.wikiUrlencode(title)+'&'+query:util.wikiScript()+'?'+query;}else{url=mw.config.get('wgArticlePath').replace('$1',util.wikiUrlencode(title));}if(fragment.length){url+='#'+util.escapeId(fragment);}return url;},wikiScript:function(str){str=str||'index';if(str==='index'){return mw.config.get('wgScript');}else if(str==='load'){return mw.config.get('wgLoadScript');}else{return mw.config.get('wgScriptPath')+'/'+str+'.php';}},addCSS:function(text){var s=mw.loader.addStyleTag(text);return s.sheet||s.styleSheet||s;},getParamValue:function(param,url){if(url===undefined){url=location.href;}var re=new RegExp('^[^#]*[&?]'
+mw.RegExp.escape(param)+'=([^&#]*)'),m=re.exec(url);if(m){return decodeURIComponent(m[1].replace(/\+/g,'%20'));}return null;},$content:null,addPortletLink:function(portlet,href,text,id,tooltip,accesskey,nextnode){var $item,$link,$portlet,$ul;if(arguments.length<3){return null;}$link=$('<a>').attr('href',href).text(text);if(tooltip){$link.attr('title',tooltip);}$portlet=$('#'+portlet);if($portlet.length===0){return null;}$ul=$portlet.find('ul').eq(0);if($ul.length===0){$ul=$('<ul>');if($portlet.find('div:first').length===0){$portlet.append($ul);}else{$portlet.find('div').eq(-1).append($ul);}}if($ul.length===0){return null;}$portlet.removeClass('emptyPortlet');if($portlet.hasClass('vectorTabs')){$item=$link.wrap('<li><span></span></li>').parent().parent();}else{$item=$link.wrap('<li></li>').parent();}if(id){$item.attr('id',id);}if(accesskey){$link.attr('accesskey',accesskey);}if(tooltip){$link.attr('title',tooltip);}if(nextnode){if(nextnode.nodeType||typeof nextnode==='string'){nextnode
=$ul.find(nextnode);}else if(!nextnode.jquery){nextnode=undefined;}if(nextnode&&(nextnode.length!==1||nextnode[0].parentNode!==$ul[0])){nextnode=undefined;}}if(nextnode){nextnode.before($item);}else{$ul.append($item);}$link.updateTooltipAccessKeys();return $item[0];},validateEmail:function(mailtxt){var rfc5322Atext,rfc1034LdhStr,html5EmailRegexp;if(mailtxt===''){return null;}rfc5322Atext='a-z0-9!#$%&\'*+\\-/=?^_`{|}~';rfc1034LdhStr='a-z0-9\\-';html5EmailRegexp=new RegExp('^'+'['+rfc5322Atext+'\\.]+'+'@'+'['+rfc1034LdhStr+']+'+'(?:\\.['+rfc1034LdhStr+']+)*'+'$','i');return(mailtxt.match(html5EmailRegexp)!==null);},isIPv4Address:function(address,allowBlock){if(typeof address!=='string'){return false;}var block=allowBlock?'(?:\\/(?:3[0-2]|[12]?\\d))?':'',RE_IP_BYTE='(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|0?[0-9]?[0-9])',RE_IP_ADD='(?:'+RE_IP_BYTE+'\\.){3}'+RE_IP_BYTE;return(new RegExp('^'+RE_IP_ADD+block+'$').test(address));},isIPv6Address:function(address,allowBlock){if(typeof address!==
'string'){return false;}var block=allowBlock?'(?:\\/(?:12[0-8]|1[01][0-9]|[1-9]?\\d))?':'',RE_IPV6_ADD='(?:'+':(?::|(?::'+'[0-9A-Fa-f]{1,4}'+'){1,7})'+'|'+'[0-9A-Fa-f]{1,4}'+'(?::'+'[0-9A-Fa-f]{1,4}'+'){0,6}::'+'|'+'[0-9A-Fa-f]{1,4}'+'(?::'+'[0-9A-Fa-f]{1,4}'+'){7}'+')';if(new RegExp('^'+RE_IPV6_ADD+block+'$').test(address)){return true;}RE_IPV6_ADD='[0-9A-Fa-f]{1,4}'+'(?:::?'+'[0-9A-Fa-f]{1,4}'+'){1,6}';return(new RegExp('^'+RE_IPV6_ADD+block+'$').test(address)&&/::/.test(address)&&!/::.*::/.test(address));},isIPAddress:function(address,allowBlock){return util.isIPv4Address(address,allowBlock)||util.isIPv6Address(address,allowBlock);}};mw.log.deprecate(util,'wikiGetlink',util.getUrl,'Use mw.util.getUrl instead.');mw.log.deprecate(util,'tooltipAccessKeyPrefix',$.fn.updateTooltipAccessKeys.getAccessKeyPrefix(),'Use jquery.accessKeyLabel instead.');mw.log.deprecate(util,'tooltipAccessKeyRegexp',/\[(ctrl-)?(option-)?(alt-)?(shift-)?(esc-)?(.)\]$/,'Use jquery.accessKeyLabel instead.');mw.
log.deprecate(util,'updateTooltipAccessKeys',function($nodes){if(!$nodes){$nodes=$('[accesskey]');}else if(!($nodes instanceof $)){$nodes=$($nodes);}$nodes.updateTooltipAccessKeys();},'Use jquery.accessKeyLabel instead.');mw.log.deprecate(util,'jsMessage',function(message){if(!arguments.length||message===''||message===null){return true;}if(typeof message!=='object'){message=$.parseHTML(message);}mw.notify(message,{autoHide:!0,tag:'legacy'});return true;},'Use mw.notify instead.');mw.util=util;}(mediaWiki,jQuery));});
