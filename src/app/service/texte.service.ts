import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Question } from './question.service';
import { PatientService } from './patient.service';

@Injectable({
  providedIn: 'root'
})
export class TexteService {
  private texts: any; 
  public questions: Map<string, Question> = new Map();
  private isLoaded: boolean = false;  // Flag pour vérifier si les questions ont été chargées

  //pour gérer les pop up
  private dialogTrigger = new Subject<string>();
  dialog$ = this.dialogTrigger.asObservable();
  private dialogResolver: (() => void) | null = null;

  constructor(
    private http: HttpClient, 
    private patientService : PatientService, 
  ) {}

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
            info : item.info, 
            subquestion : item.subquestion? item.subquestion : null, 
            type: item.type,
            nextQuestionKey: nextQuestionKey,
            responses: item.responses || undefined,  // Si les réponses sont définies, les ajouter
            message : item.message ? Object.values(item.message) : null, 
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

  //pour ouvrir une pop up avec un certain message 
  triggerDialog(message: string) {
    this.dialogTrigger.next(message);
  }

  //pou attendre l'action sur la dialogue box
  waitForDialogConfirmation(message: string): Promise<void> {
    this.triggerDialog(message);
  
    return new Promise<void>((resolve) => {
      this.dialogResolver = resolve;
    });
  }
  confirmDialog(): void {
    if (this.dialogResolver) {
      this.dialogResolver();
      this.dialogResolver = null;
    }
  }

  // Fonction pour obtenir l'ID de la question suivante en fonction de la réponse
  async getNextQuestion(currentQuestionId: number, answer: string): Promise<string | null> {
    //current id est le numéro de la question
    const currentQuestion = getQuestionById(this.questions, currentQuestionId); // Récupérer l'objet Question de la Map
    console.log("current question", currentQuestion); 

    if (!currentQuestion) {
      return null;  // Si la question n'existe pas, retourner null
    }

    const currentPatient = this.patientService.getCurrentPatient()
    console.log("le patient dans test", currentPatient)
  
    let next = currentQuestion.nextQuestionKey; //on récupère le next de cette question

    /*---------------------------------------------
    Pour les questions qui s'enchainent en fonction de la réponse de la question précédente 
    on regarde la valeur des différents next (il n'y pas pas de cacul ou de comparaison de la valeur)
    */
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

    //POur la question aide, on a doit answer soit "Oui" soit "Non"
  if (currentQuestion.title == "aide" ) {
      if (answer == "Oui"){
        if(currentQuestion.message) {
          await this.waitForDialogConfirmation(currentQuestion.message[0]);
        }
      next = "TERCV"
    } else {
      if(currentQuestion.message) {
        await this.waitForDialogConfirmation(currentQuestion.message[1]);
      }
      //next CKD donc inchangé 
    }
  }
    

    /*---------------------------------------------
    Pour les questions qui nécessite de calculer un score et ou la valeur obtenu influe sur la question suivante
    on utilise l'algorithme si dessous pour déterminer le nextParticulier à la situation en fonction de la question
     */
    let nextParticulier; 

    //en fonction de l'âge, on doit diriger vers score2 ou score2op
    let scoreUtil; 
    if (Number(currentPatient.age)<70){
      scoreUtil = "score2";
    } else {
      scoreUtil = "score2op"; 
    }


    if (currentPatient.diabetique =="Non") {
      //pour certaines questions, on doit influer sur la question suivante en fonction des réponses et des résultats
      if (currentQuestion.title == "CKD") {
        if (currentPatient.dfge &&  Number(currentPatient.dfge) < 30 ) {
          //directement vers très haut risque 
          nextParticulier = "TERCV"; 
        } else {
          //vers ratio donc inchangé 
        }
      } else if (currentQuestion.title == "ratio") {
        if (currentPatient.dfge && Number(currentPatient.dfge)<= 45) { //entre 30 et 45
          if (currentPatient.ratio && Number(currentPatient.ratio) <= 30) {
            //direct risque
            nextParticulier = "ERCV"
          } else if (currentPatient.ratio && Number(currentPatient.ratio) > 30) {
            //direct risque
            nextParticulier = "TERCV"
          } else if  (currentPatient.rationondispo && currentPatient.rationondispo == "Non disponible") { 
            //TO DO message pop up à faire ++
            if(currentQuestion.message) {
              await this.waitForDialogConfirmation(currentQuestion.message[0]);
            }
          }
        } else if (currentPatient.dfge && Number(currentPatient.dfge) <= 60) { //entre 45 et 60
          if (currentPatient.ratio && Number(currentPatient.ratio) <= 30) {
            //vers score donc inchangé
            nextParticulier = scoreUtil; 
          } else if (currentPatient.ratio && Number(currentPatient.ratio) > 30) {
            //direct risque
            nextParticulier = "ERCV"
          } else if  (currentPatient.rationondispo && currentPatient.rationondispo == "Non disponible") { 
            //TO DO message pop up à faire 
            if(currentQuestion.message) {
              await this.waitForDialogConfirmation(currentQuestion.message[1]);
            }
          }
        } else { //> 60 
          if (currentPatient.ratio && Number(currentPatient.ratio) <= 300) {
            //vers score donc inchangé
            nextParticulier = scoreUtil;
          } else if (currentPatient.ratio && Number(currentPatient.ratio) > 300) {
            //direct risque
            nextParticulier = "ERCV"
          } else if  (currentPatient.rationondispo && currentPatient.rationondispo == "Non disponible") { 
            //TO DO message pop up à considérer
            if(currentQuestion.message) {
              await this.waitForDialogConfirmation(currentQuestion.message[2]);
            }
          }
        }
                    
      } else if (currentQuestion.title == "score2" || currentQuestion.title == "score2op" ) {
        // en fonction du résultat du calcul du score 2 ou score 2 OP et de l'âge 
        if (currentPatient.age && Number(currentPatient.age)< 70){
          //on regarde le résultat du score 2
          if (Number(currentPatient.age) <50) {
            if (currentPatient.score2 && Number(currentPatient.score2) < 2.5) {
              //direct risque
              nextParticulier = "FRCV"
            } else if (currentPatient.score2 && Number(currentPatient.score2) < 7.5) {
              //direct risque
              nextParticulier = "MRCV"
            } else { //>= 7.5
              //direct risque
              nextParticulier = "ERCV"
            }
          } else { //age entre 50 et 69
            if (currentPatient.score2 && Number(currentPatient.score2) < 5) {
              //direct risque
              nextParticulier = "FRCV"
            } else if (currentPatient.score2 && Number(currentPatient.score2) < 10) {
              //direct risque
              nextParticulier = "MRCV"
            } else { //>= 10
              //direct risque
              nextParticulier = "ERCV"
            }
          }
        } else { // age >=70 avec score2op
          if (currentPatient.score2op && Number(currentPatient.score2op) < 7.5) {
            //direct risque
            nextParticulier = "FRCV"
          } else if (currentPatient.score2op && Number(currentPatient.score2op) < 15) {
            //direct risque
            nextParticulier = "MRCV"
          } else { //>= 15
            //direct risque
            nextParticulier = "ERCV"
          }
        }

      }
    } else { //diabétique OUI
      
      if (currentQuestion.title == "CKD") {
        if (currentPatient.dfge &&  Number(currentPatient.dfge) < 45 ) {
          //directement vers très haut risque 
          nextParticulier = "TERCV"; 
        } else {
          //vers ratio donc inchangé 
        }
      } else if (currentQuestion.title == "ratio") {
        //on doit changer la direction de toutes les questions vers scorediabete
        if (currentPatient.dfge && Number(currentPatient.dfge)< 60) { //entre 45 et 60
          if (currentPatient.ratio && Number(currentPatient.ratio) > 30) {
            //direct risque
            nextParticulier = "TERCV"
          } else if  (currentPatient.rationondispo && currentPatient.rationondispo == "Non disponible") { 
            // message pop up pour aller quand même au score
            nextParticulier = "score2diabete"
            if(currentQuestion.message) {
              await this.waitForDialogConfirmation(currentQuestion.message[0]);
            }
          } else {
            //vers score diabete
            nextParticulier = "score2diabete"
          } 
       
        } else { // >=60 
          if (currentPatient.ratio && Number(currentPatient.ratio) < 30) {
            //vers score diabete
            nextParticulier = "score2diabete"
          } else if (currentPatient.ratio && Number(currentPatient.ratio) < 300) { //entre 30 et 300
            //direct risque
            nextParticulier = "lesion"
          } else if  (currentPatient.rationondispo && currentPatient.rationondispo == "Non disponible") { 
            // message pop up pour aller quand même au score diabete
            nextParticulier = "score2diabete"
            if(currentQuestion.message) {
              await this.waitForDialogConfirmation(currentQuestion.message[0]);
            }
          } else { // >= 300
            //direct risque
            nextParticulier = "TERCV"
          } 
        }
        
      } else if (currentQuestion.title == "lesion") {
        if (currentPatient.neuropathie == "Oui" && currentPatient.retinopathie =="Oui") {
          //vers haut risque direct
          nextParticulier = "TERCV"
        } else {
          //vers score diabete
            nextParticulier = "score2diabete"
        }
      } else if (currentQuestion.title == "score2diabete") {
        // en fonction du résultat du calcul du score et de l'âge 
        if (currentPatient.score2diabete && Number(currentPatient.score2diabete) < 5) {
          //direct risque
          nextParticulier = "FRCV"
        } else if (currentPatient.score2diabete && Number(currentPatient.score2diabete) < 10) {
          //direct risque
          nextParticulier = "MRCV"
        } 
        else if (currentPatient.score2diabete && Number(currentPatient.score2diabete) < 20) {
          //direct risque
          nextParticulier = "ERCV"
        }else { //>= 20
          //direct risque
          nextParticulier = "TERCV"
        }
      }
    }

    
    let nextId; //représente l'id de la question suivante dans la liste des questions

    //si un nextPartiuclier existe il est prioritaire par rapport au next d'origine
    if (nextParticulier) {
      console.log("new nextid"); 
      nextId = getIndexFromKey(this.questions, nextParticulier) + 1
    } else {
      nextId =  getIndexFromKey(this.questions, next) + 1
    }
    
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
