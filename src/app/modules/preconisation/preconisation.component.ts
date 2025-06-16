import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Question } from '../../service/question.service';
import { TexteService } from '../../service/texte.service';
import { Preconisation, PreconisationService } from '../../service/preconisation.service';
import { Patient } from '../../service/patient.service';

@Component({
  selector: 'app-preconisation',
  standalone: false,
  templateUrl: './preconisation.component.html',
  styleUrl: './preconisation.component.less'
})
export class PreconisationComponent implements OnInit, OnChanges {

  
  @Input() questionId: number = 0;
  preco: Preconisation | undefined;
  allBoxesOpen: boolean = false;
  reco : any; //les recomendations 

   @Input() patient! : Patient; //on récupère le patient 

  constructor(
    private texteService: TexteService,
    private preconisationService : PreconisationService
  ) { }

  ngOnInit(): void {
    // Charger les questions dès le début si ce n'est pas déjà fait
    this.texteService.loadTexts().subscribe(texts => {
      this.reco=texts.reco; 
    });
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
    console.log("preco load", this.preco)
  }

  toggleAllBoxes() {
    this.allBoxesOpen = !this.allBoxesOpen;
  }

  //Fonctionnement des onglets
  selectedTab: string = 'dyslipidemie'; // Onglet affiché par défaut

  selectTab(tab: string) {
    this.selectedTab = tab;
  }


}
