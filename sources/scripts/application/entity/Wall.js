var Wall = Class.extend({
	init:function(width, height, borderAngle){
		this.entityContainer = new PIXI.DisplayObjectContainer();
		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(Math.random() * 0xFFFFFF);
		var diagonal = Math.sin(borderAngle / 180 * Math.PI)*height;
		this.graphics.moveTo(- diagonal,height);
		this.graphics.lineTo(width + diagonal, height);
		this.graphics.lineTo(width,0)
		this.graphics.lineTo(0,0)

		this.entityContainer.addChild(this.graphics);
		this.graphics.x = - (this.graphics.width - diagonal * 2) / 2;
		this.graphics.y = - this.graphics.height/2;

		this.marker = new PIXI.Graphics();
		this.marker.beginFill(0xFF0000);
		this.marker.drawCircle(0,0,1);
		this.entityContainer.addChild(this.marker);
	},
	update:function(){
		//this.entityContainer.rotation += 0.01;
	},
	getContent:function(){
		return this.entityContainer;
	}
});
