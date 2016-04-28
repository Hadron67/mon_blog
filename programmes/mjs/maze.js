window.Maze = (function(){
	'use strict';
	var a = {};
	var getRand = function(a,b)
	{
		return Math.random() * (b - a) + a;
	}
	a.version = '1.0.0';
	a.messageReceiver = undefined;
	a.WallMaze2D = function(height1,width1)
	{
		var height = height1;
		var width = width1;
		var mazemap = [];
		var this_maze = this;
		this.clear = function()
		{
			mazemap = [];
			for(var i = 0;i < 2*width*height;i++)
			{
				mazemap.push(1);
			}
		}
		this.getWidth = function()
		{
			return width;
		}
		this.getHeight = function()
		{
			return height;
		}
		this.clear();
		var Generate1 = function()
		{
			this_maze.clear();
			var mazetable = [];
			var mazewalls = [];
			//do some preparations
			void function()
			{
				for(var i = 0;i < height*width;i++)
				{
					mazetable.push(-1);
				}
				//generate a random sequence
				void function(a,length)
				{
					for(var i = 0;i < length;i++)
					{
						a.push(i);
					}
					for(var i = 0;i < length;i++)
					{
						//var j = Math.ceil(Math.random() * 100000) % length;
						var j = Math.floor(getRand(0,length));
						var b = a[j];
						a[j] = a[i];
						a[i] = b;
					}
				}(mazewalls,2*width*height);
			}();
			var find_n = function(n,n1)
			{
				var parent = n1;
				while(mazetable[parent] >= 0) parent = mazetable[parent];
				return parent;
			}
			var union_n = function(n,n1,n2)
			{
				var root1 = find_n(n,n1);
				var root2 = find_n(n,n2);
				if(root1 != root2)
				{
					n[root2] += n[root1];
					n[root1] = root2;			
				}
			}
			//alert(mazewalls);
			for(var i = 0;i < mazewalls.length;i++)
			{
				var a = mazewalls[i] % 2;
				var x = (mazewalls[i] - a)/2 % width;
				var y = ((mazewalls[i]- a)/2 - x)/width;
				if(x < width - 1 && y < height - 1 || (x == width - 1 && a == 1 && y < height - 1|| y == height - 1 && x < width - 1 && a == 0))
				{
					if(find_n(mazetable,x + y*width) != find_n(mazetable,x+(1-a) + (y+a)*width))
					{
						union_n(mazetable,x + y*width,x+(1-a) + (y+a)*width);
						mazemap[mazewalls[i]] = 0;
					}
				}
			}
		}
		var Generate1Animation = function(ms,canvas)
		{
			this_maze.clear();
			var mazetable = [];
			var mazewalls = [];
			//do some preparations
			void function()
			{
				for(var i = 0;i < height*width;i++)
				{
					mazetable.push(-1);
				}
				//generate a random sequence
				void function(a,length)
				{
					for(var i = 0;i < length;i++)
					{
						a.push(i);
					}
					for(var i = 0;i < length;i++)
					{
						var j = Math.floor(getRand(0,length - 1));
						var b = a[j];
						a[j] = a[i];
						a[i] = b;
					}
				}(mazewalls,2*width*height);
			}();
			var find_n = function(n,n1)
			{
				var parent = n1;
				while(mazetable[parent] >= 0) parent = mazetable[parent];
				return parent;
			}
			var union_n = function(n,n1,n2)
			{
				var root1 = find_n(n,n1);
				var root2 = find_n(n,n2);
				if(root1 != root2)
				{
					n[root2] += n[root1];
					n[root1] = root2;			
				}
			}
			//alert(mazewalls);
			var i = 0;
			var animation = window.setInterval(function(){
				canvas.width = canvas.width;
				this_maze.draw(canvas);
				if(i >= mazewalls.length) 
				{
					window.clearInterval(animation);
					window.alert("finished");
				}
				var a = mazewalls[i] % 2;
				var x = (mazewalls[i] - a)/2 % width;
				var y = ((mazewalls[i]- a)/2 - x)/width;
				if(x < width - 1 && y < height - 1 || (x == width - 1 && a == 1 && y < height - 1|| y == height - 1 && x < width - 1 && a == 0))
				{
					if(find_n(mazetable,x + y*width) != find_n(mazetable,x+(1-a) + (y+a)*width))
					{
						union_n(mazetable,x + y*width,x+(1-a) + (y+a)*width);
						mazemap[mazewalls[i]] = 0;
					}
				}
				i++;
			},ms);
			return animation;
		}
		var Generate2 = function()
		{
			var mazestatus = [];
			var pstack = [];
			this_maze.clear();
			pstack.top = function()
			{
				return this[this.length - 1];
			}
			var isvalid = function(x,y)
			{
				return (mazestatus[x + y*width] == 0) && (x >= 0 && x < width) && (y >= 0 && y < height);
			}
			for(var i = 0;i < width*height;i++)
			{
				mazestatus.push(0);
			}
			pstack.push({x : 0 , y : 0});
			while(pstack.length != 0)
			{
				var a = pstack.top();
				mazestatus[a.x + a.y*width] = 1;
				var validDirections = [];
				if(isvalid(a.x - 1,a.y)) validDirections.push({x : -1 , y :  0});
				if(isvalid(a.x + 1,a.y)) validDirections.push({x :  1 , y :  0});
				if(isvalid(a.x,a.y + 1)) validDirections.push({x :  0 , y :  1});
				if(isvalid(a.x,a.y - 1)) validDirections.push({x :  0 , y : -1});
				if(validDirections.length == 0)
				{
					pstack.pop();
				}
				else
				{
					//var selected = Math.ceil((Math.random() * 1000)) % validDirections.length;
					var selected = Math.floor(getRand(0,validDirections.length));
					var selecteda = validDirections[selected];
					mazemap[2*((a.x + (selecteda.x == -1 ? -1:0)) + (a.y + (selecteda.y == -1 ? -1:0))*width) + (selecteda.x == 0 ? 1:0)] = 0;
					pstack.push({x : a.x + selecteda.x , y : a.y + selecteda.y});
				}
			}
		}
		var Generate2Animation = function(ms,canvas)
		{
			var ctx = canvas.getContext("2d");
			var dx = canvas.width / width;
			var dy = canvas.height / height;
			var mazestatus = [];
			var pstack = [];
			this_maze.clear();
			pstack.top = function()
			{
				return this[this.length - 1];
			}
			var isvalid = function(x,y)
			{
				return (mazestatus[x + y*width] == 0) && (x >= 0 && x < width) && (y >= 0 && y < height);
			}
			for(var i = 0;i < width*height;i++)
			{
				mazestatus.push(0);
			}
			pstack.push({x : 0 , y : 0});
			var animate;
			animate = window.setInterval(function(){
				'use strict';
				if(pstack.length == 0) 
				{	
					window.clearInterval(animate);
					window.alert("finished.");
				}
				canvas.width = canvas.width;
				this_maze.draw(canvas);
				var a = pstack.top();
				ctx.fillRect(a.x*dx,a.y*dx,dx,dy);
				mazestatus[a.x + a.y*width] = 1;
				var validDirections = [];
				if(isvalid(a.x - 1,a.y)) validDirections.push({x : -1 , y :  0});
				if(isvalid(a.x + 1,a.y)) validDirections.push({x :  1 , y :  0});
				if(isvalid(a.x,a.y + 1)) validDirections.push({x :  0 , y :  1});
				if(isvalid(a.x,a.y - 1)) validDirections.push({x :  0 , y : -1});
				//window.alert("(" + a.x + "," + a.y + ")");
				if(validDirections.length == 0)
				{
					pstack.pop();
				}
				else
				{
					//var selected = Math.ceil((Math.random() * 1000)) % validDirections.length;
					var selected = Math.floor(getRand(0,validDirections.length));
					var selecteda = validDirections[selected];
					mazemap[2*((a.x + (selecteda.x == -1 ? -1:0)) + (a.y + (selecteda.y == -1 ? -1:0))*width) + (selecteda.x == 0 ? 1:0)] = 0;
					pstack.push({x : a.x + selecteda.x , y : a.y + selecteda.y});
				}
			},ms);
			return animate;
		}
		var Generate3 = function()
		{
			void function(){
				mazemap = [];
				for(var i = 0;i < 2*width*height;i++)
				{
					mazemap.push(0);
				}
			}();
			var divide = function(px1,py1,px2,py2)
			{
				//if(px2 == px1 || py2 == py1) return;
				var d_x = Math.floor(getRand(px1,px2 + 1));
				var d_y = Math.floor(getRand(py1,py2 + 1));
				for(var i = py1;i <= py2 + 1;i++)
				{
					mazemap[2*(d_x + i*width)] = 1;
				}
				for(var i = px1;i <= px2 + 1;i++)
				{
					mazemap[2*(i + d_y*width) + 1] = 1;
				}
				var d1 = Math.floor(getRand(py1 + 1,d_y));
				var d2 = Math.floor(getRand(d_y + 1,py2 + 1));
				var d3 = Math.floor(getRand(px1 + 1,d_x));
				var d4 = Math.floor(getRand(d_x + 1,px2 + 1));
				var s = Math.floor(getRand(0,4));
				switch(s)
				{
					case 0:
						//mazemap[2*(d_x + d1*width)] = 0;
						mazemap[2*(d_x + d2*width)] = 0;
						mazemap[2*(d3 + d_y*width) + 1] = 0;
						mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					case 1:
						mazemap[2*(d_x + d1*width)] = 0;
						//mazemap[2*(d_x + d2*width)] = 0;
						mazemap[2*(d3 + d_y*width) + 1] = 0;
						mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					case 2:
						mazemap[2*(d_x + d1*width)] = 0;
						mazemap[2*(d_x + d2*width)] = 0;
						//mazemap[2*(d3 + d_y*width) + 1] = 0;
						mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					case 3:
						mazemap[2*(d_x + d1*width)] = 0;
						mazemap[2*(d_x + d2*width)] = 0;
						mazemap[2*(d3 + d_y*width) + 1] = 0;
						//mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					default:break;
				}
				if(d_x != px1 && d_y != py1) divide(px1,py1,d_x - 1,d_y - 1);
				if(d_x != px2 && d_y != py1) divide(d_x + 1,py1,px2,d_y - 1);
				if(d_x != px1 && d_y != py2) divide(px1,d_y + 1,d_x - 1,py2);
				if(d_x != px2 && d_y != py2) divide(d_x + 1,d_y + 1,px2,py2);
			}
			divide(0,0,width - 2,height - 2);
		}
		var Generate3Animation = function(ms,canvas)
		{
			void function(){
				mazemap = [];
				for(var i = 0;i < 2*width*height;i++)
				{
					mazemap.push(0);
				}
			}();
			var pstack = [{px1 : 0 , py1 : 0 , px2 : width - 2 , py2 : height - 2}];
			var animation = window.setInterval(function(){
				canvas.width = canvas.width;
				this_maze.draw(canvas);
				if(pstack.length == 0)
				{
					window.clearInterval(animation);
					window.alert("finished");
				}
				var currentcell = pstack.shift();
				var px1 = currentcell.px1;
				var px2 = currentcell.px2;
				var py1 = currentcell.py1;
				var py2 = currentcell.py2;
				var d_x = Math.floor(getRand(px1,px2 + 1));
				var d_y = Math.floor(getRand(py1,py2 + 1));
				for(var i = py1;i <= py2 + 1;i++)
				{
					mazemap[2*(d_x + i*width)] = 1;
				}
				for(var i = px1;i <= px2 + 1;i++)
				{
					mazemap[2*(i + d_y*width) + 1] = 1;
				}
				var d1 = Math.floor(getRand(py1 + 1,d_y));
				var d2 = Math.floor(getRand(d_y + 1,py2 + 1));
				var d3 = Math.floor(getRand(px1 + 1,d_x));
				var d4 = Math.floor(getRand(d_x + 1,px2 + 1));
				var s = Math.floor(getRand(0,4));
				switch(s)
				{
					case 0:
						//mazemap[2*(d_x + d1*width)] = 0;
						mazemap[2*(d_x + d2*width)] = 0;
						mazemap[2*(d3 + d_y*width) + 1] = 0;
						mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					case 1:
						mazemap[2*(d_x + d1*width)] = 0;
						//mazemap[2*(d_x + d2*width)] = 0;
						mazemap[2*(d3 + d_y*width) + 1] = 0;
						mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					case 2:
						mazemap[2*(d_x + d1*width)] = 0;
						mazemap[2*(d_x + d2*width)] = 0;
						//mazemap[2*(d3 + d_y*width) + 1] = 0;
						mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					case 3:
						mazemap[2*(d_x + d1*width)] = 0;
						mazemap[2*(d_x + d2*width)] = 0;
						mazemap[2*(d3 + d_y*width) + 1] = 0;
						//mazemap[2*(d4 + d_y*width) + 1] = 0;
						break;
					default:break;
				}
				if(d_x != px1 && d_y != py1) pstack.push({px1 : px1 , py1 : py1 , px2 : d_x - 1 , py2 : d_y - 1});
				if(d_x != px2 && d_y != py1) pstack.push({px1 : d_x + 1 , py1 : py1 , px2 : px2 , py2 : d_y - 1});
				if(d_x != px1 && d_y != py2) pstack.push({px1 : px1 , py1 : d_y + 1 , px2 : d_x - 1 , py2 : py2});
				if(d_x != px2 && d_y != py2) pstack.push({px1 : d_x + 1 , py1 : d_y + 1 , px2 : px2 , py2 : py2});
			},ms);
			return animation;
		}
		this.Generate = function(algorithm)
		{
			switch(algorithm)
			{
				case 'Depth-first':
					Generate2();
					break;
				case 'Kruskal':
					Generate1();
					break;
				case 'Recursive-division':
					Generate3();
					break;
				default:
					throw 'algorithm "' + algorithm + '" is not supported yet.';
			}
		}
		this.GenerateAnimation = function(algorithm,ms,canvas)
		{
			switch(algorithm)
			{
				case 'Depth-first':
					return Generate2Animation(ms,canvas);
					break;
				case 'Kruskal':
					return Generate1Animation(ms,canvas);
					break;
				case 'Recursive-division':
					return Generate3Animation(ms,canvas);
					break;
				default:
					throw 'algorithm "' + algorithm + '" is not supported yet.';
			}
		}
		this.getSolution = function(start,end)
		{
			var path = [[{ x : start.x , y : start.y}]];
			var mazestatus = [];
			void function()
			{
				for(var i = 0;i < height*width;i++)
				{
					mazestatus.push(0);
				}
				Array.prototype.top = function()
				{
					return this[this.length - 1];
				}
			}();
			var isvalid = function(x1,y1,dx,dy)
			{
				var x2 = x1 + dx;
				var y2 = y1 + dy;
				if(x2 < 0 || x2 >= width || y2 < 0 || y2 >= height || mazestatus[x2 + y2*width] == 1) return false;
				if(mazemap[2*(x1+(dx==-1?-1:0) + (y1 + (dy==-1?-1:0))*width) + (dy==0?0:1)] == 1) return false;
				return true;
			}
			while(path.length != 0 && (path[0].top().x != end.x || path[0].top().y != end.y))
			{
				var currentpath = path.shift();
				var currentcell = currentpath.top();
				var validDirections = [];
				if(isvalid(currentcell.x,currentcell.y,-1, 0)) validDirections.push({x : -1 , y :  0});
				if(isvalid(currentcell.x,currentcell.y, 1, 0)) validDirections.push({x :  1 , y :  0});
				if(isvalid(currentcell.x,currentcell.y, 0, 1)) validDirections.push({x :  0 , y :  1});
				if(isvalid(currentcell.x,currentcell.y, 0,-1)) validDirections.push({x :  0 , y : -1});
				mazestatus[currentcell.x + currentcell.y*width] = 1;
				for(var i = 0;i < validDirections.length;i++)
				{
					var nextpath = currentpath.concat();
					nextpath.push({x : currentcell.x + validDirections[i].x , y : currentcell.y + validDirections[i].y});
					path.push(nextpath);
				}
			}
			return path[0];
		}
		this.draw = function(canvas)
		{
			var ctx = canvas.getContext("2d");
			var dx = canvas.width / width;
			var dy = canvas.height / height;
			ctx.strokeStyle = "blue";
			ctx.moveTo(0,0);
			ctx.lineTo(canvas.width,0);
			ctx.moveTo(0,0);
			ctx.lineTo(0,canvas.height);
			for(var x = 0;x < width;x++)
			{
				for(var y = 0;y < height;y++)
				{
					if(mazemap[2*(x + y*width)] == 1)
					{
						ctx.moveTo((x+1)*dx,y*dy);
						ctx.lineTo((x+1)*dx,(y+1)*dy);
					}
					if(mazemap[2*(x + y*width) + 1] == 1)
					{
						ctx.moveTo((x)*dx,(y+1)*dy);
						ctx.lineTo((x+1)*dx,(y+1)*dy);
					}
				}
			}
			ctx.stroke();
		}
		this.drawSolution = function(canvas,solution)
		{
			var ctx = canvas.getContext("2d");
			var dx = canvas.width / width;
			var dy = canvas.height / height;
			ctx.strokeStyle = "rgb(255,0,0)";
			ctx.fillStyle = "red";
			ctx.fillRect(solution[0].x*dx + dx/4,solution[0].y*dy + dy/4,dx/2,dy/2);
			ctx.moveTo(dx/2 + solution[0].x*dx,dy/2 + solution[0].y*dy);
			for(var i = 1;i < solution.length;i++)
			{
				ctx.lineTo(dx/2 + solution[i].x*dx,dy/2 + solution[i].y*dy);
			}
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(solution[solution.length - 1].x*dx + dx/2,solution[solution.length - 1].y*dy + dy/2,dx/4,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}
	}
	return a;
})();


