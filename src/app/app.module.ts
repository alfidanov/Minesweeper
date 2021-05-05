import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MsBoardComponent } from './ms-board/ms-board.component';
import { MsTilePanelComponent } from './ms-tile-panel/ms-tile-panel.component';
import { MsTileComponent } from './ms-tile/ms-tile.component';
import { MsTimerComponent } from './ms-timer/ms-timer.component';

@NgModule({
  declarations: [
    AppComponent,
    MsBoardComponent,
    MsTilePanelComponent,
    MsTileComponent,
    MsTimerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
