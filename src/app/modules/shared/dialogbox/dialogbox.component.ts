import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormatInfoTextPipe } from '../../../pipe/format-info-text.pipe';

@Component({
  selector: 'app-dialogbox',
  standalone: false,
  templateUrl: './dialogbox.component.html',
  styleUrl: './dialogbox.component.less'
})
export class DialogboxComponent implements OnInit, OnChanges {

  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  sanitizedInfo : SafeHtml = ''; 

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

  private processMessage(): void {
    const formattedInfo = this.formatInfoTextPipe.transform(this.message);
    this.sanitizedInfo = this.sanitizer.bypassSecurityTrustHtml(formattedInfo);
    console.log("message nettoyé:", this.sanitizedInfo);
  }

  onClose() {
    this.visible = false;
    this.close.emit();
  }

  @Output() confirm = new EventEmitter<void>();

  onConfirm() {
    this.visible = false;
    this.confirm.emit();
  }

}
