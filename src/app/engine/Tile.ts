import { MinesweeperEngine } from "./MinesweeperEngine";

type TileState = 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'eight' | 'flag' | 'bomb' | 'clickedbomb' | 'unopened' | '';
const Numbers = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

export class Tile {

    constructor(public x: number, public y: number, private engine: MinesweeperEngine) {
    }

    public isBomb: boolean;

    public get isFlagged() {
        return this.state === 'flag';
    }

    public get isRevealed() {
        return this.state !== 'flag' && this.state !== 'unopened';
    }

    public adjacentBombsCount: number;

    public reveal() {
        this.engine.revealTile(this);
    }

    public revealAdjacentIfFlagged() {
        this.engine.revealAdjacentIfFlagged(this);
    }

    public flag() {
        this.engine.flagTile(this);
    }

    public setRevealed(userClick = false) {
        if (this.isBomb) {
            this.state = userClick ? 'clickedbomb' : 'bomb';
        } else {
            this.state = this.adjacentBombsCount > 0 ? <TileState>Numbers[this.adjacentBombsCount] : '';
        }
    }

    public setFlagged(isFlagged: boolean) {
        if (isFlagged) {
            this.state = 'flag';
        } else {
            this.state = 'unopened';
        }
    }

    public state: TileState = 'unopened';
}