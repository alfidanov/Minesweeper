import { Component, OnInit } from '@angular/core';
import { GameDifficulty } from '../engine/GameDifficulty';
import { Tile } from '../engine/Tile';

@Component({
  selector: 'ms-tile-panel',
  templateUrl: './ms-tile-panel.component.html',
  styleUrls: ['./ms-tile-panel.component.scss']
})
export class MsTilePanelComponent implements OnInit {

  constructor() { }

  public tileContainerCssClass: string;
  public tiles: Tile[];

  ngOnInit() {
  }

  public drawTiles(tiles: Tile[], difficulty: GameDifficulty) {
    this.tileContainerCssClass = difficulty.toLowerCase();
    this.tiles = tiles;
  }
}
