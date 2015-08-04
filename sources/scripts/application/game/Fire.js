/*jshint undef:false */
var Fire = Entity.extend({
    init:function(vel){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.range = 60;
        this.width = 1;
        this.height = 1;
        this.type = 'fire';
        this.node = null;
        this.velocity.x = vel.x;
        this.velocity.y = vel.y;
        this.timeLive = 10;
        this.power = 1;
        this.defaultVelocity = 1;

    },
    getBounds: function(){
        this.bounds = {x: this.getPosition().x-this.width/2, y: this.getPosition().y-this.height/2, w: this.width, h: this.height};
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
        this._super('dist/img/fireball.png');
        this.updateable = true;
        this.collidable = true;
        // var self = this;
        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0x113300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();
    },
    update: function(){
        this._super();
        this.timeLive --;
        if(this.timeLive <= 0){
            this.preKill();
        }

        // if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        // {
        //     this.getContent().parent.addChild(this.debugGraphic);
        // }

        if(this.getContent()){
            this.width = this.getContent().width;
            this.height = this.getContent().height;
        }
        this.getBounds();
        this.range = this.width / 2;
        // this.debugGraphic.clear();
        // this.debugGraphic.beginFill(0xFF3300);
        // this.debugGraphic.lineStyle(1, 0xffd900, 1);
        // this.debugGraphic.drawRect(this.bounds.x, this.bounds.y,this.bounds.w, this.bounds.h);
        //this.debugGraphic.endFill();
        // this.debugPolygon(0x556644, true);
    },
    collide:function(arrayCollide){
        // console.log('fireCollide', arrayCollide[0].type);
        if(this.collidable){
            if(arrayCollide[0].type === 'enemy'){
                this.getContent().tint = 0xff0000;
                this.preKill();
                arrayCollide[0].hurt(this.power);

            }
        }
    },
    preKill:function(){
        //this._super();
        if(this.collidable){
            var self = this;
            this.updateable = false;
            this.collidable = false;
            TweenLite.to(this.getContent().scale, 0.3, {x:0.2, y:0.2, onComplete:function(){self.kill = true;}});

            if(this.debugGraphic.parent){
                this.debugGraphic.parent.removeChild(this.debugGraphic);
            }
        }
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection){

        // console.log(collection);
        // if(collection.object.getPosition().y > this.getPosition().y)
        // {
        //     this.velocity.y *= -1;
        // }
        // if(collection.up|| collection.down && this.virtualVelocity.y !== 0)
        // {
        //     this.velocity.y *= -1;
        // }
        this.preKill();
    },
});
