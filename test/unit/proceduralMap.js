describe('Game/ProceduralMap', function() {
    var ready = false;
    var camera;
    var map;

    function getTileData(x, y) {
        return {x: x, y: y};
    }

    beforeEach(function () {
        runs(function () {
            ready = false;
            testModule({ name: "proceduralMap", requires: ['game.proceduralMap'] }).defines(function () {
                ig.system = {width: 320, height: 620};
                camera = {pos:  {x: 0, y:0}};
                map = new ig.ProceduralMap({
                    camera: camera,
                    tileSize: 32,
                    generateTileData: function(x, y) { return x == y }
                });
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, "Waiting for module", 500);
    });

    it('gets properties set according to screen size', function() {
        expect(map.screenTileWidth).toBe(10);
        expect(map.screenTileHeight).toBe(20);
    })

    it('can fetch viewport data', function () {
        var data = map.getViewportData();
        expect(data.length).toBe(22); // rows on screen
        expect(data[0].length).toBe(12); // cols on screen
    });

    it('generates tile data on creation', function() {
        var data = map.getViewportData();
        expect(data[0][0]).toBe(true);
        expect(data[1][1]).toBe(true);
        expect(data[10][10]).toBe(true);
        expect(data[0][1]).toBe(false);
        expect(data[1][0]).toBe(false);
        expect(data[10][1]).toBe(false);
    });

    it('sets camera on creation', function() {
        expect(camera.pos.x).toBe(32);
        expect(camera.pos.y).toBe(32);
    });

    it('can set and retrieve data', function() {
        expect(map.getTileData(3, 4)).toBe(false);
        map.setTileData(3, 4, 'new data');
        expect(map.getTileData(3, 4)).toBe('new data');
    });
});