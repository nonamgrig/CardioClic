import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  constructor( private router: Router ) {
  }

  ngOnInit() {
  }

  navHome(event:Event) {
    this.router.navigate(["home"]); 
  }

  navAbout(event:Event) {
    this.router.navigate(["about"]); 
  }
}
