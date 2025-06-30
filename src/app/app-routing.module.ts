import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { PageQuestionComponent } from './modules/page-question/page-question.component';
import { AboutComponent } from './modules/about/about.component';
import { ToolsComponent } from './modules/tools/tools/tools.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: 'tools', component: ToolsComponent},
  { path: 'question/:id', component: PageQuestionComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
