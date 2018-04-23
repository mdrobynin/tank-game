const Helpers = require('../utils/helpers');

class PlayerState {
    constructor(coordinates, direction, id) {
        this.id = id;
        this.coordinates = coordinates;
        this.direction = direction;
    }

    move(direction) {
        this.direction = direction;
        const {x, y} = Helpers.getDeltaFromDirection(direction, 'for player');
        const nextPosition = {
            x: this.coordinates.x + x,
            y: this.coordinates.y + y
        };
        if (Helpers.checkBoundaries(nextPosition)) {
            this.coordinates = nextPosition;
        }
    }
}

module.exports = PlayerState;
