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
