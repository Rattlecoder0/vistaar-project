import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title: string = 'WebApp';
  navbar: boolean = false;

  constructor(private router:Router, private cdr:ChangeDetectorRef){}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/') {
          this.navbar = false; 
        } else {
          this.navbar = true;
        }
      }
    });
  }
}
