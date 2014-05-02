//Global variables used for controlling the game
var game_started = false;
var score = 0;
var snake = new Array();
var apple;
var head_direction = "up";
var next_head_direction = "up";
var tail_direction = "down";
var pause = true;
var menu = false;
var dead = false;
var menu_selected = 0;
var game_speed = 50;
var interval_handle;

//Images
var head_right = new Image();
var head_left = new Image();
var head_up = new Image();
var head_down = new Image();
var apple_img = new Image();
var arrow_img = new Image();

//Timers
var yum_start;
var yum_elapsed;

//Snake node constructor
function snakeNode(x,y) {
    this.x = x;
    this.y = y;
}

//Apple constructor
function createApple(x,y) {
    this.x = x;
    this.y = y;
}

//Creates the apple at a random unoccupied position
function spawnApple() {

    x = Math.floor(Math.random() * 20);
    y = Math.floor(Math.random() * 20);

    for(i=0; i<snake.length; ++i) {
        if(snake[i].x == x && snake[i].y == y) {
            spawnApple();
        }
    }

    apple = new createApple(x, y);
}

//Draws the select speed menu
function drawMenu() {

	//Background
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0,0,500,500);

	//Snake body
	ctx.fillStyle = "#303030";

	for (i=0; i<11; i++) {
		ctx.fillRect(100+i*25,450,25,25);
	}
	
	for (i=0; i<7; i++) {
		ctx.fillRect(375,300+i*25,25,25);
	}

	//Snake tail
	ctx.drawImage(head_left,75,450);

	//Snake head
	ctx.drawImage(head_up,375,275);

	//Apple
	ctx.drawImage(apple_img,375,200);

	//Title
	ctx.textAlign = "start";
	ctx.fillStyle = "#303030";
	ctx.font = "50px droid sans";
	ctx.fillText("SELECT SPEED",100,75);


	//Options
	ctx.fillStyle = "#606060";
	ctx.font = "35px droid sans";
	ctx.fillText("SLOW",150,200);
	ctx.fillText("AVERAGE",150,250);
	ctx.fillText("FAST",150,300);
	ctx.fillText("INSANE",150,350);

	//Arrow on the selected option
	switch (menu_selected) {
		case 0:
			ctx.drawImage(arrow_img,100,172.5);
			break;

		case 1:
			ctx.drawImage(arrow_img,100,222.5);
			break;

		case 2:
			ctx.drawImage(arrow_img,100,272.5);
			break;

		case 3:
			ctx.drawImage(arrow_img,100,322.5);
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

	ctx.fillStyle = "#606060";
	ctx.font = "35px Droid Sans";
	ctx.fillText("YOUR FINAL SCORE",250,225);
	ctx.fillStyle = "#303030";
	ctx.fillText(score,250,275);
	ctx.fillStyle = "#606060";
	ctx.fillText("PRESS ENTER",250,375);
	ctx.fillText("TO PLAY AGAIN",250,425);

}

//Draws the game in its current state
function draw() {

	if (menu) {
		drawMenu();
	}

	else if (dead) {
		drawGameOver();
	}

	else {
		//Background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0,0,500,500);

		//Apple
		ctx.drawImage(apple_img,25*apple.x,25*apple.y);

		//Snake's body except for head and tail
		ctx.fillStyle = "#303030";
		for (i=1; i<snake.length-1; ++i) {
			ctx.fillRect(25*snake[i].x,25*snake[i].y,25,25);
		}

		//Head and tail
		switch(head_direction) {
			case "left":
				ctx.drawImage(head_left,25*snake[0].x,25*snake[0].y);
				break;

			case "right":
				ctx.drawImage(head_right,25*snake[0].x,25*snake[0].y);
				break;

			case "up":
				ctx.drawImage(head_up,25*snake[0].x,25*snake[0].y);
				break;

			case "down":
				ctx.drawImage(head_down,25*snake[0].x,25*snake[0].y);
				break;
		}

		switch(tail_direction) {
			case "left":
				ctx.drawImage(head_left,25*snake[snake.length-1].x,25*snake[snake.length-1].y);
				break;

			case "right":
				ctx.drawImage(head_right,25*snake[snake.length-1].x,25*snake[snake.length-1].y);
				break;

			case "up":
				ctx.drawImage(head_up,25*snake[snake.length-1].x,25*snake[snake.length-1].y);
				break;

			case "down":
				ctx.drawImage(head_down,25*snake[snake.length-1].x,25*snake[snake.length-1].y);
				break;
		}

		//Score
		ctx.textAlign = "center";
		ctx.fillStyle = "#606060";
		ctx.font = "20px droid sans";
		ctx.fillText("Score: " + score,250,25);

		//Pause message
		if(pause) {
			ctx.fillStyle = "#606060";
			ctx.font = "50px droid sans";
			ctx.fillText("PAUSE",250,250);
		}	

		//Yum message if apple was recently eaten
		yum_elapsed = new Date().getTime() - yum_start;
		if(yum_elapsed <= 1000) {
			ctx.fillStyle = "#606060";
			ctx.font = "50px droid sans";
			ctx.fillText("YUM!",250,250);
		}
	}
}

//Check head for collisions
function collisions() {

	//Die if snake hits a well
    if (snake[0].x >= 20 || snake[0].x < 0 || 
        snake[0].y >= 20 || snake[0].y < 0) {

		dead = true;

    }

	//Die if snake hits itself
    for (i=1; i<snake.length-2; ++i) {
        if (snake[i].x == snake[0].x &&
            snake[i].y == snake[0].y) {

			dead = true;

        }
    }

    //Grow snake if it hits an apple
    if (snake[0].x == apple.x && snake[0].y == apple.y) {

		switch (tail_direction) {

			case "right":
        		snake[snake.length] = new snakeNode(snake[snake.length-1].x+1,snake[snake.length-1].y);
				break;

			case "left":
        		snake[snake.length] = new snakeNode(snake[snake.length-1].x-1,snake[snake.length-1].y);
				break;

			case "up":
        		snake[snake.length] = new snakeNode(snake[snake.length-1].x,snake[snake.length-1].y-1);
				break;

			case "down":
        		snake[snake.length] = new snakeNode(snake[snake.length-1].x,snake[snake.length-1].y+1);
				break;

		}
		
		yum_start = new Date().getTime();
        spawnApple();
		score++;

    }
}

//Moves each snake snode one step towards the head
function follow() {

    for (i=snake.length-1; i>0; i--) {
        snake[i].x = snake[i-1].x;
		snake[i].y = snake[i-1].y;
    }

	//Updates the tail's orientation
	if (snake[snake.length-1].x > snake[snake.length-2].x) {
		tail_direction = "right";
	}

	else if (snake[snake.length-1].x < snake[snake.length-2].x) {
		tail_direction = "left";
	}

	else if (snake[snake.length-1].y > snake[snake.length-2].y) {
		tail_direction = "down";
	}

	else if (snake[snake.length-1].y < snake[snake.length-2].y) {
		tail_direction = "up";
	}
	
}

//Updates the game using the head_direction variable
function update() {

    if (!pause) {

		head_direction = next_head_direction;
    	follow();

        switch (head_direction) {
            case "left":
                snake[0].x--;
                break;

            case "right":
                snake[0].x++;
                break;

            case "up":
                snake[0].y--;
                break;

            case "down":
                snake[0].y++;
                break;
        }

    	collisions();

    }

}

//Creates 3 node starting snake and randomly placed apple
function init() {

	menu = true;
	pause = true;
	dead = false;

	score = 0;

	head_direction = "up";
	next_head_direction = "up";
	tail_direction = "down";

	snake = new Array();

	for(i=0; i<3; ++i) {
		snake[i] = new snakeNode(0,17+i);
	}

	spawnApple();
        
}

//Keyboard event handler
window.onkeydown = function(evt) {

    evt = evt || window.event;
	evt.preventDefault();

	if (dead && ((evt.keycode || evt.which) == 13)) {
		init();
	}

	else if (menu) {

		switch (evt.keycode || evt.which) {

			case 13:
				//Remove the menu, kill the game loop and restart it with
				//new game_speed value
				menu = false;
				game_speed = 200/(menu_selected+1);
				clearInterval(interval_handle);
    			interval_handle = setInterval(function(){update(); draw();},game_speed);
				break;

			case 74:
				menu_selected++;
				menu_selected = menu_selected % 4;
				break;

			case 40:
				menu_selected++;
				menu_selected = menu_selected % 4;
				break;

			case 75:
				menu_selected--;
				menu_selected = menu_selected % 4;

				if(menu_selected == -1) {
					menu_selected = 3;
				}

				break;

			case 38:
				menu_selected--;
				menu_selected = menu_selected % 4;

				if(menu_selected == -1) {
					menu_selected = 3;
				}

				break;
		}

	}

	else {

		switch(evt.keycode || evt.which) {

			//Letter h
			case 72:

				if(head_direction != "right") {
					next_head_direction = "left";
					pause = false;
				}

				break;

			//Left arrow
			case 37:

				if(head_direction != "right") {
					next_head_direction = "left";
					pause = false;
				}

				break;

			//Letter j
			case 74:

				if(head_direction != "up") {
					next_head_direction = "down";
					pause = false;

				}

				break;

			//Down arrow
			case 40:

				if(head_direction != "up") {
					next_head_direction = "down";
					pause = false;

				}

				break;

			//Letter k
			case 75:

				if(head_direction != "down") {
					next_head_direction = "up";
					pause = false;
				}

				break;

			//Up arrow
			case 38:

				if(head_direction != "down") {
					next_head_direction = "up";
					pause = false;
				}

				break;
			
			//Letter l
			case 76:

				if(head_direction != "left") {
					next_head_direction = "right";
					pause = false;
				}

				break;

			//Right arrow
			case 39:

				if(head_direction != "left") {
					next_head_direction = "right";
					pause = false;
				}

				break;

			//Letter p
			case 80:

				if(pause == true) {
					pause = false;
				}

				else {
					pause = true;
				}

				break;
		}

	}

}


//Starts the game
function start() {

 	if (!game_started) {

		c = document.getElementById("snake_board");
		ctx = c.getContext("2d");

		init();
		game_started = true;
		menu = true;
		interval_handle = setInterval(function(){update(); draw();},game_speed);

	}
}
           
//Click here message before game starts
window.onload = function () {
           
	c = document.getElementById("snake_board");
	ctx = c.getContext("2d");

	//Preload images on window load
	head_right.src = "images/face_right.png";
	head_left.src = "images/face_left.png";
	head_up.src = "images/face_up.png";
	head_down.src = "images/face_down.png";
	apple_img.src = "images/apple.png";
	arrow_img.src = "images/arrow.png";

	var play_img = new Image();
	play_img.src = "images/play.png"

	//Draw default canvas
	ctx.textAlign = "center";
	ctx.fillStyle = "#303030";
	ctx.font = "50px droid sans";
	ctx.fillText("SNAKE",250,150);
	ctx.font = "35px droid sans";
	ctx.fillText("CLICK", 190, 300);
	ctx.fillText("TO PLAY",185,350);

	play_img.onload = function () {

		ctx.drawImage(play_img,300,260);
	
	}

}

