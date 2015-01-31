describe('Plugins/Noise', function() {

    var ready = false;
    var first, second, third;

    beforeEach(function() {
        runs(function() {
            ready = false;
            testModule({ name: "noise", requires: ['plugins.noise'] }).defines(function() {
                gg.noise.seed(1);
                first = gg.noise.simplex2(35, 42);
                second = gg.noise.simplex2(35, 42);
                third = gg.noise.simplex2(34, 42);

                ready = true;
            });
        });

        waitsFor(function() {
            return ready;
        }, "Waiting for module", 500);
    });



    it('simplex2 is repeatable', function() {
        expect(first).toBeCloseTo(second, 5);
    });

    it('simplex2 is nonzero', function() {
        expect(first !== 0).toBe(true);
    });

    it('simplex2 can be different with different coordinates', function() {
        expect(first).not.toBeCloseTo(third, 5);
    })

    it('simplex2 supports negative numbers', function() {
        var first = gg.noise.simplex2(-1,-1);
        var second = gg.noise.simplex2(1,-1);
        expect(first !== 0).toBe(true);
        expect(first).not.toBeCloseTo(second, 5);
    });
});