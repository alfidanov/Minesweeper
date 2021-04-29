import { GameDifficulty } from "./GameDifficulty";
import { GameDifficultySetting, GameDifficultySettings } from "./GameDifficultySettings";
import { Tile } from "./Tile";

export class GameContext {

    constructor(public difficulty: GameDifficulty) {
        this.tiles = [];
        const difficultySettings = new GameDifficultySettings();
        this.settings = difficultySettings[difficulty];
    }

    public timer: number = 0;
    public bombs: number;
    public remainingFlags: number;
    public tiles: Tile[];
    public tilesMap: Map<string, Tile> = new Map<string, Tile>();
    public settings: GameDifficultySetting;
    public debug: boolean;

    public isGameOver: boolean;
    public victory: boolean;
}