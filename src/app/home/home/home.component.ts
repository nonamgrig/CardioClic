import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
  constructor( private router: Router ) {
  }

  ngOnInit() {
  }

  onGo(event:Event) {
    this.router.navigate(["question"]); 
  }
}
