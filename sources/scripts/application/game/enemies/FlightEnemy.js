/*jshint undef:false */
var FlightEnemy = Enemy.extend({
    init:function(position){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = 60;
        this.width = 142/2;
        this.height = 142/2;
        this.type = 'flight';
        this.node = null;
        this.life = 50000;

        this.radius = 200;
        this.acumSimCos = 0;

        this.setPosition(position.x,position.y);

        this.boundsCollision = true;

    },
    build: function(){
        // console.log('criou o Heart');
        var self = this;
        var motionArray = this.getFramesByRange('dragon10',0,14);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);
        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.play('idle');
        this.centerPosition = {x:this.width/2, y:this.height/2};

        this.updateable = true;
        this.collidable = true;
        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();

        // this.acumSimCos += 0.05;
        this.virtualVelocity.x = 5;//Math.sin(this.acumSimCos) * 10;
        this.virtualVelocity.y = -5;//Math.cos(this.acumSimCos) * 10;
    },
    debug:function(){
        // draw a shape
        // console.log('debug', this.debugGraphic.parent);
        if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        {
            this.getContent().parent.addChild(this.debugGraphic);
        }
        this.debugGraphic.clear();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900);
        this.debugGraphic.moveTo(this.bounds.x ,this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y);
        this.debugGraphic.lineTo(this.bounds.x + this.bounds.w, this.bounds.y + this.bounds.h);
        this.debugGraphic.lineTo(this.bounds.x, this.bounds.y + this.bounds.h);
        this.debugGraphic.endFill();
    },
    update: function(){


        // this.debug();
        this._super();
        this.getBounds();
        // console.log(this.bounds);
        // this.updateCollisionPoints();

        // console.log(this.collisionPoints);
        // if(this.getTexture()){
        //     this.getContent().position.x = 80;
        //     this.getContent().position.y = -20;
        //     this.range = this.bounds.w / 2;
        // }

        // this.velocity.x = 2;
        // this.velocity.y = -2;
        this.acumSimCos += 0.05;
        this.virtualVelocity.x = Math.sin(this.acumSimCos) * 5;
        this.virtualVelocity.y = Math.cos(this.acumSimCos) * 5;

    },
    preKill:function(){
        var self = this;
        this.updateable = false;
        this.collidable = false;
        TweenLite.to(this.getContent(), 0.5, {alpha:0, onComplete:function(){self.kill = true;}});
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection){
        this.isTouch = true;
        if(collection.left||collection.right && this.virtualVelocity.x !== 0)
        {
            this.velocity.x = 0;
        }
        if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        {
            this.velocity.y = 0;
        }
    },
});
