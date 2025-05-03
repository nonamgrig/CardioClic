import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialogbox',
  standalone: false,
  templateUrl: './dialogbox.component.html',
  styleUrl: './dialogbox.component.less'
})
export class DialogboxComponent {

  @Input() message: string = '';
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

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
