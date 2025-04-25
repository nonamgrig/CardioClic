import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './home/home/home.component';
import { SharedComponent } from './modules/shared/shared/shared.component';
import { WaitComponent } from './modules/shared/wait/wait.component';
import { DialogboxComponent } from './modules/shared/dialogbox/dialogbox.component';
import { PatientComponent } from './modules/patient/patient/patient.component';
import { QuestionComponent } from './modules/question/question/question.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SharedComponent,
    WaitComponent,
    DialogboxComponent,
    PatientComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
