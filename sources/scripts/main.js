/*jshint undef:false */
// AbstractScreen.debug = true;
// ScreenManager.debug = true;


function testMobile() {
    return false;// Modernizr.touch || window.innerWidth < 600;
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




