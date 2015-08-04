/*jshint undef:false */
var Heart = SpritesheetEntity.extend({
    init:function(){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = 60;
        this.width = 142;
        this.height = 142;
        this.type = 'heart';
        this.node = null;
        this.life = 5;
    },
    hurt:function(power){
        console.log('hurt');
        this.life -= power;
        if(this.life <= 0){
            this.preKill();
        }
    },
    collide:function(arrayCollide){
        //if(arrayCollide[0].type === 'player'){
        //     this.endLevel = true;
        console.log('this.node', this.node);
        console.log('col enemy');
        //}
    },
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        // console.log()
        this.bounds = {x: this.getPosition().x, y: this.getPosition().y, w: this.width, h: this.height};
        this.centerPosition = {x:this.width/2, y:this.height/2};
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
    debugPolygon: function(color, force){
        if(this.lastColorDebug !== color || force){
            if(this.debugGraphic.parent === null && this.getContent().parent !== null)
            {
                this.getContent().parent.addChild(this.debugGraphic);
            }
            this.lastColorDebug = color;
            this.gambAcum ++;
            if(this.debugGraphic !== undefined){
                this.debugGraphic.clear();
            }else{
                this.debugGraphic = new PIXI.Graphics();
            }
            // console.log(this.polygon);
            this.debugGraphic.beginFill(color, 0.5);
            this.debugGraphic.lineStyle(1, 0xffd900);
            this.debugGraphic.moveTo(this.polygon.points[this.polygon.points.length - 1].x,this.polygon.points[this.polygon.points.length - 1].y);
            // console.log('this.polygon',this.polygon.points);

            for (var i = this.polygon.points.length - 2; i >= 0; i--) {
                this.debugGraphic.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
            }
            this.debugGraphic.endFill();
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

        this.respaw();

        // this.debugGraphic = new PIXI.Graphics();
        // this.debugGraphic.beginFill(0xFF3300);
        // this.debugGraphic.lineStyle(1, 0xffd900, 1);
        // this.debugGraphic.endFill();
    },
    update: function(){
        this._super();

        this.getBounds();
        //this.debugPolygon(0x556644, true);

        if(this.getTexture()){
            this.getContent().position.x = 80;
            this.getContent().position.y = -20;
            this.range = this.bounds.w / 2;
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
    respaw: function(){
        // console.log('resetou o heart', this);

        this.deading = false;
        var rndPos = {x:Math.floor((12 * Math.random() * 142) /142) * 142 + 104,
            y:Math.floor((7 * Math.random() * 142) /142) * 142 + 177 + 142};

        // console.log('center distance', this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ));
        if(this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ) < 200)
        {
            this.respaw();
        }

        this.setPosition( Math.floor(rndPos.x / 7)*7,Math.floor(rndPos.y/7)*7) ;
        // console.log(this.getPosition());
        this.spritesheet.play('idle');

        this.setVelocity(0,0);
        this.updateable = true;
        this.collidable = true;
        // this.spritesheet.setScale(0,0);
        // TweenLite.to(this.spritesheet.scale, 1, {delay:0.4, x:1,y:1, ease:'easeOutElastic'});

        // console.log('radius', this.range);

    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
});