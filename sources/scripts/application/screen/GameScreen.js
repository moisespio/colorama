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
        this.sides = 7;
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

        this.polygonContainer = new PIXI.DisplayObjectContainer();
        this.polygonContainer.position.x = windowWidth/2;
        this.polygonContainer.position.y = windowHeight/2;
        var tempWall;

        var tempAngle = 0;
        this.arrayWalls = [];
        var wallDistance = this.getDistanceBetweenWalls();
        var tempBorderAngle = 360 / this.sides;
        for (var i = 0; i < this.sides; i++) {
            tempAngle = tempBorderAngle * i /180 * Math.PI;
            tempWall = new Wall(wallDistance, 30, tempBorderAngle);
            tempWall.getContent().position.x = Math.sin(tempAngle) * this.polygonRadius;
            tempWall.getContent().position.y = Math.cos(tempAngle) * this.polygonRadius;
            tempWall.getContent().rotation = -tempAngle;
            this.arrayWalls.push(tempWall);
            this.polygonContainer.addChild(tempWall.getContent());
        };
        this.gameContainer.addChild(this.polygonContainer);

        var wall = new Wall(wallDistance, 30, tempBorderAngle)
        this.gameContainer.addChild(wall.getContent())
        wall.getContent().position.x = windowWidth / 2;
        wall.getContent().position.y = 60;
    },
    update:function()
    {
        for (var i = 0; i < this.arrayWalls.length; i++) {
            this.arrayWalls[i].update();
        };
        //this.polygonContainer.rotation += 0.01;
        this.ball.velocity.y += this.gravity;
        if(this.ball.getContent().position.y > windowHeight / 2){
            this.testCollision();
        }
        this.ball.update();
    },
    getDistanceBetweenWalls:function(){
        var tempAngle = 360 / this.sides * 1 /180 * Math.PI;
        var tempAngle2 = 360 / this.sides * 2 /180 * Math.PI;
        var point1 = {x:Math.sin(tempAngle) * this.polygonRadius, y:Math.cos(tempAngle) * this.polygonRadius};
        var point2 = {x:Math.sin(tempAngle2) * this.polygonRadius, y:Math.cos(tempAngle2) * this.polygonRadius};
        return pointDistance(point1.x, point1.y, point2.x, point2.y)
    },
    testCollision:function(){
        if(pointDistance(this.ball.getContent().position.x, this.ball.getContent().position.y, windowWidth / 2, windowHeight / 2) > this.polygonRadius - this.ball.radius){
            this.ball.jump();
        }
    }
});
