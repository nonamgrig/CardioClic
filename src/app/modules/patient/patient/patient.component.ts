import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Patient, PatientService } from '../../../service/patient.service';

@Component({
  selector: 'app-patient',
  standalone: false,
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.less'
})
export class PatientComponent implements OnInit {

  @Input() patient! : Patient ; 
  situation : any; 

  //les attributs de patient 
  patientKeys: (keyof Patient)[] = [
    'age', 'sexe', 'diabetique', 'ageApparition', 'prevention',
    'creatinine', 'ascendance', 'dfge', 'ratio',
    'neuropathie', 'retinopathie', 'pa', 'cholesTotal',
    'hdl', 'hba1c', 'fumeur', 'score2', 'score2op', 'score2diabet'
  ];
  
  constructor(
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    console.log("Component Patient initialized");
    // Charger les questions dès le début si ce n'est pas déjà fait
    this.patientService.loadSituation().subscribe({
      next: () => {
        this.situation = this.patientService.situation;
        console.log('situation', this.situation); 
      },
      error: (err) => {
        console.error('Erreur de chargement de la situation:', err);
        this.situation = null;  // Ou gérer l'erreur selon ton besoin
      }
    });
  }
  

  
  


}
