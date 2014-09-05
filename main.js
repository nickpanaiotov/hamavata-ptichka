var game = new Phaser.Game(400,480,Phaser.AUTO, 'game_div');


var main_state = {


    preload: function(){

        this.game.stage.backgroundColor='#71c5cf';
        this.game.load.image('background','images/background.png');

        this.game.load.spritesheet('bird','images/bird.png',34,24,3);
        this.game.load.spritesheet('pipe', 'images/pipe_sprite.png',55,60,1);


    },

    create: function(){

        game.add.sprite(0,0,'background');


        this.bird = this.game.add.sprite(100,245,'bird');
        this.bird.body.gravity.y=1200;

        this.bird.anchor.setTo(-0.2,0.5);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20,'pipe');

        this.timer = this.game.time.events.loop(1250, this.add_row_of_pipes,this);

        var space_key =
            this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);
        //mouse or tab
        this.input.onDown.add(this.jump, this);

        this.score = 0;

        var style = {font:"30px Arial", fill:'black'};
        this.show_score = this.game.add.text(20, 20,"0", style);

         this.bird.animations.add('flap');
         this.bird.animations.play('flap',12,true);
    },

    update: function(){
        if(this.bird.inWorld==false) {
            this.restart_game();
        }
        this.game.physics.overlap(this.bird,this.pipes, this.hit_pipe,null,this);
        //TODO: make gameover screen;


            if(this.bird.angle<45){
                this.bird.angle++;
            }




    },
    hit_pipe:function(){
      if(this.bird.alive==false){
          return;
      }
        this.bird.alive=false;

        this.game.time.events.remove(this.timer);

        this.pipe.forEachAlive(function p(){
            p.body.velocity.x=0;
        },this)
    },

    jump: function() {
        if(this.bird.alive==false){
            return;
        }

        this.bird.body.velocity.y = -350;

        var animation = this.game.add.tween(this.bird);
        animation.to({angle:-20},100);
        animation.start();

    },

    restart_game: function(){
        this.game.state.start('main');
        this.game.time.events.remove(this.timer);

    },

    add_one_pipe:function(x,y){
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x,y);
        pipe.body.velocity.x= -200;
        pipe.outOfBoundsKill = true;


    },

    add_row_of_pipes: function(){
        var hole = Math.floor((Math.random()*5))+1;

        for (var i = 0; i < 8; i++) {
            if (!(i == hole) && !(i == hole + 1)) {
                this.add_one_pipe(400, (i * 60));
            }
        }

        this.score++;
        this.show_score.content = this.score;
    }

};

game.state.add('main',main_state);
game.state.start('main');
