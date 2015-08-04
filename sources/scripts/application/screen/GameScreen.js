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
