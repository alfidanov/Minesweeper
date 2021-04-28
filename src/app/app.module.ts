import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MinesweeperBoardComponent } from './minesweeper-board/minesweeper-board.component';
import { MinesweeperTilesComponent } from './minesweeper-tiles/minesweeper-tiles.component';
import { TileComponent } from './tile/tile.component';
import { TimerComponent } from './timer/timer.component';
import { FormatTimePipe } from './timer/format-time.pipe';
import { FormsModule } from '@angular/forms';

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
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
