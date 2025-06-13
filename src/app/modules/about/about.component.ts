import { Component, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormatInfoTextPipe } from '../../pipe/format-info-text.pipe';
import { TexteService } from '../../service/texte.service';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.less'
})
export class AboutComponent {

  text : any; 
  lien1 : any; 
  lien2 : any; 
  lien3 : any; 
  lien4: any; 

  constructor(
      private location: Location,
      private texteService: TexteService,
      private sanitizer: DomSanitizer,  // Injecter DomSanitizer
      private formatInfoTextPipe: FormatInfoTextPipe  // Injection de ton pipe
  ) { }
  
  ngOnInit(): void {
    // Charger les questions dès le début si ce n'est pas déjà fait
    this.texteService.loadTexts().subscribe(texts => {
      this.texteService.setTexts(texts); 
      this.text=texts; 
      if (this.text.home) {
        const formattedLien1 = this.formatInfoTextPipe.transform(this.text.home.lien1); 
        this.lien1 = this.sanitizer.bypassSecurityTrustHtml(formattedLien1);  

        const formattedLien2 = this.formatInfoTextPipe.transform(this.text.home.lien2); 
        this.lien2 = this.sanitizer.bypassSecurityTrustHtml(formattedLien2);  
        const formattedLien3 = this.formatInfoTextPipe.transform(this.text.home.lien3); 
        this.lien3 = this.sanitizer.bypassSecurityTrustHtml(formattedLien3);  
        const formattedLien4 = this.formatInfoTextPipe.transform(this.text.home.lien4); 
        this.lien4 = this.sanitizer.bypassSecurityTrustHtml(formattedLien4);  
      }
    });
  }

  goBack():void{
    this.location.back(); 
  }

}
