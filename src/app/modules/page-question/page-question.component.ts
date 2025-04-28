import { Component } from '@angular/core';

import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-page-question',
  standalone: false,
  templateUrl: './page-question.component.html',
  styleUrl: './page-question.component.less'
})
export class PageQuestionComponent {

  questionId : number = 0; 

  constructor(
    private location: Location, 
    private router: Router,
    private route : ActivatedRoute, 
  ){

  }

  ngOnInit():void{
    //récupère l'id de la question à partir des paramètres de l'url
    this.route.paramMap.subscribe(params => {
      this.questionId = +params.get('id')!; 
    })
  }

  goBack():void{
    this.location.back(); 
  }

}
