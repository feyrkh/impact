ig.module(
    'plugins.undo'
)
    .defines(function () {
        "use strict";

        ig.Undo = ig.Class.extend({
            /**
             * @param opts.applyCmd - Function that takes a command object and applies it.
             * @param opts.redoCmd - Function that takes a command object and applies it, for the second time.
             *                  Optional, defaults to applyCmd if not provided. Should return 'false' if the command
             *                  can't be undone.
             * @param opts.undoCmd - Function that takes a command object and applies it. Should return 'false' if
             *                  the command can't be undone.
             */
            init: function (opts) {
                if (!opts.redoCmd) opts.redoCmd = opts.applyCmd;
                if (!opts.applyCmd) throw "Must supply opts.applyCmd to ig.Undo constructor";
                if (!opts.undoCmd) throw "Must supply opts.undoCmd to ig.Undo constructor.";
            }
        });
    });