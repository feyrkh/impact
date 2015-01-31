ig.module(
    'game.entities.worldMap'
)
    .requires(
    'impact.entity',
    'game.proceduralMap'
)
    .defines(function() {
        EntityWorldMap = ig.Entity.extend({
            mapSeed: 0,
            init: function() {
                this.mapSeed = opts.mapSeed || Math.random();
                this.proceduralMap = new ig.ProceduralMap({
                    generateTileData: function(x, y) {
                        var seed = (x*3)+(y*101)+this.mapSeed;
                    }
                });
            }
        });
    });