import { SignupService } from 'src/app/services/signup.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/app/modules/auth/signup/confirm-password.validator';

import { AuthenticateService } from 'src/app/services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  errorMsg: string;
  userInfoObj: any = {};
  signUpForm:UntypedFormGroup;
  isSubmitted = false;
  btndisabled = false;
  roleTypes = [];
  roles = [];
  roleEntityNames =[];
  shouldLocationInputDisplayed: boolean = false;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
   constructor(
    private formBuilder: UntypedFormBuilder,
    private auth: AuthenticateService,
    private route: Router,
    private spinner : NgxSpinnerService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private signupService: SignupService
   
    
  ) {
    this.signUpForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validator: ConfirmPasswordValidator.MatchPassword });
  }

  ngOnInit() {

    if (localStorage.getItem('isAuthenticated') === 'true') {
      this.route.navigate(['/admin/products/list']);
    }
 }
gteRoleTypes() {
  this.signupService.getRoleTypes().subscribe(resp => {
    if(resp.statusCode === 200){
      
      this.roleTypes = resp.result;
      this.roles = [];
    }else{
      this.roleTypes = [];
      this.roles = [];
    }
   
  },error =>{})
}
  onSubmit() {
    
      this.isSubmitted = true;
    if(this.signUpForm.valid){
      this.spinner.show();
      delete this.signUpForm.value.confirm_password
      this.auth.doSignup({...this.signUpForm.value,...{role:14,role_type:2}}).subscribe(
        resp => {
  
          this.spinner.hide();
          if(resp.statusCode === 400){
          this.toastr.error(resp.message);
          }else{
            if (resp.access_token !== undefined) {
              this.spinner.hide();
              this.ls.setToLocal(resp);
              document.getElementById('create_dailog').click()
              // this.route.navigate(['/admin/products/list']);
            } else {
              this.errorMsg = 'Invalid Credentials';
            }
            
          }
         
        },
        err => {
          this.spinner.hide();
          this.errorMsg = err.message;
        });
  
  
      console.warn('Your order has been submitted', this.signUpForm.value.firstName);

    }
    
    
  }

getRoles(id) {
  this.signupService.getRoles(id).subscribe(resp => {
    if(resp.statusCode === 200){
      
      this.roles = resp.result;
      
    }else{
      this.roles = [];
    }
   
  },error =>{})
}

getroletype(event)
{
  this.getRoles(this.signUpForm.get('role_type').value);
}

getEntityNames(roleId) {
  if(roleId === 6||roleId === 7||roleId === 8||roleId === 9){

    this.shouldLocationInputDisplayed = true;
  }
  if(roleId === 6 ){
    this.signupService.getEntityName(roleId).subscribe(resp => {
      if(resp.statusCode === 200){
        
        this.roleEntityNames = resp.result;
        
      }else{
        this.roleEntityNames = [];
      }
     
    },error =>{})
  }
  
}
  navigateToShop() {
    this.route.navigate(['/admin/dashboard']);
  }

  notAllowmultiplespaces(event,type)
  {
    
    var value=event.target.value;
    if (event.charCode === 32 && !event.target.value.length) 
    event.preventDefault();
   if(type=='firstName')
   {
this.signUpForm.patchValue({
  firstName:value.replace(/  +/g, ' ')
})
   }
   if(type=='lastName')
   {
this.signUpForm.patchValue({
  lastName:value.replace(/  +/g, ' ')
})
   }
  
  }

}







