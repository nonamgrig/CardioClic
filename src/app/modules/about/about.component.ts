import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.less'
})
export class AboutComponent {
  constructor(private location: Location){

  }

  goBack():void{
    this.location.back(); 
  }

}
