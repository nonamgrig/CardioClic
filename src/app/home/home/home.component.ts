import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TexteService } from '../../service/texte.service';
import { PatientService } from '../../service/patient.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  text : any; 
  constructor( 
    private router: Router, 
    public texteService : TexteService, 
    private patientService : PatientService) {
  }

  ngOnInit() {
    //Charger les textes au démarrage de l'application
    this.texteService.loadTexts().subscribe(texts => {
      this.texteService.setTexts(texts); 
      this.text=texts; 
      console.log('texte chargé', this.text)
    });
    
  }

  onGo(event:Event) {
    this.patientService.resetPatient();
    this.router.navigate(["question/1"]); 
  }
}
