ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'plugins.impact-infinite',
    'plugins.camera',
    'game.levels.block1',
    'game.levels.block2',
    'game.levels.blockStart'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	infiniteLivel: null,
	
	init: function() {
		// Initialize your game here; bind keys etc.
        ig.input.bind( ig.KEY.A, 'left' );
        ig.input.bind( ig.KEY.D, 'right' );
        this.infiniteLevel = new ig.InfiniteLevel([LevelBlock1, LevelBlock2], {start: LevelBlockStart});
	},

    loadLevel: function( data ) {

        // Call the parent implemenation; this creates the background
        // maps and entities.
        this.parent( data );

        this.setupCamera();
    },

    setupCamera: function() {
        // Set up the camera. The camera's center is at a third of the screen
        // size, i.e. somewhat shift left and up. Damping is set to 3px.
        this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3 );

        // The camera's trap (the deadzone in which the player can move with the
        // camera staying fixed) is set to according to the screen size as well.
        this.camera.trap.size.x = ig.system.width/10;
        this.camera.trap.size.y = ig.system.height/3;

        // The lookahead always shifts the camera in walking position; you can
        // set it to 0 to disable.
        this.camera.lookAhead.x = ig.system.width/6;

        // Set camera's screen bounds and reposition the trap on the player
        this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
        this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
        this.camera.set( this.player );
    },
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
        this.camera.follow( ig.game.player );
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
        this.infiniteLevel.update();
//		var x = ig.system.width/2,
//			y = ig.system.height/2;
//
//		this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320*4, 240*3, 1 );

});
