import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Preconisation, PreconisationService } from '../../../../service/preconisation.service';
import { TexteService } from '../../../../service/texte.service';

@Component({
  selector: 'app-end-eval',
  standalone: false,
  templateUrl: './end-eval.component.html',
  styleUrl: './end-eval.component.less'
})
export class EndEvalComponent implements OnInit, OnChanges {

  
  @Input() questionId: number = 0;
  preco: Preconisation | undefined;

  constructor(
    private texteService: TexteService,
    private preconisationService : PreconisationService
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
    this.preco = this.preconisationService.getPreconisationByIndex(this.texteService.questions as unknown as Map<string, Preconisation>, index);
    console.log("preco", this.preco)
  }


  terminerEvaluation() : void {
    //fonction pour envoyer les datas 
    //dans le POC, on envoie vers le formulaire
    this.texteService.waitForDialogConfirmation("Merci d'avoir utiliser Cardio'Clic ! \n\nL'outil est encore en phase de test, si vous voulez nous aider à l'améliorer, répondez à ce court questionnaire pour nous donner votre avis : text=Formulaire link=https://fr.wikipedia.org/wiki/Formulaire")
  }
}

