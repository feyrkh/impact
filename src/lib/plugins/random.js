ig.module('plugins.random')
.defines(function() {
        'use strict';
        ig.Random = ig.Class.extend({
            init: function(seed) {
                this.seed = seed || Math.random();
            },
            setSeed: function(seed) {
                this.seed = seed;
            },
            random: function() {
                var x = Math.sin(this.seed++) * 100000;
                return x - Math.floor(x);
           }
        });
    });