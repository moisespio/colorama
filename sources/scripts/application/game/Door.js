/*jshint undef:false */
var Door = Entity.extend({
    init:function(side){
        this._super( true );
        this.updateable = false;
        this.deading = false;
        this.side = side;
        this.range = APP.tileSize.x;
        this.width = APP.tileSize.x;
        this.height = APP.tileSize.y;
        this.centerPosition = {x:-this.width/2, y:-this.height/2};
        this.type = 'door';
        this.node = null;
        this.updateable = true;
    },
    getBounds: function(){
        //TA UMA MERDA E CONFUSO ISSO AQUI, por causa das posições
        //console.log(this.getPosition().x);
        this.bounds = {x: this.getPosition().x - this.width/2, y: this.getPosition().y - this.height/2, w: this.width, h: this.height};
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
        this._super('dist/img/cubo2.png');
        var self = this;
        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();
        this.getContent().scale.x = 0.5;
        this.getContent().scale.y = 0.5;
        this.getContent().alpha = 0.5;
    },
    update: function(){
        this._super();
        this.getBounds();
        this.debugPolygon(0x556644, true);
    },

    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
});
