import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Question } from '../../service/question.service';
import { TexteService } from '../../service/texte.service';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnInit, OnChanges {

  @Input() questionId: number = 0;
  question: Question | undefined;

  constructor(
    private texteService: TexteService,
  ) { }

  ngOnInit(): void {
    // Charger les questions dès le début si ce n'est pas déjà fait
    this.texteService.loadQuestions().subscribe(() => {
      this.loadQuestion();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le questionId change, on recharge la question
    if (changes['questionId']) {
      this.loadQuestion();
    }
  }

  loadQuestion(): void {
    // Charger la question via le service
    const index = this.questionId - 1;  // index basé sur le questionId
    this.question = getQuestionByIndex(this.texteService.questions, index);
  }

}

// Fonction pour récupérer un élément par son index dans la Map de questions
function getQuestionByIndex(map: Map<string, Question>, index: number): Question | undefined {
  const entriesArray = Array.from(map);
  const entry = entriesArray[index];
  return entry ? entry[1] : undefined;
}

