import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TexteService } from '../../service/texte.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  constructor( private router: Router, public texteService : TexteService) {
  }

  ngOnInit() {
  }

  onGo(event:Event) {
    this.router.navigate(["question/1"]); 
  }
}
