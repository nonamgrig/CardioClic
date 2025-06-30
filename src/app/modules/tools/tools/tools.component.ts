import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tools',
  standalone: false,
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.less'
})
export class ToolsComponent {


  constructor(
      private location: Location
  ) { }

  goBack():void{
    this.location.back(); 
  }

  faqList = [
    {
      question: 'Quand ré-évaluer le risque cardiovasculaire d\'un patient ?',
      answer: 'Le risque cardiovasculaire peut être recalculé à tout moment si un facteur de risque majeur est modifié. \nEn fonction de la gravité du risque précédement obtenu ré-évaluer le risque (Élevé : 2 ans, Modéré : 3 ans, Faible : 5 ans)',
      open: false
    },
    {
      question: 'Que faire en cas de myalgie sous statine ?',
      answer: 'CAT : Arrêt temporaire, bilan CPK, réévaluation du traitement. Conseils : surveiller douleurs musculaires persistantes.',
      open: false
    },
    {
      question: 'Que faire en cas de cytolyse sous statine ?',
      answer: 'CAT : Arrêter la statine, contrôler les transaminases, rechercher autres causes. Conseils : réintroduire à dose plus faible si possible.',
      open: false
    }    
  ];

  toggleFAQ(index: number): void {
    this.faqList[index].open = !this.faqList[index].open;
  }

}
