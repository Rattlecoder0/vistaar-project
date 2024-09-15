import { Component } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private auth: Auth, private router: Router) { }

  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(result => {
        console.log(result.user);

        const userdata = result.user.providerData
        
        userdata.forEach((e) => {
          if (e.displayName && e.email && e.uid) {
            localStorage.setItem('Username', e.displayName)
            this.router.navigate(['dashboard'])
          }
          else {
            alert('Failed to login')
          }
        })
      })
      .catch(error => {
        console.error(error);
      });
  }
}
