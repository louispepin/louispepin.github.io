angular.module('snake', [])
.controller('snakeCtrl', ['$scope', '$rootScope', '$modalInstance', function($scope, $rootScope, $modalInstance) {

    $rootScope.$watch('snakeModalReady', function () {
        $scope.canvas = {
            c: document.getElementById("snake_board"),
            ctx: null
        };
        $scope.canvas.ctx = $scope.canvas.c.getContext("2d");

        // draw default canvas
        $scope.canvas.ctx.textAlign = "center";
        $scope.canvas.ctx.fillStyle = "#303030";
        $scope.canvas.ctx.font = "50px oxygen";
        $scope.canvas.ctx.fillText("SNAKE",250,150);
        $scope.canvas.ctx.font = "35px oxygen";
        $scope.canvas.ctx.fillText("CLICK", 190, 300);
        $scope.canvas.ctx.fillText("TO PLAY",185,350);

        $scope.images.play_img.onload = function () {
            $scope.canvas.ctx.drawImage($scope.images.play_img,300,260);
        }
    });

    $scope.images = {
        head_right: new Image(),
        head_left: new Image(),
        head_up: new Image(),
        head_down: new Image(),
        apple_img: new Image(),
        arrow_img: new Image(),
        play_img: new Image()
    };

    $scope.images.head_right.src = "modules/games/snake/images/face_right.png";
    $scope.images.head_left.src = "modules/games/snake/images/face_left.png";
    $scope.images.head_up.src = "modules/games/snake/images/face_up.png";
    $scope.images.head_down.src = "modules/games/snake/images/face_down.png";
    $scope.images.apple_img.src = "modules/games/snake/images/apple.png";
    $scope.images.arrow_img.src = "modules/games/snake/images/arrow.png";
    $scope.images.play_img.src = "modules/games/snake/images/play.png";

    $scope.controls = {
        game_started: false,
        score: 0,
        snake: {},
        apple: {},
        head_direction: "up",
        next_head_direction: "up",
        tail_direction: "down",
        pause: true,
        menu: false,
        dead: false,
        menu_selected: 0,
        game_speed: 50,
        interval_handle: null
    };

    // timers
    $scope.timers = {
        yum_start: 0,
        yum_elapsed: 0
    }

    $scope.actions = {
        // snake node constructor
        SnakeNode: function (x, y) {
            this.x = x;
            this.y = y;
        },

        // apple constructor
        CreateApple: function (x, y) {
            this.x = x;
            this.y = y;
        },

        // creates the apple at a random unoccupied position
        spawnApple: function () {

            var x = Math.floor(Math.random() * 20);
            var y = Math.floor(Math.random() * 20);

            for (var i = 0; i < $scope.controls.snake.length; ++i) {
                if ($scope.controls.snake[i].x == x && $scope.controls.snake[i].y == y) {
                    $scope.actions.spawnApple();
                }
            }

            $scope.controls.apple = new $scope.actions.CreateApple(x, y);
        },

        // draws the select speed menu
        drawMenu: function () {

            // background
            $scope.canvas.ctx.fillStyle = "#ffffff";
            $scope.canvas.ctx.fillRect(0, 0, 500, 500);

            // snake body
            $scope.canvas.ctx.fillStyle = "#303030";

            for (var i = 0; i < 11; i++) {
                $scope.canvas.ctx.fillRect(100 + i * 25, 450, 25, 25);
            }

            for (var i = 0; i < 7; i++) {
                $scope.canvas.ctx.fillRect(375, 300 + i * 25, 25, 25);
            }

            // snake tail
            $scope.canvas.ctx.drawImage($scope.images.head_left, 75, 450);

            // snake head
            $scope.canvas.ctx.drawImage($scope.images.head_up, 375, 275);

            // apple
            $scope.canvas.ctx.drawImage($scope.images.apple_img, 375, 200);

            // title
            $scope.canvas.ctx.textAlign = "start";
            $scope.canvas.ctx.fillStyle = "#303030";
            $scope.canvas.ctx.font = "50px oxygen";
            $scope.canvas.ctx.fillText("SELECT SPEED", 100, 75);


            // options
            $scope.canvas.ctx.fillStyle = "#606060";
            $scope.canvas.ctx.font = "35px oxygen";
            $scope.canvas.ctx.fillText("SLOW", 150, 200);
            $scope.canvas.ctx.fillText("AVERAGE", 150, 250);
            $scope.canvas.ctx.fillText("FAST", 150, 300);
            $scope.canvas.ctx.fillText("INSANE", 150, 350);

            // arrow on the selected option
            switch ($scope.controls.menu_selected) {
                case 0:
                    $scope.canvas.ctx.drawImage($scope.images.arrow_img, 100, 172.5);
                    break;

                case 1:
                    $scope.canvas.ctx.drawImage($scope.images.arrow_img, 100, 222.5);
                    break;

                case 2:
                    $scope.canvas.ctx.drawImage($scope.images.arrow_img, 100, 272.5);
                    break;

                case 3:
                    $scope.canvas.ctx.drawImage($scope.images.arrow_img, 100, 322.5);
                    break;
            }
        },

        // game over screen
        drawGameOver: function () {

            // background
            $scope.canvas.ctx.fillStyle = "#ffffff";
            $scope.canvas.ctx.fillRect(0, 0, 500, 500);

            $scope.canvas.ctx.fillStyle = "#303030";
            $scope.canvas.ctx.textAlign = "center";
            $scope.canvas.ctx.font = "50px oxygen";
            $scope.canvas.ctx.fillText("GAME OVER", 250, 100);

            $scope.canvas.ctx.fillStyle = "#606060";
            $scope.canvas.ctx.font = "35px oxygen";
            $scope.canvas.ctx.fillText("YOUR FINAL SCORE", 250, 225);
            $scope.canvas.ctx.fillStyle = "#303030";
            $scope.canvas.ctx.fillText($scope.controls.score, 250, 275);
            $scope.canvas.ctx.fillStyle = "#606060";
            $scope.canvas.ctx.fillText("PRESS ENTER", 250, 375);
            $scope.canvas.ctx.fillText("TO PLAY AGAIN", 250, 425);

        },

        // draws the game in its current state
        draw: function () {

            if ($scope.controls.menu) {
                $scope.actions.drawMenu();
            }

            else if ($scope.controls.dead) {
                $scope.actions.drawGameOver();
            }

            else {
                // background
                $scope.canvas.ctx.fillStyle = "#ffffff";
                $scope.canvas.ctx.fillRect(0, 0, 500, 500);

                // apple
                $scope.canvas.ctx.drawImage($scope.images.apple_img, 25 * $scope.controls.apple.x, 25 * $scope.controls.apple.y);

                // snake's body except for head and tail
                $scope.canvas.ctx.fillStyle = "#303030";
                for (i = 1; i < $scope.controls.snake.length - 1; ++i) {
                    $scope.canvas.ctx.fillRect(25 * $scope.controls.snake[i].x, 25 * $scope.controls.snake[i].y, 25, 25);
                }

                // head and tail
                switch ($scope.controls.head_direction) {
                    case "left":
                        $scope.canvas.ctx.drawImage($scope.images.head_left, 25 * $scope.controls.snake[0].x, 25 * $scope.controls.snake[0].y);
                        break;

                    case "right":
                        $scope.canvas.ctx.drawImage($scope.images.head_right, 25 * $scope.controls.snake[0].x, 25 * $scope.controls.snake[0].y);
                        break;

                    case "up":
                        $scope.canvas.ctx.drawImage($scope.images.head_up, 25 * $scope.controls.snake[0].x, 25 * $scope.controls.snake[0].y);
                        break;

                    case "down":
                        $scope.canvas.ctx.drawImage($scope.images.head_down, 25 * $scope.controls.snake[0].x, 25 * $scope.controls.snake[0].y);
                        break;
                }

                switch ($scope.controls.tail_direction) {
                    case "left":
                        $scope.canvas.ctx.drawImage($scope.images.head_left, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].x, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].y);
                        break;

                    case "right":
                        $scope.canvas.ctx.drawImage($scope.images.head_right, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].x, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].y);
                        break;

                    case "up":
                        $scope.canvas.ctx.drawImage($scope.images.head_up, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].x, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].y);
                        break;

                    case "down":
                        $scope.canvas.ctx.drawImage($scope.images.head_down, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].x, 25 * $scope.controls.snake[$scope.controls.snake.length - 1].y);
                        break;
                }

                // score
                $scope.canvas.ctx.textAlign = "center";
                $scope.canvas.ctx.fillStyle = "#606060";
                $scope.canvas.ctx.font = "20px oxygen";
                $scope.canvas.ctx.fillText("Score: " + $scope.controls.score, 250, 25);

                // pause message
                if ($scope.controls.pause) {
                    $scope.canvas.ctx.fillStyle = "#606060";
                    $scope.canvas.ctx.font = "50px oxygen";
                    $scope.canvas.ctx.fillText("PAUSE", 250, 250);
                }

                // yum message if apple was recently eaten
                $scope.timers.yum_elapsed = new Date().getTime() - $scope.timers.yum_start;
                if ($scope.timers.yum_elapsed <= 1000) {
                    $scope.canvas.ctx.fillStyle = "#606060";
                    $scope.canvas.ctx.font = "50px oxygen";
                    $scope.canvas.ctx.fillText("YUM!", 250, 250);
                }
            }
        },

        // check head for collisions
        collisions: function () {

            // die if snake hits a well
            if ($scope.controls.snake[0].x >= 20 || $scope.controls.snake[0].x < 0 ||
                $scope.controls.snake[0].y >= 20 || $scope.controls.snake[0].y < 0) {

                $scope.controls.dead = true;

            }

            // die if snake hits itself
            for (i = 1; i < $scope.controls.snake.length - 2; ++i) {
                if ($scope.controls.snake[i].x == $scope.controls.snake[0].x &&
                    $scope.controls.snake[i].y == $scope.controls.snake[0].y) {

                    $scope.controls.dead = true;

                }
            }

            // grow snake if it hits an apple
            if ($scope.controls.snake[0].x == $scope.controls.apple.x && $scope.controls.snake[0].y == $scope.controls.apple.y) {

                switch ($scope.controls.tail_direction) {

                    case "right":
                        $scope.controls.snake[$scope.controls.snake.length] = new $scope.actions.SnakeNode($scope.controls.snake[$scope.controls.snake.length - 1].x + 1, $scope.controls.snake[$scope.controls.snake.length - 1].y);
                        break;

                    case "left":
                        $scope.controls.snake[$scope.controls.snake.length] = new $scope.actions.SnakeNode($scope.controls.snake[$scope.controls.snake.length - 1].x - 1, $scope.controls.snake[$scope.controls.snake.length - 1].y);
                        break;

                    case "up":
                        $scope.controls.snake[$scope.controls.snake.length] = new $scope.actions.SnakeNode($scope.controls.snake[$scope.controls.snake.length - 1].x, $scope.controls.snake[$scope.controls.snake.length - 1].y - 1);
                        break;

                    case "down":
                        $scope.controls.snake[$scope.controls.snake.length] = new $scope.actions.SnakeNode($scope.controls.snake[$scope.controls.snake.length - 1].x, $scope.controls.snake[$scope.controls.snake.length - 1].y + 1);
                        break;

                }

                $scope.timers.yum_start = new Date().getTime();
                $scope.actions.spawnApple();
                $scope.controls.score++;

            }
        },

        // moves each snake snode one step towards the head
        follow: function () {

            for (var i = $scope.controls.snake.length - 1; i > 0; i--) {
                $scope.controls.snake[i].x = $scope.controls.snake[i - 1].x;
                $scope.controls.snake[i].y = $scope.controls.snake[i - 1].y;
            }

            // updates the tail's orientation
            if ($scope.controls.snake[$scope.controls.snake.length - 1].x > $scope.controls.snake[$scope.controls.snake.length - 2].x) {
                $scope.controls.tail_direction = "right";
            }

            else if ($scope.controls.snake[$scope.controls.snake.length - 1].x < $scope.controls.snake[$scope.controls.snake.length - 2].x) {
                $scope.controls.tail_direction = "left";
            }

            else if ($scope.controls.snake[$scope.controls.snake.length - 1].y > $scope.controls.snake[$scope.controls.snake.length - 2].y) {
                $scope.controls.tail_direction = "down";
            }

            else if ($scope.controls.snake[$scope.controls.snake.length - 1].y < $scope.controls.snake[$scope.controls.snake.length - 2].y) {
                $scope.controls.tail_direction = "up";
            }

        },

        // updates the game using the head_direction variable
        update: function () {
            if (!$scope.controls.pause) {
                $scope.controls.head_direction = $scope.controls.next_head_direction;
                $scope.actions.follow();

                switch ($scope.controls.head_direction) {
                    case "left":
                        $scope.controls.snake[0].x--;
                        break;

                    case "right":
                        $scope.controls.snake[0].x++;
                        break;

                    case "up":
                        $scope.controls.snake[0].y--;
                        break;

                    case "down":
                        $scope.controls.snake[0].y++;
                        break;
                }

                $scope.actions.collisions();
            }
        },

        // creates 3 node starting snake and randomly placed apple
        init: function () {
            $scope.controls.menu = true;
            $scope.controls.pause = true;
            $scope.controls.dead = false;

            $scope.controls.score = 0;

            $scope.controls.head_direction = "up";
            $scope.controls.next_head_direction = "up";
            $scope.controls.tail_direction = "down";

            $scope.controls.snake = [];

            for (var i = 0; i < 3; ++i) {
                $scope.controls.snake[i] = new $scope.actions.SnakeNode(0, 17 + i);
            }

            $scope.actions.spawnApple();
        },

        // starts the game
        start: function () {
            if (!$scope.controls.game_started) {
                $scope.canvas.c = document.getElementById("snake_board");
                $scope.canvas.ctx = $scope.canvas.c.getContext("2d");
                $scope.actions.init();
                $scope.controls.game_started = true;
                $scope.controls.menu = true;

                $scope.controls.interval_handle = setInterval(function () {
                    $scope.actions.update();
                    $scope.actions.draw();
                }, $scope.controls.game_speed);

            }
        }
    };

    // keyboard event handler
    window.onkeydown = function (evt) {

        evt = evt || window.event;
        evt.preventDefault();

        if ($scope.controls.dead && ((evt.keycode || evt.which) == 13)) {
            $scope.actions.init();
        }

        else if ($scope.controls.menu) {
            switch (evt.keycode || evt.which) {
                case 13:
                    //Remove the menu, kill the game loop and restart it with
                    //new game_speed value
                    $scope.controls.menu = false;
                    switch ($scope.controls.menu_selected) {
                        case 0:
                            $scope.controls.game_speed = 150;
                            break;
                        case 1:
                            $scope.controls.game_speed = 100;
                            break;
                        case 2:
                            $scope.controls.game_speed = 50;
                            break;
                        case 3:
                            $scope.controls.game_speed = 30;
                            break;
                    }

                    clearInterval($scope.controls.interval_handle);
                    $scope.controls.interval_handle = setInterval(function () {
                        $scope.actions.update();
                        $scope.actions.draw();
                    }, $scope.controls.game_speed);
                    break;

                case 74:
                    $scope.controls.menu_selected++;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 4;
                    break;

                case 40:
                    $scope.controls.menu_selected++;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 4;
                    break;

                case 75:
                    $scope.controls.menu_selected--;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 4;
                    if ($scope.controls.menu_selected == -1) {
                        $scope.controls.menu_selected = 3;
                    }
                    break;

                case 38:
                    $scope.controls.menu_selected--;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 4;
                    if ($scope.controls.menu_selected == -1) {
                        $scope.controls.menu_selected = 3;
                    }
                    break;
            }
        }

        else {
            switch (evt.keycode || evt.which) {
                // letter h
                case 72:
                    if ($scope.controls.head_direction != "right") {
                        $scope.controls.next_head_direction = "left";
                        $scope.controls.pause = false;
                    }
                    break;

                // left arrow
                case 37:
                    if ($scope.controls.head_direction != "right") {
                        $scope.controls.next_head_direction = "left";
                        $scope.controls.pause = false;
                    }
                    break;

                // letter j
                case 74:
                    if ($scope.controls.head_direction != "up") {
                        $scope.controls.next_head_direction = "down";
                        $scope.controls.pause = false;

                    }
                    break;

                // down arrow
                case 40:
                    if ($scope.controls.head_direction != "up") {
                        $scope.controls.next_head_direction = "down";
                        $scope.controls.pause = false;

                    }
                    break;

                // letter k
                case 75:
                    if ($scope.controls.head_direction != "down") {
                        $scope.controls.next_head_direction = "up";
                        $scope.controls.pause = false;
                    }
                    break;

                // up arrow
                case 38:
                    if ($scope.controls.head_direction != "down") {
                        $scope.controls.next_head_direction = "up";
                        $scope.controls.pause = false;
                    }
                    break;

                // letter l
                case 76:
                    if ($scope.controls.head_direction != "left") {
                        $scope.controls.next_head_direction = "right";
                        $scope.controls.pause = false;
                    }
                    break;

                // right arrow
                case 39:
                    if ($scope.controls.head_direction != "left") {
                        $scope.controls.next_head_direction = "right";
                        $scope.controls.pause = false;
                    }
                    break;

                // letter p
                case 80:
                    $scope.controls.pause = !$scope.controls.pause;
                    break;
            }
        }
    };

}]);
