import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export interface Question {
  id: number;  // La clé de la question dans le JSON (ex: "age")
  title: string;  // Le nom de la question
  question: string;  // La question à afficher
  type: string;  // Le type de la question (text, prop, etc.)
  nextQuestionKey: string | { next1: string; next2: string } | null;  // L'ID de la question suivante
  responses?: { [key: string]: string };  // Réponses possibles (le cas échéant)
  userAnswer?: string | null;  // Réponse de l'utilisateur
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

 

  constructor() { }

}
