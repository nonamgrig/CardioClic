import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Question {
  id: number;
  title: string;
  question: string;
  info : string; 
  subquestion: { [key: string]: Question } | null;
  units : string[] | null; 
  type: string;
  nextQuestionKey: string | { [key: string]: string } | null;
  responses?: { [key: string]: string };
  userAnswer?: string | string[] | null;
  selectedUnit? : string | null; 
  message : string[] | null
}


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor() {}

}
