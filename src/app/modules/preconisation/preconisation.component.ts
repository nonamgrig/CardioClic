import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Question } from '../../service/question.service';
import { TexteService } from '../../service/texte.service';
import { Preconisation } from '../../service/preconisation.service';

@Component({
  selector: 'app-preconisation',
  standalone: false,
  templateUrl: './preconisation.component.html',
  styleUrl: './preconisation.component.less'
})
export class PreconisationComponent implements OnInit, OnChanges {

  
  @Input() questionId: number = 0;
  preco: Preconisation | undefined;

  message1 = "LDL cholesterol"
  message2= "blablablabla"
  refIcon = "ldl"

  constructor(
    private texteService: TexteService,
  ) { }

  ngOnInit(): void {
    // Charger les questions dès le début si ce n'est pas déjà fait
    this.texteService.loadQuestions().subscribe(() => {
      this.loadPreconisation();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le questionId change, on recharge la question
    if (changes['questionId']) {
      this.loadPreconisation();
    }
  }

  loadPreconisation(): void {
    // Charger la question via le service
    const index = this.questionId - 1;  // index basé sur le questionId
    this.preco = getPreconisationByIndex(this.texteService.questions as unknown as Map<string, Preconisation>, index);
    console.log("preco", this.preco)
  }
}


// Fonction pour récupérer un élément par son index dans la Map de questions
function getPreconisationByIndex(map: Map<string, Preconisation>, index: number): Preconisation | undefined {
  const entriesArray = Array.from(map);
  const entry = entriesArray[index];
  return entry ? entry[1] : undefined;
}
