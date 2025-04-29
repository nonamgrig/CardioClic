import { Component, OnDestroy, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient, PatientService } from '../../service/patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-question',
  standalone: false,
  templateUrl: './page-question.component.html',
  styleUrl: './page-question.component.less'
})
export class PageQuestionComponent implements OnInit, OnDestroy {

  questionId : number = 0; 
  patient!: Patient ; 
  patientSubscription : Subscription = new Subscription(); 

  constructor(
    private location: Location, 
    private router: Router,
    private route : ActivatedRoute, 
    private patientService : PatientService
  ){

  }

  ngOnInit():void{
    //récupère l'id de la question à partir des paramètres de l'url
    this.route.paramMap.subscribe(params => {
      this.questionId = +params.get('id')!; 
    })

    // S'abonner aux mises à jour du patient
    this.patientSubscription = this.patientService.patient$.subscribe(
      (updatedPatient) => {
        this.patient = updatedPatient;
      }
    );
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
  }

  goBack():void{
    this.location.back(); 
  }

}
