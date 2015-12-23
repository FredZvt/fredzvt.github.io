/*
    Vancouver Film School - Web Apps 1 Final Assignment Battleships Game
    Copyrights 2014 Frederico Zveiter (frederico.zveiter@gmail.com)
    All rights reserved
*/

window.BoardClasses = {

    HiddenClassName: "hidden",
    InPlacementClassName: "shipInPlacement",
    InvalidPlaceClassName: "shipInInvalidPlacement",
    InPlaceClassName: "shipInPlace",
    WaterShootClassName: "waterShoot",
    HitShootClassName: "hitShoot",
}

window.ShootingStates = {

    Unshooted: 0,
    Water: 1,
    Hit: 2
}

window.Board = function (boardSelector, playerName, opponentName, isAI, opponentIsAI) {
        
    this._playerName = playerName;
    this._opponentName = opponentName;
    this._isAI = isAI;
    this._opponentIsAI = opponentIsAI;
    
    // Select and hold section elements.
    this._section = $(boardSelector);
    this._playerNameLabel = $("h1", this._section);
    this._remainingShotsLabel = $("span.remainingShotsLabel", this._section);
    this._remainingShots = $("span.remainingShotsNumber", this._section);
    this._tblFleetStatus = $("table.fleetStatus", this._section);
    this._tblBoard = $("table.board", this._section);
    this._instructionsBox = $(".instructionBox", this._section);
	
	// Set instructionBox initially hidden.
	this._instructionsBox.hide();

    // Check selections
    if (this._section.length != 1) throw "Element selection error;";
    if (this._playerNameLabel.length != 1) throw "Element selection error;";
    if (this._remainingShotsLabel.length != 1) throw "Element selection error;";
    if (this._remainingShots.length != 1) throw "Element selection error;";
    if (this._tblFleetStatus.length != 1) throw "Element selection error;";
    if (this._tblBoard.length != 1) throw "Element selection error;";

    // Set player name on labels
    this._playerNameLabel.html(this._playerName + " Board");
    this._remainingShotsLabel.html(this._playerName + " Remaining Shots");
    
    // Initialize fleet
    this._ships = [Game.shipDefinitions.length];
    for (var i = 0; i < Game.shipDefinitions.length; i++) {
        var def = Game.shipDefinitions[i];
        this._ships[i] = new Ship(def.name, def.size);
    }
    
    // Initialize shootings record
    this._shootings = [Game.boardHeight];
    for (var row = 0; row < Game.boardHeight; row++) {
        this._shootings[row] = [Game.boardWidth];
        for (var cell = 0; cell < Game.boardWidth; cell++) {
            this._shootings[row][cell] = ShootingStates.Unshooted;
        }
    }

    // Draw fleet status for the first time.
    this._recreateFleetStatusTable();

    // Draw board for the first time.
    this._createBoardTable();
    
    // Initialize flag to hide the ships.
    this._hideShips = false;
};

window.Board.prototype.getSumOfShipsHealth = function() {

    var healthCounter = 0;
    
    for (var i = 0; i < this._ships.length; i++) {
        var ship = this._ships[i];
        healthCounter += ship.getHealth();
    }
            
    return healthCounter;
}

window.Board.prototype.showInstruction = function (msg, cssTop, cssFontSize) {

    this._instructionsBox.html(msg);	
    this._instructionsBox.css("top", cssTop + "px");
    this._instructionsBox.css("font-size", cssFontSize + "px");
    
    this._instructionsBox
		.stop(true, false)
        .fadeIn(50)
        .animate({ top: "-=10" }, 200, "easeOutQuad")
        .animate({ top: "+=10" }, 200, "easeInQuad")
        .animate({ top: "-=10" }, 200, "easeOutQuad")
        .animate({ top: "+=10" }, 200, "easeInQuad")
}

window.Board.prototype.setRemainingShots = function (value) {

    this._remainingShots.html(value);
}

window.Board.prototype.hideInstruction = function () {

    this._instructionsBox.fadeOut(50)
}

window.Board.prototype.setHideShips = function (value) {

    if (this._hideShips != value) {
        this._hideShips = value;
        this._drawBoard();
    }
}

window.Board.prototype.setHighlight = function (value) {

    if (value == true) {
        this._section.addClass('highlighted');
    }
    else {
        this._section.removeClass('highlighted');
    }
}

window.Board.prototype._createBoardTable = function () {

    this._tblBoard.empty();
    this._tblBoardCells = [Game.boardWidth];

    for (var row = 0; row < Game.boardWidth; row++) {
        
        this._tblBoardCells[row] = [Game.boardHeight];
        var newRow = $("<tr></tr>");

        for (var cell = 0; cell < Game.boardHeight; cell++) {

            this._tblBoardCells[row][cell] = $("<td data-row='" + row + "' data-cell='" + cell + "'></td>");
            newRow.append(this._tblBoardCells[row][cell]);
        }

        this._tblBoard.append(newRow);
    }
}

window.Board.prototype._recreateFleetStatusTable = function () {

    var tblHtml = "<tr><td class='header'>Fleet Status:</td></tr>";

    for (var i = 0; i < this._ships.length; i++) {

        var ship = this._ships[i];
        tblHtml += "<tr>";
        tblHtml += "<td class='name'>" + ship.getName() + "</td>";

        var shipHealth = ship.getHealth();
        var shipSize = ship.getSize();
        for (var j = 1; j <= shipSize; j++)
        {
            var tdClass = j <= shipHealth ? "healthy" : "unhealthy";
            tblHtml += "<td class='" + tdClass + "'></td>";
        }

        tblHtml += "</tr>";
    }

    this._tblFleetStatus.html(tblHtml);
}

window.Board.prototype._removeClassesOfAllCells = function () {

    for (var row = 0; row < Game.boardWidth; row++) {
        for (var cell = 0; cell < Game.boardHeight; cell++) {
        
            this._tblBoardCells[row][cell].removeClass(BoardClasses.HiddenClassName);
            this._tblBoardCells[row][cell].removeClass(BoardClasses.InPlacementClassName);
            this._tblBoardCells[row][cell].removeClass(BoardClasses.InvalidPlaceClassName);
            this._tblBoardCells[row][cell].removeClass(BoardClasses.InPlaceClassName);
        }
    }
}

window.Board.prototype._addClasseToAllCells = function (className) {

    for (var row = 0; row < Game.boardWidth; row++) {
        for (var cell = 0; cell < Game.boardHeight; cell++) {
            this._tblBoardCells[row][cell].addClass(className);
        }
    }
}

window.Board.prototype._drawBoard = function () {
    
    // Clean all cells of the board
    this._removeClassesOfAllCells();
    
    if (!this._hideShips) {
    
        for (var shipIdx = 0; shipIdx < this._ships.length; shipIdx++) {
        
            var ship = this._ships[shipIdx];
            var state = ship.getState();		
            var placements = ship.getPlacement();
            
            switch (state) {
            
                case ShipState.InPlace:
                
                    for (var placementIdx = 0; placementIdx < placements.length; placementIdx++) {
                        
                        var p = placements[placementIdx];
                        var td = this._tblBoardCells[p.row][p.cell];
                        td.addClass(BoardClasses.InPlaceClassName);
                    }
                    break;
            
                case ShipState.InPlacement:
                
                    var classToUse = 
                        ship.isPlacementInsideBoard() && 
                        this._currentShipInPlacementColliding == false
                        ? BoardClasses.InPlacementClassName 
                        : BoardClasses.InvalidPlaceClassName;
                    
                    for (var placementIdx = 0; placementIdx < placements.length; placementIdx++) {
                    
                        var p = placements[placementIdx];
                        if (p.row < Game.boardHeight && p.cell < Game.boardWidth) {
                        
                            var td = this._tblBoardCells[p.row][p.cell];
                            td.addClass(classToUse);
                        }
                    }
                    break;
            }
        }
    }

    for (var row = 0; row < Game.boardWidth; row++) {
        for (var cell = 0; cell < Game.boardHeight; cell++) {
            
            var td = this._tblBoardCells[row][cell];			
            switch (this._shootings[row][cell]) {
            
                case ShootingStates.Water:
                    td.addClass(BoardClasses.WaterShootClassName);
                    break;
                    
                case ShootingStates.Hit:
                    td.addClass(BoardClasses.HitShootClassName);
                    break;
            
                case ShootingStates.Unshooted:
                    // Do nothing.
                    break;
            
                default:
                    throw "Unexpected shooting state.";
            }
        }
    }
}

window.Board.prototype._setNextShipToPlace = function (dontShowInstructions) {

    this._currentShipInPlacementIndex++;

    if (this._currentShipInPlacementIndex == this._ships.length) {

        this._currentShipInPlacement = null;
    }
    else {

        this._currentShipInPlacement = this._ships[this._currentShipInPlacementIndex];
        this._currentShipInPlacement.setState(ShipState.InPlacement);
        this._checkCurrentShipInPlacementForCollisions();

        var msg = 
            this._playerName + ", set " + this._currentShipInPlacement.getName() + 
            " position.<br />Right click to rotate<br />Left click to place.";
        
        if (dontShowInstructions != true)
            this.showInstruction(msg, -120, 18);
    }
}

window.Board.prototype._getCellPositionFromEvent = function (evt) {

    var td = $(evt.target);
    var row = td.data("row");
    var cell = td.data("cell");

    return {
        row: row,
        cell: cell
    };
}

window.Board.prototype._checkCurrentShipInPlacementForCollisions = function () {

    this._currentShipInPlacementColliding = false;
    var placements = this._currentShipInPlacement.getPlacement();
    for (var placementIdx = 0; placementIdx < placements.length; placementIdx++) {
    
        var p = placements[placementIdx];
        for (var i = 0; i < this._ships.length; i++) {
        
            var ship = this._ships[i];
            var state = ship.getState();
            if (state == ShipState.InPlace) {
                        
                var sPlcs = ship.getPlacement();
                for (var j = 0; j < sPlcs.length; j++) {
                
                    var sPlc = sPlcs[j];
                    if (p.row == sPlc.row && p.cell == sPlc.cell) {
                        
                        this._currentShipInPlacementColliding = true;
                        return;
                    }
                }
            }
        }
    }
}

window.Board.prototype.setShipPlacementMode = function (callbackContext, callback) {

    // Set first ship to place.
    this._currentShipInPlacementIndex = -1;
    this._setNextShipToPlace(this._isAI);
        
    if (this._isAI) {
        // auto play!
        
        for (var i = 0; i < this._ships.length; i++) {
        
            var ship = this._ships[i];
            do {
            
                ship.setNewPosition(Game._getRndBoardPosition());			
                this._currentShipInPlacement.toggleOrientation();
                this._checkCurrentShipInPlacementForCollisions();
            } 
            while (
            
                this._currentShipInPlacementColliding == true ||
                this._currentShipInPlacement.isPlacementInsideBoard() == false
            )

            this._currentShipInPlacement.setState(ShipState.InPlace);
            this._setNextShipToPlace(true);
        }
        
        callback.call(callbackContext);
    }
    else {
        // Human playing.

        // Set on complete callback.
        this._onShipPlacementModeComplete = function () {
            callback.call(callbackContext);
        };

        // When mouse enters a cell, paint ship placement in that position.
        this._tblBoard.on("mouseenter", "td", this, function (e) {

            var self = e.data;
            var newPos = self._getCellPositionFromEvent(e);
            self._currentShipInPlacement.setNewPosition(newPos);
            self._checkCurrentShipInPlacementForCollisions();
            self._drawBoard();
        });

        // Disable context menu on cells to allow right click.
        this._tblBoard.on("contextmenu", "td", this, function (e) {
            return false;
        });
        
        // Capture mouse clicks on board cells.
        this._tblBoard.on("mousedown", "td", this, function (e) {
    
        var self = e.data;
        var newPos = self._getCellPositionFromEvent(e);
        switch (e.which) {
                
            case 3:
                // right mouse button click.
                
                self._currentShipInPlacement.toggleOrientation();
                self._checkCurrentShipInPlacementForCollisions();
                self._drawBoard();
                break;
        
            case 1:
                // left mouse button click.
                
                if (self._currentShipInPlacementColliding == false &&
                    self._currentShipInPlacement.isPlacementInsideBoard()) {
                
                    self._currentShipInPlacement.setState(ShipState.InPlace);
                    self._setNextShipToPlace();
                    
                    if (self._currentShipInPlacement != null) {	
                        // There are more ships to place.
                    
                        // Set the next ship position to current mouse position.
                        self._currentShipInPlacement.setNewPosition(newPos);
                        
                        // Refresh cell classes in order to correctly detect collisions.
                        self._drawBoard();
                    
                        // Check for collisions.
                        self._checkCurrentShipInPlacementForCollisions();
                    }
                    else {
                        // All ships are in place.
                        
                        // Unbind placement mode event handlers.
                        self._tblBoard.off("mouseenter", "td");
                        self._tblBoard.off("contextmenu", "td");
                        self._tblBoard.off("mousedown", "td");
                        
                        // Hide instructions.
                        self.hideInstruction();
                        
                        // Call on complete callback.
                        self._onShipPlacementModeComplete();
                    }
                    
                    self._drawBoard();
                }
                else {
                    // Invalid position.
                    
                    // TODO: Play sound.
                }
                break;
            }
        });
    }
}

window.Board.prototype.setShootingMode = function (callbackContext, callback) {

    if (this._opponentIsAI) {
        // Auto play.
        
        do {
        
            var shootPos = Game._getRndBoardPosition();
        }
        while (this._shootings[shootPos.row][shootPos.cell] != ShootingStates.Unshooted);
        
        this._setShotAtPosition(shootPos);
        
        callback.call(callbackContext);
    } 
    else {
        // Is human playing.

        // Set on complete callback.
        this._onShootingComplete = function () {
            callback.call(callbackContext);
        };
        
        // Show instructions.
        this.showInstruction(this._opponentName + " turn!<br />Left click to shoot!", -100, 20);
            
        // Capture mouse clicks on board cells.
        this._tblBoard.on("mousedown", "td", this, function (e) {
        
            if (e.which == 1) {
                // Capture only left clicks.
        
                var self = e.data;
                var shootPos = self._getCellPositionFromEvent(e);
                
                if (self._shootings[shootPos.row][shootPos.cell] != ShootingStates.Unshooted) {
                    // Already shooted here!
                    
                    // TODO: play sound.
                }
                else {
                
                    self._setShotAtPosition(shootPos);
                    
                    // Unbind placement mode event handlers.
                    self._tblBoard.off("mousedown", "td");
                    
                    // Hide instructions.
                    self.hideInstruction();
                    
                    // Call on complete callback.
                    self._onShootingComplete();
                }
            }
        });
    }
}

window.Board.prototype._setShotAtPosition = function (shootPos) {

    var hit = false;			
    for (var i = 0; i < this._ships.length; i++) {
    
        var ship = this._ships[i];
        var placements = ship.getPlacement();
        for (var j = 0; j < placements.length; j++) {
        
            var placement = placements[j];
            if (placement.row == shootPos.row && placement.cell == shootPos.cell) {
            
                ship.setHit(placement.index);
                this._recreateFleetStatusTable();						
                this._shootings[shootPos.row][shootPos.cell] = ShootingStates.Hit;
                hit = true;
				
				Game.playSound(Sounds.ShipHit);	
            }
            
            if (hit) break;
        }
        
        if (hit) break;
    }
    
    if (!hit) {
    
        this._shootings[shootPos.row][shootPos.cell] = ShootingStates.Water;		
		Game.playSound(Sounds.WaterHit);
    }
    
    this._drawBoard();
}








