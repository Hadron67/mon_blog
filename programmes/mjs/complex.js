if(Math.sinh == undefined)
  Math.sinh = function(a){
    return (Math.exp(a) - Math.exp(-a)) / 2;
  }
if(Math.cosh == undefined)
  Math.cosh = function(a){
    return (Math.exp(a) + Math.exp(-a)) / 2;
  }
﻿function Complex(a,b){
  this.re=a;
  this.im=b;
}
Complex.prototype.c=function(){
  return new Complex(this.re,-this.im);
}
Complex.prototype.neg = function(){
  return new Complex(-this.re,-this.im);
}
Complex.prototype.abs=function(){
  return Math.sqrt(this.re*this.re+this.im*this.im);
}
Complex.prototype.invert = function(){
  if(this === Complex.ComplexInfinity){
    return new Complex(0,0);
  }
  else {
    var r = this.re * this.re + this.im * this.im;
    return new Complex(this.re / r,-this.im / r);
  }
}
Complex.prototype.rotate=function(a){
  var x=this.re*Math.cos(a)-this.im*Math.sin(a);
  var y=this.re*Math.sin(a)+this.im*Math.cos(a);
  return new Complex(x,y);
}
Complex.prototype.hyperbolicT=function(p){
  var k2=1/(1-p.re*p.re-p.im-p.im);
  var a=new Complex(0,k2*(1+p.re*p.re+p.im*p.im));
  var b=new Complex(2*k2*p.im,-p.re);
  return Complex.mobius(this,a,b);
}
Complex.ComplexInfinity = {
  plus : function(a){ return this; },
  minus : function(a){ return this; },
  multiply : function(a){
    if(a.re == 0 && a.im == 0){
      return new Complex(1,0);
    }
    else
      return this;
  },
  divide : function(a){
    if(a.re === Complex.ComplexInfinity){
      return new Complex(1,0);
    }
    else
      return this;
  },
  pow : function(a){
    if(a.re < 0)
      return new Complex(0,0);
    else
      return this;
  },
  toString : function(){
    return 'ComplexInfinity';
  }
}
Complex.prototype.plus=function(a){
  if(a === Complex.ComplexInfinity)
    return Complex.ComplexInfinity;
  else return new Complex(a.re + this.re,a.im + this.im);
}
Complex.prototype.minus=function(a){
  if(a === Complex.ComplexInfinity)
    return Complex.ComplexInfinity;
  else return new Complex(this.re - a.re,this.im - a.im);
}
Complex.prototype.multiply=function(a){
  if(a === Complex.ComplexInfinity)
    return Complex.ComplexInfinity;
  else return new Complex(a.re * this.re - a.im * this.im,a.re * this.im + a.im * this.re);
}
Complex.prototype.divide=function(a){
  if(this.re == 0 && this.im == 0 && a.re == 0 && a.im == 0){
    return new Complex(1,0);
  }
  else if(a.re == 0 && a.im == 0){
    return Complex.ComplexInfinity;
  }
  else{
    var r = a.re * a.re + a.im * a.im;
    var re=this.re * a.re + this.im * a.im;
    var im=this.im * a.re - this.re * a.im;
    return new Complex(re / r,im / r);
  }
}
Complex.prototype.pow = function(a){
  if(a === Complex.ComplexInfinity)
    return Complex.ComplexInfinity;
  else if(this.re == 0 && this.im == 0 && a.re < 0){
    return Complex.ComplexInfinity;
  }
  else{
    var r = this.re * this.re + this.im * this.im;
    var angle = Math.atan2(this.im,this.re);
    var r2 = Math.pow(r,a.re) * Math.exp(-angle * a.im);
    var angle2 = a.im * Math.log(r) + angle * a.re;
    return new Complex(r2 * Math.cos(angle2),r2 * Math.sin(angle2));
  }
}
Complex.prototype.toString = function(){
  var s = '';
  if(this.re != 0){
    s += this.re;
    if(this.im < 0)
      s += this.im + ' * I';
    else if(this.im > 0)
      s += '+' + this.im + ' * I';
  }
  else{
    if(this.im == 0){
      s += '0';
    }
    else{
      s += this.im + ' * I';
    }
  }
  return s;
}
Complex.Sin = Complex.prototype.Sin = function(a){
  if(a === Complex.ComplexInfinity)
    return new Complex(0,0);
  else{
    return new Complex(Math.sin(a.re) * Math.cosh(a.im),Math.cos(a.re) * Math.sinh(a.im));
  }
}
Complex.Cos = Complex.prototype.Cos = function(a){
  if(a === Complex.ComplexInfinity)
    return new Complex(0,0);
  else{
    return new Complex(Math.cos(a.re) * Math.cosh(a.im),-Math.sin(a.re) * Math.sinh(a.im));
  }
}
Complex.plus=function(a,b){
  return new Complex(a.re+b.re,a.im+b.im);
}
Complex.minus=function(a,b){
  return new Complex(a.re-b.re,a.im-b.im);
}
Complex.multiply=function(a,b){
  return new Complex(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
}
Complex.divide=function(a,b){
  var r=b.re*b.re+b.im*b.im;
  var re=a.re*b.re+a.im*b.im;
  var im=a.im*b.re-a.re*b.im;
  return new Complex(re/r,im/r);
}
Complex.mobius=function(z,a,b){
  var c1=Complex.plus(Complex.multiply(a,z),b);
  var c2=Complex.plus(Complex.multiply(b.c(),z),a.c());
  return Complex.divide(c1,c2);
}
