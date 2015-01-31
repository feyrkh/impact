ig.module(
    'game.proceduralMap'
)
    .requires('impact.map')
    .defines(function() {
        "use strict";
        ig.ProceduralMap = ig.Map.extend({
            /**
             * @param opts.tileSize
             * @param opts.x
             * @param opts.y
             * @param opts.camera
             * @param opts.generateTileData - function to generate tile data, takes args (x, y)
             * @param opts.tileLoadCallback - optional; function called when a new tile is loaded
             * @param opts.tileUnloadCallback - optional; function called when a tile moves off screen
             * @param opts.tileUpdateCallback - optional; function called when generated tile data is changed
             * @param opts.border - default 1; number of tiles around the screen to render
             *
             */
            init: function(opts) {
                if(!opts.tileSize) throw("must provide tileSize in ProceduralMap constructor");
                this.tileSize = opts.tileSize;
                if(!opts.camera) throw("must provide camera in ProceduralMap constructor");
                this.camera = opts.camera;
                if(!opts.generateTileData) throw("must provide generateTileData in ProceduralMap constructor");
                this.generateTileData = opts.generateTileData;
                this.tileLoadCallback = opts.tileLoadCallback || null;
                this.tileUpdateCallback = opts.tileUpdateCallback || null;
                this.tileUnloadCallback = opts.tileUnloadCallback || null;
                if(!opts.border || opts.border < 0) opts.border = 1;
                this.border = opts.border;
                this.x = opts.x || 0;
                this.y = opts.y || 0;
                this.camera.pos = {x: this.border * this.tileSize, y: this.border * this.tileSize};
                this.screenTileWidth = opts.screenTileWidth || Math.ceil(ig.system.width / opts.tileSize);
                this.screenTileHeight = opts.screenTileHeight || Math.ceil(ig.system.height / opts.tileSize);
                this.viewportData = [];
                this.savedData = {};
                for(var y=0-this.border;y<this.screenTileHeight+this.border;y++) {
                    var row = [];
                    this.viewportData.push(row);
                    for(var x=0-this.border;x<this.screenTileWidth+this.border;x++) {
                        var tileData = this.getTileData(x,y);
                        row.push(tileData);
                        if(this.tileLoadCallback) this.tileLoadCallback(tileData);
                    }
                }
                this.camera = opts.camera;
            },

            getTileData: function(x, y) {
                var saved = this.savedData[x+','+y];
                return saved || this.generateTileData(x,y);
            },

            setTileData: function(x, y, data) {
                this.savedData[x+','+y] = data;
                if(this.tileUpdateCallback) {
                    if (x > this.x - this.border && x < this.x + this.screenTileWidth + this.border) {
                        if (y > this.y - this.border && y < this.y + this.screenTileHeight + this.border) {
                            this.tileUpdateCallback(x, y, data);
                        }
                    }
                }
            },

            getViewportData: function() {
                return this.viewportData;
            }
        });
    });
