/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){
        this._super(windowWidth, windowHeight);
	},
    build:function(){
        this._super();
        this.onAssetsLoaded();
    },
    onAssetsLoaded:function()
    {
        this.gameScreen = new GameScreen('Game');
        this.homeScreen = new HomeScreen('Home');
        this.screenManager.addScreen(this.gameScreen);
        this.screenManager.addScreen(this.homeScreen);
        this.screenManager.change('Home');
    },
});

/*jshint undef:false */
var Ball = Class.extend({
	init:function(){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(0x553388);
		this.graphics.drawCircle(0,0,30);
		this.entityContainer.addChild(this.graphics);
		this.velocity = {x:0,y:0};
		this.jumpForce = 8;
	},
	jump:function(){
		this.graphics.beginFill(Math.random() * 0xFFFFFF);
		this.graphics.drawCircle(0,0,30);
		this.velocity.y = -this.jumpForce;
	},
	update:function(){
		this.entityContainer.position.x += this.velocity.x;
		this.entityContainer.position.y += this.velocity.y;
	},
	getContent:function(){
		return this.entityContainer;
	}
});

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
/*jshint undef:false */
var Minimap = Class.extend({
	init:function(){
		this.collidable = false;
	},
	build:function(gen){
		this.gen = gen;
		this.background = new PIXI.Graphics();

		this.container = new PIXI.DisplayObjectContainer();
		this.roomsContainer = new PIXI.DisplayObjectContainer();
		this.mask = new PIXI.Graphics();
		this.container.addChild(this.background);
		this.container.addChild(this.roomsContainer);
		this.container.addChild(this.mask);
		this.arrayRooms = [];
		this.margin = {x: 15, y: 15};
		this.sizeTile = {x:80, y:50};
		this.sizeGraph = {x:40, y:25};

		// console.log(this.gen.rooms);

		var minX = 9999;
		var minY = 9999;
		var maxX = -9999;
		var maxY = -9999;
		var tempX = 0;
		var tempY = 0;

		for (var j = 0; j < this.gen.rooms.length; j++)
		{
			var item = this.gen.rooms[j];


			for (var i = 0; i < item.length; i++)
			{
				if (item[i].id > 0)
				{
					// console.log('item', item[i]);
					var tempRoomView = new PIXI.Graphics();
					var nodeColor = 0xffffff;
					if(item[i].mode === 1){
						nodeColor = 0x52d468;
					}else if(item[i].mode === 2){
						nodeColor = 0xaeaeae;
					}else if(item[i].mode === 3){
						nodeColor = 0xf7cd39;
					}else if(item[i].mode === 4){
						nodeColor = 0xf73939;
					}else if(item[i].mode === 5){
						nodeColor = 0xCB5B00;
					}else if(item[i].mode === 6){
						nodeColor = 0xcb52c4;
					}else{
						nodeColor = 0xffffff;
					}
					tempRoomView.beginFill(nodeColor);
					var tempSideGraphic;

					tempX = item[i].position[1] * this.sizeTile.x;
					tempY = item[i].position[0] * this.sizeTile.y;
					tempRoomView.position.x = tempX;
					tempRoomView.position.y = tempY;
					tempRoomView.drawRect(0,0,this.sizeGraph.x,this.sizeGraph.y);
					tempRoomView.endFill();
					this.roomsContainer.addChild(tempRoomView);

					for (var k = 0; k < item[i].childrenSides.length; k++) {
						if(item[i].childrenSides[k]){
							if(k === 0){//left
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = -this.sizeGraph.x / 2;
								tempY = this.sizeGraph.y / 4;//this.sizeGraph.y;
							}else if(k === 1){//right
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = this.sizeGraph.x;//this.sizeGraph.y;
								tempY = this.sizeGraph.y / 4;
							}else if(k === 2){//right
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = this.sizeGraph.x / 4;//this.sizeGraph.y;
								tempY = -this.sizeGraph.y / 2;
							}else if(k === 3){//down
								tempSideGraphic = new PIXI.Graphics();
								tempSideGraphic.beginFill(nodeColor);
								tempSideGraphic.drawRect(0,0,this.sizeGraph.x / 2,this.sizeGraph.y / 2);
								tempX = this.sizeGraph.x / 4;//this.sizeGraph.y;
								tempY = this.sizeGraph.y;
							}
							if(tempSideGraphic){
								tempSideGraphic.position.x = tempX;
								tempSideGraphic.position.y = tempY;
								tempRoomView.addChild(tempSideGraphic);
							}
							tempSideGraphic = null;
						}
					}
					if (minX > item[i].position[1]){
						minX = item[i].position[1];
					}
					if (minY > item[i].position[0]){
						minY = item[i].position[0];
					}

					if (maxX < item[i].position[1]){
						maxX = item[i].position[1];
					}
					if (maxY < item[i].position[0]){
						maxY = item[i].position[0];
					}
					// console.log(i,j);
					tempRoomView.positionID = {i:j,j:i};
					tempRoomView.node = item[i];
					this.arrayRooms.push(tempRoomView);
				}
			}
		}
		for (var m = 0; m < this.arrayRooms.length; m++) {
			this.arrayRooms[m].position.x -= minX * this.sizeTile.x - this.margin.x - this.sizeGraph.x/2;
			this.arrayRooms[m].position.y -= minY * this.sizeTile.y - this.margin.y - this.sizeGraph.y/2;
		}

		this.mask.beginFill(0);
		this.mask.drawRect(0,0,200,200);
		this.container.addChild(this.mask);
		// this.updatePlayerNode();
		// console.log(minX,minY,maxX,maxY, maxX * this.margin.x, this.margin.x);
		this.background.beginFill(0x0);
		this.background.drawRect(0,0,this.mask.width,this.mask.height);
		// this.background.drawRect(0,0,
		// 	(maxX - minX + 1) * this.sizeTile.x + this.margin.x * 2 + this.sizeGraph.x/2,
		// 	(maxY - minY + 1) * this.sizeTile.y+ this.margin.y * 2+ this.sizeGraph.y/2);
		this.background.endFill();
		this.background.alpha = 0.5;

		this.container.mask = this.mask;
	},
	updatePlayerNode:function(position){
		var tempDist = 0;
		var currentNode = null;
		var childs = [];
		for (var i = 0; i < this.arrayRooms.length; i++) {
			this.arrayRooms[i].alpha = 0.4;
			if(position && position[0] === this.arrayRooms[i].positionID.i && position[1] === this.arrayRooms[i].positionID.j){
				currentNode = this.arrayRooms[i];
				for (var j = 0; j < this.arrayRooms[i].node.childrenSides.length; j++) {
					if(this.arrayRooms[i].node.childrenSides[j]){
						var tempPosition = this.arrayRooms[i].node.childrenSides[j].position;
						for (var k = 0; k < this.arrayRooms.length; k++) {
							if(this.arrayRooms[k].positionID.j === tempPosition[0] && this.arrayRooms[k].positionID.i === tempPosition[1]){
								childs.push(this.arrayRooms[k]);
							}
						}
					}
				}

			}
			// else if(!this.arrayRooms[i].active){
			// 	this.arrayRooms[i].alpha = 0;
			// }
		}
		console.log(childs);
		// for (var m = 0; m < childs.length; m++) {
		// 	this.showNode(childs[m]);
		// }
		this.showNode(currentNode, 0xFF0000);
		//CENTRALIZAR O MINIMAP AQUI
		TweenLite.to(this.roomsContainer, 0.5, {x:this.background.width / 2 - currentNode.position.x - currentNode.width / 2,
			y:this.background.height / 2 - currentNode.position.y - currentNode.height / 2});
	},
	showNode:function(node, tint){
		if(!node){
			return;
		}
		node.alpha = 1;
		// if(tint){
		// 	node.tint = tint;
		// }else{
		// 	node.tint = 0xFFFFFF;
		// }
	},
	getContent:function(){
		return this.container;
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	}
});

/*jshint undef:false */
var Obstacle = Entity.extend({
    init:function(imgId){
        this._super();
        this.updateable = true;
        this.collidable = true;
        this.arrayObstacles = ['dist/img/2.png','dist/img/3.png','dist/img/2.png'];

        this.srcImg =  this.arrayObstacles[imgId];
        this.type = 'environment';
        this.width = APP.tileSize.x;
        this.height = APP.tileSize.x;

        this.debugGraphic = new PIXI.Graphics();
        this.debugGraphic.beginFill(0xFF3300);
        this.debugGraphic.lineStyle(1, 0xffd900, 1);
        this.debugGraphic.endFill();
        // this.scale.x = 0.5;
        // this.scale.y = 0.5;
        this.range = 0;
    },
    preKill:function(){
        this._super();
        if(this.debugGraphic.parent){
            this.debugGraphic.parent.removeChild(this.debugGraphic);
        }
    },
    getBounds: function(){
        this.bounds = {x: this.getPosition().x - this.width *this.sprite.anchor.x,
            y: this.getPosition().y - this.height *this.sprite.anchor.y,
            w: this.width,
            h: this.height};
        return this.bounds;
    },
    build: function(){
        // console.log('criou o Obstacle');
        this._super(this.srcImg);
        var self = this;
        // this.respaw();
        this.sprite.anchor.x = 0;
        this.sprite.anchor.y = 1;

        // this.sprite.scale.x = 0.5;
        // this.sprite.scale.y = 0.5;
    },
    update: function(){
        this._super();

        if(this.debugGraphic.parent === null && this.getContent().parent !== null)
        {
            this.getBounds();
            this.debugGraphic.drawRect(this.bounds.x, this.bounds.y,this.bounds.w, this.bounds.h);

            this.getContent().parent.addChild(this.debugGraphic);
        }
    },
    respaw: function(){
        // var rndPos = {x:(windowWidth - 200) * Math.random() + 100,
        //     y:(windowHeight - 200) * Math.random() + 100};

        var rndPos = {x:Math.floor((12 * Math.random() * 142) /142) * 142 + 104,
            y:Math.floor((7 * Math.random() * 142) /142) * 142 + 177 + 142};

        if(this.pointDistance(rndPos.x, rndPos.y, windowWidth/2, windowHeight/2 ) < 200)
        {
            this.respaw();
        }

        this.setPosition( rndPos.x,rndPos.y) ;
        this.collidable = true;
    },
    pointDistance: function(x, y, x0, y0){
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
});

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

/*jshint undef:false */
var AppModel = Class.extend({
	init:function(){
        this.isMobile = false;
        this.action = 'default';
        this.id = 0;
        this.position = 0;
        this.angle = 0;
        this.side = 0;
	},
	build:function(){

	},
    destroy:function(){

    },
    serialize:function(){
        
    }
});
/*jshint undef:false */
var RainParticle = Class.extend({
	init:function(fallSpeed,windSpeed,hArea,vArea,dir){
		// 50, 5, 600, 300, 'left'

		this.fallSpeed=fallSpeed;
		this.windSpeed=windSpeed;
		this.dir=dir;
		this.hArea=hArea;
		this.vArea=vArea;


		this.texture = new PIXI.Texture.fromImage('dist/img/drop.png');
		this.content = new PIXI.Sprite(this.texture);

		this.content.position.x = Math.random() * hArea;
		this.content.position.y=Math.random()*vArea;

		this.gambAccum = 0;
	},
	update:function(){
		var side = 1;
		// this.gambAccum += 0.005;

		switch (this.dir)
		{
			case 'left' :
				// this.content.rotation = this.gambAccum;// / 180 * 3.14;
				this.content.rotation = 15 / 180 * 3.14;
				break;

			case 'right' :
				side = -1;
				// this.content.rotation = -this.gambAccum;// / 180 * 3.14;
				this.content.rotation = -15 / 180 * 3.14;

				break;

			default :
				console.log('There is some error dude...');
		}

		// this.windSpeed = Math.cos(this.gambAccum) * 5;


		// console.log(this.windSpeed);
		// this.gambAccum ++;
		// if(this.gambAccum > 200){
		// 	this.gambAccum = 0;
		// 	if(this.dir === 'left')
		// 	{
		// 		this.dir = 'right';
		// 	}else
		// 	{
		// 		this.dir = 'left';
		// 	}
		// }


		this.content.position.x-=this.windSpeed * side;
		this.content.position.y+=Math.random()*this.fallSpeed;

		if (this.content.position.y>this.vArea)
		{
			this.content.position.x = Math.random() * (this.hArea);
			this.content.position.y =- 200;
		}
	}
});

/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        this.gravity = windowHeight * 0.0001;
        this.polygonRadius = windowWidth * 0.25;
        this.gameContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.gameContainer);
        var assetsToLoader = [];
        if(assetsToLoader.lenght <= 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
    },
    onProgress:function(){

    },
    onAssetsLoaded:function()
    {
        this._super();
        this.ball = new Ball();
        this.gameContainer.addChild(this.ball.getContent());
        this.ball.getContent().position.x = windowWidth /2;
        this.ball.getContent().position.y = windowHeight /2;
        this.ball.jumpForce = this.gravity * 70;
    },
    update:function()
    {
        this.ball.velocity.y += this.gravity;
        if(this.ball.getContent().position.y > windowHeight / 2){
            this.testCollision();
        }
        this.ball.update();
    },
    testCollision:function(){
        if(pointDistance(this.ball.getContent().position.x, this.ball.getContent().position.y, windowWidth / 2, windowHeight / 2) > this.polygonRadius){
            this.ball.jump();
        }
    }
});

/*jshint undef:false */
var HomeScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);

    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        this.screenContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.screenContainer);

        var self = this;

        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x553388);
        this.graphics.drawRoundedRect(-120,-80,240, 160, 30);
        this.graphics.position.x = windowWidth /2;
        this.graphics.position.y = windowHeight /2;
        this.graphics.interactive = true;
        this.graphics.buttonMode = true;
        this.graphics.touchstart = this.graphics.mousedown = function(mouseData){
            self.screenManager.change('Game');
        };
        this.screenContainer.addChild(this.graphics);

        var assetsToLoader = [];
        if(assetsToLoader.lenght <= 0){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
    },
    onProgress:function(){

    },
    onAssetsLoaded:function()
    {
        console.log('what3');
        this._super();
    },
    update:function()
    {
    }
});

/*jshint undef:false */
var InputManager = Class.extend({
	init: function (parent){
		var game = parent;
		var self = this;
		this.vecPositions = [];
		document.body.addEventListener('mouseup', function(e){
			if(game.player){
				game.mouseDown = false;
			}
		});
		document.body.addEventListener('mousedown', function(e){
			//só atira se não tiver na interface abaixo
			//TODO: melhorar isso
			if(game.player){// && APP.getMousePos().x < windowWidth && APP.getMousePos().y < windowHeight - 70){
				game.mouseDown = true;
			}
		});
		document.body.addEventListener('keyup', function(e){
			if(game.player){
				if(e.keyCode === 87 || e.keyCode === 38){// && game.player.velocity.y < 0){
					self.removePosition('up');
				}
				else if(e.keyCode === 83 || e.keyCode === 40){// && game.player.velocity.y > 0){
					self.removePosition('down');
				}
				else if(e.keyCode === 65 || e.keyCode === 37){// && game.player.velocity.x < 0){
					self.removePosition('left');
				}
				else if(e.keyCode === 68 || e.keyCode === 39){// && game.player.velocity.x > 0){
					self.removePosition('right');
				}
				game.player.updatePlayerVel(self.vecPositions);
			}
		});
		document.body.addEventListener('keydown', function(e){
			var vel = 6;
			var newPos = false;
			if(game.player){
				if(e.keyCode === 87 || e.keyCode === 38){
					self.removePosition('down');
					newPos = self.addPosition('up');
				}
				else if(e.keyCode === 83 || e.keyCode === 40){
					self.removePosition('up');
					newPos = self.addPosition('down');
				}
				else if(e.keyCode === 65 || e.keyCode === 37){
					self.removePosition('right');
					newPos = self.addPosition('left');
				}
				else if(e.keyCode === 68 || e.keyCode === 39){
					self.removePosition('left');
					newPos = self.addPosition('right');
				}
				game.player.updatePlayerVel(self.vecPositions);
			}
		});
	},
	//
    removePosition:function(position){
        for (var i = this.vecPositions.length - 1; i >= 0; i--) {
            if(this.vecPositions[i] === position)
            {
                this.vecPositions.splice(i,1);
            }
        }
    },
    //
    addPosition:function(position){
        var exists = false;

        for (var i = this.vecPositions.length - 1; i >= 0; i--) {
            if(this.vecPositions[i] === position)
            {
                exists = true;
            }
        }

        if(!exists){
            this.vecPositions.push(position);
        }
        return exists;
    },
});

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

/*jshint undef:false */
var DefaultBehaviour = Class.extend({
    init: function (entity, player){
		this.player = player;
		this.entity = entity;
		this.life = 8;
		this.entity.setVelocity(-2,(Math.random()-0.5)*3);
		this.sideAcum = 0;
		this.sideMaxAcum = 200;
		this.fireFreq = 25;
		this.fireAcum = 0;
		this.fireSpeed = 6;
	},
	update: function(){
		//this.entity.update();
		// this.sideAcum --;
		// if(this.sideAcum <= 0)
		// {
		// 	this.entity.setVelocity(-1,this.entity.velocity.y*-1);
		// 	this.sideAcum = this.sideMaxAcum;
		// }

		// if(this.fireAcum >= this.fireFreq)
		// {
		// 	var pr = new Fire(true, new this.entity.fireBehaviour.clone());
		// 	pr.build();
		// 	this.fireAcum = 0;
		// 	this.entity.layer.addChildFirst(pr);		
		// 	pr.setPosition(this.entity.getPosition().x,this.entity.getPosition().y);
		// 	pr.setVelocity(-this.fireSpeed,0);
		// }
		// else
		// {
		// 	this.fireAcum ++;
		// }
		// if(this.entity.getPosition().x < -20 || this.entity.getPosition().x > windowWidth + 50 || this.entity.getPosition().y < -30 || this.entity.getPosition().y > windowHeight)
		// {
		// 	this.entity.kill = true;
		// }

		// this.entity.sprite.position.x += this.entity.velocity.x;
		// this.entity.sprite.position.y += this.entity.velocity.y;
			
		// if(this.entity.velocity.x > 0)
		// 	this.entity.setScale(-1,1 );
		// else if(this.entity.velocity.x < 0)
		// 	this.entity.setScale(1,1 );
    },
});
/*jshint undef:false */
// AbstractScreen.debug = true;
// ScreenManager.debug = true;

function testMobile() {
    return false;// Modernizr.touch || window.innerWidth < 600
}

var SOCKET = null;
var windowWidth = 750,
windowHeight = 1334;

var renderer;
var windowWidthVar = window.innerWidth,
windowHeightVar = window.innerHeight;
var retina = 2;

var renderer = PIXI.autoDetectRecommendedRenderer(windowWidth, windowHeight, {antialias:true, resolution:retina});//PIXI.autoDetectRenderer(windowWidth, windowHeight);
document.body.appendChild(renderer.view);

var APP;
APP = new Application();
APP.build();

function update() {
	requestAnimFrame(update );
	var tempRation =  (window.innerHeight/windowHeight);
	var ratio = tempRation;
	windowWidthVar = windowWidth * ratio;
	windowHeightVar = windowHeight * ratio;
	renderer.view.style.width = windowWidthVar+'px';
	renderer.view.style.height = windowHeightVar+'px';
	APP.update();
	renderer.render(APP.stage);
}

var initialize = function(){
	// //inicia o game e da um build
	PIXI.BaseTexture.SCALE_MODE = 2;
	requestAnimFrame(update);
};

(function () {
	var App = {
		init: function () {
			initialize();
		}
	};
	$(App.init);
})();
var pointDistance = function(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};




