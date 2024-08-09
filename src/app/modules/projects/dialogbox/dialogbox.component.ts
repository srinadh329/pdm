/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
  NgbModalRef,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { QuoteService } from 'src/app/services/quote.service';
import { ProjectService } from 'src/app/services/project.service';
@Component({
  selector: "app-dialogbox",
  templateUrl: "./dialogbox.component.html",
  styleUrls: ["./dialogbox.component.css"],
})
export class DialogboxComponent implements OnInit {
@Input()projectEditInData:any
@Output() projectEditOpData:EventEmitter<any> = new EventEmitter();
  projectForm: any;
  projected_revenue: number;
  budgeted_cost: number;
  company: any;
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private ls: LocalStorageService,
    private quoteService: QuoteService,
  ) {
    this.projectForm = this.fb.group({
      sgid:['',],
      company_id:['',Validators.required],
      company_name:['',Validators.required],
      user_id:['',Validators.required],
      project_name:['',Validators.required],
      project_type:['',Validators.required],
      product_tariff_projected_revenue:[''],
      product_tariff_budgeted_cost:[''],
      freight_projected_revenue:[''],
      freight_budgeted_cost:[''],
      delivery_install_budgeted_cost:[''],
      delivery_install_projected_revenue:[''],
      sales_tax_projected_revenue:[''],
      sales_tax_budgeted_cost:[''],
      other_services_projected_revenue:[''],
      other_services_budgeted_cost:[''],
      
    })
  }

  ngOnInit(): void {
    
    if(this.projectEditInData?.type=='edit'){
      // this.projectForm.controls['project_name'].disable();
      
      let data = JSON.parse(JSON.stringify(this.projectEditInData))
      data.res.project_name = data.res.project_name +' ' +'-'+ ' '+data.res.ops_project_id
      this.projectForm.patchValue(data?.res);
      this.count()
    }
    if(this.projectEditInData?.type=='create'){
      this.projectForm.patchValue({
        user_id:this.projectEditInData?.user_id
      })
    }
  }

  count(){
    let form = this.projectForm.value;
    
    this.projected_revenue = Number(form.product_tariff_projected_revenue)+ Number(form.freight_projected_revenue)
    +Number(form.delivery_install_projected_revenue) + Number(form.sales_tax_projected_revenue) 
    + Number(form.other_services_projected_revenue)
  
    this.budgeted_cost = Number(form.product_tariff_budgeted_cost)+ Number(form.freight_budgeted_cost)
    +Number(form.delivery_install_budgeted_cost) + Number(form.sales_tax_budgeted_cost) 
    + Number(form.other_services_budgeted_cost)
  }
  sumbitProject(){
    
    this.spinner.show()
    this.quoteService.createUpdateProject(this.projectForm.value).subscribe((res:any)=>{
      this.spinner.hide();
      
      if(res){
        this.toastr.success(res?.message);
        this.projectEditOpData.emit(true)
      }
    },error=>{
      this.spinner.hide()
    })
  }
  selectCompany(data){
    
    if(data){
      this.company=data;
      this.projectForm.patchValue({
        company_name:data?.company,
        company_id:data?.sgid
      })
    }
  }
}
