import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotForm;
  public isSubmitted;
  public clicked = false;
  public fgEmail = '';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private auth: AuthenticateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.forgotForm = this.formBuilder.group({

      email: ['', Validators.required],
    });
  }

  onSubmit() {

    this.spinner.show();
    this.isSubmitted = true;

    
    if (this.forgotForm.invalid) {
      this.spinner.hide();
      return false;
    }



    this.auth.resetPassword(this.forgotForm.value).subscribe(resp => {
      if (resp.statusCode === 200) {
        this.toastr.success(resp?.message)
        this.spinner.hide();
        this.clicked = true;
        this.fgEmail = this.forgotForm.value.email;
      }

    },
      error => { this.clicked = false; 
        this.spinner.hide();
       this.toastr.error(error.error);
      });
  }

}
