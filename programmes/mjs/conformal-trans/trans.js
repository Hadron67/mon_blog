var trans = (function(){
    'use strict';

    var a = {};
    function Pixel(){
        this._index = 0;
        this._imgdata = undefined;
    }   
    Pixel.prototype.getColor = function(color){
        color[0] = this._imgdata[this._index + 0];
        color[1] = this._imgdata[this._index + 1];
        color[2] = this._imgdata[this._index + 2];
        color[3] = this._imgdata[this._index + 3];
    }
    Pixel.prototype.setColor = function(color){
        this._imgdata[this._index + 0] = color[0];
        this._imgdata[this._index + 1] = color[1];
        this._imgdata[this._index + 2] = color[2];
        this._imgdata[this._index + 3] = color[3];
    }

    function ImgFrame(canvas,startp,endp){
        this._x1 = startp || [-2,2];
        this._x2 = endp || [2,-2];
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this.reloadData();
    }
    ImgFrame.prototype.reloadData = function(){
        this._imgdata = this._ctx.getImageData(0,0,this._canvas.width,this._canvas.height);

        this.dx = (this._x2[0] - this._x1[0]) / this._canvas.width;
        this.dy = (this._x2[1] - this._x1[1]) / this._canvas.height;
        return this;
    }
    ImgFrame.prototype.start = function(x,y){
        this._x1[0] = x || -2;
        this._x1[1] = y || 2;
        return this;
    }
    ImgFrame.prototype.end = function(x,y){
        this._x2[0] = x || -2;
        this._x2[1] = y || 2;
        return this;
    }
    ImgFrame.prototype.loadImgsrc = function(src,cb){
        var img = new Image();
        var parent = this;
        img.src = src;
        img.onload = function () {
            parent._canvas.height = img.height;
            parent._canvas.width = img.width;

            parent._ctx.drawImage(img, 0, 0);
            parent.reloadData();
            if (cb)
                cb.call(parent);
        }
        return this;
    }
    ImgFrame.prototype.drawImg = function(){
        this._canvas.width = this._canvas.width;
        this._ctx.putImageData(this._imgdata,0,0);
        return this;
    }
    ImgFrame.prototype.getPoint = function(x,y,output){
        var px = Math.floor(this._canvas.width * (x - this._x1[0]) / (this._x2[0]- this._x1[0]));
        var py = Math.floor(this._canvas.height * (y - this._x1[1]) / (this._x2[1]- this._x1[1]));
        var i = (px + py * this._canvas.width) * 4;
        if (px >= 0 && px < this._canvas.width && py >= 0 && py < this._canvas.height) {
            output[0] = this._imgdata.data[i + 0];
            output[1] = this._imgdata.data[i + 1];
            output[2] = this._imgdata.data[i + 2];
            output[3] = this._imgdata.data[i + 3];
        }
        else{
            output[0] = output[1] = output[2] = 255;
            output[3] = 255;
        }
        return this;
    }
    ImgFrame.prototype.setPoint = function(x,y,color){
        var px = Math.floor(this._canvas.width * (x - this._x1[0]) / (this._x2[0]- this._x1[0]));
        var py = Math.floor(this._canvas.height * (y - this._x1[1]) / (this._x2[1]- this._x1[1]));
        var i = (px + py * this._canvas.width) * 4;
        if (px >= 0 && px < this._canvas.width && py >= 0 && py < this._canvas.height) {
            this._imgdata.data[i + 0] = color[0];
            this._imgdata.data[i + 1] = color[1];
            this._imgdata.data[i + 2] = color[2];
            this._imgdata.data[i + 3] = color[3];
        }
        return this;
    }
    ImgFrame.prototype.forEachPixel = function(cb){
        var p = new Pixel();
        p._imgdata = this._imgdata.data;
        for(var j = 0;j < this._canvas.height;j++){
            var y = this._x1[1] + j / this._canvas.height * (this._x2[1] - this._x1[1]);
            for(var i = 0;i < this._canvas.width;i++){
                var x = this._x1[0] + i / this._canvas.width * (this._x2[0] - this._x1[0]);
                p._index = (i + j * this._canvas.height) * 4;
                cb.call(p,x,y);
            }
        }
        return this;
    }
    ImgFrame.prototype.transFrom = function(src,func,antialias,regulator){
        antialias = antialias || false;
        regulator = regulator || function(z){ return z; }
        var parent = this;
        var color = new Mathx.Rvec(4);
        var color2 = new Mathx.Rvec(4);
        this.forEachPixel(function(x,y){
            if(antialias){
                var p1 = regulator(func(new Mathx.Complex(x - parent.dx / 4, y - parent.dy / 4)));
                var p2 = regulator(func(new Mathx.Complex(x + parent.dx / 4, y + parent.dy / 4)));
                var p3 = regulator(func(new Mathx.Complex(x - parent.dx / 4, y + parent.dy / 4)));
                var p4 = regulator(func(new Mathx.Complex(x + parent.dx / 4, y - parent.dy / 4)));
                src.getPoint(p1.re,p1.im,color2);
                color.plusAssign(color2);

                src.getPoint(p2.re,p2.im,color2);
                color.plusAssign(color2);

                src.getPoint(p3.re,p3.im,color2);
                color.plusAssign(color2);

                src.getPoint(p4.re,p4.im,color2);
                color.plusAssign(color2);

                color.forEach(function(i){
                    this[i] /= 4;
                });
                this.setColor(color);
            }
            else{
                var p = regulator(func(new Mathx.Complex(x, y)));
                src.getPoint(p.re, p.im, color);
                this.setColor(color);
            }
        });
    }

    ImgFrame.prototype.cercleSpiralTrans = function(src,r1,r2){
        
        var beta = 2 * Math.PI / Math.sqrt(4 * Math.PI * Math.PI + Math.log(r2 / r1) * Math.log(r2 / r1));
        var alpha = Math.acos(beta);
        Mathx
        .variable('r1',r1)
        .variable('r2',r2)
        .variable('beta',beta)
        .variable('alpha',alpha)
        .variable('gamma',Mathx.eval('beta * exp(I * alpha)'));

        var ratio = Mathx.eval('(r2 / r1) ^ gamma');

        function regulator(z){
            if(z.m() >= r2){
                while(z.m() >= r2){
                    z = z.divide(ratio);
                }
            }
            else if(z.m() < r1){
                while(z.m() < r1){
                    z = z.multiply(ratio);
                }
            }
            return z;
        }

        this.transFrom(src,Mathx.lambda('r1 * z^(1 / gamma)',['z']),true,regulator);
    }
    a.ImgFrame = ImgFrame;

    return a;
})();
