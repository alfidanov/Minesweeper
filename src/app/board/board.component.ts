import { Component, OnInit, ViewChild } from '@angular/core';
import { TilePanelComponent } from '../tile-panel/tile-panel.component';
import { GameDifficulty } from '../engine/GameDifficulty';
import { MinesweeperEngine } from '../engine/MinesweeperEngine';


@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @ViewChild(TilePanelComponent, { static: true }) tilesBoard: TilePanelComponent;

  public engine: MinesweeperEngine = new MinesweeperEngine();

  constructor() {
    this.engine.gameStarted$.subscribe(() => {
      console.log("Board: Game started");

      this.tilesBoard.drawTiles(this.engine.context.tiles, this.engine.context.difficulty);
    })
  }

  ngOnInit() {
    this.engine.startGame('Junior');
  }

  public changeDebug(debug) {
    localStorage.setItem('msw-debug', debug);
  }

  public changeDifficulty(difficulty: GameDifficulty) {
    this.engine.startGame(difficulty);
  }
}
