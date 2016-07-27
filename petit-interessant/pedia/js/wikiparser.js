/**
 *   A wiki parser for converting a wiki text into html.
 *   This file is currently part of the "petit interessant pedia".
 *   See http://hadroncfy.com/petit-interessant/pedia
 *
 *   Copyright (C) 2016  CFY
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var wikiParser = (function(){
    'use strict';
    var a = typeof exports == 'undefined' ? {} : exports;
    a.version = '1.0.0';
    var b = {};
    function Token(id,image){
        this.id = id;
        this.image = image;
    }
    function WikiScanner(file){
        this.s = file;
        this.cursor = 0;
        this.line = this.column = 1;
        this.lexiquestate = WikiScanner.STDEFAULT;
        this.sstack = [];
    }
    WikiScanner.prototype.eof = function(){
        return this.cursor >= this.s.length;
    }
    WikiScanner.prototype.mkError = function(msg){
        return msg + ' at line ' + this.line + ',column ' + this.column;
    }
    WikiScanner.prototype.pushState = function(s){
        this.sstack.push(this.lexiquestate);
        this.lexiquestate = s;
    }
    WikiScanner.prototype.popState = function(){
        this.lexiquestate = this.sstack.pop();
    }
    WikiScanner.prototype.getchar = function(){
        if(this.eof()){
            return '';
        }
        var ret = this.s[this.cursor++];
        if(ret == '\n'){
            this.line++;
            this.column = 1;
        }
        else
            this.column++;
        return ret;
    }
    WikiScanner.prototype.char = function(){
        if(this.eof()){
            return '';
        }
        return this.s[this.cursor];
    }
    //tokens
    WikiScanner.STRING = 0;
    WikiScanner.H = 1;
    WikiScanner.LINKSTART = 2;
    WikiScanner.LINKEND = 3;
    WikiScanner.SEPERATOR = 4;
    WikiScanner.NEWLINE = 5;
    WikiScanner.NEWP = 6;
    WikiScanner.BIQUOTE = 7;
    WikiScanner.TRIQUOTE = 8;
    WikiScanner.COLON = 9;
    WikiScanner.STAR = 10;
    WikiScanner.EXLINKBEGIN = 11;
    WikiScanner.EXLINKEND = 12;
    WikiScanner.PLUGINSTART = 13;
    WikiScanner.PLUGINEND = 14;
    WikiScanner.EQU = 15;
    WikiScanner.TABLESTART = 16;
    WikiScanner.TABLEEND = 17;
    WikiScanner.TABLEROW = 18;
    WikiScanner.BISEPERATOR = 19;
    WikiScanner.SIRP = 20;
    WikiScanner.BISIRP = 21;
    WikiScanner.TABLECAP = 22;
    //states
    WikiScanner.STDEFAULT = 0;
    WikiScanner.STINLINK = 1;
    WikiScanner.STFINDURL = 2;
    WikiScanner.STINPLUGIN = 3;
    WikiScanner.STINTABLE = 4;
    WikiScanner.prototype.ignoreSpace = function(){
        while(this.char() == ' '){
            this.getchar();
        }
    }
    
    WikiScanner.prototype.next = function(){
        this.ignoreSpace();
        var char = this.char();
        var image = '';
        var space = '';

        if(char == ''){
            return new Token(WikiScanner.EOF,'EOF');
        }
        
        if(char == '\n'){
            image += this.getchar();
            if(this.char() == '\n'){
                while(this.char() == '\n'){
                    image += this.getchar();
                }
                return new Token(WikiScanner.NEWP,'\\n\\n');
            }
            else{
                return new Token(WikiScanner.NEWLINE,'\\n');
            }
            /*
            if(this.char() == '\n'){
                this.getchar();
                return new Token(WikiScanner.NEWLINE,'\\n\\n');
            }
            image = '';
            char = this.char();*/
        }
        else if(char == '\\'){
            this.getchar();
            image += this.getchar();
        }
        else if(char == '{'){
            image += this.getchar();
            if(this.char() == '{'){
                this.getchar();
                this.pushState(WikiScanner.STINPLUGIN);
                return new Token(WikiScanner.PLUGINSTART,'{{');
            }
            else if(this.char() == '|'){
                this.getchar();
                this.pushState(WikiScanner.STINTABLE);
                return new Token(WikiScanner.TABLESTART,'{|');
            }
        }
        else if(char == '}'){
            image += this.getchar();
            if(this.char() == '}'){
                this.getchar();
                this.popState();
                return new Token(WikiScanner.PLUGINEND,'}}');
            }
        }
        else if(char == '['){
            image += this.getchar();
            if(this.char() == '['){
                this.getchar();
                this.pushState(WikiScanner.STINLINK);
                return new Token(WikiScanner.LINKSTART,'[[');
            }
            else{
                return new Token(WikiScanner.EXLINKBEGIN,'[');
            }
        }
        
        else if(char == '\''){
            image += this.getchar();
            if(this.char() == '\''){
                image += this.getchar();
                if(this.char() == '\''){
                    image += this.getchar();
                    return new Token(WikiScanner.TRIQUOTE,image);
                }
                else{
                    return new Token(WikiScanner.BIQUOTE,image);
                }
            }
        }
        else if(char == ']'){
            image += this.getchar();
            if(this.char() == ']'){
                image += this.getchar();
                this.popState();
                return new Token(WikiScanner.LINKEND,']]');
            }
            else{
                return new Token(WikiScanner.EXLINKEND,']');
            }
        }
        else if(this.lexiquestate == WikiScanner.STINTABLE && char == '!'){
            image += this.getchar();
            if(this.char() == '!'){
                image += this.getchar();
                return new Token(WikiScanner.BISIRP,'!!');
            }
            else{
                return new Token(WikiScanner.SIRP,'!');
            }
        }
        else if((this.lexiquestate == WikiScanner.STINTABLE || this.lexiquestate == WikiScanner.STDEFAULT || this.lexiquestate == WikiScanner.STINPLUGIN) && char == '='){
            image += this.getchar();
            if(this.char() == '='){
                var hcount = 2;
                image += this.getchar();
                while(this.char() == '='){
                    image += this.getchar();
                    hcount++;
                }
                var ret = new Token(WikiScanner.H,image);
                ret.hcount = hcount;
                return ret;
            }
            else if(this.lexiquestate == WikiScanner.STINPLUGIN){
                return new Token(WikiScanner.EQU,'=');
            }
        }
        else if((this.lexiquestate == WikiScanner.STDEFAULT || this.lexiquestate == WikiScanner.STINTABLE) && char == '*'){
            image += this.getchar();
            return new Token(WikiScanner.STAR,'*');
        }
        else if((this.lexiquestate == WikiScanner.STINTABLE || this.lexiquestate == WikiScanner.STINLINK || this.lexiquestate == WikiScanner.STINPLUGIN) && char == '|'){
            image += this.getchar();
            if(this.lexiquestate == WikiScanner.STINTABLE && this.char() == '-'){
                image += this.getchar();
                return new Token(WikiScanner.TABLEROW,image);
            }
            else if(this.lexiquestate == WikiScanner.STINTABLE && this.char() == '}'){
                image += this.getchar();
                this.popState();
                return new Token(WikiScanner.TABLEEND,image);
            }
            else if(this.lexiquestate == WikiScanner.STINTABLE && this.char() == '+'){
                image += this.getchar();
                return new Token(WikiScanner.TABLECAP,image);
            }
            else if(this.lexiquestate == WikiScanner.STINTABLE && this.char() == '|'){
                image += this.getchar();
                return new Token(WikiScanner.BISEPERATOR,image);
            }
            else{
                return new Token(WikiScanner.SEPERATOR,image);
            }
        }
        else if(this.lexiquestate == WikiScanner.STINLINK && char == ':'){
            image += this.getchar();
            return new Token(WikiScanner.COLON,image);
        }
        //none has matched
        if(this.lexiquestate == WikiScanner.STDEFAULT){
            char = this.char();
            while(char != ' ' && char != '*' && char != '[' && char != ']' && char != '=' && char != '' && char != '\n' && char != '\''){
                if(char == '\\'){
                    this.getchar();
                }
                image += this.getchar();
                char = this.char();
            }
            return new Token(WikiScanner.STRING,image);
        }
        else if(this.lexiquestate == WikiScanner.STINPLUGIN){
            char = this.char();
            while(char != ' ' && char != '}' && char != '*' && char != '[' && char != ']' && char != '=' && char != '' && char != '\n' && char != '\''){
                if(char == '\\'){
                    this.getchar();
                }
                image += this.getchar();
                char = this.char();
            }
            return new Token(WikiScanner.STRING,image);
        }
        else if(this.lexiquestate == WikiScanner.STINLINK){
            char = this.char();
            while(char != ' ' && char != '[' && char != ']' && char != '' && char != '\n' && char != '\'' && char != '|' && char != ':'){
                if(char == '\\'){
                    this.getchar();
                }
                image += this.getchar();
                char = this.char();
            }
            return new Token(WikiScanner.STRING,image);
        }
        else if(this.lexiquestate == WikiScanner.STINTABLE){
            char = this.char();
            while(char != ' ' && char != '=' && char != '[' && char != '!' && char != ']' && char != '' && char != '\n' && char != '\'' && char != '|'){
                if(char == '\\'){
                    this.getchar();
                }
                image += this.getchar();
                char = this.char();
            }
            return new Token(WikiScanner.STRING,image);
        }
        /*else if(this.lexiquestate == WikiScanner.STFINDURL){
            char = this.char();
            while(char != ' ' && char != '[' && char != ']' && char != '' && char != '\n' && char != '\'' && char != '|'){
                image += this.getchar();
                char = this.char();
            }
            return new Token(WikiScanner.STRING,image);
        }*/
    }
    
    function Parser(){
        this.pstack = [];
        this.options = {
            queryUrl : '/',
            queryObj : 'word',
            useRouter : false,
            titleClass : 'wk-title',
            paragraphClass : 'wk-p',
            linkClass : 'wk-link',
            imgClass : 'wk-img',
            exlinkClass : 'external text'
        };
        this.namespaces = {
            'File' : Parser.Filenamespace
        };
        this.plugins = {
            'siteSub' : Parser.SiteSubPlugin
        };
    }
    Parser.prototype = new WikiScanner('');
    Parser.prototype.constructor = Parser;
    
    
    Parser.prototype.init = function(file){
        WikiScanner.call(this,file);
        this.result = '';
        this.currentToken = this.next();
        this.warn = [];
    }
    Parser.prototype.getToken = function(expect){
        if(expect != undefined && expect != this.currentToken.id)
            throw this.mkError('SyntaxError in wiki text');
        var ret = this.currentToken;
        this.currentToken = this.next();
        return ret;
    }
    Parser.prototype.parse = function(file){
        if(file != undefined)
            this.init(file);
        this.file();
        if(this.warn.length > 0){
            if(console && console.log){
                for(var i = 0;i < this.warn.length;i++){
                    console.log(this.warn[i]);
                }
            }
        }
        return this.result;
    }
    Parser.prototype.getTagClass = function(tag){
        switch(tag){
            case 'a':
                if(this.options.linkClass != ''){
                    return 'class="' + this.options.linkClass + '"';
                }
                return '';
            case 'h':
                if(this.options.titleClass != ''){
                    return 'class="' + this.options.titleClass + '"';
                }
                return '';
            case 'p':
                if(this.options.paragraphClass != ''){
                    return 'class="' + this.options.paragraphClass + '"';
                }
                return '';
            case 'img':
                if(this.options.imgClass != ''){
                    return 'class="' + this.options.imgClass + '"';
                }
                return '';
        }
    }
    
    //rules=================================================
    
    /**
     * file() ->
     * ( paragraph() | title() )* EOF
     */
    Parser.prototype.file = function(){
        while(this.currentToken.id != WikiScanner.EOF){
            switch(this.currentToken.id){
                case WikiScanner.H:
                    this.title();
                    this.result += this.pstack.pop();
                    break;
                default:
                    this.paragraph();
                    this.result += this.pstack.pop();
            }
        }
    }
    /**
     * block() ->
     * ( paragraph() | title() )*
     */
    Parser.prototype.block = function(){
        var s = '';
        out:
        while(true){
            switch(this.currentToken.id){
                case WikiScanner.STRING:
                case WikiScanner.BIQUOTE:
                case WikiScanner.TRIQUOTE:
                case WikiScanner.LINKSTART:
                case WikiScanner.EXLINKBEGIN:
                case WikiScanner.TABLESTART:
                case WikiScanner.STAR:
                    this.paragraph();
                    s += this.pstack.pop();
                    break;
                case WikiScanner.H:
                    this.title();
                    s += this.pstack.pop();
                    break;
                default:break out;
            }
        }
        this.pstack.push(s);
    }
    /**
     * link() ->
     * exlink() | inlink()
     */
    Parser.prototype.link = function(){
        switch(this.currentToken.id){
            case WikiScanner.LINKSTART:
                this.inlink();
                break;
            case WikiScanner.EXLINKBEGIN:
                this.exlink();
                break;
        }
    }
    /**
     * inlink() ->
     * '[[' [ atom() ':' ] atom() ( '|' sentence() )* ']]'
     * | 
     */
    Parser.prototype.inlink = function(){
        var s;
        this.getToken();
        this.atom();
        var t1 = this.pstack.pop();
        var t2 = '';
        if(this.currentToken.id == WikiScanner.COLON){
            this.getToken();
            var nsname = t1;
            this.atom();
            var src = this.pstack.pop();
            var args = [src];
            while(this.currentToken.id != WikiScanner.LINKEND){
                this.getToken(WikiScanner.SEPERATOR);
                this.sentence();
                args.push(this.pstack.pop());
            }
            this.getToken();
            var ns = this.namespaces[nsname];
            if(ns == undefined){
                this.warn.push(this.mkError('wiki warning: no such namespace:' + nsname));
                this.pstack.push('');
                return;
            }
            this.pstack.push(ns.run(args));
            return;
        }
        else if(this.currentToken.id == WikiScanner.SEPERATOR){
            this.getToken();
            this.sentence();
            t2 = t1;
            t1 = this.pstack.pop();
            this.getToken(WikiScanner.LINKEND);
        }
        else{
            this.getToken(WikiScanner.LINKEND);
        }

        if(!this.options.useRouter){
            s = '<a title="' + t2 + '"' + this.getTagClass('a') + 
            ' href="' + this.options.queryUrl + '?' + this.options.queryObj + '=' + t1 + '">' + t2 + '</a>';
        }
        else{
             s = '<a title="' + t2 + '"' + this.getTagClass('a') + 
            ' href="' + this.options.queryUrl + '#/' + t1 + '">' + t2 + '</a>';
        }
        this.pstack.push(s);
    }
//    /**
//     * linkitem() ->
//     * ( atom() | link() )*
//     */
//    Parser.prototype.linkitem = function(){
//        var s = '';
//        out:
//        while(true){
//            switch(this.currentToken.id){
//                case WikiScanner.BIQUOTE:
//                case WikiScanner.TRIQUOTE:
//                case WikiScanner.STRING:
//                    this.atom();
//                    s += this.pstack.pop();
//                    break;
//                case WikiScanner.LINKSTART:
//                case WikiScanner.EXLINKBEGIN:
//                    this.link();
//                    s += this.pstack.pop();
//                    break;
//                default:break out;
//            }
//        }
//        this.pstack.push(s);
//    }
    
    /**
     * title ->
     * H sentence() H ('\n'|'\n\n')
     */
    Parser.prototype.title = function(){
        var count = this.currentToken.hcount;
        var s = '<h' + count + ' '+ this.getTagClass('h') + '>';
        this.getToken();
        this.sentence();
        s += this.pstack.pop();
        var endt = this.getToken(WikiScanner.H);
        if(endt.hcount != count)
            throw this.mkError('SyntaxError: imbalance title bracket');
        s += '</h' + count + '>';
        //if(count == 2)
         //   s += '<hr class="wk-hr">';
        this.pstack.push(s);
        if(this.currentToken.id == WikiScanner.NEWLINE || this.currentToken.id == WikiScanner.NEWP){
            this.getToken();
        }
    }
    /**
     * sentence() ->
     * ( atom() | link() | plugins() | '' fontlessSentence() '' | ''' fontlessSentence() ''' )+
     */
    Parser.prototype.sentence = function(){
        var s = '';
        switch(this.currentToken.id){
            case WikiScanner.PLUGINSTART:
                this.plugin();
                s += this.pstack.pop();
                break;
            case WikiScanner.LINKSTART:
            case WikiScanner.EXLINKBEGIN:
                this.link();
                s += this.pstack.pop();
                break;
            case WikiScanner.STRING:
                this.atom();
                s += this.pstack.pop();
                break;
            case WikiScanner.BIQUOTE:
                this.getToken();
                this.fontlessSentence();
                this.getToken(WikiScanner.BIQUOTE);
                s += '<i>' + this.pstack.pop() + '</i>';
                break;
            case WikiScanner.TRIQUOTE:
                this.getToken();
                this.fontlessSentence();
                this.getToken(WikiScanner.TRIQUOTE);
                s += '<b>' + this.pstack.pop() + '</b>';
                break;
            default:throw this.mkError('SyntaxError: expect "[[",STRING,"\'\'"or"\'\'\'"');
        }
        out:
        while(true){
            switch(this.currentToken.id){
                case WikiScanner.PLUGINSTART:
                    this.plugin();
                    s += this.pstack.pop();
                    break;
                case WikiScanner.LINKSTART:
                case WikiScanner.EXLINKBEGIN:
                    this.link();
                    s += this.pstack.pop();
                    break;
                case WikiScanner.STRING:
                    this.atom();
                    s += this.pstack.pop();
                    break;
                case WikiScanner.BIQUOTE:
                    this.getToken();
                    this.fontlessSentence();
                    this.getToken(WikiScanner.BIQUOTE);
                    s += '<i>' + this.pstack.pop() + '</i>';
                    break;
                case WikiScanner.TRIQUOTE:
                    this.getToken();
                    this.fontlessSentence();
                    this.getToken(WikiScanner.TRIQUOTE);
                    s += '<b>' + this.pstack.pop() + '</b>';
                    break;
                default:break out;
            }
        }
        this.pstack.push(s);
    }
    
    /**
     * fontlesssentence() ->
     * ( atom() | link() | plugins() )+
     */
    Parser.prototype.fontlessSentence = function(){
        var s = '';
        switch(this.currentToken.id){
            case WikiScanner.PLUGINSTART:
                this.plugin();
                s += this.pstack.pop();
                break;
            case WikiScanner.LINKSTART:
            case WikiScanner.EXLINKBEGIN:
                this.link();
                s += this.pstack.pop();
                break;
            case WikiScanner.STRING:
                this.atom();
                s += this.pstack.pop();
                break;
            default:throw this.mkError('SyntaxError: expect "[[",STRING');
        }
        out:
        while(true){
            switch(this.currentToken.id){
                case WikiScanner.PLUGINSTART:
                    this.plugin();
                    s += this.pstack.pop();
                    break;
                case WikiScanner.LINKSTART:
                case WikiScanner.EXLINKBEGIN:
                    this.link();
                    s += this.pstack.pop();
                    break;
                case WikiScanner.STRING:
                    this.atom();
                    s += this.pstack.pop();
                    break;
                default:break out;
            }
        }
        this.pstack.push(s);
    }
     
    /**
     * paragraph() ->
     * ( sentence() [ '\n' ] | points() [ '\n' ] | table() [ '\n' ] )+ [ '\n\n' ]
     */
    Parser.prototype.paragraph = function(){
        var s = '<p class="' + this.options.paragraphClass + '">';
        switch(this.currentToken.id){
            case WikiScanner.STRING:
            case WikiScanner.BIQUOTE:
            case WikiScanner.TRIQUOTE:
            case WikiScanner.LINKSTART:
            case WikiScanner.EXLINKBEGIN:
            case WikiScanner.PLUGINSTART:
                this.sentence();
                s += this.pstack.pop();
                break;
            case WikiScanner.TABLESTART:
                this.table();
                s += this.pstack.pop();
                break;
            case WikiScanner.STAR:
                this.points();
                s += this.pstack.pop();
                break;              
            default:throw this.mkError('SyntaxError: invalid syntax:' + this.currentToken.image);
        }
        if(this.currentToken.id == WikiScanner.NEWLINE){
            this.getToken();
            s += '<br/>';
        }
        out:
        while(true){
            switch(this.currentToken.id){
                case WikiScanner.STRING:
                case WikiScanner.BIQUOTE:
                case WikiScanner.TRIQUOTE:
                case WikiScanner.LINKSTART:
                case WikiScanner.EXLINKBEGIN:
                case WikiScanner.TABLESTART:
                    this.sentence();
                    s += this.pstack.pop();
                    break;
                case WikiScanner.STAR:
                    this.points();
                    s += this.pstack.pop();
                    break;
                default:break out;
            }
            if(this.currentToken.id == WikiScanner.NEWLINE){
                this.getToken();
                s += '<br/>';
            }
        }
        s += '</p>';
        if(this.currentToken.id == WikiScanner.NEWP)
            this.getToken();
        this.pstack.push(s);
    }
    
    /**
     * plugin() ->
     * '{{' STRING [ sentence() ] ( '|' pluginitem() )* '}}'
     */
    Parser.prototype.plugin = function(){
        this.getToken();
        var pname = this.getToken().image;
        var marg = '';
        var args = {};
        var arrayarg = [];
        if(this.currentToken.id != WikiScanner.SEPERATOR){
            this.sentence();
            marg = this.pstack.pop();
        }
        while(this.currentToken.id == WikiScanner.SEPERATOR){
            this.getToken();
            this.pluginitem();
            var a = this.pstack.pop();
            if(a[0] == ''){
                arrayarg.push(a[1]);
            }
            else{
                args[a[0]] = a[1];
            }
        }
        this.getToken(WikiScanner.PLUGINEND);
        var p = this.plugins[pname];
        if(p == undefined){
            this.warn.push(this.mkError('wiki warning: no such plugin:"' + pname + '"'));
            this.pstack.push('');
        }
        else
            this.pstack.push(p.run(marg,arrayarg,args));
    }
    
    /**
     * pluginitem() ->
     * STRING [ '=' [ sentence() ] ]
     */
    Parser.prototype.pluginitem = function(){
        var s = this.getToken(WikiScanner.STRING).image;
        if(this.currentToken.id == WikiScanner.EQU){
            this.getToken();
            switch(this.currentToken.id){
                case WikiScanner.STRING:
                case WikiScanner.BIQUOTE:
                case WikiScanner.TRIQUOTE:
                case WikiScanner.LINKSTART:
                case WikiScanner.EXLINKBEGIN:
                case WikiScanner.TABLESTART:
                    this.sentence();
                    this.pstack.push([s,this.pstack.pop()]);
                    break;
                default:
                    this.pstack.push([s,'']);
            }
        }
        else{
            this.pstack.push(['',s]);
        }
    }
    
    /**
     * table() ->
     * '{|' [ sentence() ] '\n' [ '|+' sentence() '\n' ] firsttablerow() ( tablerow() )* '|}'
     * 
     */
    Parser.prototype.table = function(){
        this.getToken();
        var s = '<table';
        if(this.currentToken.id != WikiScanner.NEWLINE){
            this.sentence();
            s += ' ' + this.pstack.pop();
        }
        s += '>';
        this.getToken(WikiScanner.NEWLINE);
        if(this.currentToken.id == WikiScanner.TABLECAP){
            this.getToken();
            this.sentence();
            s += '<caption>' + this.pstack.pop() + '</caption>';
            this.getToken(WikiScanner.NEWLINE);
        }
        s += '<tbody>';
        this.firsttablerow();
        s += this.pstack.pop();
        while(this.currentToken.id != WikiScanner.TABLEEND){
            this.tablerow();
            s += this.pstack.pop();
        }
        this.getToken(WikiScanner.TABLEEND);
        s += '</tbody></table>';
        this.pstack.push(s);
    }
    
    /**
     * tablerow()->
     * '|-' [ sentence() ] '\n' ( tablecolumn() )*
     */
    Parser.prototype.tablerow = function(){
        this.getToken(WikiScanner.TABLEROW);
        var s = '<tr';
        if(this.currentToken.id != WikiScanner.NEWLINE){
            this.sentence();
            s += ' ' + this.pstack.pop();
        }
        s += '>';
        this.getToken(WikiScanner.NEWLINE);
        //this.tablecolumn();
        //s += this.pstack.pop();
        while(this.currentToken.id == WikiScanner.SEPERATOR || this.currentToken.id == WikiScanner.SIRP){
            this.tablecolumn();
            s += this.pstack.pop();
            
        }
        //this.getToken(WikiScanner.NEWLINE);
        s += '</tr>';
        this.pstack.push(s);
    }
    
    /**
     * firsttablerow() ->
     * [ '|-' [ sentence() ] '\n' ] ( tablecolumn() )*
     */
    Parser.prototype.firsttablerow = function(){
        var s = '<tr';
        if(this.currentToken.id == WikiScanner.TABLEROW){
            this.getToken();
            if(this.currentToken.id != WikiScanner.NEWLINE){
                this.sentence();
                s += ' ' + this.pstack.pop();
            }
            this.getToken(WikiScanner.NEWLINE);
        }
        s += '>';
        //this.tablecolumn();
        //s += this.pstack.pop();
        while(this.currentToken.id == WikiScanner.SEPERATOR || this.currentToken.id == WikiScanner.SIRP){
            this.tablecolumn();
            s += this.pstack.pop();
        }
        //this.getToken(WikiScanner.NEWLINE);
        s += '</tr>';
        this.pstack.push(s);
    }
    
    /**
     * tablecolumn() ->
     * ('|'|'!') tablecolumnitem() ( ('||'|'!!') tablecolumnitem() )* '\n' [ block() ]
     */
    Parser.prototype.tablecolumn = function(){
        var ttype = '';
        switch(this.currentToken.id){
            case WikiScanner.SEPERATOR:
                ttype = 'td';
                break;
            case WikiScanner.SIRP:
                ttype = 'th';
                break;
            default:throw this.mkError('SyntaxError: expected "|" or "!"');
        }
        this.getToken();
        var s = '<' + ttype;
        this.tablecolumnitem();
        var t = this.pstack.pop();
        if(t.length > 1){
            s += ' ' + t[0] + '>' + t[1];
            for(var i = 2;i < t.length;i++){
                s += '|' + t[i];
            }
            
        }
        else{
            s += '>' + t[0];
        }
        while(this.currentToken.id == WikiScanner.BISEPERATOR || this.currentToken.id == WikiScanner.BISIRP){
            s += '</' + ttype + '>';
            ttype = this.currentToken.id == WikiScanner.BISEPERATOR ? 'td' : 'th';
            this.getToken();
            this.tablecolumnitem();
            s += '<' + ttype;
            t = this.pstack.pop();
            if(t.length > 1){
                s += t[0] + '>' + t[1];
                for(var i = 2;i < t.length;i++){
                    s += '|' + t[i];
                } 
            }
            else{
                s += '>' + t[0];
            }
        }
        this.getToken(WikiScanner.NEWLINE);
        if(this.currentToken.id != WikiScanner.SEPERATOR 
        && this.currentToken.id != WikiScanner.SIRP
        && this.currentToken.id != WikiScanner.TABLEROW
        && this.currentToken.id != WikiScanner.TABLEEND){
            this.block();
            s += this.pstack.pop();
        }
        s += '</' + ttype + '>';
        this.pstack.push(s);
    }
    
    
    /**
     * tablecolumnitem() ->
     * sentence() ( '|' sentence() )* ['|']
     */
    Parser.prototype.tablecolumnitem = function(){
        var s = [];
        this.sentence();
        s.push(this.pstack.pop());
        out:
        while(this.currentToken.id == WikiScanner.SEPERATOR){
            this.getToken();
            switch(this.currentToken.id){
                case WikiScanner.STRING:
                case WikiScanner.BIQUOTE:
                case WikiScanner.TRIQUOTE:
                case WikiScanner.LINKSTART:
                case WikiScanner.EXLINKBEGIN:
                case WikiScanner.PLUGINSTART:
                    this.sentence();
                    s.push(this.pstack.pop());
                    break;
                default:
                    s.push('');
                    break out;                    
            }            
        }
        this.pstack.push(s);
    }
    
    
    /**
     * points() ->
     * ( '*' sentence() )+ [NEWLINE]
     */
    Parser.prototype.points = function(){
        var s = '<ul><li>';
        this.getToken();
        this.sentence();
        s += this.pstack.pop() + '</li>';
        while(this.currentToken.id == WikiScanner.STAR){
            this.getToken();
            this.sentence();
            s += '<li>' + this.pstack.pop() + '</li>';
        }
        if(this.currentToken.id == WikiScanner.NEWLINE)
            this.getToken();
        s += '</ul>';
        this.pstack.push(s);
    }
    
    /**
     * 
     */
    
    /**
     * exlink() ->
     * '[' STRING [ atom() ] ']'
     */
    Parser.prototype.exlink = function(){
        //this.pushState(WikiScanner.STFINDURL);
        this.getToken();
        //this.popState();
        var url = this.getToken(WikiScanner.STRING).image;
        switch(this.currentToken.id){
            case WikiScanner.STRING:
                this.atom();
                var name = this.pstack.pop();
                this.getToken(WikiScanner.EXLINKEND);
                this.pstack.push('<a class="' + this.options.exlinkClass + '" href="//' + url + '">' + name + '</a>');
                break;
            case WikiScanner.EXLINKEND:
                this.getToken();
                this.pstack.push('<a class="' + this.options.exlinkClass + '" href="//' + url + '">' + url + '</a>');
                break;
        }
    }
    
    /**
     * atom() ->
     * STRING+
     */
    Parser.prototype.atom = function(){
        var s = '';
        switch(this.currentToken.id){
            case WikiScanner.STRING:
                s += this.currentToken.image;
                this.getToken();
                break;
            default:throw this.mkError('SyntaxError: expected STRING');
        }
        out:
        while(true){
            switch(this.currentToken.id){
                case WikiScanner.STRING:
                    while(this.currentToken.id == WikiScanner.STRING){
                        s += ' ' + this.currentToken.image;
                        this.getToken();
                    }
                    break;
                default:break out;
            }
        }
        this.pstack.push(s);
    }
    
    //parser end===============================================
    
    Parser.Filenamespace = {
        run: function(args){
            var src = args[0];
            var caption = '';
            var type;
            var size;
            var caption = '';
            for(var i = 1;i < args.length;i++){
                if(args[i] == 'thumb'){
                    type = 'thumb';
                }
                else if(/[0-9]+px/.test(args[i])){
                    size = args[i].substr(0,args[i].length - 2);
                }
                else{
                    caption = args[i];
                }
            }
            switch(type){
                case 'thumb':
                    var s = '';
                    s += '<div class="' + this.options.outterDivClass + '"><div class="' + this.options.innerDivClass + '">';
                    s += '<a href="' + this.options.srcQueryPrefix + src + '" class="image">';
                    s += '<img src="' + this.options.srcPrefix + src + '" class="' + this.options.imgClass + '"';
                    s += size ? ' width="' + size + '"/>' : '/>';
                    s += '</a>';
                    s += '<div class="' + this.options.captionClass + '">' + caption + '</div>';
                    s += '</div></div>';
                    break;
                default:;
            }
            return s;
        },
        options: {
            srcPrefix : '/petit-interessant/pedia/img/',
            srcQueryPrefix : '/petit-interessant/pedia/?page=img&name=',
            outterDivClass : 'thumb tright',
            innerDivClass : 'thumbinner',
            captionClass : 'thumbcaption',
            imgClass : 'thumbimage'
        }
    };
    Parser.SiteSubPlugin = {
        run : function(marg,arrayarg,args){
            return '<div class="' + this.options.divClass + '">' + marg + '</div>';
        },
        options : {
            divClass : 'siteSub'
        }
    }
    
    a.Parser = Parser;
    
    return a;
})();
