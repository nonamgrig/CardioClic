import { Component, Input, OnChanges, OnInit, PipeTransform, SimpleChanges } from '@angular/core';
import { Question } from '../../service/question.service';
import { TexteService } from '../../service/texte.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormatInfoTextPipe } from '../../pipe/format-info-text.pipe';

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
    private sanitizer: DomSanitizer,  // Injecter DomSanitizer
    private formatInfoTextPipe: FormatInfoTextPipe  // Injection de ton pipe
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
    console.log("question", this.question);
    // Appliquer le pipe formatInfoText et marquer comme safe
    if (this.question?.info) {
      const formattedInfo = this.formatInfoTextPipe.transform(this.question.info); // Applique ton pipe ici
      this.sanitizedInfo = this.sanitizer.bypassSecurityTrustHtml(formattedInfo);  // Marque le contenu comme "safe"
      console.log("sani", this.sanitizedInfo); 
    }
  }

  //pour gérer l'affichage des images dans infos
  sanitizedInfo : SafeHtml = ''; 
  showImageModal = false;
  modalImageSrc = '';

  handleImageClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const linkElement = target.closest('.image-link');
    console.log("link", linkElement);
     if (linkElement) {
      event.preventDefault();
      const imgPath = linkElement.getAttribute('data-img');
      console.log('Image cliquée :', imgPath);

      if (imgPath) {
        this.modalImageSrc = imgPath;
        this.showImageModal = true;
      }
    }
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.modalImageSrc = '';
  }

}

// Fonction pour récupérer un élément par son index dans la Map de questions
function getQuestionByIndex(map: Map<string, Question>, index: number): Question | undefined {
  const entriesArray = Array.from(map);
  const entry = entriesArray[index];
  return entry ? entry[1] : undefined;
}

