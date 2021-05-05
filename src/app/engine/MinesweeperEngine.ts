import { Subject } from "rxjs";
import { GameContext } from "./GameContext";
import { GameDifficulty } from "./GameDifficulty";
import { MainPositions, Positions } from "./Position";
import { Tile } from "./Tile";
import { getRandomInt } from "./utils";

export class MinesweeperEngine {

    private interval: any;

    public context: GameContext = new GameContext('Junior');

    constructor() {
    }

    public gameStarted$ = new Subject();
    public gameCompleted$ = new Subject<boolean>();

    public startGame(difficulty: GameDifficulty) {
        this.context = new GameContext(difficulty)
        this.stopTimer();
        this.setupGame(difficulty);
        this.gameStarted$.next();
    }

    public revealTile(tile: Tile) {
        if (this.context.isGameOver || this.context.victory) {
            return;
        }

        if (!this.context.bombsPlaced) {
            this.placeMines(this.context.settings.bombs, this.context.settings.x, this.context.settings.y, tile);
            this.context.bombsPlaced = true;
        }

        this.startTimer();

        if (tile.isFlagged) {
            return;
        }

        if (tile.isBomb) {
            tile.setRevealed(true);
            this.gameOver();
            return;
        }

        this.revealTileInternal(tile);
        this.revealObviousTiles();
        this.checkWinCondition();
    }

    public revealAdjacentIfFlagged(tile: Tile) {
        if (!tile.isRevealed) {
            return;
        }
        const adjTiles = this.findAdjacentTiles(tile, Positions);
        const adjFlagged = adjTiles.filter(x => !x.isRevealed && x.isFlagged);
        const adjUnrevealed = adjTiles.filter(x => !x.isRevealed && !x.isFlagged);
        if (adjFlagged.length === tile.adjacentBombsCount) {
            adjUnrevealed.forEach(adjT => {
                this.revealTile(adjT);
            })
        }
    }

    public flagTile(tile: Tile) {
        if (tile.isRevealed) {
            return;
        }

        this.startTimer();

        if (!tile.isFlagged && this.context.remainingFlags === 0) {
            return;
        }

        if (tile.isFlagged) {
            tile.setFlagged(false);
            this.context.remainingFlags++;
        }
        else {
            tile.setFlagged(true);
            this.context.remainingFlags--;
        }

        this.checkWinCondition();
    }

    private setupGame(difficulty: GameDifficulty) {
        console.log(`Starting Game | ${difficulty}`)

        for (let y = 0; y < this.context.settings.y; y++) {
            for (let x = 0; x < this.context.settings.x; x++) {
                const tile = new Tile(x, y, this);
                this.context.tiles.push(tile);
                this.context.tilesMap.set(this.getTileKey(x, y), tile);
            }
        }

        this.context.bombs = this.context.settings.bombs;
    }

    private gameOver() {

        this.context.isGameOver = true;

        this.context.tiles.forEach(x => {
            if (x.isBomb && !x.isRevealed) {
                x.setRevealed();
            }
        });
        this.stopTimer();

        this.gameCompleted$.next(false);
    }

    private placeMines(bombsCount: number, maxX: number, maxY: number, exceptTile: Tile) {

        const randomizeMinesFunc = () => {
            let bombsRemaining = bombsCount;
            let maxInterations = 1000;
            const bombsMap = new Map<string, boolean>();
            while (bombsRemaining > 0) {
                maxInterations--;
                if (maxInterations < 0) {
                    console.log('Cannot set mines for 1000 iterations');
                    return null;
                }
                const x = getRandomInt(0, maxX);
                const y = getRandomInt(0, maxY);

                const tileKey = this.getTileKey(x, y);
                if (exceptTile.x !== x && exceptTile.y !== y && !bombsMap.get(tileKey)) {
                    bombsMap.set(tileKey, true);
                    bombsRemaining--;
                }
            }
            console.log(`Mines set for ${1000 - maxInterations} iterations`);
            return bombsMap;
        }

        let bombsMap: Map<string, boolean>;
        while (true) {
            bombsMap = randomizeMinesFunc();
            if (bombsMap) {
                break;
            }
        }

        bombsMap.forEach((value, key) => {
            this.context.tilesMap.get(key).isBomb = value;
        });

        this.context.tiles.filter(x => !x.isBomb).forEach(x => {
            x.adjacentBombsCount = this.findAdjacentBombs(x);
        })

    }

    private startTimer() {
        if (this.context.isRunning) {
            return;
        }

        this.context.isRunning = true;
        this.interval = setInterval(() => {
            this.context.timer++;
        }, 1000);
    }

    private stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private getTileKey(x: number, y: number) {
        return `${x}-${y}`;
    }

    private getRelativeTile(tile: Tile, relative: string): Tile {
        let tileKey = '';
        switch (relative) {
            case 'TopLeft':
                tileKey = this.getTileKey(tile.x - 1, tile.y - 1);
                break;
            case 'Top':
                tileKey = this.getTileKey(tile.x, tile.y - 1);
                break;
            case 'TopRight':
                tileKey = this.getTileKey(tile.x + 1, tile.y - 1);
                break;
            case 'Right':
                tileKey = this.getTileKey(tile.x + 1, tile.y);
                break;
            case 'Left':
                tileKey = this.getTileKey(tile.x - 1, tile.y);
                break;
            case 'BottomLeft':
                tileKey = this.getTileKey(tile.x - 1, tile.y + 1);
                break;
            case 'Bottom':
                tileKey = this.getTileKey(tile.x, tile.y + 1);
                break;
            case 'BottomRight':
                tileKey = this.getTileKey(tile.x + 1, tile.y + 1);
                break;
            default:
                break;
        }
        return this.context.tilesMap.get(tileKey);
    }

    private findAdjacentBombs(tile: Tile) {
        let result = 0;
        Positions.forEach(p => {
            const adjTile = this.getRelativeTile(tile, p);
            if (adjTile && adjTile.isBomb) {
                result++;
            }
        })

        return result;
    }

    private findAdjacentTiles(tile: Tile, positions: string[]) {
        const adjacentTiles: Tile[] = [];

        positions.forEach(p => {
            const adjTile = this.getRelativeTile(tile, p);
            if (adjTile) {
                adjacentTiles.push(adjTile);
            }
        })
        return adjacentTiles;
    }

    private revealTileInternal(tile: Tile) {
        tile.setRevealed();

        if (tile.adjacentBombsCount === 0) {

            this.findAdjacentTiles(tile, MainPositions).forEach(adjTile => {
                if (adjTile && !adjTile.isRevealed && !adjTile.isFlagged) {
                    this.revealTileInternal(adjTile);
                }
            })
        }
    }

    private revealObviousTiles() {
        const revealedEmptyTiles = this.context.tiles.filter(x => x.isRevealed && x.adjacentBombsCount === 0);
        revealedEmptyTiles.forEach(t => {
            Positions.forEach(p => {
                var adjTile = this.getRelativeTile(t, p);
                if (adjTile && !adjTile.isRevealed && adjTile.adjacentBombsCount > 0) {
                    adjTile.setRevealed();
                }
            })
        })
    }

    private checkWinCondition() {
        const unopenedTiles = this.context.tiles.find(x => !x.isBomb && !x.isRevealed);
        if (!unopenedTiles) {
            this.context.victory = true;
            this.stopTimer();
            this.gameCompleted$.next(true);
            return true;
        }
    }
}