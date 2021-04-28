import { Component, OnInit, ViewChild } from '@angular/core';
import { MinesweeperTilesComponent } from '../minesweeper-tiles/minesweeper-tiles.component';
import { GameDifficulty } from '../engine/GameDifficulty';
import { MinesweeperEngine } from '../engine/MinesweeperEngine';


@Component({
  selector: 'app-minesweeper-board',
  templateUrl: './minesweeper-board.component.html',
  styleUrls: ['./minesweeper-board.component.scss']
})
export class MinesweeperBoardComponent implements OnInit {

  @ViewChild(MinesweeperTilesComponent, { static: true }) tilesBoard: MinesweeperTilesComponent;

  public engine: MinesweeperEngine = new MinesweeperEngine();

  constructor() {
    this.engine.gameStarted$.subscribe(() => {
      console.log("Board: Game started");

      this.tilesBoard.drawTiles(this.engine.tiles, this.engine.difficulty);
    })
  }

  ngOnInit() {
    this.engine.startGame('Junior');
  }

  public changeDifficulty(difficulty: GameDifficulty) {
    this.engine.startGame(difficulty);
  }
}
