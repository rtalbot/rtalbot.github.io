(function( $ ) {
	var randomize = function(c) { return Math.floor(Math.random()*c); };
	
	var color = function(rval, gval, bval, alpha) {
		this.r = rval;
		this.g = gval;
		this.b = bval;
		this.alpha = alpha;		
	};
	
	color.prototype = {
		torgb: function() 
			{
				var red = randomize(this.r);
				var blue = randomize(this.b);
				var green = randomize(this.g);
				var transparency = randomize(this.alpha);
				if(transparency == 0)
					transparency+=127;
				
				return "rgba("+red+","+green+","+blue+","+transparency+")"; 
			}
	};
	
	var cell = function(x,y,s,rval,gval,bval,alpha) {
		this.x = x;
		this.y = y;
		this.s = s;	
		this.color = new color(rval, gval, bval, alpha);
		this.active = true;
	};

	cell.prototype = {
		setcolor: function(rval, gval, bval, alpha) { this.color = new color(rval, gval, bval, alpha); },
		draw: function(context, p) {
			context.fillStyle  = this.color.torgb();
			context.clearRect(this.x, this.y, this.s, this.s);
			p ? context.fillRect(this.x, this.y, this.s, this.s) :
				context.strokeRect(this.x, this.y, this.s, this.s);
		}
	};

	$.fn.pixelNoise = function(options) {
		var settings = $.extend( {
			'fullscreen'         : false,
			'r' : 256,
			'b' : 256,
			'g' : 256,
			'alpha' : 256,
			'size'	: 10,
			'interval': 10,
			'updatecells': 5,
			'startcell': 0,
			'stepcell': 7
		}, options);
		
		return this.each(function() {
			var ctx = $(this)[0].getContext("2d");
			
			if(settings['fullscreen'])
			{
				ctx.canvas.height = window.innerHeight;
				ctx.canvas.width = window.innerWidth;
			}
			var HEIGHT = ctx.canvas.height; 
			var WIDTH = ctx.canvas.width; 
			
			var sp = settings['size'];
			var xc = Math.floor(WIDTH / sp) ;
			var yc = Math.floor(HEIGHT / sp) ;
			var v = (xc * yc);
			
			var grid = [];
						
			for(i = 0;i<=yc;i++)
			{
				for(j = 0;j<=xc;j++)
				{
					grid.push(new cell(j*sp, i*sp, sp, settings.r, settings.b, settings.g, settings.alpha));
				}
			}
			
			grid.forEach(function(c) {
				c.draw(ctx, true);
			});
			
			var timerinterval = settings['interval'];
			var j = settings['startcell'];
			var u = settings['updatecells'];
			 
			function draw() {
				j += settings['stepcell'];
				for(i = 0;i<u;i++)
				{
					var k = (j) + (((i % 2 == 0) ? -1 : 1) * Math.floor(Math.random()*v));
					
					if(k < 0)
						k = v - k;
					if(k > v)
						k = 0 + (k - v);
					
					var c = grid[k];
					c.active = true;
					c.draw(ctx, true);		
				}
				if(j >= v) j = 0;
			}

			setInterval(draw, timerinterval);
		});
	  };
})( jQuery );