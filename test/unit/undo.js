describe('Plugins/Undo', function () {

    var ready = false;
    var first, second, third;

    beforeEach(function () {
        runs(function () {
            ready = false;
            testModule({ name: "undo", requires: ['plugins.undo'] }).defines(function () {
                ready = true;
            });
        });

        waitsFor(function () {
            return ready;
        }, "Waiting for module", 500);
    });

    var noOpFn = function (cmd) {
        return true;
    };

    it('requires undoCmd arg', function () {
        expect(function () {
            new ig.Undo({'applyCmd': noOpFn})
        }).toThrow();
    });

    it('requires applyCmd arg', function () {
        expect(function () {
            new ig.Undo({'undoCmd': noOpFn})
        }).toThrow();
    });

    it("doesn't require redoCmd arg", function () {
        expect(function () {
            new ig.Undo({'undoCmd': noOpFn, 'applyCmd': noOpFn})
        }).not.toThrow();
    });


});