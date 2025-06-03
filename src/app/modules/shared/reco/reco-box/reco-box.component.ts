import { Component, Input } from '@angular/core';

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

  is2Open = false; //pour savoir si on ouvre le niveau 2 ou pas 


    //Autre section dépliable
  toggleSection() {
    this.is2Open = !this.is2Open;
  }

}
