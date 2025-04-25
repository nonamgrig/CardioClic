import { Component } from '@angular/core';

import { Location } from '@angular/common';

@Component({
  selector: 'app-page-question',
  standalone: false,
  templateUrl: './page-question.component.html',
  styleUrl: './page-question.component.less'
})
export class PageQuestionComponent {
  constructor(private location: Location){

  }

  goBack():void{
    this.location.back(); 
  }

}
