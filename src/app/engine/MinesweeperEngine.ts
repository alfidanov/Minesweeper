import { Subject } from "rxjs";
import { BoardPosition } from "./BoardPosition";
import { GameDifficulty } from "./GameDifficulty";
import { GameDifficultySettings } from "./GameDifficultySettings";
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
        this.startTimer();

        tile.isRevealed = true;

        if (tile.isBomb) {
            this.gameOver();
        }
    }

    public flagTile(tile: Tile) {
        this.startTimer();

        tile.isFlagged = true;
    }

    private reset() {
        this.tiles = [];
        this.tilesMap = new Map<string, Tile>();
        this.stopTimer();
        this.timer = 0;
    }

    private setupGame(difficulty: GameDifficulty) {
        console.log(`Starting Game | ${difficulty}`)
        const difficultySettings = new GameDifficultySettings();
        const settings = difficultySettings[difficulty];

        for (let y = 0; y < settings.y; y++) {
            for (let x = 0; x < settings.x; x++) {
                const tile = new Tile(new BoardPosition(x, y), this);
                this.tiles.push(tile);
                this.tilesMap.set(this.getTileKey(x, y), tile);
            }
        }

        this.tilesBoard = { x: settings.x, y: settings.y };
        this.bombs = settings.bombs;
        this.randomizeMines(settings.bombs, settings.x, settings.y);
    }

    private gameOver() {
        this.tiles.forEach(x => {
            if (x.isBomb) {
                x.isRevealed = true;
            }
        })
    }

    private randomizeMines(bombsCount: number, maxX: number, maxY: number) {
        let maxInterations = 1000;
        while (bombsCount > 0) {
            maxInterations--;
            if (maxInterations < 0) {
                console.log('Cannot set mines for 1000 iterations');
                return;
            }
            const x = getRandomInt(0, maxX);
            const y = getRandomInt(0, maxY);
            if (this.trySetMine(x, y)) {
                const tile = this.tilesMap.get(this.getTileKey(x, y));
                tile.isBomb = true
                bombsCount--;
            }
        }
        console.log(`Mines set for ${1000 - maxInterations} iterations`)
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

    private trySetMine(x: number, y: number) {
        const tile = this.tiles.find(t => t.position.x === x && t.position.y === y);
        if (!tile) {
            throw `Cannot find with coordinates: X:${x}, Y:${y}`;
        }
        if (tile.isBomb) {
            return false;
        }
        tile.isBomb = true;
        return true;
    }

    private getTileKey(x: number, y: number) {
        return `${x}-${y}`;
    }
}