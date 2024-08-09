import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthenticateService, private rte: Router){}
  canActivate(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.rte.navigate(['/login']);
      return false;
    }
  }
}
