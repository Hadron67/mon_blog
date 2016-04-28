---
title: 双曲镶嵌
type: "page"
date: 2016-04-09 01:02:18
keywords: 双曲空间,镶嵌,庞加莱圆盘
---
<canvas id="canvas1" height="500" width="500" style="background-color:#ffffff;width:60%" onmousedown="canvas1_onmousedown(event)" onmousemove="canvas1_onmousemove(event)" onmouseup="canvas1_onmouseup(event)">nocanvas!</canvas>
## draw polygonal tilings
每个顶点周围的多边形数：<input id="p" type="text" value="4" />
多边形边数：<input id="n" type="text" value="5" />
计算深度：<input id="deepth" type="text" value="4" />
<button onclick="draw('canvas1',p.value,n.value,deepth.value)">draw</button>
<button onclick="initdisc()">clear</button>

<script src="/programmes/mjs/complex.js"></script>
<script src="/programmes/mjs/hyperbolic.js"></script>
<script>
function canvas1_onmousedown(event){
	canvas1.move=true;
	canvas1.offsetx=event.clientX;
	canvas1.offsety=event.clientY;
}
function canvas1_onmousemove(event){
	if(canvas1.move){
		event.preventDefault();
		var dx=event.clientX-canvas1.offsetx;
		var dy=event.clientY-canvas1.offsety;
		canvas1.offsetx=event.clientX;
		canvas1.offsety=event.clientY;
		//alert("dx="+dx+" dy="+dy);
		canvas1.width=canvas1.width;
		ctx1.drawdisc();
		ctx1.hyperbolicmovepoints(dx/200,-dy/200);
		ctx1.drawinternallines();
	}
}
function canvas1_onmouseup(event){
	canvas1.move=false;
}
window.onload=function(){
	canvas1=document.getElementById("canvas1");
	ctx1=canvas1.getContext("2d");
	inithyperbolic(ctx1);
	ctx1.setScale(canvas1.height-1,canvas1.width-1);
	ctx1.drawdisc();
}
function initdisc(){
	canvas1.width=canvas1.width;
	ctx1.clearall();
	ctx1.drawdisc();
}
function draw(canvasid,p,n,deepth){
	canvas1.width=canvas1.width;
	initdisc();
	//ctx1.addpolygon(p,n);
	ctx1.hyperbolicdrawtile(p,n,deepth);
	//ctx1.addpolygon(7,6);
	//ctx1.lines.push(ctx1.lines[0].circularinverse(ctx1.lines[3]));
	ctx1.drawinternallines();
}
</script>

## 说明
* 这个圆盘称为庞加莱圆盘，
* 输入参数后点击draw即可绘制。
* 可以用鼠标拖动镶嵌。
