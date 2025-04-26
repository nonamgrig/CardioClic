import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  standalone: false,
  templateUrl: './question.component.html',
  styleUrl: './question.component.less'
})
export class QuestionComponent implements OnInit {
  
  reponse1 = "";
  reponse2= ""; 

  constructor(private router: Router) {}
  
  ngOnInit():void{

  }

  onSubmitForm(form: NgForm){
    console.log("reponse", form.value); 
  }

}
