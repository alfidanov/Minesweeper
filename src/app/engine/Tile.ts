import { MinesweeperEngine } from "./MinesweeperEngine";

export class Tile {
    constructor(public x: number, public y: number, private engine: MinesweeperEngine) {
    }

    public isBomb: boolean;

    public isBombClicked: boolean;

    public isFlagged: boolean;

    public isRevealed: boolean;

    public adjacentBombsCount: number = 5;

    public reveal() {
        this.engine.revealTile(this);
    }

    public flag() {
        this.engine.flagTile(this);
    }

    public get image() {
        if (this.isFlagged) {
            return 'flag';
        }

        if (this.isBombClicked) {
            return 'clickedBomb';
        }

        if (this.isBomb && this.isRevealed) {
            return 'bomb';
        }

        if (!this.isRevealed) {
            return 'unopened';
        }

        if (this.adjacentBombsCount > 0) {
            return String(this.adjacentBombsCount);
        }
        return null;
    }
}