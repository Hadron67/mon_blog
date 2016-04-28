---
title: 迷宫生成器
type: "page"
date: 2016-04-09 01:02:18
keywords: 迷宫,算法,迷宫生成算法
---
<canvas id="canvas1" width="100" height="100"></canvas>
## 控制台
宽度：<input type="text" id="text_width" value="30" size="10"/>
高度：<input type="text" id="text_height" value="30" size="10px"/>
<button id="btn_draw">生成</button>
<button id="btn_solve">求解</button>
### 算法选择
***
* <input type="radio" name="algorithm" value="Depth-first" />深度优先
* <input type="radio" name="algorithm" value="Kruskal" />克鲁卡算法
* <input type="radio" name="algorithm" value="Recursive-division" />递归分割

<input type="checkbox" id="chk_vis"/>查看生成过程

<script src="/programmes/mjs/maze.js"></script>
<script>
void function(){
	var m = undefined;
	var interval = undefined;
	var $ = function(id)
	{
		return document.getElementById(id);
	}
	var enabledrag = function(handle,obj)
	{
		var x0 = 0;
		var y0 = 0;
		var draging = false;
		handle.onmousedown = function(event)
		{
			x0 = event.clientX - obj.offsetLeft;
			y0 = event.clientY - obj.offsetTop;
			draging = true;
		}
		handle.onmousemove = function(event)
		{
			if(draging)
			{
				obj.style.left = (event.clientX - x0) -10 + 'px';
				obj.style.top  = (event.clientY - y0) -10 + 'px';
			}
		}
		handle.onmouseup = function(event)
		{
			x0 = 0;
			y0 = 0;
			draging = false;
		}
	}
	window.onload = function()
	{
		$('btn_draw').onclick = function()
		{
			if(interval != undefined) window.clearInterval(interval);
			var options = document.getElementsByName('algorithm');
			for(var i = 0;i < options.length;i++)
			{
				if(options[i].checked)
				{
					$('canvas1').width = Number($('text_height').value) * 10;
					$('canvas1').height = Number($('text_width').value) * 10;
					m = new Maze.WallMaze2D(Number($('text_height').value),Number($('text_width').value));
					if($('chk_vis').checked)
					{
						interval = m.GenerateAnimation(options[i].value,10,$('canvas1'));
					}
					else
					{
						m.Generate(options[i].value);
					}
					$('canvas1').width = $('canvas1').width;
					m.draw($('canvas1'));
				}
			}
			
		}
		$('btn_solve').onclick = function()
		{
			if(m == undefined) return;
			$('canvas1').width = $('canvas1').width;
			m.draw($('canvas1'));
			m.drawSolution($('canvas1'),m.getSolution({x : 0 , y : 0},{x : m.getWidth() - 1 , y : m.getHeight() - 1}));
		}
		enabledrag($('controller-handle'),$('controller'));
	}
}();
</script>
