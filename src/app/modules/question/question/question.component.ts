import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TexteService } from '../../../service/texte.service';
import { QuestionService } from '../../../service/question.service';
import { Question } from '../../../service/question.service'

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
  ) { }

  ngOnInit(): void {
    console.log("Component initialized");
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

    console.log("this question", this.question);
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
    console.log('getResponseArraySubquestion - Subquestion reçue :', subquestion);

    if (subquestion?.responses){
      const array = Object.keys(subquestion.responses).map(key => {
        return { key: key, label: subquestion?.responses? subquestion.responses[key] : null };
      });
      console.log("getResponse ArraySubquestion : ", array); 
      return array;
    } else {
      console.warn('getResponseArraySubquestion - Pas de réponses dispo')
      return null}
  }

  //Fonction pour transformer subquestion en tableau
  initSubquestions() {
    const subquestions = this.question?.subquestion;
    console.log('initSubquestions - Début', this.question);
    if (subquestions) {
      this.subquestionsArray = Object.keys(subquestions).map((key) => {
        const question = {
          ...subquestions[key],
          key: key
        };
        console.log(`initSubquestions - Subquestion ajoutée : ${key}`, question);
        return question;
      });
    }
  
    console.log('initSubquestions - Fin', this.subquestionsArray);
  }
  


  onAnswerSubmit(): void {
    if (this.questionId) {
      //enregistrer la réponse de l'utilisateur, utile ? 
      console.log('onAnswerSubmit - Réponse utilisateur :', this.userAnswer);
      console.log('onAnswerSubmit - Clé sélectionnée :', this.selectedAnswer);
      //on a stocké les réponses aux questions dans les subquestions directement
      console.log("subquestion with answer", this.subquestionsArray); 

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
