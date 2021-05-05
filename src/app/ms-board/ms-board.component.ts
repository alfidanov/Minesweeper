import { Component, OnInit, ViewChild } from '@angular/core';
import { GameDifficulty } from '../engine/GameDifficulty';
import { MinesweeperEngine } from '../engine/MinesweeperEngine';
import { MsTilePanelComponent } from '../ms-tile-panel/ms-tile-panel.component';

@Component({
  selector: 'ms-board',
  templateUrl: './ms-board.component.html',
  styleUrls: ['./ms-board.component.scss']
})
export class MsBoardComponent implements OnInit {

  @ViewChild(MsTilePanelComponent, { static: true }) tilesBoard: MsTilePanelComponent;

  public engine: MinesweeperEngine = new MinesweeperEngine();
  private lastDifficulty: GameDifficulty = 'Junior';

  constructor() {
    this.engine.gameStarted$.subscribe(() => {
      console.log("Board: Game started");

      this.tilesBoard.drawTiles(this.engine.context.tiles, this.engine.context.difficulty);
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.engine.startGame(this.lastDifficulty);
    })
  }

  public startNewGame() {
    this.engine.startGame(this.lastDifficulty)
  }

  public changeDebug(debug) {
    localStorage.setItem('msw-debug', debug);
  }

  public changeDifficulty(difficulty: GameDifficulty) {
    this.lastDifficulty = difficulty;
    this.engine.startGame(this.lastDifficulty);
  }

}

