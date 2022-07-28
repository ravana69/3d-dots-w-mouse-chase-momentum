var circle, stage, xdir, ydir, spot, scale_offset,
	direction_x = 1,
	direction_y= 1,
	speed = 10,
	max_speed = 15,
	spots = [],
	count = 300,
	momentum_val = 0.6,
	outer_margin = 200,
	offset = [],
	last_mouse_x = 0,
	last_mouse_y = 0,
	mouse_reached = true,
	adjusted_x = function(this_dot, circ_offset) {
		return (circ_offset * this_dot.offset) + ((this_dot.origin_x * 2) - (stage.canvas.width / 2));
	},

	adjusted_y = function(this_dot, circ_offset) {
		return (circ_offset * this_dot.offset) + ((this_dot.origin_y * 2) - (stage.canvas.width / 2));
	},

	init = function() {
		stage = new createjs.Stage("the_canvas");
		stage.enableMouseOver();
		stage.canvas.width = window.innerWidth;
		stage.canvas.height =  window.innerHeight;
		circle = new createjs.Shape();

		stage.onMouseMove = function(e){
			last_mouse_x = e.stageX;
			last_mouse_y = e.stageY;
			mouse_reached = false;
		};

		circle.graphics.beginFill("#00FF00").drawCircle(0, 0, 20);
		circle.shadow = new createjs.Shadow("#00FF00", 0, 0, 30);
		circle.speed_x = 10;
		circle.speed_y = 10;
		circle.x = stage.canvas.width / 2;
		circle.y = stage.canvas.height / 2;
		circle.onPress = pressHandler;

		for (var i = 0; i < count; i++){
			spot = new createjs.Shape();
			spot.graphics.beginFill("#666").drawCircle(0, 0, (((i / count) * 10 ) + 2 ));
			spot.offset = i / (count / 2);
			spot.name = "spot_" + i;
			spot.origin_x = Math.floor(Math.random() * stage.canvas.width * 1.5) + 1;
			spot.origin_y = Math.floor(Math.random() * stage.canvas.height * 1.5) + 1;
			spot.x = spot.origin_x;
			spot.y = spot.origin_y;

			spots[i] = spot;
			stage.addChild(spot);
		}

		stage.addChild(circle);
		stage.update();
		createjs.Ticker.addEventListener("tick", tick);
		createjs.Ticker.setFPS(60);
		console.log(spots[1]);
	},
	pressHandler = function(e){
		e.onMouseMove = function(ev){
			e.target.x = ev.stageX;
			e.target.y = ev.stageY;
			update = true;
		};
	},

	momentum_x = function(speed){
		var old_speed = circle.speed_x;

		if (old_speed - speed >= momentum_val){
			circle.speed_x = old_speed - momentum_val;
			return circle.speed_x;
		} else if(old_speed - speed <= -momentum_val) {
			circle.speed_x = old_speed +momentum_val;
			return circle.speed_x;
		} else {
			circle.speed_x = speed;
			return circle.speed_x;
		}
	},

	momentum_y = function(speed){
		var old_speed = circle.speed_y;

		if (old_speed - speed >= momentum_val){
			circle.speed_y = old_speed - momentum_val;
			return circle.speed_y;
		} else if(old_speed - speed <= -momentum_val) {
			circle.speed_y = old_speed +momentum_val;
			return circle.speed_y;
		} else {
			circle.speed_y = speed;
			return circle.speed_y;
		}
	},

	tick = function() {

		offset[0] = (circle.x - (stage.canvas.width / 2));
		offset[1] = (circle.y - (stage.canvas.height / 2));
		scale_offset = ((((Math.abs(offset[0]) - (stage.canvas.width / 2)) * -1 )	/ (stage.canvas.width / 2) +
							((Math.abs(offset[1]) - (stage.canvas.height / 2)) * -1 )	/(stage.canvas.height / 2)) / 2) + 1;


	
		if(mouse_reached){
			circle.x = circle.x + momentum_x(max_speed * direction_x);
			circle.y = circle.y + momentum_y(max_speed * direction_y);
		} else {
			circle.x = circle.x + momentum_x((last_mouse_x - circle.x) / 10);
			circle.y = circle.y + momentum_y((last_mouse_y - circle.y) / 10);
			if ( Math.abs(circle.x - last_mouse_x) <= 0.5 && Math.abs(circle.y - last_mouse_y) <= 0.5 ){ mouse_reached = true; }
		}
		circle.scaleX = scale_offset * 0.5;
		circle.scaleY = scale_offset * 0.5;
		if (circle.x > (stage.canvas.width - outer_margin)) { direction_x = -1; }
		if (circle.x < outer_margin) { direction_x = 1; }
		if (circle.y > (stage.canvas.height - outer_margin)) { direction_y = -1; }
		if (circle.y < outer_margin) { direction_y = 1; }

		for (var i = 0; i < count; i++){

			spots[i].x = adjusted_x(spots[i], offset[0]);
			spots[i].y = adjusted_y(spots[i], offset[1]);

			spots[i].scaleX =  scale_offset * (spots[i].offset / 2);
			spots[i].scaleY =  scale_offset * (spots[i].offset / 2);


		}


		stage.update(); // important!!
	};

$(function(){ 
  $(window).load(function(){
    init();
  }); 
});
