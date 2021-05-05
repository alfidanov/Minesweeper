import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../engine/Tile';

@Component({
  selector: 'ms-tile',
  templateUrl: './ms-tile.component.html',
  styleUrls: ['./ms-tile.component.scss']
})
export class MsTileComponent implements OnInit {

  @Input() tile: Tile;

  private isClicked: boolean;
  private isLeftClicked: boolean;
  private isRightClicked: boolean;
  private isMiddleClicked: boolean;

  constructor() { }

  ngOnInit() {
  }

  public onContextMenu() {
    return false;
  }

  public mouseclick(event: MouseEvent) {
    this.isLeftClicked = this.isLeftClicked || event.button === 0;
    this.isMiddleClicked = this.isMiddleClicked || event.button === 1;
    this.isRightClicked = this.isRightClicked || event.button === 2;

    if (!this.isClicked) {
      this.isClicked = true;
      setTimeout(() => {
        const isBoth = (this.isLeftClicked && this.isRightClicked) || this.isMiddleClicked;

        this.handleMouseClick(isBoth ? 1 : (this.isLeftClicked ? 0 : 2));
        this.isLeftClicked = false;
        this.isRightClicked = false;
        this.isMiddleClicked = false;
        this.isClicked = false;
      }, 100)
    }

    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  private handleMouseClick(button: number) {
    if (button === 1) {
      this.tile.revealAdjacentIfFlagged();
    } else if (button === 0) {
      this.tile.reveal();
    } else if (button === 2) {
      this.tile.flag();
    }
  }
}
