import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { IndexComponent } from './index/index.component';
import { LawComponent } from './law/law.component';
import { LawArticlesComponent } from './law-articles/law-articles.component';
import { LawDetailComponent } from './law-detail/law-detail.component';
import { LawService } from './law.service';
import { LoadingComponent } from './loading/loading.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LawComponent,
    LawArticlesComponent,
    LawDetailComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [LawService],
  bootstrap: [AppComponent]
})
export class AppModule { }
