angular.module('asteroid', [])
.controller('asteroidCtrl', ['$scope', function($scope) {

    $scope.canvas = {
        c: document.getElementById("asteroid_board"),
        ctx: null
    };

    $scope.canvas.ctx = $scope.canvas.c.getContext("2d");

    $scope.controls = {
        game_started: false,
        menu: true,
        pause: false,
        survival: false,
        adventure: false,
        cutscene: false,
        dead: false,
        menu_selected: 0,
        asteroid_speed: 2,

        // counters
        lives: 3,
        level: 0,
        score: 0,
        bullet_index: 0,
        asteroid_index: 0,
        explosion_index: 0,
        asteroid_count: 0,

        // ship
        firing_rate: 200,
        gun_type: 1,
        ship_orientation: "up",
        invincible: false,
        shooting: false,
        moving_right: false,
        moving_left: false,
        moving_up: false,
        moving_down: false
    };

    $scope.timers = {
        invincible_start: 0,
        asteroid_spawn_start: 0,
        cooldown_start: 0,
        cutscene_start: 0,
        powerup_start: 0
    };

    $scope.containers = {
        bullets: [],
        asteroids: [],
        explosions: []
    };

    $scope.images = {
        ship_img: new Image(),
        ship_left: new Image(),
        ship_right: new Image(),
        ship_up: new Image(),
        ship_down: new Image(),
        asteroid_big_img: new Image(),
        asteroid_small_img: new Image(),
        arrow_img: new Image(),
        life_img: new Image(),
        explosion_img: new Image(),
        play_img: new Image()
    };

    $scope.images.ship_img.src = "modules/asteroid/images/ship_up.png";
    $scope.images.ship_left.src = "modules/asteroid/images/ship_left.png";
    $scope.images.ship_right.src = "modules/asteroid/images/ship_right.png";
    $scope.images.ship_up.src = "modules/asteroid/images/ship_up.png";
    $scope.images.ship_down.src = "modules/asteroid/images/ship_down.png";
    $scope.images.asteroid_big_img.src = "modules/asteroid/images/asteroid_big.png";
    $scope.images.asteroid_small_img.src = "modules/asteroid/images/asteroid_small.png";
    $scope.images.arrow_img.src = "modules/asteroid/images/arrow.png";
    $scope.images.life_img.src = "modules/asteroid/images/ship_up.png";
    $scope.images.explosion_img.src = "modules/asteroid/images/explosion.png";
    $scope.images.play_img.src = "modules/asteroid/images/play.png";

    // draw default canvas
    $scope.canvas.ctx.textAlign = "center";
    $scope.canvas.ctx.fillStyle = "#303030";
    $scope.canvas.ctx.font = "50px droid sans";
    $scope.canvas.ctx.fillText("ASTEROID",250,150);
    $scope.canvas.ctx.font = "35px droid sans";
    $scope.canvas.ctx.fillText("CLICK",190,300);
    $scope.canvas.ctx.fillText("TO PLAY",185,350);

    $scope.images.play_img.onload = function () {
        $scope.canvas.ctx.drawImage($scope.images.play_img,300,260);
    }

    $scope.actions = {
        createPlayer: function () {
            this.x_ = 250;
            this.y_ = 250;
            this.speedX_ = 0;
            this.speedY_ = 0;
        },

        createAsteroid: function (x,y) {
            if (arguments.length == 0) {
                this.x_ = Math.random() * 500;
                this.y_ = Math.random() * 500;

                // prevent asteroids from spawning too close to the ship
                while (Math.abs(this.x_ - $scope.player.x_) < 100 && Math.abs(this.y_ - $scope.player.y_) < 100) {
                    this.x_ = Math.random() * 500;
                    this.y_ = Math.random() * 500;
                }

                this.size_ = 20;
            }

            // smaller $scope.containers.asteroids that spawn where a bigger one was destroyed
            else {
                this.x_ = x;
                this.y_ = y;
                this.size_ = 12;
            }

            this.speedX_ = (Math.random() * $scope.controls.asteroid_speed) - $scope.controls.asteroid_speed / 2;
            this.speedY_ = (Math.random() * $scope.controls.asteroid_speed) - $scope.controls.asteroid_speed / 2;
            this.active = true;

            $scope.controls.asteroid_count++;
            $scope.controls.asteroid_index++;
            $scope.controls.asteroid_index = $scope.controls.asteroid_index % 100;
        },

        createBullet: function (x,y) {
            this.x_ = x;
            this.y_ = y;

            switch ($scope.controls.ship_orientation) {
                case "right":
                    this.speedX_ = 4;
                    this.speedY_ = 0;
                    break;

                case "left":
                    this.speedX_ = -4;
                    this.speedY_ = 0;
                    break;

                case "up":
                    this.speedX_ = 0;
                    this.speedY_ = 4;
                    break;

                case "down":
                    this.speedX_ = 0;
                    this.speedY_ = -4;
                    break;
            }

            this.active = true;

            $scope.controls.bullet_index++;
            $scope.controls.bullet_index = $scope.controls.bullet_index % 100;
        },

        createExplosion: function (x,y) {
            this.x_ = x;
            this.y_ = y;
            this.start_ = new Date().getTime();

            $scope.controls.explosion_index++;
            $scope.controls.explosion_index = $scope.controls.explosion_index % 25;
        },

        pauseGame: function () {
            $scope.controls.pause = true;
        },

        unpauseGame: function () {
            $scope.timers.asteroid_spawn_start = new Date().getTime();
            $scope.timers.cooldown_start = new Date().getTime();
            $scope.controls.pause = false;
        },

        drawMenu: function () {
            // background
            $scope.canvas.ctx.fillStyle = "#ffffff";
            $scope.canvas.ctx.fillRect(0,0,500,500);

            // title
            $scope.canvas.ctx.textAlign = "center";
            $scope.canvas.ctx.fillStyle = "#303030";
            $scope.canvas.ctx.font = "50px droid sans";
            $scope.canvas.ctx.fillText("SELECT MODE",250,100);

            // options
            $scope.canvas.ctx.textAlign = "start";
            $scope.canvas.ctx.fillStyle = "#606060";
            $scope.canvas.ctx.font = "35px droid sans";
            $scope.canvas.ctx.fillText("Adventure",175,225);
            $scope.canvas.ctx.fillText("Survival",175,275);

            // ship
            $scope.canvas.ctx.drawImage($scope.images.ship_right,50,400);

            // bullets
            $scope.canvas.ctx.fillStyle = "#ff0000";
            for (var i=0; i<7; i++) {
                $scope.canvas.ctx.fillRect(150+30*i,415,3,3);
            }

            // asteroids
            $scope.canvas.ctx.fillStyle = "#303030";
            $scope.canvas.ctx.beginPath();
            $scope.canvas.ctx.arc(40,90,20,0,2*Math.PI);
            $scope.canvas.ctx.fill();
            $scope.canvas.ctx.beginPath();
            $scope.canvas.ctx.arc(150,165,10,0,2*Math.PI);
            $scope.canvas.ctx.fill();
            $scope.canvas.ctx.beginPath();
            $scope.canvas.ctx.arc(50,290,20,0,2*Math.PI);
            $scope.canvas.ctx.fill();
            $scope.canvas.ctx.beginPath();
            $scope.canvas.ctx.arc(390,50,10,0,2*Math.PI);
            $scope.canvas.ctx.fill();
            $scope.canvas.ctx.beginPath();
            $scope.canvas.ctx.arc(400,310,20,0,2*Math.PI);
            $scope.canvas.ctx.fill();

            // explosion
            $scope.canvas.ctx.drawImage($scope.images.explosion_img,340,395);

            // arrow on selected option
            switch ($scope.controls.menu_selected) {
                case 0:
                    $scope.canvas.ctx.drawImage($scope.images.arrow_img,125,200);
                    break;

                case 1:
                    $scope.canvas.ctx.drawImage($scope.images.arrow_img,125,250);
                    break;
            }
        },

        drawGameOver: function () {
            // background
            $scope.canvas.ctx.fillStyle = "#ffffff";
            $scope.canvas.ctx.fillRect(0,0,500,500);

            $scope.canvas.ctx.fillStyle = "#303030";
            $scope.canvas.ctx.textAlign = "center";
            $scope.canvas.ctx.font = "50px Droid Sans";
            $scope.canvas.ctx.fillText("GAME OVER",250,100);

            if ($scope.controls.survival) {
                $scope.canvas.ctx.fillStyle = "#606060";
                $scope.canvas.ctx.font = "35px Droid Sans";
                $scope.canvas.ctx.fillText("YOUR FINAL SCORE",250,225);
                $scope.canvas.ctx.fillStyle = "#303030";
                $scope.canvas.ctx.fillText($scope.controls.score,250,275);
                $scope.canvas.ctx.fillStyle = "#606060";
                $scope.canvas.ctx.fillText("PRESS ENTER",250,375);
                $scope.canvas.ctx.fillText("TO PLAY AGAIN",250,425);
            }

            else {
                $scope.canvas.ctx.fillStyle = "#606060";
                $scope.canvas.ctx.font = "35px Droid Sans";
                $scope.canvas.ctx.fillText("YOU DIED AT $scope.controls.level ",250,225);
                $scope.canvas.ctx.fillStyle = "#303030";
                $scope.canvas.ctx.fillText($scope.controls.level,250,275);
                $scope.canvas.ctx.fillStyle = "#606060";
                $scope.canvas.ctx.fillText("PRESS ENTER",250,375);
                $scope.canvas.ctx.fillText("TO PLAY AGAIN",250,425);
            }
        },

        drawCutscene: function () {
            $scope.canvas.ctx.fillStyle = "#ffffff";
            $scope.canvas.ctx.fillRect(0, 0, 500, 500);
            $scope.canvas.ctx.textAlign = "center";
            $scope.canvas.ctx.fillStyle = "#303030";
            $scope.canvas.ctx.font = "50px Droid Sans";
            $scope.canvas.ctx.fillText("Level " + $scope.controls.level, 250, 250);
        },

        draw: function () {
            if ($scope.controls.menu) {
                $scope.actions.drawMenu();
            }
            else if ($scope.controls.cutscene) {
                $scope.actions.drawCutscene();
            }
            else if ($scope.controls.dead) {
                $scope.actions.drawGameOver();
            }
            else {
                $scope.canvas.ctx.fillStyle = "#ffffff";
                $scope.canvas.ctx.fillRect(0,0,500,500);

                // ship with proper orientation
                switch ($scope.controls.ship_orientation) {
                    case "up":
                        $scope.images.ship_img = $scope.images.ship_up;
                        break;
                    case "down":
                        $scope.images.ship_img = $scope.images.ship_down;
                        break;
                    case "left":
                        $scope.images.ship_img = $scope.images.ship_left;
                        break;
                    case "right":
                        $scope.images.ship_img = $scope.images.ship_right;
                        break;
                }

                // bullets
                $scope.canvas.ctx.fillStyle = "#ff0000";
                for (var i=0; i<$scope.containers.bullets.length; i++) {
                    if ($scope.containers.bullets[i].active)
                        $scope.canvas.ctx.fillRect($scope.containers.bullets[i].x_, 500 - $scope.containers.bullets[i].y_, 3, 3);
                }

                // asteroids
                $scope.canvas.ctx.fillStyle = "#303030";
                for (var i=0; i<$scope.containers.asteroids.length; i++) {
                    if ($scope.containers.asteroids[i].active) {
                        $scope.canvas.ctx.beginPath();
                        $scope.canvas.ctx.arc($scope.containers.asteroids[i].x_, 500 - $scope.containers.asteroids[i].y_, $scope.containers.asteroids[i].size_, 0, 2 * Math.PI);
                        $scope.canvas.ctx.fill();
                    }
                }

                // explosions
                for (var i=0; i<$scope.containers.explosions.length; i++) {
                    $scope.canvas.ctx.drawImage($scope.images.explosion_img,$scope.containers.explosions[i].x_-31,500-$scope.containers.explosions[i].y_-31);
                }

                // clean up explosions
                var time_now = new Date().getTime();
                for (var i=0; i<$scope.containers.explosions.length; i++) {
                    if (time_now - $scope.containers.explosions[i].start_ >= 1000)
                        $scope.containers.explosions[i] = 0;
                }

                // ship
                if ($scope.controls.invincible) {
                    if ((((new Date().getTime() - $scope.controls.invincible_start) / 100) % 2) > 1)
                        $scope.canvas.ctx.drawImage($scope.images.ship_img, $scope.player.x_ - 17, 500 - ($scope.player.y_ + 17));
                }
                else
                    $scope.canvas.ctx.drawImage($scope.images.ship_img, $scope.player.x_ - 17, 500 - ($scope.player.y_ + 17));

                // score
                $scope.canvas.ctx.textAlign = "start";
                $scope.canvas.ctx.fillStyle = "#606060";
                $scope.canvas.ctx.font = "20px droid sans";

                if ($scope.controls.survival)
                    $scope.canvas.ctx.fillText("Score: " + $scope.controls.score,5,25);
                else
                    $scope.canvas.ctx.fillText("Level: " + $scope.controls.level, 5, 25);

                // gun type
                $scope.canvas.ctx.fillText("Gun: ",5,490);
                switch ($scope.controls.gun_type) {
                    case 1:
                        $scope.canvas.ctx.fillRect(55,482,5,5);
                        break;

                    case 2:
                        $scope.canvas.ctx.fillRect(55,475,5,5);
                        $scope.canvas.ctx.fillRect(55,485,5,5);
                        break;

                    default:
                        $scope.canvas.ctx.fillRect(55,472,5,5);
                        $scope.canvas.ctx.fillRect(63,482,5,5);
                        $scope.canvas.ctx.fillRect(55,492,5,5);
                        break;
                }

                // lives
                $scope.images.life_img.src = "images/ship_up.png";
                for (i=0; i<$scope.controls.lives; i++) {
                    $scope.canvas.ctx.drawImage($scope.images.life_img, 25*(18-i),5);
                }

                // pause message
                if ($scope.controls.pause) {
                    $scope.canvas.ctx.textAlign = "center";
                    $scope.canvas.ctx.fillStyle = "#606060";
                    $scope.canvas.ctx.font = "50px droid sans";
                    $scope.canvas.ctx.fillText("Pause",250,275);
                }

                // powerup message
                if (new Date().getTime() - $scope.timers.powerup_start <= 1000) {
                    $scope.canvas.ctx.textAlign = "center";
                    $scope.canvas.ctx.fillStyle = "#606060";
                    $scope.canvas.ctx.font = "50px droid sans";
                    $scope.canvas.ctx.fillText("POWER UP!",250,275);
                }
            }
        },

        update: function () {
            var now = new Date().getTime();
            if ($scope.controls.lives == -1)
                $scope.controls.dead = true;

            // end invincibility after 2 seconds
            if ($scope.controls.invincible) {
                if (now - $scope.controls.invincible_start >= 2000)
                    $scope.controls.invincible = false;
            }

            // spawn asteroids if in $scope.controls.survival mode
            if ($scope.controls.survival) {
                if ($scope.controls.score <= 200) {
                    if (now - $scope.timers.asteroid_spawn_start >= 5000 - (20 * $scope.controls.score)) {
                        $scope.containers.asteroids[$scope.controls.asteroid_index] = new $scope.actions.createAsteroid();
                        $scope.timers.asteroid_spawn_start = now;
                    }
                }

                else {
                    if (now - $scope.timers.asteroid_spawn_start >= 1000) {
                        $scope.containers.asteroids[$scope.controls.asteroid_index] = new $scope.actions.createAsteroid();
                        $scope.timers.asteroid_spawn_start = now;
                    }
                }
            }

            // move to the next level if there are no asteroids left in adventure mode
            if ($scope.controls.adventure) {
                if ($scope.controls.asteroid_count == 0 && !$scope.controls.cutscene) {
                    $scope.controls.level++;
                    $scope.timers.cutscene_start = now;
                    $scope.controls.cutscene = true;
                }

                if (new Date().getTime() - $scope.timers.cutscene_start >= 2000 && $scope.controls.cutscene) {
                    for (var i=0; i<$scope.controls.level*2; i++) {
                        $scope.containers.asteroids[$scope.controls.asteroid_index] = new $scope.actions.createAsteroid();
                    }
                    $scope.controls.cutscene = false;
                }
            }

            // fire bullets
            if ($scope.controls.shooting) {
                if (new Date().getTime() - $scope.timers.cooldown_start >= $scope.controls.firing_rate) {
                    $scope.actions.fire();
                    $scope.timers.cooldown_start = now;
                }
            }

            // set speed according to movement control variables
            if ($scope.controls.moving_right) {
                $scope.player.speedX_ = 2;
                $scope.player.speedY_ = 0;
            }
            else if ($scope.controls.moving_left) {
                $scope.player.speedX_ = -2;
                $scope.player.speedY_ = 0;
            }
            else if ($scope.controls.moving_up) {
                $scope.player.speedX_ = 0;
                $scope.player.speedY_ = 2;
            }
            else if ($scope.controls.moving_down) {
                $scope.player.speedX_ = 0;
                $scope.player.speedY_ = -2;
            }
            else {
                $scope.player.speedX_ = 0;
                $scope.player.speedY_ = 0;
            }

            // move battleship
            $scope.player.x_ += $scope.player.speedX_;
            $scope.player.y_ += $scope.player.speedY_;

            // move asteroids
            for (i=0; i<$scope.containers.asteroids.length; i++) {
                $scope.containers.asteroids[i].x_ += $scope.containers.asteroids[i].speedX_;
                $scope.containers.asteroids[i].y_ += $scope.containers.asteroids[i].speedY_;
            }

            // move bullets
            for (i=0; i<$scope.containers.bullets.length; i++) {
                $scope.containers.bullets[i].x_ += $scope.containers.bullets[i].speedX_;
                $scope.containers.bullets[i].y_ += $scope.containers.bullets[i].speedY_;
            }

            // wrap ship
            if ($scope.player.x_ < 0) {
                $scope.player.x_ = 500;
            }
            else if ($scope.player.x_ > 500) {
                $scope.player.x_ = 0;
            }
            else if ($scope.player.y_ < 0) {
                $scope.player.y_ = 500;
            }
            else if ($scope.player.y_ > 500) {
                $scope.player.y_ = 0;
            }

            // wrap asteroids
            for (i=0; i<$scope.containers.asteroids.length; i++) {
                if ($scope.containers.asteroids[i].x_ < 0) {
                    $scope.containers.asteroids[i].x_ = 500;
                }
                else if ($scope.containers.asteroids[i].x_ > 500) {
                    $scope.containers.asteroids[i].x_ = 0;
                }
                else if ($scope.containers.asteroids[i].y_ < 0) {
                    $scope.containers.asteroids[i].y_ = 500;
                }
                else if ($scope.containers.asteroids[i].y_ > 500) {
                    $scope.containers.asteroids[i].y_ = 0;
                }
            }
        },

        collisions: function () {
            var x_dist;
            var y_dist;
            var dist;

            // ship - asteroids
            for (var i = 0; i < $scope.containers.asteroids.length; i++) {
                if ($scope.containers.asteroids[i].active) {
                    x_dist = Math.abs($scope.player.x_ - $scope.containers.asteroids[i].x_);
                    y_dist = Math.abs($scope.player.y_ - $scope.containers.asteroids[i].y_);
                    dist = Math.sqrt(x_dist * x_dist + y_dist * y_dist);

                    // 20 is the approximate ship size
                    if (dist <= ($scope.containers.asteroids[i].size_ + 20)) {
                        if (!$scope.controls.invincible) {
                            $scope.controls.lives--;
                            $scope.controls.invincible = true;
                           $scope.controls.invincible_start = new Date().getTime();
                        }

                        $scope.containers.asteroids[i].active = false;
                        $scope.controls.asteroid_count--;
                        $scope.containers.explosions[$scope.controls.explosion_index] = new $scope.actions.createExplosion($scope.containers.asteroids[i].x_, $scope.containers.asteroids[i].y_);

                        if ($scope.containers.asteroids[i].size_ == 20) {
                            for (var j = 0; j < Math.random() * 5; j++) {
                                $scope.containers.asteroids[$scope.controls.asteroid_index] = new $scope.actions.createAsteroid($scope.containers.asteroids[i].x_, $scope.containers.asteroids[i].y_);
                            }
                        }
                    }
                }
            }

            // bullets - asteroids
            for (var i=0; i<$scope.containers.asteroids.length; i++) {
                for (var j=0; j<$scope.containers.bullets.length; j++) {
                    if ($scope.containers.asteroids[i].active && $scope.containers.bullets[j].active) {
                        x_dist = Math.abs($scope.containers.bullets[j].x_ - $scope.containers.asteroids[i].x_);
                        y_dist = Math.abs($scope.containers.bullets[j].y_ - $scope.containers.asteroids[i].y_);
                        dist = Math.sqrt(x_dist*x_dist + y_dist*y_dist);

                        if (dist <= $scope.containers.asteroids[i].size_) {
                            if ($scope.containers.asteroids[i].size_ == 20) {
                                for (var k = 0; k < Math.random() * 5; k++) {
                                    $scope.containers.asteroids[$scope.controls.asteroid_index] = new $scope.actions.createAsteroid($scope.containers.asteroids[i].x_, $scope.containers.asteroids[i].y_);
                                }
                            }

                            $scope.containers.explosions[$scope.controls.explosion_index] = new $scope.actions.createExplosion($scope.containers.asteroids[i].x_, $scope.containers.asteroids[i].y_);

                            // destroy asteroid and bullet
                            $scope.containers.asteroids[i].active = false;
                            $scope.containers.bullets[j].active = false;
                            $scope.controls.asteroid_count--;
                            $scope.controls.score++;

                            // make the asteroids faster as score increases
                            if ($scope.controls.score % 100 == 0) {
                                $scope.controls.asteroid_speed++;
                            }

                            // 2% chance of getting new gun
                            if ($scope.controls.gun_type < 3) {
                                var new_gun = Math.floor(Math.random() * 100);
                                if (new_gun <= 2) {
                                    $scope.controls.gun_type++;
                                    if ($scope.controls.gun_type <= 3) {
                                        $scope.timers.powerup_start = new Date().getTime();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        fire: function () {
            switch ($scope.controls.gun_type) {
                case 1:
                    $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_-2,$scope.player.y_+2);
                    break;

                case 2:
                    if ($scope.controls.ship_orientation == "up" || $scope.controls.ship_orientation == "down") {
                        $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_+8,$scope.player.y_);
                        $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_-12,$scope.player.y_);
                    }
                    else {
                        $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_,$scope.player.y_+12);
                        $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_,$scope.player.y_-8);
                    }
                    break;

                default:
                    switch ($scope.controls.ship_orientation) {
                        case "up":
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_+8,$scope.player.y_);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_-2,$scope.player.y_+8);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_-12,$scope.player.y_);
                            break;

                        case "down":
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_+8,$scope.player.y_);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_-2,$scope.player.y_-8);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_-12,$scope.player.y_);
                            break;

                        case "left":
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_,$scope.player.y_+12);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_-8,$scope.player.y_+2);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_,$scope.player.y_-8);
                            break;

                        case "right":
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_,$scope.player.y_+12);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_+8,$scope.player.y_+2);
                            $scope.containers.bullets[$scope.controls.bullet_index] = new $scope.actions.createBullet($scope.player.x_,$scope.player.y_-8);
                            break;
                    }
            }
        },

        init: function () {
            $scope.player = new $scope.actions.createPlayer();
            $scope.containers.asteroids = [];
            $scope.containers.bullets = [];
            $scope.containers.explosions = [];

            $scope.controls.menu = true;
            $scope.controls.pause = false;
            $scope.controls.survival = false;
            $scope.controls.adventure = false;
            $scope.controls.cutscene = false;
            $scope.controls.dead = false;
            $scope.controls.menu_selected = 0;

            $scope.controls.lives = 3;
            $scope.controls.level = 0;
            $scope.controls.score = 0;
            $scope.controls.bullet_index = 0;
            $scope.controls.asteroid_count = 0;
            $scope.controls.asteroid_index = 0;
            $scope.controls.explosion_index = 0;
            $scope.controls.gun_type = 1;

            $scope.controls.ship_orientation = "up";

            $scope.timers.cooldown_start = new Date().getTime();
            $scope.controls.invincible_start = new Date().getTime();
        },

        animate: function () {
            if (!$scope.controls.pause) {
                $scope.actions.update();
                $scope.actions.collisions();
            }

            $scope.actions.draw();
            requestAnimationFrame($scope.actions.animate);
        },

        start: function () {
            if (!$scope.controls.game_started) {
                $scope.canvas.c = document.getElementById("asteroid_board");
                $scope.canvas.ctx = $scope.canvas.c.getContext("2d");

                $scope.actions.init();
                $scope.controls.game_started = true;

                //Firefox and chrome support
                if (!window.requestAnimationFrame) {
                    window.mozRequestAnimationFrame($scope.actions.animate);
                }

                else {
                    requestAnimationFrame($scope.actions.animate);
                }
            }
        }
    };

    window.onkeydown = function (evt) {
        evt = evt || window.event;
        evt.preventDefault();

        switch(evt.keycode || evt.which) {

            // letter h
            case 72:
                if (!$scope.controls.menu && $scope.controls.pause) {
                    $scope.actions.unpauseGame();
                }

                $scope.controls.ship_orientation = "left";
                $scope.controls.moving_left = true;
                $scope.controls.moving_right = false;
                $scope.controls.moving_up = false;
                $scope.controls.moving_down = false;
                break;

            // left arrow
            case 37:
                if (!$scope.controls.menu && $scope.controls.pause) {
                    $scope.actions.unpauseGame();
                }

                $scope.controls.ship_orientation = "left";
                $scope.controls.moving_left = true;
                $scope.controls.moving_right = false;
                $scope.controls.moving_up = false;
                $scope.controls.moving_down = false;
                break;

            // letter j
            case 74:
                if ($scope.controls.menu) {
                    $scope.controls.menu_selected++;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 2;
                }

                else {
                    if ($scope.controls.pause) {
                        $scope.actions.unpauseGame();
                    }
                    $scope.controls.ship_orientation = "down";
                    $scope.controls.moving_left = false;
                    $scope.controls.moving_right = false;
                    $scope.controls.moving_up = false;
                    $scope.controls.moving_down = true;
                }
                break;

            // down arrow
            case 40:
                if ($scope.controls.menu) {
                    $scope.controls.menu_selected++;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 2;
                }
                else {
                    if ($scope.controls.pause) {
                        $scope.actions.unpauseGame();
                    }

                    $scope.controls.ship_orientation = "down";
                    $scope.controls.moving_left = false;
                    $scope.controls.moving_right = false;
                    $scope.controls.moving_up = false;
                    $scope.controls.moving_down = true;
                }
                break;

            // letter k
            case 75:
                if ($scope.controls.menu) {
                    $scope.controls.menu_selected++;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 2;
                }
                else {
                    if ($scope.controls.pause) {
                        $scope.actions.unpauseGame();
                    }
                    $scope.controls.ship_orientation = "up";
                    $scope.controls.moving_left = false;
                    $scope.controls.moving_right = false;
                    $scope.controls.moving_up = true;
                    $scope.controls.moving_down = false;
                }
                break;

            // up arrow
            case 38:
                if ($scope.controls.menu) {
                    $scope.controls.menu_selected++;
                    $scope.controls.menu_selected = $scope.controls.menu_selected % 2;
                }
                else {
                    if ($scope.controls.pause) {
                        $scope.actions.unpauseGame();
                    }
                    $scope.controls.ship_orientation = "up";
                    $scope.controls.moving_left = false;
                    $scope.controls.moving_right = false;
                    $scope.controls.moving_up = true;
                    $scope.controls.moving_down = false;
                }
                break;

            // letter l
            case 76:
                if (!$scope.controls.menu && $scope.controls.pause) {
                    $scope.actions.unpauseGame();
                }
                $scope.controls.ship_orientation = "right";
                $scope.controls.moving_left = false;
                $scope.controls.moving_right = true;
                $scope.controls.moving_up = false;
                $scope.controls.moving_down = false;
                break;

            // right arrow
            case 39:
                if (!$scope.controls.menu && $scope.controls.pause) {
                    $scope.actions.unpauseGame();
                }
                $scope.controls.ship_orientation = "right";
                $scope.controls.moving_left = false;
                $scope.controls.moving_right = true;
                $scope.controls.moving_up = false;
                $scope.controls.moving_down = false;
                break;

            // spacebar
            case 32:
                if ($scope.controls.pause) {
                    $scope.actions.unpauseGame();
                }
                $scope.controls.shooting = true;
                break;

            // letter p
            case 80:
                if ($scope.controls.pause) {
                    $scope.actions.unpauseGame();
                }
                else {
                    $scope.actions.pauseGame();
                }
                break;

            // enter
            case 13:
                if ($scope.controls.menu) {
                    // start the game
                    $scope.controls.menu = false;
                    $scope.images.ship_img.src = "images/ship_up.png";

                    // set the right game mode
                    if ($scope.controls.menu_selected == 1) {
                        $scope.controls.survival = true;
                        $scope.timers.asteroid_spawn_start = new Date().getTime();
                    }
                    else {
                        $scope.controls.adventure = true;
                        $scope.timers.cutscene_start = new Date().getTime();
                    }
                }

                else if ($scope.controls.dead) {
                    init();
                }
                break;
        }
    };

    window.onkeyup = function(evt) {
        evt = evt || window.event;
        evt.preventDefault();

        switch(evt.keycode || evt.which) {

            // letter h
            case 72:
                $scope.controls.moving_left = false;
                break;

            // left arrow
            case 37:
                $scope.controls.moving_left = false;
                break;

            // letter j
            case 74:
                $scope.controls.moving_down = false;
                break;

            // down arrow
            case 40:
                $scope.controls.moving_down = false;
                break;

            // letter k
            case 75:
                $scope.controls.moving_up = false;
                break;

            // up arrow
            case 38:
                $scope.controls.moving_up = false;
                break;

            // letter l
            case 76:
                $scope.controls.moving_right = false;
                break;

            // right arrow
            case 39:
                $scope.controls.moving_right = false;
                break;

            // spacebar
            case 32:
                $scope.controls.shooting = false;
                break;
        }
    };
}]);
