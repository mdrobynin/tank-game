const config = require('../config/config');
const constants = require('../config/constants');
const TerrainFactory = require('./terrain-factory');

class Helpers {
    static getDirectionFromEvent(event) {
        switch (event.name) {
            case constants.events.click.up:
                return constants.directions.up;
            case constants.events.click.down:
                return constants.directions.down;
            case constants.events.click.left:
                return constants.directions.left;
            case constants.events.click.right:
                return constants.directions.right;
        }
    }

    static checkBulletIsHittingPlayer(bulletPos, playerPos) {
        const size = config.player.size / 2 - 3;
        const inX = bulletPos.x >= playerPos.x - size && bulletPos.x <= playerPos.x + size;
        const inY = bulletPos.y >= playerPos.y - size && bulletPos.y <= playerPos.y + size;
        return inX && inY;
    }

    static checkBulletIsHittingBarrier(bulletPos, barrier) {
        const inX = bulletPos.x >= barrier.xMin && bulletPos.x <= barrier.xMax;
        const inY = bulletPos.y >= barrier.yMin && bulletPos.y <= barrier.yMax;
        return inX && inY;
    }

    static checkBoundariesForBullet({ x, y }) {
        return x > 0 && x < config.CANVAS_SIZE && y > 0 && y < config.CANVAS_SIZE;
    }

    static checkBoundaries({ x, y }) {
        const size = config.player.size / 2 - 3;
        return x > size && x < config.CANVAS_SIZE - size && y > size && y < config.CANVAS_SIZE - size;
    }

    static checkTerrainInDirection(player, terrainInDirection) {
        if (!terrainInDirection) return true;
        if (terrainInDirection.type === constants.terrainTypes.grass) return true;
        const size = config.player.size / 2;
        const { x, y } = player.coordinates;
        const { xMin, yMin, xMax, yMax } = terrainInDirection;
        const { up, down, left, right } = constants.directions;

        if (player.direction === up || player.direction === down) {
            return Math.min(Math.abs(yMin - y), Math.abs(yMax - y)) > size + config.player.speed;
        }

        if (player.direction === left || player.direction === right) {
            return Math.min(Math.abs(xMin - x), Math.abs(xMax - x)) > size;
        }
    }

    static getPlayerFrontPoints({ x, y }, direction) {
        const size = config.player.size / 2 - 3;
        const nextPosition = {
            x: x + direction.x * config.player.speed,
            y: y + direction.y * config.player.speed
        };
        const { up, down, left, right } = constants.directions;

        switch (direction) {
            case up:
                return {
                    rightPoint: { x: nextPosition.x + size, y: nextPosition.y - size },
                    leftPoint: { x: nextPosition.x - size, y: nextPosition.y - size }
                };
            case down:
                return {
                    rightPoint: { x: nextPosition.x + size, y: nextPosition.y + size },
                    leftPoint: { x: nextPosition.x - size, y: nextPosition.y + size }
                };
            case left:
                return {
                    rightPoint: { x: nextPosition.x + size, y: nextPosition.y + size },
                    leftPoint: { x: nextPosition.x + size, y: nextPosition.y - size }
                };
            case right:
                return {
                    rightPoint: { x: nextPosition.x - size, y: nextPosition.y + size },
                    leftPoint: { x: nextPosition.x - size, y: nextPosition.y - size }
                };
        }
    }

    static getRandomGrassTerrain(terrain) {
        const grassTerrains = [];
        for (let i = 0; i < config.BLOCKS_COUNT; i++) {
            for (let j = 0; j < config.BLOCKS_COUNT; j++) {
                if (terrain[i][j].type === constants.terrainTypes.grass) {
                    grassTerrains.push(terrain[i][j]);
                }
            }
        }
        const n = Math.floor(Math.random() * grassTerrains.length);
        return grassTerrains[n];
    }

    static findTerrainByCoordinates({ x, y }, terrain) {
        for (let i = 0; i < config.BLOCKS_COUNT; i++) {
            for (let j = 0; j < config.BLOCKS_COUNT; j++) {
                let { xMin, yMin, xMax, yMax } = terrain[i][j];
                if (x >= xMin && y >= yMin && x <= xMax && y <= yMax) {
                    return { i, j };
                }
            }
        }
    }

    static createTerrain() {
        const terrain = [];
        const barriers = [];
        const terrainFactory = new TerrainFactory();
        for (let i = 0; i < config.BLOCKS_COUNT; i++) {
            const terrainRow = [];
            for (let j = 0; j < config.BLOCKS_COUNT; j++) {
                const terrainItem = terrainFactory.getTerrain({ i, j });
                terrainRow.push(terrainItem);
                if (terrainItem.type !== constants.terrainTypes.grass) {
                    barriers.push(terrainItem);
                }
            }
            terrain.push(terrainRow);
        }
        return { terrain, barriers }
    }
}

module.exports = Helpers;
