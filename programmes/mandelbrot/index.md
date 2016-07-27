---
title: Julia集合与Mandelbrot集合
type: "page"
date: 2016-05-27 21:40:18
---
<style>canvas{border:1px solid rgb(238, 238, 238);background-color: rgb(230, 230, 230);}/*button{outline:none;border:none;background-color:#CC33FF;padding:2px 4px;}*/</style>
<table><tr><td><canvas height="330" width="330" id="canvas1"></canvas></td><td><canvas height="330" width="330" id="canvas2"></canvas></td></tr><tr><td><div style="margin:10px;"><div><button id="draw" onclick="Fractal.updateValues();Fractal.drawMandelbrolt();Fractal.drawJulia(true)">绘制</button>C=<input type="text" value="0" id="cx" />+<input type="text" value="0" id="cy" />\*i<button id="btn_select">取点</button></div><div>迭代次数=<input id="inp_precision" type="text" value="200" /><button id="btn_JAnimation" >颜色动画</button></div><div><button onclick="Fractal.JuliaTimes*=1.1;Fractal.drawJulia(true);">+</button><button onclick="Fractal.JuliaTimes/=1.1;Fractal.drawJulia(true);">-</button><button onclick="Fractal.JuliaTimes=1;Fractal.drawJulia(true);" >X1</button><input type="checkbox" style="width:20px" onclick="Fractal.realTimeDrawing=!this.checked;"/>关闭实时绘制<div>指数<input id='power' type='text' value='2'></div></div></div></td><td>迭代次数=<input id="inp_precision2" type="text" value="200" /><button id="btn_MAnimation" >颜色动画</button><button id="m_plus" onclick="Fractal.MandelbrotTime*=1.1;Fractal.drawMandelbrolt();">+</button><button id="m_minus" onclick="Fractal.MandelbrotTime/=1.1;Fractal.drawMandelbrolt();">-</button><button id="m_un" onclick="Fractal.MandelbrotTime=1;Fractal.drawMandelbrolt();">X1</button><div>颜色方案</div><div><input type='radio' name='color-method' id='trifunc' onclick='Fractal.cmethod = 0;'>三角函数</div><div><input type='radio' name='color-method' id='trifunc-smooth' onclick='Fractal.cmethod = 1;'>三角函数（光滑）</div><div><input type='radio' name='color-method' id='trifunc-smooth' onclick='Fractal.cmethod = 2;'>三角不等式（暂时还不行）</div></td></tr></table>

## 四维Mandelbrot集合
<table><tr><td><canvas height="330" width="330" id="canvas3"></canvas></td><td><div style="margin:10px;"><button onclick='Fractal.updateValues();Fractal.drawM4d()'>绘制</button><div>phi=<input type='text' id='phi' value='0'/></div><div>theta=<input type='text' id='theta' value='0'/></div><div>alpha=<input type='text' id='alpha' value='0'/></div><div>x=<input id='m4d_x' type='text' value='0'/>y=<input id='m4d_y' type='text' value='0'/></div><div>z=<input id='m4d_z' type='text' value='0'/>t=<input id='m4d_t' type='text' value='0'/></div><div><button id='animation1'>变换动画</button></div><div><button id="m4d_plus" onclick="Fractal.M4dTimes*=1.1;Fractal.drawM4d();">+</button><button id="m4d_minus" onclick="Fractal.M4dTimes/=1.1;Fractal.drawM4d();">-</button><button id="m4d_un" onclick="Fractal.M4dTimes=1;Fractal.drawM4d();">X1</button></div></div></td></tr></table>

## 说明
* 可以去看一下我的[这篇](/2016/05/30/julia-fractal/)介绍这两种分形的文章。
* 可以用鼠标拖动分形，点旁边的+,-可以放大或缩小，当放大倍数比较大的时候可能需要增大迭代次数。
* 可以计算任意指数的Multibrot集合，只需要改“指数”即可，但其他指数的计算速度比较慢。
* 点击取点可以在Mandelbrot集合里面取c值然后画出对应的Julia集合。firefox上的这个功能有点问题，我暂时没做浏览器兼容。
* 下面四维Mandelbrot集合中的三个角度参数分别是截面与Oxy面的最大角与最小角，还有自转角，xyzt是这个面过的点。
* 点“变换动画”可以看截面从Oxy转到Ozt上时截到的图形的变换动画，即Julia集合到Mandelbrot集合的过渡动画。
<script>
window.Fractal=(function(){
	'use strict';
	var a={};
	var $ = function(id){
	    return document.getElementById(id);
	}
	var btn_select=$("btn_select");
	var btn_JAnimation=$("btn_JAnimation");
	var btn_MAnimation=$("btn_MAnimation");
	var inp_precision=$("inp_precision");
	var inp_precision2=$("inp_precision2");
	var canvas1=$('canvas1');
	var canvas2=$('canvas2');
	var canvas3 = $('canvas3');
	var cx=$("cx");
	var cy=$("cy");
	var ctx1=canvas1.getContext("2d");
	var ctx2=canvas2.getContext("2d");
	var ctx3 = canvas3.getContext('2d');
	var phase1=3.14/3;
	var phase2=3.14*4/3;
	var phase3=0;
	var phase4=3.14/3;
	var phase5=3.14*4/3;
	var phase6=0;
	a.cmethod = 0;
	var getC_julia = function(x,y,cx,cy,imgdata,index){
	    switch(a.cmethod){
	        case 0:
    	        getC1(x,y,cx,cy,a.JuliaPrecision,imgdata,index,false);
                break;
            case 1:
    	        getC1(x,y,cx,cy,a.JuliaPrecision,imgdata,index,true);
                break;
            case 2:
    	        getC2(x,y,cx,cy,a.JuliaPrecision,imgdata,index);
                break;
            default:;           
	    }
	}
	var getC_mandelbrot = function(x,y,cx,cy,imgdata,index){
	    switch(a.cmethod){
	        case 0:
    	        getC1(x,y,cx,cy,a.MandelbrotPrecision,imgdata,index,false);
                break;
	        case 1:
    	        getC1(x,y,cx,cy,a.MandelbrotPrecision,imgdata,index,true);
                break;
            case 2:
    	        getC2(x,y,cx,cy,a.JuliaPrecision,imgdata,index);
                break;
            default:;           
	    }
	}
	var getC_m4d = function(x,y,imgdata,index){
	    var x2 = x * Math.cos(a.phi);
	    var y2 = y * Math.cos(a.theta);
	    var z2 = x * Math.sin(a.phi);
	    var t2 = y * Math.sin(a.theta);
	    
	    var x1 = x2 + a.M4doriginale[0];
	    var y1 = y2 + a.M4doriginale[1];
	    var z1 = z2 * Math.cos(a.alpha) - t2 * Math.sin(a.alpha) + a.M4doriginale[2];
	    var t1 = z2 * Math.sin(a.alpha) - t2 * Math.cos(a.alpha) + a.M4doriginale[3];
	    switch(a.cmethod){
	        case 0:
    	        getC1(x1,y1,z1,t1,a.M4dPrecision,imgdata,index,false);
                break;
	        case 1:
    	        getC1(x1,y1,z1,t1,a.M4dPrecision,imgdata,index,true);
                break;
            case 2:
    	        getC2(x,y,cx,cy,a.JuliaPrecision,imgdata,index);
                break;
            default:;           
	    }
	}
	var getC1=function(x,y,cx,cy,precision,imgdata,index,smooth){
		for(var k=0;k < precision;k++){
		    if(a.power == 2){
			    var x1=x;
			    x=x*x-y*y+cx;
			    y=2*x1*y+cy;
			}
			else{
			    var module = Math.pow(x * x + y * y,a.power / 2);
			    var argument = Math.atan2(y,x) * a.power;
			    x = module * Math.cos(argument) + cx;
			    y = module * Math.sin(argument) + cy;
			}
			if(x*x+y*y>4){
			    if(smooth){
			        var log_zn = Math.log( x*x + y*y ) / 2;
                    var nu = Math.log( log_zn / Math.log(2) ) / Math.log(2);
                    k += 1 - nu;
                }
				imgdata.r += 127*(Math.sin(k+phase3)+1);
				imgdata.g += 127*(Math.sin(k+phase1)+1);
				imgdata.b += 127*(Math.sin(k+phase2)+1);
				imgdata.a += 255;
				return;
			}
		}
		imgdata.r += 0;
		imgdata.g += 0;
		imgdata.b += 0;
		imgdata.a += 255;
	}
    var getC2=function(x,y,cx,cy,precision,imgdata,index){
        var zn2 = [0,0];
        var zn1 = [0,0];
        var zn = [x,y];
        var colo = {r : 0,g : 0,b : 0};
		for(var k=0;k < precision;k++){
		    if(a.power == 2){
			    var x1=x;
			    x=x*x-y*y+cx;
			    y=2*x1*y+cy;
			}
			else{
			    var module = Math.pow(x * x + y * y,a.power / 2);
			    var argument = Math.atan2(y,x) * a.power;
			    x = module * Math.cos(argument) + cx;
			    y = module * Math.sin(argument) + cy;
			}
			zn2[0] = zn1[0];zn2[1] = zn1[1];
			zn1[0] = zn[0];zn1[1] = zn[1];
			zn[0] = x;zn[1] = y;
			if(x*x+y*y>4){
			    var A = Math.sqrt((zn[0] - zn2[0]) * (zn[0] - zn2[0]) + (zn[1] - zn2[1]) * (zn[1] - zn2[1]));
			    var B = Math.sqrt((zn[0] - zn1[0]) * (zn[0] - zn1[0]) + (zn[1] - zn1[1]) * (zn[1] - zn1[1]));
			    var C = Math.sqrt((zn2[0] - zn1[0]) * (zn2[0] - zn1[0]) + (zn2[1] - zn1[1]) * (zn2[1] - zn1[1]));
			    var mo = A / (B + C);
			    hsb2rgb(mo * 360,1,1,colo);
				imgdata.r += colo.r;
				imgdata.g += colo.g;
				imgdata.b += colo.b;
				imgdata.a += 255;
				return;
			}
		}
		imgdata.r += 0;
		imgdata.g += 0;
		imgdata.b += 0;
		imgdata.a += 255;
	}
	var clearColor = function(imgdata,index){
	    imgdata.data[index] = 0;
	    imgdata.data[index + 1] = 0;
	    imgdata.data[index + 2] = 0;
	    imgdata.data[index + 3] = 0;
	}
	/*
	var getC2=function(x,y,cx,cy,imgdata,index,smooth){
		for(var k=0;k<a.MandelbrotPrecision;k++){
			var x1=x;
			x=x*x-y*y+cx;
			y=2*x1*y+cy;
			if(x*x+y*y>4){
			    if(smooth){
			        var log_zn = Math.log( x*x + y*y ) / 2;
                    var nu = Math.log( log_zn / Math.log(2) ) / Math.log(2);
                    k += 1 - nu;
                }
				imgdata.r += 127*(Math.sin(k+phase6)+1);
				imgdata.g += 127*(Math.sin(k+phase4)+1);
				imgdata.b += 127*(Math.sin(k+phase5)+1);
				imgdata.a += 255;
				return;
			}
		}
		imgdata.r += 0;
		imgdata.g += 0;
		imgdata.b += 0;
		imgdata.a += 255;
	}
	*/
	a.Animation1==undefined;
	//parametres
	a.power = 2;
	a.JuliaCentreX=0;
	a.JuliaCentreY=0;
	a.JuliaCX=0;
	a.JuliaCY=0;
	a.JuliaTimes=1;
	a.JuliaPrecision=200;
	a.MandelbrotCentreX=0;
	a.MandelbrotCentreY=0;
	a.MandelbrotTime=1;
	a.MandelbrotPrecision=200;
	a.M4dTimes = 1;
	a.M4dPrecision = 200;
	a.phi = 0;
	a.theta = 0;
	a.alpha = 0;
	a.M4dCentreX = 0;
	a.M4dCentreY = 0;
	a.M4doriginale = [0,0,0,0];
	a.realTimeDrawing=true;
	a.M4danimation = undefined;
	//states
	var isSelecting=false;
	var dragMandelbrot=false;
	var dragJulia=false;
	var dragM4d = false;
	var tempX=0;
	var tempY=0;
	var tempdata=undefined;
	a.updateValues=function(){
		a.JuliaCX=Number(cx.value);
		a.JuliaCY=Number(cy.value);
		a.JuliaPrecision=Number(inp_precision.value);
		a.MandelbrotPrecision=Number(inp_precision2.value);
		a.power = Number($('power').value);
		a.phi = Number($('phi').value);
		a.theta = Number($('theta').value);
		a.alpha = Number($('alpha').value);
		a.M4doriginale[0] = Number($('m4d_x').value);
		a.M4doriginale[1] = Number($('m4d_y').value);
		a.M4doriginale[2] = Number($('m4d_z').value);
		a.M4doriginale[3] = Number($('m4d_t').value);
	}
	a.drawJulia=function(antialias){
	    canvas1.width = canvas1.width;
		var imgdata=ctx1.getImageData(0,0,canvas1.width,canvas1.height);
		var dx = 3 / canvas1.width / a.JuliaTimes / 4;
		for(var i = 0;i < canvas1.height;i++){
			for(var j = 0;j < canvas1.width;j++){
				var index = 4 * (i * canvas1.width + j);
				var c = {r : 0,g : 0,b : 0,a : 0};
				var x=(j / canvas1.width - 0.5) * 3 / a.JuliaTimes + a.JuliaCentreX;
				var y=-(i / canvas1.height - 0.5) * 3 / a.JuliaTimes + a.JuliaCentreY;
				if(antialias){
				    getC_julia(x + dx,y + dx,a.JuliaCX,a.JuliaCY,c,index);
				    getC_julia(x - dx,y - dx,a.JuliaCX,a.JuliaCY,c,index);
				    getC_julia(x - dx,y + dx,a.JuliaCX,a.JuliaCY,c,index);
				    getC_julia(x + dx,y - dx,a.JuliaCX,a.JuliaCY,c,index);
				    imgdata.data[index] = c.r / 4;
				    imgdata.data[index + 1] = c.g / 4;
				    imgdata.data[index + 2] = c.b / 4;
				    imgdata.data[index + 3] = 255;
				}
				else{
				    getC_julia(x,y,a.JuliaCX,a.JuliaCY,c,index);
				    imgdata.data[index] = c.r;
				    imgdata.data[index + 1] = c.g;
				    imgdata.data[index + 2] = c.b;
				    imgdata.data[index + 3] = 255;
				}
			}
		}
		ctx1.putImageData(imgdata,0,0);
	}
	
	a.drawMandelbrolt=function(){
	    canvas2.width = canvas2.width;
		var imgdata=ctx2.getImageData(0,0,canvas2.width,canvas2.height);
		var dx = 3 / canvas1.width / a.MandelbrotTime / 4;
		for(var i=0;i<canvas2.height;i++){
			for(var j=0;j<canvas2.width;j++){
				var index=4*(i*canvas2.width+j);
				var co = {r : 0,g : 0,b : 0,a : 0};
				var x=(j/canvas2.width-0.5)*3/a.MandelbrotTime+a.MandelbrotCentreX;
				var y=-(i/canvas2.height-0.5)*3/a.MandelbrotTime+a.MandelbrotCentreY;
				//antialias
				getC_mandelbrot(0,0,x + dx,y + dx,co,index);
				getC_mandelbrot(0,0,x - dx,y - dx,co,index);
				getC_mandelbrot(0,0,x - dx,y + dx,co,index);
				getC_mandelbrot(0,0,x + dx,y - dx,co,index);
				imgdata.data[index] = co.r / 4;
				imgdata.data[index + 1] = co.g / 4;
				imgdata.data[index + 2] = co.b / 4;
				imgdata.data[index + 3] = 255;
			}
		}
		ctx2.putImageData(imgdata,0,0);
	}
	a.drawM4d = function(){
	    canvas3.width = canvas3.width;
		var imgdata=ctx3.getImageData(0,0,canvas3.width,canvas3.height);
		var dx = 3 / canvas3.width / a.M4dTimes / 4;
		for(var i=0;i<canvas3.height;i++){
			for(var j=0;j<canvas3.width;j++){
				var index=4*(i*canvas3.width+j);
				var co = {r : 0,g : 0,b : 0,a : 0};
				var x=(j/canvas3.width-0.5)*3/a.M4dTimes+a.M4dCentreX;
				var y=-(i/canvas3.height-0.5)*3/a.M4dTimes+a.M4dCentreY;
				//antialias
				getC_m4d(x + dx,y + dx,co,index);
				getC_m4d(x - dx,y - dx,co,index);
				getC_m4d(x - dx,y + dx,co,index);
				getC_m4d(x + dx,y - dx,co,index);
				imgdata.data[index] = co.r / 4;
				imgdata.data[index + 1] = co.g / 4;
				imgdata.data[index + 2] = co.b / 4;
				imgdata.data[index + 3] = 255;
			}
		}
		ctx3.putImageData(imgdata,0,0);
	}
	btn_JAnimation.onclick=function(){
		if(a.Animation1==undefined){
			a.Animation1=window.setInterval(function(){
				if(!dragJulia && !dragMandelbrot){
					phase1+=0.1;
					if(phase1>=2*3.14){
						phase1-=2*3.14;
					}
					phase2+=0.1;
					if(phase2>=2*3.14){
						phase2-=2*3.14;
					}
					phase3+=0.1;
					if(phase3>=2*3.14){
						phase3-=2*3.14;
					}
					a.drawJulia(true);
				}
				
			},100);
		}
		else {
			window.clearInterval(a.Animation1);
			a.Animation1=undefined;
			phase1=3.14/3;
			phase2=3.14*4/3;
			phase3=0;
			a.drawJulia(true);
		}
	}
	btn_MAnimation.onclick=function(){
		if(a.Animation2==undefined){
			a.Animation2=window.setInterval(function(){
				if(!dragJulia && !dragMandelbrot){
					phase4+=0.1;
					if(phase4>=2*3.14){
						phase4-=2*3.14;
					}
					phase5+=0.1;
					if(phase5>=2*3.14){
						phase5-=2*3.14;
					}
					phase6+=0.1;
					if(phase6>=2*3.14){
						phase6-=2*3.14;
					}
					a.drawMandelbrolt();
				}
				
			},100);
		}
		else {
			window.clearInterval(a.Animation2);
			a.Animation2=undefined;
			phase4=3.14/3;
			phase5=3.14*4/3;
			phase6=0;
			a.drawMandelbrolt();
		}
	}
	$('animation1').onclick = function(){
	    if(a.M4danimation == undefined){
	        var n = 20,i = 0;
	        a.updateValues();
	        a.M4danimation = window.setInterval(function(){
	            if(i >= n){
	                window.clearInterval(a.M4danimation);
	                a.M4danimation = undefined;
	                a.updateValues();
	                a.drawM4d();
	            }
	            a.phi = Math.PI * i / n;
	            a.theta = a.phi;
	            a.drawM4d();
	            i++;
	        },100);
	    }
	    else{
	        window.clearInterval(a.M4danimation);
	        a.M4danimation = undefined;
	        a.updateValues();
	        a.drawM4d();
	    }
	}
	btn_select.onclick=function(){
		btn_select.disabled=true;
		isSelecting=true;
	}
	canvas2.onmousemove=function(event){
		event.preventDefault();
		if(isSelecting){
			a.JuliaCX=((event.offsetX-canvas2.offsetLeft)/canvas2.width-0.5)*3/a.MandelbrotTime+a.MandelbrotCentreX;
			a.JuliaCY=-((event.offsetY-canvas2.offsetTop)/canvas2.height-0.5)*3/a.MandelbrotTime+a.MandelbrotCentreY;
			cx.value=a.JuliaCX;
			cy.value=a.JuliaCY;
			if(a.realTimeDrawing) a.drawJulia(false);
		}
		else if(dragMandelbrot){
			canvas2.width=canvas2.width;
			ctx2.putImageData(tempdata,event.clientX-canvas2.offsetLeft-tempX,event.clientY-canvas2.offsetTop-tempY);
		}
	}
	canvas2.onclick=function(event){
		if(isSelecting){
			isSelecting=false;
			btn_select.disabled=false;
			a.JuliaCX=((event.offsetX-canvas2.offsetLeft)/canvas2.width-0.5)*3/a.MandelbrotTime+a.MandelbrotCentreX;
			a.JuliaCY=-((event.offsetY-canvas2.offsetTop)/canvas2.height-0.5)*3/a.MandelbrotTime+a.MandelbrotCentreY;
			cx.value=a.JuliaCX;
			cy.value=a.JuliaCY;
			a.drawJulia(true);
		}
	}
	canvas2.onmousedown=function(event){
		event.preventDefault();
		if(!isSelecting){
			tempX=event.clientX-canvas2.offsetLeft;
			tempY=event.clientY-canvas2.offsetTop;
			tempdata=ctx2.getImageData(0,0,canvas2.width,canvas2.height);
			dragMandelbrot=true;
		}
	}
	canvas2.onmouseup=function(event){
		event.preventDefault();
		if(dragMandelbrot){
			dragMandelbrot=false;
			a.MandelbrotCentreX-=(event.clientX-canvas2.offsetLeft-tempX)/canvas2.width*3/a.MandelbrotTime;
			a.MandelbrotCentreY+=(event.clientY-canvas2.offsetTop-tempY)/canvas2.height*3/a.MandelbrotTime;
			a.drawMandelbrolt();
		}
	}
	canvas1.onmousedown=function(event){
		event.preventDefault();
		tempX=event.clientX-canvas1.offsetLeft;
		tempY=event.clientY-canvas1.offsetTop;
		tempdata=ctx1.getImageData(0,0,canvas1.width,canvas1.height);
		dragJulia=true;
	}
	canvas1.onmousemove=function(event){
		event.preventDefault();
		if(dragJulia){
			canvas1.width=canvas1.width;
			ctx1.putImageData(tempdata,event.clientX-canvas1.offsetLeft-tempX,event.clientY-canvas1.offsetTop-tempY);
		}
	}
	canvas1.onmouseup=function(event){
		event.preventDefault();
		if(dragJulia){
			dragJulia=false;
			a.JuliaCentreX-=(event.clientX-canvas1.offsetLeft-tempX)/canvas1.width*3/a.JuliaTimes;
			a.JuliaCentreY+=(event.clientY-canvas1.offsetTop-tempY)/canvas1.height*3/a.JuliaTimes;
			a.drawJulia(true);
		}
	}
	
	canvas3.onmousedown=function(event){
		event.preventDefault();
		tempX=event.clientX-canvas3.offsetLeft;
		tempY=event.clientY-canvas3.offsetTop;
		tempdata=ctx3.getImageData(0,0,canvas1.width,canvas1.height);
		dragM4d=true;
	}
	canvas3.onmousemove=function(event){
		event.preventDefault();
		if(dragM4d){
			canvas3.width=canvas3.width;
			ctx3.putImageData(tempdata,event.clientX-canvas1.offsetLeft-tempX,event.clientY-canvas1.offsetTop-tempY);
		}
	}
	canvas3.onmouseup=function(event){
		event.preventDefault();
		if(dragM4d){
			dragM4d=false;
			a.M4dCentreX-=(event.clientX-canvas3.offsetLeft-tempX)/canvas3.width*3/a.M4dTimes;
			a.M4dCentreY+=(event.clientY-canvas3.offsetTop-tempY)/canvas3.height*3/a.M4dTimes;
			a.drawM4d();
		}
	}
	var hsb2rgb = function(h,s,v,re){
        var r = 0, g = 0, b = 0;  
        var i = Math.floor((h / 60) % 6);  
        var f = (h / 60) - i;  
        var p = v * (1 - s);  
        var q = v * (1 - f * s);  
        var t = v * (1 - (1 - f) * s);  
        switch (i) {  
        case 0:  
            r = v;  
            g = t;  
            b = p;  
            break;  
        case 1:  
            r = q;  
            g = v;  
            b = p;  
            break;  
        case 2:  
            r = p;  
            g = v;  
            b = t;  
            break;  
        case 3:  
            r = p;  
            g = q;  
            b = v;  
            break;  
        case 4:  
            r = t;  
            g = p;  
            b = v;  
            break;  
        case 5:  
            r = v;  
            g = p;  
            b = q;  
            break;  
        default:  
            break;  
        }
        re.r = Math.floor(r * 255);
        re.g = Math.floor(g * 255); 
        re.b = Math.floor(b * 255);
    }
	return a;
})();
</script>
