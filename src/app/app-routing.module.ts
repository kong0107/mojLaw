import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { LawComponent } from './law/law.component';
import { LawArticlesComponent } from './law-articles/law-articles.component';
import { LawDetailComponent } from './law-detail/law-detail.component';

const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'search/:query', component: IndexComponent },
  { path: 'laws/:PCode', component: LawComponent, children: [
      { path: '', redirectTo: 'articles', pathMatch: 'full' },
      { path: 'articles', component: LawArticlesComponent, pathMatch: 'full' },
      { path: 'detail', component: LawDetailComponent }
    ]
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
