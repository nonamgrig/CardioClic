import { Component, OnInit } from '@angular/core';
import { TexteService } from './service/texte.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  title = 'cardioclic';

  constructor(private texteService : TexteService) {}

  ngOnInit():void {
    //Charger les textes au démarrage de l'application
    this.texteService.loadTexts().subscribe(texts => {
      this.texteService.setTexts(texts)
    });
    
    // Charger les questions au démarrage de l'application
    this.texteService.loadQuestions().subscribe(() => {
      console.log('Questions chargées', this.texteService.getQuestions());
    });
  }

}

