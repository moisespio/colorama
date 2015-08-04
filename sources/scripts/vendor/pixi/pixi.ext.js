Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {
  get: function () {
    // Get child with greater width
    var width = 0, 
        x = 0;
    for (var i=0, lengthc = this.children.length; i<length; ++i) {
      if (this.children[i].x < x) {
        x = his.children[i].x;
      }
      if (this.children[i].width > width) {
        width = this.children[i].width;
      }
    }
    return x + width;
  },
  configurable: true
});

Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'height', {
  get: function () {
    // Get child with greater height
    var height = 0, y = 0;
    for (var i=0, length = this.children.length; i<length; ++i) {
      if (this.children[i].height > height) {
        height = this.children[i].height;
      }
    }
    return y + height;
  },
  configurable: true
});