import { Component, Input, SimpleChanges } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { FormatInfoTextPipe } from '../../../../pipe/format-info-text.pipe';

@Component({
  selector: 'app-reco-box',
  standalone: false,
  templateUrl: './reco-box.component.html',
  styleUrl: './reco-box.component.less'
})
export class RecoBoxComponent {

  @Input() refIcon: string = ''; 
  @Input() message1: string = '';
  @Input() message2: string = '';

  @Input() is2Open = false; //pour savoir si on ouvre le niveau 2 ou pas 
  @Input() hidden = false; //pour avoir la flèche visible ou pas

  sanitizedMessage2: SafeHtml = ''; 

  constructor(
    private sanitizer: DomSanitizer,  // Injecter DomSanitizer
    private formatInfoTextPipe: FormatInfoTextPipe  // Injection de ton pipe
  ) { }
  
  ngOnInit(): void {
    this.processMessage(); // Appelé une fois au début
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && changes['message'].currentValue) {
      this.processMessage(); // Appelé à chaque changement de message
    }
  }
    //Autre section dépliable
  toggleSection() {
    this.is2Open = !this.is2Open;
  }

  private processMessage(): void {
    const formattedInfo = this.formatInfoTextPipe.transform(this.message2);
    this.sanitizedMessage2 = this.sanitizer.bypassSecurityTrustHtml(formattedInfo);
  }

}
