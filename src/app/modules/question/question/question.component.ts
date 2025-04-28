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
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le questionId change, on recharge la question
    if (changes['questionId']) {
      this.userAnswer=""; 
      this.loadQuestion();
    }
  }

  loadQuestion(): void {
    // Charger la question via le service
    const index = this.questionId - 1;  // index basé sur le questionId
    this.question = getQuestionByIndex(this.texteService.questions, index);

    console.log('Questions chargées :', this.texteService.questions);
    console.log("questionID", this.questionId);
    console.log("question", this.question);
  }

   // Fonction pour transformer l'objet responses en tableau
   getResponseArray() {
    if (this.question?.responses){
      return Object.keys(this.question.responses).map(key => {
        return { key: key, label: this.question?.responses? this.question.responses[key] : null };
      });
    } else {return null}
  }

  onAnswerSubmit(): void {
    if (this.questionId) {
      //enregistrer la réponse de l'utilisateur, utile ? 
      console.log("réponse", this.userAnswer); 

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
