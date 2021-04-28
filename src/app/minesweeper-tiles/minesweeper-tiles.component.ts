import { Component, OnInit } from '@angular/core';
import { GameDifficulty } from '../engine/GameDifficulty';
import { Tile } from '../engine/Tile';

@Component({
  selector: 'app-minesweeper-tiles',
  templateUrl: './minesweeper-tiles.component.html',
  styleUrls: ['./minesweeper-tiles.component.scss']
})
export class MinesweeperTilesComponent implements OnInit {

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
