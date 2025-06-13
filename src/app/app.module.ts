import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/shared/header/header.component';
import { HomeComponent } from './home/home/home.component';
import { WaitComponent } from './modules/shared/wait/wait.component';
import { DialogboxComponent } from './modules/shared/dialogbox/dialogbox.component';
import { PatientComponent } from './modules/patient/patient/patient.component';
import { QuestionComponent } from './modules/question/question/question.component';
import { PageQuestionComponent } from './modules/page-question/page-question.component';
import { InfoComponent } from './modules/info/info.component';
import { AboutComponent } from './modules/about/about.component';
import { BackComponent } from './modules/shared/back/back.component';
import { FormsModule } from '@angular/forms';
import { FormatInfoTextPipe } from './pipe/format-info-text.pipe';
import { PreconisationComponent } from './modules/preconisation/preconisation.component';
import { RecoBoxComponent } from './modules/shared/reco/reco-box/reco-box.component';
import { ContactbarComponent } from './modules/shared/contactbar/contactbar/contactbar.component';
import { EndEvalComponent } from './modules/shared/end/end-eval/end-eval.component';
import { DetailComponent } from './modules/preconisation/detail/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    WaitComponent,
    DialogboxComponent,
    PatientComponent,
    QuestionComponent,
    PageQuestionComponent,
    InfoComponent,
    AboutComponent,
    BackComponent,
    FormatInfoTextPipe,
    PreconisationComponent,
    RecoBoxComponent,
    ContactbarComponent,
    EndEvalComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule, 
    HttpClientModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
