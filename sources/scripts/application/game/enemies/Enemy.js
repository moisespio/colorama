/*jshint undef:false */
var Enemy = SpritesheetEntity.extend({
    init:function(player){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = APP.tileSize.x/2;
        this.width = APP.tileSize.x * 0.9;
        this.height = APP.tileSize.y * 0.9;
        this.type = 'enemy';
        this.node = null;
        this.life = 1000;
        this.boundsCollision = true;
        this.defaultVelocity = 1;
        this.player = player;
        this.behaviour = new DefaultBehaviour(this, player);
    },
    hurt:function(power){
        console.log('hurt');
        this.getTexture().tint = 0xFF0000;
        this.life -= power;
        if(this.life <= 0){
            this.preKill();
        }
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
    },
    update: function(){
        this.behaviour.update();
        if(!this.isTouch){
            this.velocity = this.virtualVelocity;
        }
        this._super();
        this.getBounds();
        if(this.getTexture()){
            // this.width = 0;
            // this.height = 0;
            this.getContent().position.x = 20;
            // this.getContent().position.y = -20;
            // this.range = this.bounds.w / 2;
        }

    },
    preKill:function(){
        //this._super();
        var self = this;
        this.updateable = false;
        this.collidable = false;
        TweenLite.to(this.getContent(), 0.5, {alpha:0, onComplete:function(){self.kill = true;}});
        // if(this.debugGraphic.parent){
        //     this.debugGraphic.parent.removeChild(this.debugGraphic);
        // }
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