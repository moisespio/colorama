/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){
        this._super(windowWidth, windowHeight);
        this.stage.setBackgroundColor(0xffffff);
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
        this.screenManager.change('Game');
    },
});
