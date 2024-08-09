import { Component, OnInit,ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormGroup, ValidatorFn, Validators, UntypedFormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { QuoteService } from 'src/app/services/quote.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { SharedService } from 'src/app/services/shared.service';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';

@Component({
  selector: "app-create-quote",
  templateUrl: "./create-quote.component.html",
  styleUrls: ["./create-quote.component.css"],
})
export class CreateQuoteComponent implements OnInit {
  quoteInfoForm: UntypedFormGroup;
  states: any = [];
  clientList: any = [];
  phoneNoPattern = "^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  projectType = [
    { name: "Buy", sgid: 1 },
    { name: "Rent", sgid: 0 },
  ];
  companyList: any = [];
  projectList: any = [];
  segment: any = [];
  isSubmitted:boolean=false;
  today = new Date();
  disableDate: any;
  quote:any={
    id:'',
    type:''
  }
  segmentList: any;
  orderInfo:any=[
    {type:'RTR',value:'RTR'},
    {type:'RTO',value:'RTO'},
    {type:'Sale',value:'Sale'}
  ]
  order_status
  prod_id: any;
  skuVariationId: any;
  productType: any;
  is_billing_address:boolean=true;
  is_checked:boolean=false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private quoteService: QuoteService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthenticateService,
    private sharedservice: SharedService,
    private cMbService: CreateMoodboardService,
    private calendar: NgbCalendar,
    private aroute: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    this.quoteInfoForm = this.formBuilder.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      zipcode: ["", Validators.required],
      billing_address: ["", Validators.required],
      billing_state: ["", Validators.required],
      billing_city: ["", Validators.required],
      billing_zip_code: ["", Validators.required],
      email: ["", Validators.required],
      company_id: ["", Validators.required],
      companyName: ["", Validators.required],
      segment_type_id:["", Validators.required],
      project_id: ["", Validators.required],
      project_name: ["", Validators.required],
      contact_no: ["", Validators.required],
      order_type:["", Validators.required],
      preferred_delivery_start_date: [""],
      preferred_delivery_end_date: [""],
    });
    this.getStates();
    this.getCompanyList();
    this.getSegment()
    this.aroute.queryParams.subscribe((res:any)=>{
      
      if(res){
        this.quote={
          id:res?.id,
          type:res?.type
        }
      }
      if(res?.productType=='productDetails'){
        this.prod_id = res?.productId;
        this.skuVariationId = res?.productSkuId;
        this.productType = res?.productType
      }
    })
  }

  ngOnInit(): void {
    if(this.quote?.id)this.getquotation(this.quote.id)
  }
  getquotation(id){
    this.quoteService.getQuotationDetails(id).subscribe((res:any)=>{
     
      // if(res?.quote?.is_order=="YES" || res?.quote?.business_segment_type==""){
      //   if(res?.quote?.business_segment_type==""){
      //     this.form_key['segment_type_id']=''
      //   }
      //   let form = this.quoteInfoForm.value;
      //   this.is_enable = true
      //   this.quoteInfoForm?.disable()
      //   for(let f_key in this.form_key){
      //     for(let key in form){
      //       if(f_key == key){
      //         this.quoteInfoForm?.get(key).enable()
      //       }
      //     }
      //   }
      // }
      const quote = res?.quote;
      if(quote){
        this.getProjectListMD(res?.quote?.company_id);
        this.quoteInfoForm.patchValue({
          name: quote?.name,
          address: quote?.address,
          state: String(quote?.state),
          city: quote?.city_name,
          zipcode: quote?.is_zip_code,
          billing_address: quote?.billing_address,
          billing_state: String(quote?.billing_state),
          billing_city: quote?.billing_city,
          billing_zip_code: quote?.is_billing_zip_code,
          email: quote?.email,
          company_id: quote?.company_id,
          companyName: quote?.company_name,
          segment_type_id: quote?.segment_type_id,
          project_id: quote?.project_id,
          project_name: quote?.project_name,
          contact_no: quote?.contactno,
          order_type: quote?.quote_order_type,
          preferred_delivery_start_date: quote?.preferred_delivery_start_date,
          preferred_delivery_end_date: quote?.preferred_delivery_end_date,
        });
        const isBillingSameAsAddress = (
          quote?.address === quote?.billing_address &&
          quote?.state === quote?.billing_state &&
          quote?.city_name === quote?.billing_city &&
          quote?.is_zip_code === quote?.is_billing_zip_code
      );
      this.is_checked = isBillingSameAsAddress;
      this.order_status = res?.quote?.order_status;
      this.is_billing_address=false;
      }
    })
    
  }

  getStates() {
    this.spinner.show();
    this.quoteService.getStates().subscribe((res: any) => {
      this.spinner.hide();
      
      if (res?.statusCode == 200) {
        this.states = res?.states;
      }
      
    });
  }
  getCompanyList() {
    let userId = this.auth.getProfileInfo("userId");
    this.sharedservice.getCompanyList({ company_type: "quote", user_id: userId })
      .subscribe(
        (res: any) => {
          if (res) {
            this.companyList = res;
          }
          
        },
        (error) => {}
      );
  }

  selectCompany(event) {
    let data = this.companyList.find((x) => x.sgid == event.target.value);

    this.quoteInfoForm.patchValue({
      companyName: data?.company
    });
    this.getProjectListMD(event.target.value);
    this.segementCompany(event.target.value)
  }
  getSegment(){
    this.quoteService.getSegment().subscribe((res:any)=>{
      if(res){
        this.segmentList=res?.result
      }
    })
  }
  segementCompany(id){
    this.spinner.show()
    this.quoteService.segementCompany({company_id:id}).subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        this.quoteInfoForm.patchValue({
          segment_type_id: res?.result?.sgid ? res?.result?.sgid:''
        });
      }
      
    })
  }
  selectSegment(event){
    let data = this.segmentList.find((x) => x.sgid == event.target.value);
    this.quoteInfoForm.patchValue({
      segment_type_id: data?.sgid,
    });
  }
  getProjectListMD(compid: any) {
    this.spinner.show();
    this.cMbService.getProjectListMD(compid).subscribe((res) => {
      this.spinner.hide();
      if (res == "No Data Found") {
        this.projectList = [];
        
      } else {
        this.projectList = res;
      }
    });
  }
  createPopup(type,title,size){
    const modalRef = this.modalService.open(DialogBoxComponent, {
      size: size,
      backdrop: "static",
      centered: true,
    });
    let companyData = {
      title:title,
      dialogType: type,
      segmentData:this.segmentList,
      orderData:this.orderInfo,
      company_id: this.quoteInfoForm.value.company_id
    };
    modalRef.componentInstance.companyInData = companyData;
    modalRef.componentInstance.companyOpData.subscribe((res:any)=>{
      modalRef.componentInstance.activeModal.close();
      if(res?.type=='company'){
        this.getCompanyList();
        this.quoteInfoForm.patchValue({
          company_id:res?.data?.sgid,
          companyName:res?.data?.company_name
        });
        this.getProjectListMD(res?.data?.sgid);
        this.segementCompany(res?.data?.sgid)
      }
      if(res?.type=='project'){
        this.getProjectListMD(res?.data?.company_id);
        this.quoteInfoForm.patchValue({
          project_id:res?.data?.sgid,
          project_name:res?.data?.project_name,
        });
      }
    })
  }

  selectProject(event: any) {
    let data = this.projectList.find((x) => x.sgid == event.target.value);
    
    this.quoteInfoForm.patchValue({
      project_name: data?.project,
    });
    
  }

  isZipCodeValid(data) {
   
    return this.sharedservice.validateZipCode(data).toPromise();
  }
  async zipCodeValid() {
    this.spinner.show()
    if (this.quoteInfoForm.value.zipcode) {
      let data = {
          city_name: this.quoteInfoForm.value.city,
          state_id: this.quoteInfoForm.value.state,
          zipcode: this.quoteInfoForm.value.zipcode,
      };
      try {

          let status = await this.isZipCodeValid(data);
          if (!status) {
              this.toastr.warning("Invalid Shipping Zipcode");
              this.spinner.hide()
              this.quoteInfoForm.controls['zipcode'].setErrors({ 'invalidZipcode': true });
          } else {
               this.spinner.hide()
               this.toastr.success("Shipping zipcode has been successfully validated");
              this.quoteInfoForm.controls['zipcode'].setErrors(null);
          }
      } catch (error) {
          console.error("Zip code validation error:", error);
          this.toastr.error("Error validating zip code");
      }
  }
}
async billingZipCodeValid() {
  this.spinner.show()
  if (this.quoteInfoForm.value.billing_zip_code) {
      let data = {
          city_name: this.quoteInfoForm.value.billing_city,
          state_id: this.quoteInfoForm.value.billing_state,
          zipcode: this.quoteInfoForm.value.billing_zip_code,
      };
      try {
          let status = await this.isZipCodeValid(data);
          if (!status) {
              this.toastr.warning("Invalid Billing Zipcode");
              this.spinner.hide()
              this.quoteInfoForm.controls['billing_zip_code'].setErrors({ 'invalidZipcode': true });
          } else {
              this.spinner.hide()
              this.toastr.success("Billing zipcode has been successfully validated");
              this.quoteInfoForm.controls['billing_zip_code'].setErrors(null);
          }
      } catch (error) {
          console.error("Billing zip code validation error:", error);
          this.toastr.error("Error validating billing zip code");
      }
  }
}
   submit() {
    if(this.quote?.type !=='copy')this.isSubmitted = true;
     
    if (this.quoteInfoForm.valid) {
     
      let userId = this.auth.getProfileInfo("userId");
      let form = this.quoteInfoForm.value;
      let projectTypeLable = "";
      if (form?.quote_button_type) {
        let data = this.projectType.find(
          (x) => x.sgid == form?.quote_button_type
        );
        projectTypeLable = data?.name;
      }
      form.quote_button_type_value = projectTypeLable;
      form.userid = userId;
      form.state = Number(form.state);
      form.billing_state = Number(form.billing_state);
      console.log(form)
      
      this.spinner.show();
      if(this.quote?.type!=='edit' && this.quote?.type!=='copy'){
        this.quoteService.createCustomerInformation(this.quoteInfoForm.value).subscribe(
          (resp:any) => {
            this.spinner.hide();
            if (resp?.statusCode==200) {
              if(this.productType !=='productDetails'){
                this.toastr.success("Quote created successfully");
                this.router.navigate(["/admin/quote/list", "my"]);
              }
              if(this.productType =='productDetails'){
                this.toastr.success("Quote created successfully");
                this.router.navigate([`/admin/products/view/${this.prod_id}`],{queryParams:{skuid:this.skuVariationId,type:'quote'}});
              }
            }
            if (resp?.statusCode === 502) {
              this.toastr.error(resp.result);
              this.spinner.hide();
            }
          },
          (error) => {}
        );
      }
      if(this.quote?.type=='edit'){
        let form = this.quoteInfoForm.value
        form['city_name'] = form.city
        form['city'] = null
        let obj={
          quote_id:Number(this.quote.id)
        }
        this.quoteService.udpateCustomerInformation({...form,...obj}).subscribe((res:any)=>{
          this.spinner.hide();
          if(res){
            this.toastr.success('Customer information updated successfully.');
            this.router.navigate(["/admin/quote/view/"+[this.quote.id],]);
          }
        })
      }
      if(this.quote?.type=='copy'){
        let form = this.quoteInfoForm.value
        form['city_name'] = form.city
        form['city'] = null
        let obj={
          quote_id:Number(this.quote.id),
          action:"copy"
        }
        this.quoteService.copyQuote({...form,...obj}).subscribe((res:any)=>{
          if(res){
            this.toastr.success('Quote created successfully');
            this.router.navigate(['/admin/quote/list', 'my']);
          }
        })
      }

        
    } else {
      this.spinner.hide();
      this.toastr.warning("All fileds are mondotry");
    }
  }
  cancleMethod() {
    
    if(this.quote.type=='edit' || this.quote.type=='copy'){
      this.router.navigate(["/admin/quote/view/"+[this.quote.id],]);
    }
    else{
      this.router.navigate(["/admin/quote/list", "all"]);
    }
  }
  numberValidation(event) {
    
    if (event.target.value > 36) {
      this.toastr.error("Rent Duration below 36 months only");
    }
  }
  
  dateMethod(type:string,event){
    if(type=='first'){
      this.disableDate = event.target.value;
      this.quoteInfoForm.patchValue({
        preferred_delivery_end_date: '',
      });
      
    }
    if(type=='second'){
      // this.today = event.target.value
      
    }
  }
  
  billingAddress(event){
   
    if(event.target.checked==true){
      this.is_checked=true;
      this.quoteInfoForm.patchValue({
        billing_address: this.quoteInfoForm?.value?.address,
        billing_city: this.quoteInfoForm?.value?.city,
        billing_state: this.quoteInfoForm?.value?.state,
        billing_zip_code: this.quoteInfoForm?.value?.zipcode
      })
    }
    else if(event.target.checked==false){
      this.is_checked=false;
      this.quoteInfoForm.patchValue({
        billing_address: '',
        billing_city: '',
        billing_state: '',
        billing_zip_code:''
      })
    }
  }
  copyOpt(type){
    
    if(type=='shipping'){
      if(this.quoteInfoForm?.value?.address 
        && this.quoteInfoForm?.value?.state && 
        this.quoteInfoForm?.value?.city && 
        this.quoteInfoForm?.value?.zipcode){
          this.is_billing_address=false;
          this.zipCodeValid()
          if( this.is_checked==true){
            this.quoteInfoForm.patchValue({
              billing_address: this.quoteInfoForm?.value?.address,
              billing_city: this.quoteInfoForm?.value?.city,
              billing_state: this.quoteInfoForm?.value?.state,
              billing_zip_code: this.quoteInfoForm?.value?.zipcode
            })
          }
        }
        else{
          this.is_billing_address=true;
        }
    }
    else if(type=='billing'){
      if(this.quoteInfoForm?.value?.billing_address 
        && this.quoteInfoForm?.value?.billing_state && 
        this.quoteInfoForm?.value?.billing_city && 
        this.quoteInfoForm?.value?.billing_zip_code){
          this.billingZipCodeValid()
        }
    }
  }
}
