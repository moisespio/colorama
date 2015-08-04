/*jshint undef:false */
var Player = SpritesheetEntity.extend({
    init:function(){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.collidable = true;
        this.range = APP.tileSize.x/2;
        this.width = APP.tileSize.x * 0.8;
        this.height = APP.tileSize.y * 0.8;
        this.type = 'player';
        this.collisionPointsMarginDivide = 0;
        this.isTouch = false;
        this.boundsCollision = true;


        this.defaultVelocity = 3;
        this.endLevel = false;
        this.fireSpeed = 10;
        this.fireFreq = 5;
        // this.fireFreq = 15;
        this.fireFreqAcum = 0;
        this.fireStepLive = 20;
        this.firePower = 20;

        this.touchCollection = {up:false, down:false,left:false, right:false, middleUp:false,middleDown:false,bottomLeft:false,bottomRight:false,topLeft:false,topRight:false};
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
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        // console.log()
        this.bounds = {x: this.getPosition().x , y: this.getPosition().y, w: this.width, h: this.height};
        this.collisionPoints = {
            up:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y},
            down:{x:this.bounds.x + this.bounds.w / 2, y:this.bounds.y + this.bounds.h},
            bottomLeft:{x:this.bounds.x, y:this.bounds.y+this.bounds.h},
            topLeft:{x:this.bounds.x, y:this.bounds.y},
            bottomRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y+this.bounds.h},
            topRight:{x:this.bounds.x + this.bounds.w, y:this.bounds.y}
        };
        this.polygon = new PIXI.Polygon(new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y),
            new PIXI.Point(this.bounds.x, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w / 2, this.bounds.y + this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y+this.bounds.h),
            new PIXI.Point(this.bounds.x + this.bounds.w, this.bounds.y));
        return this.bounds;
    },
    build: function(){
        // console.log('criou o player');

        var self = this;
        var motionArray = this.getFramesByRange('chinesa10',0,8);
        var animationIdle = new SpritesheetAnimation();
        animationIdle.build('idle', motionArray, 1, true, null);

        // var motionArrayDead = this.getFramesByRange('chinesa10',19,25);
        var motionArrayDead = this.getFramesByRange('chinesa10',0,8);
        var animationDead = new SpritesheetAnimation();

        animationDead.build('dead', motionArrayDead, 2, false, function(){
            TweenLite.to(self.spritesheet.scale, 0.2, {x:0,y:0});
        });

        this.spritesheet = new Spritesheet();
        this.spritesheet.addAnimation(animationIdle);
        this.spritesheet.addAnimation(animationDead);
        this.spritesheet.play('idle');
        this.reset();
        this.counter = 0;

        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();

        this.vecPositions = [];

    },
    update: function(){
        // console.log(this.isTouch);
        if(!this.isTouch){
            this.velocity = this.virtualVelocity;
        }
        if(this.deading){
            this.setVelocity(0,0);
        }
        this.debugPolygon(0x556644, true);
        if(this.getTexture()){
            this.getContent().position.x = 20;
        }
        // if(this.lockUp && this.velocity.y < 0){
        //     this.velocity.y = 0;
        // }
        this._super();
    },
    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    reset: function(){
        this.deading = false;
        this.setPosition( windowWidth/2, windowHeight/2);
        this.spritesheet.play('idle');
        this.setVelocity(0,0);
        this.updateable = true;
        this.vecPositions = [];
    },
    collide:function(arrayCollide){
        // console.log('playerCollide', arrayCollide[0].type);

        if(arrayCollide[0].type === 'door'){
            console.log('door collider');
            if(arrayCollide[0].side === 'up' && this.virtualVelocity.y < 0 ||
                arrayCollide[0].side === 'down' && this.virtualVelocity.y > 0 ||
                arrayCollide[0].side === 'left' && this.virtualVelocity.x < 0 ||
                arrayCollide[0].side === 'right' && this.virtualVelocity.x > 0)
            {

                this.endLevel = true;
                this.nextNode = arrayCollide[0].node;
                this.nextDoorSide = arrayCollide[0].side;
            }
        }
        if(arrayCollide[0].type === 'enemy'){
            // var angle = Math.atan2(this.getPosition().y-arrayCollide[0].getPosition().y,  this.getPosition().x-arrayCollide[0].getPosition().x);
            // angle = angle * 180 / Math.PI;
            // this.setPosition(this.getPosition().x + arrayCollide[0].range * Math.sin(angle), this.getPosition().y + arrayCollide[0].range * Math.cos(angle));
        }
        //console.log('colidiu');
    },
    touch: function(collection){
        this.isTouch = true;
        if(collection.left||collection.right && this.virtualVelocity.x !== 0)
        {
            this.velocity.x = 0;
        }
        if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        {
            console.log('Y TOUCH');
            this.velocity.y = 0;
        }
    },
    // touch: function(collection, isTouch){
    //     console.log(this.touchCollection);
    //     this.touchCollection = collection;
    //     this.isTouch = isTouch;
    //     if(collection.left||collection.right && this.virtualVelocity.x !== 0)
    //     {
    //         this.velocity.x = 0;
    //     }
    //     if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
    //     {
    //         this.virtualVelocity.y = this.velocity.y = 0;
    //     }
    // },
    updatePlayerVel:function(vecPositions)
    {
        console.log('UPDATE');
        if(this && vecPositions){
            var hasAxysY = false;
            var hasAxysX = false;
            if(vecPositions.length === 0){
                this.virtualVelocity.x = 0;
                this.virtualVelocity.y = 0;
            }
            for (var i = vecPositions.length - 1; i >= 0; i--) {

                if(vecPositions[i] === 'up'){
                    this.virtualVelocity.y = -this.defaultVelocity;
                    hasAxysY = true;
                }
                else if(vecPositions[i] === 'down'){
                    this.virtualVelocity.y = this.defaultVelocity;
                    hasAxysY = true;
                }

                if(vecPositions[i] === 'left'){
                    this.virtualVelocity.x = -this.defaultVelocity;
                    hasAxysX = true;
                }
                else if(vecPositions[i] === 'right'){
                    this.virtualVelocity.x = this.defaultVelocity;
                    hasAxysX = true;
                }
            }
            if(this.virtualVelocity.y !== 0 && this.virtualVelocity.x !== 0){
                this.virtualVelocity.y /= 1.5;
                this.virtualVelocity.x /= 1.5;
            }
            if(!hasAxysY){
                this.virtualVelocity.y = 0;
            }
            if(!hasAxysX){
                this.virtualVelocity.x = 0;
            }

        }
    },
    // updatePlayerVel:function(vecPositions)
    // {
    //     if(this && vecPositions){
    //         var hasAxysY = false;
    //         var hasAxysX = false;
    //         if(vecPositions.length === 0){
    //             this.virtualVelocity.x = 0;
    //             this.virtualVelocity.y = 0;
    //             return;
    //         }
    //         for (var i = vecPositions.length - 1; i >= 0; i--) {

    //             if(vecPositions[i] === 'up' && !this.touchCollection.up){
    //                 this.virtualVelocity.y = -this.defaultVelocity;
    //                 this.touchCollection.down = false;
    //                 hasAxysY = true;
    //             }
    //             else if(vecPositions[i] === 'down' && !this.touchCollection.down){
    //                 this.virtualVelocity.y = this.defaultVelocity;
    //                 this.touchCollection.up = false;
    //                 hasAxysY = true;
    //             }

    //             if(vecPositions[i] === 'left' && !this.touchCollection.left){
    //                 this.virtualVelocity.x = -this.defaultVelocity;
    //                 this.touchCollection.right = false;
    //                 this.touchCollection.down = false;
    //                 hasAxysX = true;
    //             }
    //             else if(vecPositions[i] === 'right' && !this.touchCollection.right){
    //                 this.virtualVelocity.x = this.defaultVelocity;
    //                 this.touchCollection.left = false;
    //                 this.touchCollection.down = false;
    //                 hasAxysX = true;
    //             }
    //         }
    //         if(this.virtualVelocity.y !== 0 && this.virtualVelocity.x !== 0){
    //             this.virtualVelocity.y /= 1.5;
    //             this.virtualVelocity.x /= 1.5;
    //         }
    //         if(!hasAxysY){
    //             this.virtualVelocity.y = 0;
    //         }
    //         if(!hasAxysX){
    //             this.virtualVelocity.x = 0;
    //         }
    //     }
    // },
});
