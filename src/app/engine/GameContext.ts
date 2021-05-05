import { GameDifficulty } from "./GameDifficulty";
import { Tile } from "./Tile";


export class GameDifficultySettings {
    public Junior = new GameDifficultySetting(8, 8, 10);
    public Senior = new GameDifficultySetting(16, 16, 40);
    public Master = new GameDifficultySetting(32, 16, 99);
}

export class GameDifficultySetting {
    constructor(public x: number, public y: number, public bombs: number) {
    }
}

export class GameContext {

    constructor(public difficulty: GameDifficulty) {
        this.tiles = [];
        const difficultySettings = new GameDifficultySettings();
        this.settings = difficultySettings[difficulty];
        this.remainingFlags = this.settings.bombs;
    }

    public timer: number = 0;
    public bombs: number;
    public remainingFlags: number;
    public tiles: Tile[];
    public tilesMap: Map<string, Tile> = new Map<string, Tile>();
    public settings: GameDifficultySetting;
    public debug: boolean;
    public isRunning: boolean;
    public bombsPlaced: boolean;

    public isGameOver: boolean;
    public victory: boolean;
}