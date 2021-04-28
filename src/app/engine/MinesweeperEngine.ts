import { Subject } from "rxjs";
import { GameDifficulty } from "./GameDifficulty";
import { GameDifficultySettings } from "./GameDifficultySettings";
import { Positions } from "./Position";
import { Tile } from "./Tile";
import { getRandomInt } from "./utils";

export class MinesweeperEngine {

    public difficulty: GameDifficulty;
    public timer: number = 0;
    public bombs: number;
    public tiles: Tile[];
    public tilesMap: Map<string, Tile> = new Map<string, Tile>();
    public tilesBoard: { x: number, y: number };

    private interval: any;
    private isRunning: boolean;
    public isGameOver: boolean;

    constructor() {
    }

    public gameStarted$ = new Subject();

    public startGame(difficulty: GameDifficulty) {
        this.difficulty = difficulty;

        this.reset();
        this.setupGame(difficulty);
        this.gameStarted$.next();
    }

    public revealTile(tile: Tile) {
        if (this.isGameOver) {
            return;
        }
        this.startTimer();

        tile.isRevealed = true;

        if (tile.isBomb) {
            tile.isBombClicked = true;
            this.gameOver();
        }
    }

    public flagTile(tile: Tile) {
        if (this.isGameOver) {
            return;
        }

        this.startTimer();

        tile.isFlagged = !tile.isFlagged;
    }

    private reset() {
        this.tiles = [];
        this.tilesMap = new Map<string, Tile>();
        this.stopTimer();
        this.timer = 0;
        this.isGameOver = false;
        this.isRunning = false;
    }

    private setupGame(difficulty: GameDifficulty) {
        console.log(`Starting Game | ${difficulty}`)
        const difficultySettings = new GameDifficultySettings();
        const settings = difficultySettings[difficulty];

        for (let y = 0; y < settings.y; y++) {
            for (let x = 0; x < settings.x; x++) {
                const tile = new Tile(x, y, this);
                this.tiles.push(tile);
                this.tilesMap.set(this.getTileKey(x, y), tile);
            }
        }

        this.tilesBoard = { x: settings.x, y: settings.y };
        this.bombs = settings.bombs;

        this.placeMines(settings.bombs, settings.x, settings.y);
    }

    private gameOver() {

        this.isGameOver = true;

        this.tiles.forEach(x => {
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
            this.tilesMap.get(key).isBomb = value;
        });

        this.tiles.filter(x => !x.isBomb).forEach(x => {
            x.adjacentBombsCount = this.findAdjacentBombs(x);
        })

    }

    private startTimer() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.interval = setInterval(() => {
            this.timer++;
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
        return this.tilesMap.get(tileKey);
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
}