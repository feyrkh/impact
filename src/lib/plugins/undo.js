ig.module(
    'plugins.undo'
)
    .requires('plugins.utils')
    .defines(function () {
        "use strict";

        ig.Undo = ig.Class.extend({
            /**
             * @param opts.applyCmd - Function that takes a command object and applies it. Should return truthy if the
             *                  command can't be applied.
             * @param opts.redoCmd - Function that takes a command object and applies it, for the second time.
             *                  Optional, defaults to applyCmd if not provided. Should return a truthy value if the command
             *                  can't be undone.
             * @param opts.undoCmd - Function that calls undoes the most recent command. Should return a truthy value if
             *                  the command can't be undone.
             */
            init: function (opts) {
                if (!opts.redoCmd) opts.redoCmd = opts.applyCmd;
                if (!opts.applyCmd) throw "Must supply opts.applyCmd to ig.Undo constructor";
                if (!opts.undoCmd) throw "Must supply opts.undoCmd to ig.Undo constructor.";
                this.opts = opts;
                this.stack = [];
                this.redoStack = [];
            },

            applyCmd: function(cmd) {
                var err = this.opts.applyCmd(cmd);
                if(!err) {
                    this.stack.push(cmd);
                    this.redoStack.clear();
                }
                return err;
            },
            redoCmd: function() {
                if(this.redoStack.length === 0) {
                    return "no redo entries";
                }
                var latestRedone = this.redoStack.pop();
                var err = this.opts.redoCmd(latestRedone);
                if(err) {
                    this.redoStack.push(err);
                }
                return err;
            },
            undoCmd: function() {
                if(this.stack.length === 0) {
                    return "no undo entries";
                }
                var latestCmd = this.stack.pop();
                var err = this.opts.undoCmd(latestCmd);
                if(err) {
                    this.stack.push(latestCmd);
                } else {
                    this.redoStack.push(latestCmd);
                }
                return err;
            }
        });
    });