import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Patient, PatientService } from '../../../service/patient.service';

@Component({
  selector: 'app-patient',
  standalone: false,
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.less'
})
export class PatientComponent implements OnInit {

  @Input() patient! : Patient; //on récupère le patient 
  situation : any; //pour récupérer les infos autour de patient

  //les attributs de patient 
  patientKeys: (keyof Patient)[] = [
    'age', 'sexe', 'prevention', 'diabetique', 'ageApparition', 
    'creatinine', 'ascendance', 'dfge', 'ratio',
    'rationondispo', 'neuropathie', 'retinopathie', 'pa', 'cholesTotal',
    'hdl', 'hba1c', 'fumeur', 'score2', 'score2op', 'score2diabete'
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
