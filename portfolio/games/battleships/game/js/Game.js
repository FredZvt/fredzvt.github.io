/*
    Vancouver Film School - Web Apps 1 Final Assignment Battleships Game
    Copyrights 2014 Frederico Zveiter (frederico.zveiter@gmail.com)
    All rights reserved
*/

window.Sounds = {
	ShipHit: 0,
	WaterHit: 1
}

window.Game = (function () {

    var _gameLoop = function() {
    
        var opponentPlayer = this.playerTurn + 1;
        if (opponentPlayer > 2) opponentPlayer = 1;
        
        var playerBoard = this["p" + this.playerTurn + "Board"];
        var opponentBoard = this["p" + opponentPlayer + "Board"];
        
        playerBoard.setHighlight(false);
        opponentBoard.setHighlight(true);
        
        opponentBoard.setShootingMode(this, function () {
            
            var remainingShotsVarName = "p" + this.playerTurn + "RemainingShots";
            this[remainingShotsVarName]--;
            playerBoard.setRemainingShots(this[remainingShotsVarName]);
            
            if (opponentBoard.getSumOfShipsHealth() == 0) {
                // Player wins!
        
                this.p1Board.setHideShips(false);
                this.p2Board.setHideShips(false);
        
                var winnerName = this["_p" + this.playerTurn + "Name"];
                this._announce(winnerName + " win!");
            }
            else if (this[remainingShotsVarName] == 0 && this["p" + opponentPlayer + "RemainingShots"] == 0) {
                // No shots remaining for both players.
                
                this._onNoMoreShots();
            }
            else {
                // Game still running.
            
                this.playerTurn++;
                if (this.playerTurn > 2)
                    this.playerTurn = 1;
                    
                this._gameLoop();
            }
        });
    }
    
    var _onNoMoreShots = function() {
        
        this.p1Board.setHideShips(false);
        this.p2Board.setHideShips(false);
        
        var p1Health = this.p1Board.getSumOfShipsHealth();
        var p2Health = this.p2Board.getSumOfShipsHealth();
        
        if (p1Health > p2Health) {
            // p1 win
            this._announce(this._p1Name + " win!");
        }
        else if (p2Health > p1Health) {
            // p2 win
            this._announce(this._p2Name + " win!");
        }
        else if (p1Health == p2Health) {
            // Draw
            this._announce("Draw game!");
        }
    }
    
    var _announce = function(html) {
    
        this._announceMessage.html(html);
        this._announceBox.toggle("pulsate");
    }
	
	var _initNewGame = function(p2AI) {
	
		this._p1AI = false;
        this._p2AI = p2AI;
    
        this._p1Name = Game.p1Name;
        
        if (this._p2AI)
            this._p2Name = Game.cpuName;
        else
            this._p2Name = Game.p2Name;
        
        // Initialize Boards
        this.p1Board = new Board("#playerOne", this._p1Name, this._p2Name, this._p1AI, this._p2AI);
        this.p2Board = new Board("#playerTwo", this._p2Name, this._p1Name, this._p2AI, this._p1AI);
        
        // Initialize number of shots for each playerOne
        this.p1RemainingShots = this.numberOfShots;
        this.p2RemainingShots = this.numberOfShots;
        
        // Display players remaining shots
        this.p1Board.setRemainingShots(this.p1RemainingShots);
        this.p2Board.setRemainingShots(this.p2RemainingShots);

        this.p2Board.setHighlight(false);
        this.p2Board.setHideShips(true);

        this.p1Board.setHighlight(true);
        this.p1Board.setShipPlacementMode(this, function () {
            // When P1 finish placement, let P2 place ships.
            
            this.p1Board.setHighlight(false);
            this.p1Board.setHideShips(true);

            this.p2Board.setHighlight(true);
            this.p2Board.setHideShips(false);
            
            this.p2Board.setShipPlacementMode(this, function () {
                // When P2 finish placement
                
                this.p1Board.setHideShips(true);
                this.p2Board.setHideShips(true);
        
                this.playerTurn = 1;
                this._gameLoop();
            });
        });
	}
	
    var init = function () {

        // Get references
		this._secMainMenu = $("#secMainMenu");
		this._secPlayerBoards = $("#secPlayerBoards");
        this._announceBox = $("#announceBox");
		this._announceMessage = $("#announceMessage");
		this._btnAnnounceBack = $("#btnAnnounceBack");
		this._btnOnePlayer = $("#btnOnePlayer");
		this._btnTwoPlayers = $("#btnTwoPlayers");
		
		// Check references
        if (this._secMainMenu.length != 1) throw "Element selection error;";
        if (this._secPlayerBoards.length != 1) throw "Element selection error;";
        if (this._announceBox.length != 1) throw "Element selection error;";
        if (this._btnOnePlayer.length != 1) throw "Element selection error;";
        if (this._btnTwoPlayers.length != 1) throw "Element selection error;";
		
		this._btnOnePlayer.click(this, function(e) {
			var self = e.data;
			self._initNewGame(true);
			self._secMainMenu.fadeOut(100, function() {
				self._secPlayerBoards.fadeIn(100);
			});
		});
		
		this._btnTwoPlayers.click(this, function(e) {
			var self = e.data;
			self._initNewGame(false);
			self._secMainMenu.fadeOut(100, function() {
				self._secPlayerBoards.fadeIn(100);
			});
		});
		
		this._btnAnnounceBack.click(this, function(e) {
			var self = e.data;
			self._secPlayerBoards.fadeOut(100, function() {
				self._announceBox.fadeOut(100);
				self._secMainMenu.fadeIn(100);
			});
		});
		
		// Load music
		
		this._music = 
			new buzz.sound(
				"sounds/music.mp3", 
				{ 
					autoplay: true, 
					loop: true 
				}
			);
		
		// Load sound effects
		
		this._sfx = [
		
			new buzz.sound(
				"sounds/ship-hit.mp3", 
				{ 
					autoplay: false, 
					loop: false
				}
			),
			
			new buzz.sound(
				"sounds/water-hit.mp3", 
				{ 
					autoplay: false, 
					loop: false
				}
			),
		];
    };
	
	var playSound = function(index) {
	
		this._sfx[index].stop().play();
	}
    
    var _getRnd = function(min, max) {
    
        return Math.floor(Math.random() * max) + min;
    }
    
    var _getRndBoardPosition = function() {
    
        return {
            row: this._getRnd(0, this.boardHeight),
            cell: this._getRnd(0, this.boardWidth),
        };
    }

    return {

        init: init,
        
        _getRnd: _getRnd,
        _getRndBoardPosition: _getRndBoardPosition,
        _gameLoop: _gameLoop,
        _onNoMoreShots: _onNoMoreShots,
        _announce: _announce,
		_initNewGame: _initNewGame,
		playSound: playSound,

		p1Name: "Player 1",
		p2Name: "Player 2",
		cpuName: "Computer",
		
        numberOfShots: 100,
        boardWidth: 10,
        boardHeight: 10,
        shipDefinitions: [
            { size: 8, name: "Aircraft Carrier" },
            { size: 4, name: "Battleship" },
            { size: 4, name: "Cruiser" },
            { size: 5, name: "Destroyer" },
            { size: 2, name: "Submarine" }
        ],
    };

})();