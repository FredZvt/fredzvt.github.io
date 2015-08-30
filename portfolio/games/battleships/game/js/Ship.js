/*
    Vancouver Film School - Web Apps 1 Final Assignment Battleships Game
    Copyrights 2014 Frederico Zveiter (frederico.zveiter@gmail.com)
    All rights reserved
*/

window.ShipOrientation = {

    Horizontal: 1,
    Vertical: 2
}

window.ShipState = {

    Uninitialized: 0,
    InPlacement: 1,
    InPlace: 2
}

window.Ship = function (name, size) {

    this._name = name;
    this._size = size;
    
    // Set initial state.
    this._state = ShipState.Uninitialized;
    
    // Set initial orientation.
    this._orientation = ShipOrientation.Vertical;
    
    // Set initial position.
    this._position = { row: 0, cell: 0 };
    
    // Initialize hits array.
    this._hits = [this._size];
    for (var i = 0; i < this._size; i++)
        this._hits[i] = false;
    
    // Calculate initial placement.
    this._calculatePlacement();
}

window.Ship.prototype.setHit = function(index) {

    this._hits[index] = true;
}

window.Ship.prototype.getName = function() {

    return this._name;
}

window.Ship.prototype.getSize = function() {

    return this._size;
}

window.Ship.prototype.getState = function() {

    return this._state;
}

window.Ship.prototype.setState = function(value) {

    this._state = value;
}

window.Ship.prototype.getPlacement = function() {

    return this._placement;
}

window.Ship.prototype.setNewPosition = function(newPos) {

    this._position = newPos;
    
    // Calculate placement for new position.
    this._calculatePlacement();	
}

window.Ship.prototype.getHealth = function() {

    var healthCounter = 0;
    
    for (var i = 0; i < this._size; i++)
        if (!this._hits[i])
            healthCounter++;
            
    return healthCounter;
}

window.Ship.prototype.toggleOrientation = function() {

    switch (this._orientation) {

        case ShipOrientation.Horizontal:
            this._orientation = ShipOrientation.Vertical;
            break;

        case ShipOrientation.Vertical:
            this._orientation = ShipOrientation.Horizontal;
            break;

        default:
            throw "Unexpected ShipOrientation.";
    }
    
    // Calculate placement for new orientation.
    this._calculatePlacement();	
}

window.Ship.prototype.isPlacementInsideBoard = function() {

    for (var i = 0; i < this._placement.length; i++) {
        var p = this._placement[i];

        if (p.row >= Game.boardHeight || 
            p.cell >= Game.boardWidth)
            return false;
    }
    
    return true;
}

window.Ship.prototype._calculatePlacement = function() {

    this._placement = [this._size];

    for (var i = 0; i < this._size; i++) {
    
        switch (this._orientation) {

            case ShipOrientation.Horizontal:
                this._placement[i] = {
                    row: this._position.row,
                    cell: this._position.cell + i
                };
                break;

            case ShipOrientation.Vertical:
                this._placement[i] = {
                    row: this._position.row + i,
                    cell: this._position.cell
                };
                break;

            default:
                throw "Unexpected ShipOrientation.";
        }
        
        this._placement[i].index = i;
    }
}