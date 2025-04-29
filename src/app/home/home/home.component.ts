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
  constructor( 
    private router: Router, 
    public texteService : TexteService, 
    private patientService : PatientService) {
  }

  ngOnInit() {
  }

  onGo(event:Event) {
    this.patientService.resetPatient();
    this.router.navigate(["question/1"]); 
  }
}
