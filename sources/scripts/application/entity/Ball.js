var Ball = Class.extend({
	init:function(){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(0x553388);
		this.radius = 30;
		this.graphics.drawCircle(0,0,this.radius);
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
