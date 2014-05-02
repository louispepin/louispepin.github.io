//Game control
var game_started = false;
var menu = true;
var pause = false;
var survival = false;
var adventure = false;
var cutscene = false;
var dead = false;
var menu_selected = 0;
var asteroid_speed = 2;

//Timers
var invincible_start;
var asteroid_spawn_start;
var cooldown_start;
var cutscene_start;
var powerup_start;
var dead_start;

//Counters
var lives = 3;
var level = 0;
var score = 0;
var bullet_index = 0;
var asteroid_index = 0;
var explosion_index = 0;
var asteroid_count = 0;

//Ship control
var firing_rate = 200;
var gun_type = 1;
var ship_orientation = "up";
var invincible = false;
var shooting = false;
var moving_right = false;
var moving_left = false;
var moving_up = false;
var moving_down = false;

//Containers
var bullets = new Array;
var asteroids = new Array;
var explosions = new Array;

//Images
var ship_img = new Image();
var asteroid_big_img = new Image();
var asteroid_small_img = new Image();
var arrow_img = new Image();
var life_img = new Image();
var explosion_img = new Image();

ship_img.src = "images/ship_right.png";
asteroid_big_img.src = "images/asteroid_big.png";
asteroid_small_img.src = "images/asteroid_small.png";
arrow_img.src = "images/arrow.png";
life_img.src = "images/ship_up.png";
explosion_img.src = "images/explosion.png";

//Main player constructor
function createPlayer() {

	this.x_ = 250;
	this.y_ = 250;
	this.speedX_ = 0;
	this.speedY_ = 0;

}

//Asteroid constructor
function createAsteroid(x,y) {

	//Larger asteroids that spawn all over the map
	if (arguments.length == 0) {
		
	    this.x_ = Math.random() * 500;
	    this.y_ = Math.random() * 500;

		//Prevent asteroids from spawning too close to the ship
		while (Math.abs(this.x_ - player.x_) < 100 && Math.abs(this.y_ - player.y_ < 100)) {

		    this.x_ = Math.random() * 500;
		    this.y_ = Math.random() * 500;

		}

		this.size_ = 20;

	}

	//Smaller asteroids that spawn where a bigger one was destroyed
	else {

	    this.x_ = x;
	    this.y_ = y;
	    this.size_ = 12;

	}
	
	this.speedX_ = (Math.random() * asteroid_speed) - asteroid_speed / 2;
	this.speedY_ = (Math.random() * asteroid_speed) - asteroid_speed / 2;

	this.active = true;

	asteroid_count++;
	asteroid_index++;
	asteroid_index = asteroid_index % 100;

}

//Bullet constructor
function createBullet(x,y) {

    this.x_ = x;
    this.y_ = y;

	//Set speed according to the ship's orientation
	switch (ship_orientation) {

		case "right":
		    this.speedX_ = 5;
		    this.speedY_ = 0;
			break;

		case "left":
		    this.speedX_ = -5;
		    this.speedY_ = 0;
			break;

		case "up":
		    this.speedX_ = 0;
		    this.speedY_ = 5;
			break;

		case "down":
		    this.speedX_ = 0;
		    this.speedY_ = -5;
			break;

	}

	this.active = true;

	bullet_index++;
	bullet_index = bullet_index % 100;
}

//Explosion constructor
function createExplosion(x,y) {

    this.x_ = x;
    this.y_ = y;
    this.start_ = new Date().getTime();

    explosion_index++;
    explosion_index = explosion_index % 25;

}

//Pause and unpause functions needed to conserve timers
function pauseGame() {

    pause = true;

}

function unpauseGame() {

    asteroid_spawn_start = new Date().getTime();
    cooldown_start = new Date().getTime();

    pause = false;

}
//Draws the menu
function drawMenu() {

		//Background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0,0,500,500);

		//Title
		ctx.textAlign = "center";
		ctx.fillStyle = "#303030";
		ctx.font = "50px droid sans";
		ctx.fillText("SELECT MODE",250,100);

		//Options
		ctx.textAlign = "start";
		ctx.fillStyle = "#606060";
		ctx.font = "35px droid sans";
		ctx.fillText("ADVENTURE",175,225);
		ctx.fillText("SURVIVAL",175,275);

		//Ship
		ship_img.src = "images/ship_right.png";
		ctx.drawImage(ship_img,50,400);

		//Bullets
		ctx.fillStyle = "#ff0000";
		for (i=0; i<7; i++) {
			ctx.fillRect(150+30*i,415,3,3);
		}

		//Asteroids
		ctx.fillStyle = "#303030";
		ctx.beginPath();
		ctx.arc(40,90,20,0,2*Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(150,165,10,0,2*Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(50,290,20,0,2*Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(390,50,10,0,2*Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(400,310,20,0,2*Math.PI);
		ctx.fill();

		//Explosion
		ctx.drawImage(explosion_img,340,395);

		//Draws arrow on the selected option
		switch (menu_selected) {

			case 0:
				ctx.drawImage(arrow_img,125,200);
				break;

			case 1:
				ctx.drawImage(arrow_img,125,250);
				break;

		}
		
}

//Game over screen
function drawGameOver() {

	//Background
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0,0,500,500);

	ctx.fillStyle = "#303030";
	ctx.textAlign = "center";
	ctx.font = "50px Droid Sans";
	ctx.fillText("GAME OVER",250,100);

	if (survival) {
		ctx.fillStyle = "#606060";
		ctx.font = "35px Droid Sans";
		ctx.fillText("YOUR FINAL SCORE",250,225);
		ctx.fillStyle = "#303030";
		ctx.fillText(score,250,275);
		ctx.fillStyle = "#606060";
		ctx.fillText("PRESS ENTER",250,375);
		ctx.fillText("TO PLAY AGAIN",250,425);
	}

	else {
		ctx.fillStyle = "#606060";
		ctx.font = "35px Droid Sans";
		ctx.fillText("YOU DIED AT LEVEL ",250,225);
		ctx.fillStyle = "#303030";
		ctx.fillText(level,250,275);
		ctx.fillStyle = "#606060";
		ctx.fillText("PRESS ENTER",250,375);
		ctx.fillText("TO PLAY AGAIN",250,425);
	}

}

//Draws cutscene in-between levels
function drawCutscene() {

    //Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 500, 500);

    //Level
    ctx.textAlign = "center";
    ctx.fillStyle = "#303030";
    ctx.font = "50px Droid Sans";
    ctx.fillText("LEVEL " + level, 250, 250);

}

//Draws the game in its current state
function draw() {

	if (menu) {
		drawMenu();
	}

	else if (cutscene) {
	    drawCutscene();
	}

	else if (dead) {
		drawGameOver();
	}

	else {
		//Background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0,0,500,500);

		//Ship with proper orientation
		if (moving_left)
			ship_img.src = "images/ship_left.png"		

		else if (moving_right)
			ship_img.src = "images/ship_right.png";		

		else if (moving_up)
			ship_img.src = "images/ship_up.png";		
		
		else if (moving_down)
			ship_img.src = "images/ship_down.png";		

	    //Bullets
		ctx.fillStyle = "#ff0000";
		for (i = 0; i < bullets.length; i++) {
            if (bullets[i].active)
		        ctx.fillRect(bullets[i].x_, 500 - bullets[i].y_, 3, 3);
		}

	    //Asteroids
		ctx.fillStyle = "#303030";
		for (i=0; i<asteroids.length; i++) {
		    if (asteroids[i].active) {
		        ctx.beginPath();
		        ctx.arc(asteroids[i].x_, 500 - asteroids[i].y_, asteroids[i].size_, 0, 2 * Math.PI);
		        ctx.fill();
		    }
		}

		//Explosions
		for (i=0; i<explosions.length; i++) {
			ctx.drawImage(explosion_img,explosions[i].x_-31,500-explosions[i].y_-31);
		}

		//Clean up explosion
		var time_now = new Date().getTime();
		for (i=0; i<explosions.length; i++) {
			if (time_now - explosions[i].start_ >= 1000)
				explosions[i] = 0;
		}

	    //Ship
		if (invincible) {
		    if ((((new Date().getTime() - invincible_start) / 100) % 2) > 1)
		        ctx.drawImage(ship_img, player.x_ - 17, 500 - (player.y_ + 17));	    
		}

		else 
		    ctx.drawImage(ship_img, player.x_ - 17, 500 - (player.y_ + 17));		
			
		//Score
		ctx.textAlign = "start";
		ctx.fillStyle = "#606060";
		ctx.font = "20px droid sans";

		if (survival) 
			ctx.fillText("Score: " + score,5,25);

		else 
		    ctx.fillText("Level: " + level, 5, 25);

	    //Gun type
		ctx.fillText("Gun: ",5,490);

		switch (gun_type) {
			
			case 1:
				ctx.fillRect(55,482,5,5);	
				break;

			case 2:
				ctx.fillRect(55,475,5,5);	
				ctx.fillRect(55,485,5,5);	
				break;

			default:
				ctx.fillRect(55,472,5,5);	
				ctx.fillRect(63,482,5,5);	
				ctx.fillRect(55,492,5,5);	
				break;

		}

		//Lives
		life_img.src = "images/ship_up.png";
		for (i=0; i<lives; i++) {
			ctx.drawImage(life_img, 25*(18-i),5);
		}

		//Pause message
		if (pause) {
			ctx.textAlign = "center";
			ctx.fillStyle = "#606060";
			ctx.font = "50px droid sans";
			ctx.fillText("PAUSE",250,275);
		}	

		//Powerup message
		if (new Date().getTime() - powerup_start <= 1000) {
			ctx.textAlign = "center";
			ctx.fillStyle = "#606060";
			ctx.font = "50px droid sans";
			ctx.fillText("POWER UP!",250,275);
		}
	}
}

//Updates the game according to user input
function update() {

    var now = new Date().getTime();

	if (lives == -1)
		dead = true;

	//End invincibility after 2 seconds
	if (invincible) {
		if (now - invincible_start >= 2000)
			invincible = false;
	}

	//Spawn asteroids if in survival mode
	if (survival) {

		//Spawn more and more often as score increases. Caps at score = 200.
		if (score <= 200) {
			if (now - asteroid_spawn_start >= 5000 - (20 * score)) {
				asteroids[asteroid_index] = new createAsteroid();
				asteroid_spawn_start = now;
			}
		}

		else {
			if (now - asteroid_spawn_start >= 1000) {
				asteroids[asteroid_index] = new createAsteroid();
				asteroid_spawn_start = now;
			}
		}
	}

	//Move to the next level if there are no asteroids left in adventure mode
	if (adventure) {

		if (asteroid_count == 0 && !cutscene) {
			level++;
			cutscene_start = now;
			cutscene = true;
		}

		if (new Date().getTime() - cutscene_start >= 2000 && cutscene) {

			for (i=0; i<level*2; i++) {
				asteroids[asteroid_index] = new createAsteroid();
			}

			cutscene = false;

		}
	}

	//Fire bullets 
	if (shooting) {
		if (new Date().getTime() - cooldown_start >= firing_rate) {
			fire();
			cooldown_start = now;
		}
	}

	//Set speed according to movement control variables
	if (moving_right) {
		player.speedX_ = 3;
		player.speedY_ = 0;
	}

	else if (moving_left) {
		player.speedX_ = -3;
		player.speedY_ = 0;
	}

	else if (moving_up) {
		player.speedX_ = 0;
		player.speedY_ = 3;
	}

	else if (moving_down) {
		player.speedX_ = 0;
		player.speedY_ = -3;
	}

	else {
		player.speedX_ = 0;
		player.speedY_ = 0;
	}

	//Move battleship
	player.x_ += player.speedX_;
	player.y_ += player.speedY_;

	//Move asteroids
	for (i=0; i<asteroids.length; i++) {
		asteroids[i].x_ += asteroids[i].speedX_;
		asteroids[i].y_ += asteroids[i].speedY_;
	}

	//Move bullets
	for (i=0; i<bullets.length; i++) {
		bullets[i].x_ += bullets[i].speedX_;
		bullets[i].y_ += bullets[i].speedY_;
	}

	//Wrap ship
	if (player.x_ < 0) {
		player.x_ = 500;
	}

	else if (player.x_ > 500) {
		player.x_ = 0;
	}

	else if (player.y_ < 0) {
		player.y_ = 500;
	}

	else if (player.y_ > 500) {
		player.y_ = 0;
	}

	//Wrap asteroids
	for (i=0; i<asteroids.length; i++) {

		if (asteroids[i].x_ < 0) {
			asteroids[i].x_ = 500;
		}

		else if (asteroids[i].x_ > 500) {
			asteroids[i].x_ = 0;
		}

		else if (asteroids[i].y_ < 0) {
			asteroids[i].y_ = 500;
		}

		else if (asteroids[i].y_ > 500) {
			asteroids[i].y_ = 0;
		}

	}

}

//Checks for collisions with asteroids
function collisions() {

	var x_dist;
	var y_dist;
	var dist;

	//Ship
	for (i = 0; i < asteroids.length; i++) {

	    if (asteroids[i].active) {

	        x_dist = Math.abs(player.x_ - asteroids[i].x_);
	        y_dist = Math.abs(player.y_ - asteroids[i].y_);
	        dist = Math.sqrt(x_dist * x_dist + y_dist * y_dist);

            //20 is the approximate ship size
	        if (dist <= (asteroids[i].size_ + 20)) {
	            if (!invincible) {

	                lives--;
	                invincible = true;
	                invincible_start = new Date().getTime();

	            }

	            //Destroy asteroid on impact with ship
	            asteroids[i].active = false;
	            asteroid_count--;
	            explosions[explosion_index] = new createExplosion(asteroids[i].x_, asteroids[i].y_);

	            //Spawn up to 5 mini-asteroids when a large one breaks
	            if (asteroids[i].size_ == 20) {
	                for (k = 0; k < Math.random() * 5; k++) {
	                    asteroids[asteroid_index] = new createAsteroid(asteroids[i].x_, asteroids[i].y_);
	                }
	            }

	        }
	    }
	}

	//Bullets
	for (i=0; i<asteroids.length; i++) {
		for (j=0; j<bullets.length; j++) {

		    if (asteroids[i].active && bullets[j].active) {

			    x_dist = Math.abs(bullets[j].x_ - asteroids[i].x_);
			    y_dist = Math.abs(bullets[j].y_ - asteroids[i].y_);
			    dist = Math.sqrt(x_dist*x_dist + y_dist*y_dist);

			    if (dist <= asteroids[i].size_) {

			        //Spawn up to 5 mini-asteroids when a large one breaks
			        if (asteroids[i].size_ == 20) {
			            for (k = 0; k < Math.random() * 5; k++) {
			                asteroids[asteroid_index] = new createAsteroid(asteroids[i].x_, asteroids[i].y_);
			            }
			        }

			        //Create explosion
			        explosions[explosion_index] = new createExplosion(asteroids[i].x_, asteroids[i].y_);

			        //Destroy asteroid and bullet
			        asteroids[i].active = false;
			        bullets[j].active = false;

			        asteroid_count--;
			        score++;

			        //Make the game faster as score increases
			        if (score % 100 == 0) {
			            asteroid_speed++;
			        }

			        //2% chance of getting new gun
			        if (gun_type < 3) {
			            var new_gun = Math.floor(Math.random() * 100);
			            if (new_gun <= 2) {
			                gun_type++;
			                if (gun_type <= 3) {
			                    powerup_start = new Date().getTime();
			                }
			            }
			        }
			    }
			}
		}
	}
}

//Handles the firing of different kinds of guns
function fire() {

	switch (gun_type) {

		case 1:
			bullets[bullet_index] = new createBullet(player.x_-2,player.y_+2);
			break;

		case 2:
			
			if (ship_orientation == "up" || ship_orientation == "down") {
				bullets[bullet_index] = new createBullet(player.x_+8,player.y_);
				bullets[bullet_index] = new createBullet(player.x_-12,player.y_);
			}

			else {
				bullets[bullet_index] = new createBullet(player.x_,player.y_+12);
				bullets[bullet_index] = new createBullet(player.x_,player.y_-8);
			}

			break;

		default:

			switch (ship_orientation) {

				case "up":
					bullets[bullet_index] = new createBullet(player.x_+8,player.y_);
					bullets[bullet_index] = new createBullet(player.x_-2,player.y_+8);
					bullets[bullet_index] = new createBullet(player.x_-12,player.y_);
					break;

				case "down":
					bullets[bullet_index] = new createBullet(player.x_+8,player.y_);
					bullets[bullet_index] = new createBullet(player.x_-2,player.y_-8);
					bullets[bullet_index] = new createBullet(player.x_-12,player.y_);
					break;

				case "left":
					bullets[bullet_index] = new createBullet(player.x_,player.y_+12);
					bullets[bullet_index] = new createBullet(player.x_-8,player.y_+2);
					bullets[bullet_index] = new createBullet(player.x_,player.y_-8);
					break;
					
				case "right":
					bullets[bullet_index] = new createBullet(player.x_,player.y_+12);
					bullets[bullet_index] = new createBullet(player.x_+8,player.y_+2);
					bullets[bullet_index] = new createBullet(player.x_,player.y_-8);
					break;

			break;

			}
	}
}
	
//Sets initial game environment
function init() {

    //(Re)create objects
    player = new createPlayer();
	asteroids = new Array();
	bullets = new Array();
	explosions = new Array();
	
    //(Re)initialise variables
	menu = true;
	pause = false;
	survival = false;
	adventure = false;
	cutscene = false;
	dead = false;
	menu_selected = 0;

	lives = 3;
	level = 0;
	score = 0;
	bullet_index = 0;
	asteroid_count = 0;
	asteroid_index = 0;
	explosion_index = 0;
	gun_type = 1;

	ship_orientation = "up";

    //(Re)start timers
	cooldown_start = new Date().getTime();
	invincible_start = new Date().getTime();
}

//Puts together the next frame and prints it
function animate() {
	
	if (!pause) {
		update();
		collisions();
	}

	draw();
	
	//Firefox and chrome support
	if (!window.requestAnimationFrame) {
		window.mozRequestAnimationFrame(animate);
	}

	else {
		requestAnimationFrame(animate);
	}
}

//Keyboard event handler
window.onkeydown = function (evt) {

    evt = evt || window.event;
	evt.preventDefault();

	switch(evt.keycode || evt.which) {

		//Letter h 
		case 72:

			if (!menu && pause) {
				unpauseGame();
			}

			ship_orientation = "left"
			moving_left = true;
			moving_right = false;
			moving_up = false;
			moving_down = false;
			break;

		//Left arrow 
		case 37:

			if (!menu && pause) {
				unpauseGame();
			}

			ship_orientation = "left"
			moving_left = true;
			moving_right = false;
			moving_up = false;
			moving_down = false;
			break;
		
		//Letter j
		case 74:

			if (menu) {
				menu_selected++;
				menu_selected = menu_selected % 2;
			}

			else {

				if (pause) {
					unpauseGame();
				}

				ship_orientation = "down"
				moving_left = false;
				moving_right = false;
				moving_up = false;
				moving_down = true;
			}
			
			break;

		//Down arrow
		case 40:

			if (menu) {
				menu_selected++;
				menu_selected = menu_selected % 2;
			}

			else {

				if (pause) {
					unpauseGame();
				}

				ship_orientation = "down"
				moving_left = false;
				moving_right = false;
				moving_up = false;
				moving_down = true;
			}
			
			break;

		//Letter k
		case 75:

			if (menu) {
				menu_selected++;
				menu_selected = menu_selected % 2;
			}

			else {

				if (pause) {
					unpauseGame();
				}

				ship_orientation = "up"
				moving_left = false;
				moving_right = false;
				moving_up = true;
				moving_down = false;
			}

			break;

		//Up arrow
		case 38:

			if (menu) {
				menu_selected++;
				menu_selected = menu_selected % 2;
			}

			else {

				if (pause) {
					unpauseGame();
				}

				ship_orientation = "up"
				moving_left = false;
				moving_right = false;
				moving_up = true;
				moving_down = false;
			}

			break;

		//Letter l
		case 76:

			if (!menu && pause) {
				unpauseGame();
			}

			ship_orientation = "right"
			moving_left = false;
			moving_right = true;
			moving_up = false;
			moving_down = false;
			break;

		//Right arrow
		case 39:

			if (!menu && pause) {
				unpauseGame();
			}

			ship_orientation = "right"
			moving_left = false;
			moving_right = true;
			moving_up = false;
			moving_down = false;
			break;

		//Spacebar
		case 32:

			if (pause) {
				unpauseGame();
			}

			shooting = true;

			break;

		//Letter p
		case 80:
		    
			if (pause) {
				unpauseGame();
			}

			else {
				pauseGame();
			}

			break;

		//Enter
		case 13:

			if (menu) {
				//Start the game
				menu = false;
				ship_img.src = "images/ship_up.png";

				//Set the right game mode
				if (menu_selected == 1) {
					survival = true;
					asteroid_spawn_start = new Date().getTime();
				}

				else {
					adventure = true;
					cutscene_start = new Date().getTime();
				}
			}

			else if (dead) {
				init();
			}

			break;

	}
}

//Keyboard event handler
window.onkeyup = function(evt) {

    evt = evt || window.event;
	evt.preventDefault();

	switch(evt.keycode || evt.which) {

		//Letter h 
		case 72:
			moving_left = false;
			break;

		//Left arrow 
		case 37:
			moving_left = false;
			break;

		//Letter j
		case 74:
			moving_down = false;
			break;

		//Down arrow
		case 40:
			moving_down = false;
			break;

		//Letter k
		case 75:
			moving_up = false;
			break;

		//Up arrow
		case 38:
			moving_up = false;
			break;

		//Letter l
		case 76:
			moving_right = false;
			break;

		//Right arrow
		case 39:
			moving_right = false;
			break;

		//Spacebar
		case 32:
			shooting = false;
			break;
	}
}

//Starts the game
function start() {
	
    //Prevents re-starting the game at every click
	if (!game_started) {

		c = document.getElementById("asteroid_board");
		ctx = c.getContext("2d");

		init();

		game_started = true;

		//Firefox and chrome support
		if (!window.requestAnimationFrame) {
			window.mozRequestAnimationFrame(animate);
		}

		else {
			requestAnimationFrame(animate);
		}

	}

}

//Click here message before game starts
window.onload = function () {
           
	c = document.getElementById("asteroid_board");
	ctx = c.getContext("2d");

	var play_img = new Image();
	play_img.src = "images/play.png"

	ctx.textAlign = "center";
	ctx.fillStyle = "#303030";
	ctx.font = "50px droid sans";
	ctx.fillText("ASTEROID",250,150);
	ctx.font = "35px droid sans";
	ctx.fillText("CLICK",190,300);
	ctx.fillText("TO PLAY",185,350);

	play_img.onload = function () {

		ctx.drawImage(play_img,300,260);
	
	}

}

