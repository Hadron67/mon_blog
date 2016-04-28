---
title: Mathematica类似物
type: "page"
date: 2016-04-19 15:44:18
---
<div id='math-output'></div>
<input id='minput' type='text' />
<button id='btn_run'>运行</button>
## 更新日志
### 2016-4-28
大改动，把数值运算改成了符号运算，目前只实现了'+'，'-'，立即赋值（'='），延迟赋值（':='），还不能合并同类项。
### 2016-4-19
复数基本运算已实现。
<script src="/programmes/mjs/compile.js" type="text/javascript"></script>
<script type="text/javascript">
(function(){
  'use strict';
  var $ = function(id){
    return document.getElementById(id);
  }
  Compiler.setLanguage('Mathematica');
  var count = 1;
  $('btn_run').onclick = function(){
    var result = '';
    try{
      result = MathRun.Run(Compiler.compile($('minput').value)).toString();
    }
    catch(e){
      result = '<span style="color:#ff0000">' + e.toString() + '</span>';
    }
    $('math-output').innerHTML += '<p><span style="color:#0000ff">In[' + count + ']:=</span>' + $('minput').value + '</p>';
    $('math-output').innerHTML += '<p><span style="color:#0000ff">Out[' + count + ']=</span>' + result + '</p>';
    count++;
  }
})();
</script>
