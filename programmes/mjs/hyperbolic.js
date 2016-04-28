function line(x0,y0,x1,y1){
	this.p1=new Complex(x0,y0);
	this.p2=new Complex(x1,y1);
	this.a=(2*y1+2*x0*x0*y1+2*y0*y0*y1-2*y0-2*y0*x1*x1-2*y1*y1*y0)/(4*x0*y1-4*x1*y0);
	this.b=(2*x0+2*x0*x1*x1+2*x0*y1*y1-2*x1-2*x1*x0*x0-2*x1*y0*y0)/(4*x0*y1-4*x1*y0);
	this.r=Math.sqrt(this.a*this.a+this.b*this.b-1);
	this.circularinverse=function(l){
		var x0=this.p1.re;
		var y0=this.p1.im;
		var x1=this.p2.re;
		var y1=this.p2.im;
		var R1=Math.sqrt((l.a-x0)*(l.a-x0)+(l.b-y0)*(l.b-y0));
		var R2=Math.sqrt((l.a-x1)*(l.a-x1)+(l.b-y1)*(l.b-y1));
		var x2,y2,x3,y3;
		x2=l.a+(x0-l.a)*l.r*l.r/R1/R1;
		y2=l.b+(y0-l.b)*l.r*l.r/R1/R1;
		x3=l.a+(x1-l.a)*l.r*l.r/R2/R2;
		y3=l.b+(y1-l.b)*l.r*l.r/R2/R2;
		return new line(x2,y2,x3,y3);
	}
}
// ctx.moveTo  ctx.lineTo  ctx.stroke must be defined.
function inithyperbolic(ctx){
	var points=[];
	var lines=[];
	var addlinex;
	var addliney;
	//must implement obj.draw
	var otherobjects=[];
	var clonearray=function(a){
		var len=a.length;
		var o=[];
		for(var i=0;i<len;i++){
			o.push(a[i]);
		}
		return o;
	}
	ctx.setScale=function(height,width){
		this.height=height;
		this.width=width;
	}
	ctx.drawdisc=function(){
		this.strokeStyle="blue";
		this.moveTo(this.width,this.height/2);
		for(var theta=0;theta<Math.PI*2+0.5;theta+=0.1){
			var x2=Math.cos(theta);
			var y2=Math.sin(theta);
			this.lineTo(this.width*(x2+1)/2,this.height*(-y2+1)/2);
		}
		this.stroke();
	}
	ctx.hyperbolicmoveTo=function(x,y){
		this.x0=x;
		this.y0=y;
	}
	ctx.hyperboliclineTo=function(x1,y1){
		this.strokeStyle="blue";
		var x0=this.x0;
		var y0=this.y0;
		var a=(2*y1+2*x0*x0*y1+2*y0*y0*y1-2*y0-2*y0*x1*x1-2*y1*y1*y0)/(4*x0*y1-4*x1*y0);
		var b=(2*x0+2*x0*x1*x1+2*x0*y1*y1-2*x1-2*x1*x0*x0-2*x1*y0*y0)/(4*x0*y1-4*x1*y0);
		var r=Math.sqrt(a*a+b*b-1);
		if(r>100){
			//this means this hyperbolic line is a straight line.
			this.moveTo(this.width*(x0+1)/2,this.height*(-y0+1)/2);
			this.lineTo(this.width*(x1+1)/2,this.height*(-y1+1)/2);
			return;
		}
		var alpha=Math.acos(((x0-a)*(x1-a)+(y0-b)*(y1-b))/Math.sqrt((x0-a)*(x0-a)+(y0-b)*(y0-b))/Math.sqrt((x1-a)*(x1-a)+(y1-b)*(y1-b)));
		this.moveTo(this.width*(x0+1)/2,this.height*(-y0+1)/2);
		for(var i=0;i<=200;i++){
			var theta=alpha*i/200;
			var x2=((x0-a)*Math.sin(alpha-theta)+(x1-a)*Math.sin(theta))/Math.sin(alpha)+a;
			var y2=((y0-b)*Math.sin(alpha-theta)+(y1-b)*Math.sin(theta))/Math.sin(alpha)+b;
			this.lineTo(this.width*(x2+1)/2,this.height*(-y2+1)/2);
		}
		this.hyperbolicmoveTo(x1,y1);
	}
	ctx.addpolygon=function(p,n){
		var r=Math.cos(Math.PI/n+Math.PI/p)/Math.sqrt(Math.cos(Math.PI/p)*Math.cos(Math.PI/p)-Math.sin(Math.PI/n)*Math.sin(Math.PI/n));
		var theta;
		for(var i=0;i<n;i++){
			theta=2*i*Math.PI/n;
			this.addmoveto(r*Math.cos(theta),r*Math.sin(theta));
			this.addlineto(r*Math.cos(theta+2*Math.PI/n),r*Math.sin(theta+2*Math.PI/n));
		}
	}
	ctx.drawinternallines=function(){
		for(var i=0;i<lines.length;i++){
			this.hyperbolicmoveTo(lines[i].p1.re,lines[i].p1.im);
			this.hyperboliclineTo(lines[i].p2.re,lines[i].p2.im);
		}
		this.stroke();
	}
	ctx.addline=function(x0,y0,x1,y1){
		//this.lines.push(new Complex(x0,y0));
		//this.lines.push(new Complex(x1,y1));
		lines.push(new line(x0,y0,x1,y1));
	}
	ctx.addmoveto=function(x,y){
		addlinex=x;
		addliney=y;
	}
	ctx.addlineto=function(x,y){
		this.addline(addlinex,addliney,x,y);
		this.addmoveto(x,y);
	}
	ctx.transform=function(transformfunc){
		for(var i=0;i<this.lines.length;i++){
			lines[i].p1=transformfunc(this.lines[i].p1);
			lines[i].p2=transformfunc(this.lines[i].p2);
		}
	}
	ctx.hyperbolicmovepoints=function(tx,ty){
		var k=1/Math.sqrt(1-tx*tx-ty*ty);
		var a=new Complex(k,0);
		var b=new Complex(k*tx,k*ty);
		for(var i=0;i<lines.length;i++){
			lines[i].p1=Complex.mobius(lines[i].p1,a,b);
			lines[i].p2=Complex.mobius(lines[i].p2,a,b);
		}
	}
	ctx.hyperbolicdrawtile=function(p,n,deepth){
		this.addpolygon(p,n);
		var length=lines.length;
		var temp=[];
		for(var i=length-n;i<length;i++){
			temp.push(clonearray(lines));
		}
		var polygons=[clonearray(lines)];
		for(var i=0;i<deepth;i++){
			//var len=this.lines.length;
			var len1=polygons.length;
			var polygons2=[];
			for(var j=0;j<len1;j++){
				var len=polygons[j].length;
				for(var k=0;k<len;k++){
					var polygon=[];	
					if(polygons[j][k].marked!=undefined||polygons[j][k].r>100) continue;
					for(var l=0;l<len;l++){
						var line=polygons[j][l].circularinverse(polygons[j][k]);
						//polygon.push(polygons[j][l].circularinverse(polygons[j][k]));
						if(k==l){
							line.marked=1;
						}
						polygon.push(line);
						if(line.marked==undefined) {
							lines.push(line);
						}
					}
					polygons2.push(polygon);
				}
			}
			polygons=clonearray(polygons2);
		}
	}
	ctx.removelines=function(){
		lines=[];
	}
	ctx.removeobjects=function(){
		otherobjects=[];
	}
	ctx.addobject=function(o){
		otherobjects.push(o);
	}
	ctx.drawobjects=function(){
		for(var i=0;i<otherobjects.length;i++){
			if(otherobjects[i].draw!=undefined) otherobjects[i].draw(this);
		}
	}
	ctx.clearall=function(){
		lines=[];
		otherobjects=[];
	}
	ctx.drawall=function(){
		this.drawinternallines();
		this.drawobjects();
	}
}
