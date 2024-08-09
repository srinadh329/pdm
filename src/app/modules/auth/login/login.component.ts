import { Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';

import { AuthenticateService } from 'src/app/services/authenticate.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  loginData: any = {};
  fbLoginData: any = {};
  rememberMe: any = false;
  forgotPassword: any = false;
  forgotEmail: any = {};
  userinfo: any = {};
  error: string;
  success: string;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  loginForm: any;
  isSubmitted = false;
  constructor(private auth: AuthenticateService,
    private route: Router,
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private fb: UntypedFormBuilder,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private ngZone: NgZone) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  handleCredentialResponse(response: any) {
    
    // Decoding  JWT token...
    let decodedToken: any | null = null;
    let token: any
    try {
      decodedToken = JSON.parse(atob(response?.credential.split('.')[1]));
      token = JSON.parse(atob(response?.credential.split('.')[0]));
    } catch (e) {
      console.error('Error while trying to decode token', e);
    }

    if (decodedToken) {
      const useObject = {
        firstName: '', lastName: '', socialNetworkUserId: '', email: '', image: '',
        socialNetworkAccessToken: '', authKey: '', socialNetwork: '', gender: ''
      };

      useObject.firstName = decodedToken.given_name;
      useObject.lastName = decodedToken.family_name;
      useObject.socialNetworkUserId = decodedToken.sub;
      useObject.email = decodedToken.email;
      useObject.image = decodedToken.picture;
      useObject.socialNetworkAccessToken = response?.credential;
      useObject.authKey = decodedToken.jti
      useObject.socialNetwork = 'GOOGLE';
      useObject.gender = 'MALE';
      this.auth.socialLogin(useObject).subscribe((userLogin) => {
        // this.spinner.hide()
        
        if (userLogin) {
          this.ngZone.run(() => {
            this.ls.setToLocal(userLogin);
            localStorage.setItem('role_type', userLogin?.role_type)
            this.route.navigate(['/admin/dashboard']);
          })
        }
      }, (err) => {
        this.spinner.hide()
      });
    }
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    const script1 = this._renderer2.createElement('script');
    script1.src = `https://accounts.google.com/gsi/client`;
    script1.async = `true`;
    script1.defer = `true`;
    this._renderer2.appendChild(this._document.body, script1);
  }
  ngOnInit() {

    (window as any).onGoogleLibraryLoad = () => {
      

      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '636777534484-uer2h3vkam57h8k1rf1b4hnq1ni30bl1.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this), // Whatever function you want to trigger...
        auto_select: false,
        cancel_on_tap_outside: false
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        document!.getElementById("google-button")!,
        { theme: "outline", size: "large", width: "100%" }
      );
    };
    if (this.ls.getItem('id')) {
      this.route.navigate(['/admin/products/list']);
    }
    if (this.ls.get_session_rememberMe()) {
      this.rememberMe = true;
      this.loginData = JSON.parse(this.ls.get_session_rememberMe());
    }
  }
  remember(e) {
    this.rememberMe = e.target.checked;
  }
  showForgotPassword() {
    this.forgotPassword = !this.forgotPassword;
  }
  doLogin() {
    this.isSubmitted = true;
    if (this.rememberMe) {
      this.ls.set_session_rememberMe(JSON.stringify(this.loginData));
    } else {
      this.ls.clear_session_rememberMe();
    }
    if (this.loginForm.valid) {
      this.spinner.show();
      this.auth.doLogin(this.loginForm.value).subscribe(
        resp => {
          this.spinner.hide();
          if (resp.access_token !== undefined) {
            this.spinner.hide();
            this.ls.setToLocal(resp);
            localStorage.setItem('role_type', resp?.role_type)
            this.route.navigate(['/admin/dashboard']);
          } else {
            this.error = 'Invalid Credentials';
            this.toastr.error(resp?.data)
            if (resp.status === 'error') {
              this.error = resp.data;
            }
          }
        },
        err => {
          this.spinner.hide();
          this.error = err.message;
        });
    }

  }

}
