import { Component, OnInit } from '@angular/core';
import { GameDifficulty } from '../engine/GameDifficulty';
import { Tile } from '../engine/Tile';

@Component({
  selector: 'tile-panel',
  templateUrl: './tile-panel.component.html',
  styleUrls: ['./tile-panel.component.scss']
})
export class TilePanelComponent implements OnInit {

  constructor() { }

  public tileContainerCssClass: string;
  public tiles: Tile[];

  ngOnInit() {
  }

  public drawTiles(tiles: Tile[], difficulty: GameDifficulty) {
    this.tileContainerCssClass = difficulty.toLowerCase();
    this.tiles = tiles;
  }

  public rightClick(event: any, tile: Tile) {
    tile.flag();
    return false;
  }
}
