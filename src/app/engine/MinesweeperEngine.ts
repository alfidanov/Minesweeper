import { Subject } from "rxjs";
import { GameContext } from "./GameContext";
import { GameDifficulty } from "./GameDifficulty";
import { GameDifficultySettings } from "./GameDifficultySettings";
import { MainPositions, Positions } from "./Position";
import { Tile } from "./Tile";
import { getRandomInt } from "./utils";

export class MinesweeperEngine {

    private interval: any;
    private isRunning: boolean;

    public context: GameContext;

    constructor() {
    }

    public gameStarted$ = new Subject();

    public startGame(difficulty: GameDifficulty) {
        this.context = new GameContext(difficulty)
        this.reset();
        this.setupGame(difficulty);
        this.gameStarted$.next();
    }

    public revealTile(tile: Tile) {
        if (this.context.isGameOver || this.context.victory) {
            return;
        }

        if (tile.isFlagged) {
            return;
        }

        if (tile.isBomb) {
            tile.isRevealed = true;
            tile.isBombClicked = true;
            this.gameOver();
            return;
        }

        this.startTimer();

        this.revealTileInternal(tile);
        this.checkWinCondition();
    }

    public flagTile(tile: Tile) {
        if (this.context.isGameOver || this.context.victory) {
            return;
        }

        this.startTimer();

        tile.isFlagged = !tile.isFlagged;
        this.checkWinCondition();
    }

    private reset() {
        this.stopTimer();
    }

    private setupGame(difficulty: GameDifficulty) {
        console.log(`Starting Game | ${difficulty}`)
        const difficultySettings = new GameDifficultySettings();
        const settings = difficultySettings[difficulty];

        for (let y = 0; y < settings.y; y++) {
            for (let x = 0; x < settings.x; x++) {
                const tile = new Tile(x, y, this);
                this.context.tiles.push(tile);
                this.context.tilesMap.set(this.getTileKey(x, y), tile);
            }
        }

        this.context.tilesBoard = { x: settings.x, y: settings.y };
        this.context.bombs = settings.bombs;

        this.placeMines(settings.bombs, settings.x, settings.y);
    }

    private gameOver() {

        this.context.isGameOver = true;

        this.context.tiles.forEach(x => {
            if (x.isBomb) {
                x.isRevealed = true;
            }
        });
        this.stopTimer();
    }

    private placeMines(bombsCount: number, maxX: number, maxY: number) {

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

                if (!bombsMap.get(tileKey)) {
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
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
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

    private revealTileInternal(tile: Tile) {
        tile.isRevealed = true;

        if (tile.adjacentBombsCount === 0) {
            MainPositions.forEach(p => {
                const adjTile = this.getRelativeTile(tile, p);
                if (adjTile && !adjTile.isRevealed && !adjTile.isFlagged) {
                    this.revealTileInternal(adjTile);
                }
            })
        }
    }

    private checkWinCondition() {
        const unflaggedMine = this.context.tiles.find(x => x.isBomb && !x.isFlagged);
        if (!unflaggedMine) {
            this.context.victory = true;
            this.stopTimer();
            return true;
        }

        const unopenedTiles = this.context.tiles.find(x => !x.isBomb && !x.isRevealed);
        if (!unopenedTiles) {
            this.context.victory = true;
            this.stopTimer();
            return true;
        }

    }
}