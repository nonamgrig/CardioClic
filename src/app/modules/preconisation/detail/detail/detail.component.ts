import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormatInfoTextPipe } from '../../../../pipe/format-info-text.pipe';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.less'
})
export class DetailComponent {

 @Input() reco : any; 

 message : any; 
 fiche : any; 
 traitement : any; 
 ordonance : any; 
 encart : any; 

 constructor(
      private sanitizer: DomSanitizer,  // Injecter DomSanitizer
      private formatInfoTextPipe: FormatInfoTextPipe  // Injection de ton pipe
  ) { }

  ngOnInit(){
    
    const formattedMessage = this.formatInfoTextPipe.transform(this.reco.message); 
    this.message = this.sanitizer.bypassSecurityTrustHtml(formattedMessage);

    const formattedFiche = this.formatInfoTextPipe.transform(this.reco.fiche); 
    this.fiche = this.sanitizer.bypassSecurityTrustHtml(formattedFiche);
    const formattedTraitement = this.formatInfoTextPipe.transform(this.reco.traitement); 
    this.traitement = this.sanitizer.bypassSecurityTrustHtml(formattedTraitement);
    const formattedOrdonance = this.formatInfoTextPipe.transform(this.reco.ordonance); 
    this.ordonance = this.sanitizer.bypassSecurityTrustHtml(formattedOrdonance);
    const formattedEncart = this.formatInfoTextPipe.transform(this.reco.encart); 
    this.encart = this.sanitizer.bypassSecurityTrustHtml(formattedEncart);
  }

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
