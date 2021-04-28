import { BoardPosition } from "./BoardPosition";
import { MinesweeperEngine } from "./MinesweeperEngine";

export class Tile {
    constructor(public position: BoardPosition, private engine: MinesweeperEngine) {
    }

    public isBomb: boolean;

    public isFlagged: boolean;

    public isRevealed: boolean;

    public adjacentMinesCount: number;

    public reveal() {
        this.engine.revealTile(this);
    }

    public flag() {
        this.engine.flagTile(this);
    }
}