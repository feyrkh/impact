describe('Plugins/Undo', function () {

    var ready = false;
    var first, second, third;
    var mathUndoer;
    var state;

    beforeEach(function () {
        runs(function () {
            ready = false;
            testModule({ name: "undo", requires: ['plugins.undo'] }).defines(function () {
                state = 0;

                function applyCmd(cmd) {
                    console.log("Trying to apply "+cmd);
                    if(cmd < 0) return "can't add negatives";
                    state += cmd;
                }

                function undoCmd(cmd) {
                    console.log("Trying to undo "+cmd);
                    state -= cmd;
                }

                function redoCmd(cmd) {
                    console.log("Trying to redo "+cmd);
                    state += cmd;
                }

                mathUndoer = new ig.Undo({
                    applyCmd: applyCmd,
                    undoCmd: undoCmd,
                    redoCmd: redoCmd
                });
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

    it("undo with empty stack does nothing", function() {
        expect(state).toBe(0);
        expect(mathUndoer.undoCmd()).toBeTruthy();
        expect(state).toBe(0);

    });

    it("invalid commands don't get undo entries", function() {
        expect(state).toBe(0);
        expect(mathUndoer.applyCmd(-1)).toBeTruthy();
        expect(state).toBe(0);
        expect(mathUndoer.undoCmd()).toBeTruthy();
    });

    it("can apply commands and undo them", function() {
        expect(state).toBe(0);
        expect(mathUndoer.applyCmd(1)).toBeFalsy();
        expect(state).toBe(1);
        expect(mathUndoer.applyCmd(2)).toBeFalsy();
        expect(state).toBe(3);
        expect(mathUndoer.applyCmd(3)).toBeFalsy();
        expect(state).toBe(6);
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(state).toBe(3);
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(state).toBe(1);
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(state).toBe(0);
        expect(mathUndoer.undoCmd()).toBeTruthy();
        expect(state).toBe(0);
    })

    it("can undo and redo commands", function() {
        expect(state).toBe(0);
        expect(mathUndoer.applyCmd(1)).toBeFalsy();
        expect(mathUndoer.applyCmd(2)).toBeFalsy();
        expect(mathUndoer.applyCmd(3)).toBeFalsy();
        expect(state).toBe(6);
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(state).toBe(1);
        expect(mathUndoer.redoCmd()).toBeFalsy();
        expect(mathUndoer.redoCmd()).toBeFalsy();
        expect(state).toBe(6);
        expect(mathUndoer.redoCmd()).toBeTruthy();
    });

    it("wipes redo history after applying new commands", function() {
        expect(state).toBe(0);
        expect(mathUndoer.applyCmd(1)).toBeFalsy();
        expect(mathUndoer.applyCmd(2)).toBeFalsy();
        expect(mathUndoer.applyCmd(3)).toBeFalsy();
        expect(state).toBe(6);
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(state).toBe(1);
        expect(mathUndoer.applyCmd(4));
        expect(state).toBe(5);
        expect(mathUndoer.redoCmd()).toBeTruthy();
    });

    it("can clear undo/redo history", function() {
        expect(state).toBe(0);
        expect(mathUndoer.applyCmd(1)).toBeFalsy();
        expect(mathUndoer.applyCmd(2)).toBeFalsy();
        expect(mathUndoer.applyCmd(3)).toBeFalsy();
        expect(state).toBe(6);
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(mathUndoer.undoCmd()).toBeFalsy();
        expect(mathUndoer.redoCmd()).toBeFalsy();
        expect(state).toBe(3);
        mathUndoer.clearHistory();
        expect(state).toBe(3);
        expect(mathUndoer.undoCmd()).toBeTruthy();
        expect(state).toBe(3);
        expect(mathUndoer.redoCmd()).toBeTruthy();
        expect(state).toBe(3);
    })
});