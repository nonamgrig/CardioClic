import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Question } from './question.service';

@Injectable({
  providedIn: 'root'
})
export class TexteService {
  private texts: any; 
  public questions: Map<string, Question> = new Map();
  private isLoaded: boolean = false;  // Flag pour vérifier si les questions ont été chargées

  constructor(private http: HttpClient) {}

  // Méthode pour charger les textes depuis le fichier JSON
  loadTexts(): Observable<any> {
    return this.http.get('/assets/texts.json'); 
  }

  // Méthode pour charger les questions depuis le fichier JSON
  loadQuestions(): Observable<Map<string, Question>> {
    // Si les questions sont déjà chargées, on ne les recharge pas
    if (this.isLoaded) {
      return new Observable(observer => {
        observer.next(this.questions); // Retourner les questions déjà chargées
        observer.complete();
      });
    }

    // Si non, on charge les questions depuis le fichier JSON
    return this.http.get<any>('assets/texts.json').pipe(
      map((data: any) => {
        const questionsData = data.questions;
        const keys = Object.keys(questionsData);
        let index = 1 ; 

        // 1. Créer les objets Question et les ajouter à la Map
        keys.forEach((key) => {
          const item = questionsData[key];
          let nextQuestionKey = null;

          // Si "next" est un objet (cas spécial de la question "diabete")
          if (typeof item.next === 'object') {
            nextQuestionKey = item.next;  
          } else if (item.next) {
            nextQuestionKey = item.next;  
          }

          // Créer l'objet Question
          const question: Question = {
            id: index,  // Utiliser la clé comme identifiant unique
            title: key,
            question: item.question,
            subquestion : item.subquestion? item.subquestion : null, 
            type: item.type,
            nextQuestionKey: nextQuestionKey,
            responses: item.responses || undefined  // Si les réponses sont définies, les ajouter
          };

          // Ajouter chaque question à la Map
          this.questions.set(key, question);

          index = index +1; 
        });

        // Marquer comme chargé
        this.isLoaded = true;

        // Retourner la Map avec les questions
        return this.questions;  
      })
    );
  }

  // Méthode pour obtenir toutes les questions
  getQuestions(): Map<string, Question> {
    return this.questions;
  }

  // Fonction pour obtenir l'ID de la question suivante en fonction de la réponse
  getNextQuestion(currentQuestionId: number, answer: string): string | null {
    //current id est le numéro de la question
    const currentQuestion = getQuestionById(this.questions, currentQuestionId); // Récupérer l'objet Question de la Map
    console.log("current question", currentQuestion); 

    if (!currentQuestion) {
      return null;  // Si la question n'existe pas, retourner null
    }

    let next = currentQuestion.nextQuestionKey; //on récupère le next de cette question
    
    let nextId;

    // Si "next" est un objet, on doit choisir le bon chemin en fonction de la réponse
    // Si "next" est un objet, on doit choisir le bon chemin en fonction de la réponse
    if (next && typeof next === 'object') {
      if (answer == 'response1') {
        next = next['next1'];  
      } else if (answer === 'response2') {
        next = next['next2'];  
      } else if (answer === 'response3') {
        next = next['next3'];  
      }
    } 

    nextId =  getIndexFromKey(this.questions, next) + 1

    return nextId ? nextId.toString() : null;
  }

  

  //récupérer un text spécifique en fonction de la clé
  getText(key: string): string {
    const keys = key.split('.'); 
    let result = this.texts; 
    for (let k of keys) {
      result = result[k]; 
    }
    return result || key; 
  }

  //Initialiser les texts
  setTexts(texts : any): void {
    this.texts = texts; 
  }
}

// Fonction pour récupérer l'index de l'élément par la clé
function getIndexFromKey(map: Map<any, any>, key: any): number {
  const entriesArray = Array.from(map); // Transforme la Map en tableau
  const index = entriesArray.findIndex(([mapKey, mapValue]) => mapKey === key); // Trouve l'index de la clé
  
  return index;
}

// Fonction pour récupérer une question par son ID
function getQuestionById(map : Map<string, Question>, id: number): Question | undefined {
  // Parcourir les entrées de la Map
  for (let [key, question] of map) {
    if (question.id === id) {
      return question;  // Retourne la question si l'id correspond
    }
  }
  return undefined;  // Si aucune question ne correspond à l'id, retourner undefined
}
