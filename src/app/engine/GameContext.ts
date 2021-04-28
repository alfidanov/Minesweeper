import { GameDifficulty } from "./GameDifficulty";
import { Tile } from "./Tile";

export class GameContext {

    constructor(public difficulty: GameDifficulty) {
        this.tiles = [];
    }

    public timer: number = 0;
    public bombs: number;
    public tiles: Tile[];
    public tilesMap: Map<string, Tile> = new Map<string, Tile>();
    public tilesBoard: { x: number, y: number };
    public debug: boolean;

    public isGameOver: boolean;
    public victory: boolean;
}