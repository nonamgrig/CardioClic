import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Question {
  id: number;
  title: string;
  question: string;
  subquestion: { [key: string]: Question } | null;
  type: string;
  nextQuestionKey: string | { [key: string]: string } | null;
  responses?: { [key: string]: string };
  userAnswer?: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor() {}

}
