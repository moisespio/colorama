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
