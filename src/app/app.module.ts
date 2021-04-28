import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MinesweeperBoardComponent } from './minesweeper-board/minesweeper-board.component';
import { MinesweeperTilesComponent } from './minesweeper-tiles/minesweeper-tiles.component';
import { TileComponent } from './tile/tile.component';
import { TimerComponent } from './timer/timer.component';
import { FormatTimePipe } from './timer/format-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MinesweeperBoardComponent,
    MinesweeperTilesComponent,
    TileComponent,
    TimerComponent,
    FormatTimePipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
