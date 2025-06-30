import { Component, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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

  liens: { original: string, formatted: SafeHtml }[] = [];


  constructor(
      private location: Location,
      private texteService: TexteService,
      private sanitizer: DomSanitizer,  // Injecter DomSanitizer
      private formatInfoTextPipe: FormatInfoTextPipe  // Injection de ton pipe
  ) { }
  
  ngOnInit(): void {
    this.texteService.loadTexts().subscribe(texts => {
      this.texteService.setTexts(texts);
      this.text = texts;

      if (this.text.home) {
        this.liens = Object.entries(this.text.home)
          .filter(([key]) => key.startsWith('lien'))
          .map(([_, value]) => {
            const formatted = this.formatInfoTextPipe.transform(value as string);
            return {
              original: value as string,
              formatted: this.sanitizer.bypassSecurityTrustHtml(formatted)
            };
          });
      }
    });
  }


  goBack():void{
    this.location.back(); 
  }

}
