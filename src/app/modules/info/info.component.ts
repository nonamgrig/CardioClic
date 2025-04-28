import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent {

  @Input() title: string = ''; 
  @Input() text: string = ''; 
}
