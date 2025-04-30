import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TexteService } from '../../../service/texte.service';
import { QuestionService } from '../../../service/question.service';
import { Question } from '../../../service/question.service'
import { PatientService } from '../../../service/patient.service';

@Component({
  selector: 'app-question',
  standalone: false,
  templateUrl: './question.component.html',
  styleUrl: './question.component.less'
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() questionId: number = 0;
  question: Question | undefined;
  userAnswer: any = null;
  selectedAnswer : any = null; 

  subquestionsArray: (Question & { key: string })[] = [];

  constructor(
    private router: Router,
    private texteService: TexteService,
    private questionService: QuestionService,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    // Charger les questions dès le début si ce n'est pas déjà fait
    this.texteService.loadQuestions().subscribe(() => {
      this.loadQuestion();
      //pour initialiser les questions supplémentaires
      this.initSubquestions();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le questionId change, on recharge la question
    if (changes['questionId']) {
      //pour ré-initialiser les valeurs pour la nouvelle question
      this.userAnswer=""; 
      this.selectedAnswer=""; 
      this.subquestionsArray=[]; 
      this.loadQuestion();
      //pour initialiser les questions supplémentaires
      this.initSubquestions();
    }
  }

  loadQuestion(): void {
    // Charger la question via le service
    const index = this.questionId - 1;  // index basé sur le questionId
    this.question = getQuestionByIndex(this.texteService.questions, index);
  }

  // Fonction pour transformer l'objet responses en tableau
  getResponseArray() {
    if (this.question?.responses){
      return Object.keys(this.question.responses).map(key => {
        return { key: key, label: this.question?.responses? this.question.responses[key] : null };
      });
    } else {return null}
  }

  //pour transformer les réponses d'une subquestion en tableau
  getResponseArraySubquestion(subquestion : Question) {

    if (subquestion?.responses){
      const array = Object.keys(subquestion.responses).map(key => {
        return { key: key, label: subquestion?.responses? subquestion.responses[key] : null };
      });
      return array;
    } else {
      console.warn('getResponseArraySubquestion - Pas de réponses dispo')
      return null}
  }

  //Fonction pour transformer subquestion en tableau
  initSubquestions() {
    const subquestions = this.question?.subquestion;
    if (subquestions) {
      this.subquestionsArray = Object.keys(subquestions).map((key) => {
        const question = {
          ...subquestions[key],
          key: key
        };
        return question;
      });
    }
  }
  

  onAnswerSubmit(): void {
    if (this.questionId) {
      //enregistrer la réponse de l'utilisateur, utile ? 
      console.log('onAnswerSubmit - Réponse utilisateur :', this.userAnswer);
      console.log('onAnswerSubmit - Clé sélectionnée :', this.selectedAnswer);
      //on a stocké les réponses aux questions dans les subquestions directement
      console.log("subquestion with answer", this.subquestionsArray);
      console.log("key", this.question?.title); 

      const key = this.question?.title ? this.question.title : "titre vide";

      if (this.subquestionsArray.length == 0 ) {
        //on a une seule question sur la page 
        this.patientService.updateField(key, this.userAnswer);
      } else {
        //il y a plusieurs réponses à enregistrer
        this.subquestionsArray.forEach(subquestion => {
          this.patientService.updateField(subquestion.key, subquestion.userAnswer);
        })
      }

      //pour les questions avec un calcul, on appelle la fonction de calcul dans patientService
      switch (this.question?.title) {
        case "apparition": //calculer l'age à l'apparition du diabète 
        //si une année d'apparition a été renseignée, elle prévaut ?
        //TO DO : choisir qui prévaut l'age ou l'année si les deux sont enregistrées 
          if (this.subquestionsArray[0].userAnswer) {
            console.log("annee d'apparition donnée", this.subquestionsArray[0].userAnswer); 
            let ageApparition = this.patientService.calculAgeApparition(this.subquestionsArray[0].userAnswer).toString()
            console.log("age apparition diabete", ageApparition); 
            this.patientService.updateField("ageApparition", ageApparition); 
          }
          
          break;
        case "CKD": 
          let DFGe = arrondirSiNecessaire(this.patientService.calculDFGe()); //'avec 2 chiffres après la virgule
          if (DFGe == "0"){
            DFGe = ""; 
          }
          this.patientService.updateField("dfge", DFGe); 
          break;
        case "score2": 
          let score2 = arrondirSiNecessaire(this.patientService.calculscore2()); 
          this.patientService.updateField("score2", score2); 
          break;
        case "score2op": 
          let score2op = arrondirSiNecessaire(this.patientService.calculscore2op()); 
          this.patientService.updateField("score2op", score2op); 
          break;  
        case "score2diabete": 
          let score2diabete = arrondirSiNecessaire(this.patientService.calculscore2diabet()); 
          this.patientService.updateField("score2diabete", score2diabete); 
        break; 
        default : 
        
          break;
      }

      // Trouver la question suivante en fonction de la réponse
      const nextQuestionId = this.texteService.getNextQuestion(this.questionId, this.selectedAnswer);
      if (nextQuestionId) {
        this.router.navigate(['/question', nextQuestionId]);
      } else {
        console.log("pas de question suivante");
      }
    }
  }
}

// Fonction pour récupérer un élément par son index dans la Map de questions
function getQuestionByIndex(map: Map<string, Question>, index: number): Question | undefined {
  const entriesArray = Array.from(map);
  const entry = entriesArray[index];
  return entry ? entry[1] : undefined;
}

function arrondirSiNecessaire(val : number) {
  const arrondi = Math.round(val * 100) / 100;
  return Number.isInteger(arrondi) ? arrondi.toString() : arrondi.toFixed(2);
}