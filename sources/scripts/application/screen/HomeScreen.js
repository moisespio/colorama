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
