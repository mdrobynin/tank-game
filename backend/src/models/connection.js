const UserEventsObservable = require('../logic/user-events-observable');
const Controller = require('../controllers/controller');

class Connection {
    constructor (socket, room) {
        this.id = socket.id;
        this.observable = new UserEventsObservable(socket);
        this.controller = new Controller(this.observable, room.gameState);
        this.tickHandler = this.controller.handleMainTick.bind(this.controller);
    }

    abort () {
        this.controller.onDelete();
    }
}

module.exports = Connection;