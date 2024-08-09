import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { QuoteService } from "src/app/services/quote.service";
@Component({
  selector: "app-dialog-box",
  templateUrl: "./dialog-box.component.html",
  styleUrls: ["./dialog-box.component.css"],
})
export class DialogBoxComponent implements OnInit {
  @Input() quoteMbInData:any
  @Output() quoteMbOpData:EventEmitter<any> = new EventEmitter();
  @Input() floorPlanInData:any;
  @Output() floorPlanOpData:EventEmitter<any> = new EventEmitter();
  @Input() unitsInData:any;
  @Output() unitsOpData:EventEmitter<any> = new EventEmitter();
  @Input() moodInData:any;
  @Output() moodOpData:EventEmitter<any> = new EventEmitter();
  @Input() floorUnitsInData:any;
  @Output() floorUnitsOpData:EventEmitter<any> = new EventEmitter();
  @Input() deliveryFeeInData:any;
  @Output() deliveryFeeOpData:EventEmitter<any> = new EventEmitter();
  @Input() amountInData:any;
  @Output() amountOpData:EventEmitter<any> = new EventEmitter();
  @Input() freightInData:any;
  @Output() freightOpData:EventEmitter<any> = new EventEmitter();
  @Input() otherServiceInData:any;
  @Output() otherServiceOpData:EventEmitter<any> = new EventEmitter();
  @Input() companyInData:any;
  @Output() companyOpData:EventEmitter<any> = new EventEmitter();
  @Input() advanceAmountInData:any;
  @Output() advanceAmountOpData:EventEmitter<any> = new EventEmitter();
  @Input() flooramountInData:any;
  @Output() flooramountOpData:EventEmitter<any> = new EventEmitter();
  floorForm: any;
  unitForm: any;
  mbData: any;
  floorUnitForm: any;
  deliveryFeeShow: any;
  quoteDeliveryFee:any;
  quotePickupFee:any;
  servicesForm: any;
  services: any;
  companyForm: any;
  projectForm: any;
  projected_revenue: any=0;
  budgeted_cost: any=0;
  advanceAmountForm:FormGroup;
  intallmentMemoObj:any;
  intallmentAmtObj:any;
  weekDaysMap = new Map([
    [1, 'First'],
    [2, 'Second'],
    [3, 'Third'],
    [4, 'Fourth'],
    [5, 'Fifth'],
    [6, 'Sixth']
  ]);
  total_due: any=0;
  total_after_tax_due:any=0;
  rent_value: any;
  taxable_amount:any;
  non_taxable_amount:any;
  constructor(
    public activeModal: NgbActiveModal,
    private _sanitizer: DomSanitizer,
    private quoteService: QuoteService,
    private spinner: NgxSpinnerService,
    private fb:FormBuilder,
    private ls: LocalStorageService,
    private toastr: ToastrService,
  ) {
    this.ls.getFromLocal().userId
    this.floorForm = this.fb.group({
      floorplan_name:['',Validators.required],
      floorplan_type_id:['',Validators.required],
      units:['',Validators.required]
    })
    this.unitForm = this.fb.group({
      unit:['',Validators.required]
    });
    this.floorUnitForm = this.fb.group({
      unit:['',Validators.required]
    });
    this.services =   this.fb.array([])
    this.servicesForm = this.fb.group({
      services:this.services
    })
    this.companyForm = this.fb.group({
      company_name:['',Validators.required],
      segment_type_id:['',Validators.required],
      user_id:[this.ls.getFromLocal().userId,Validators.required]
    })
    this.advanceAmountForm = this.fb.group({
      installment_datas: this.fb.array([])
    })
  }
  ngOnInit(): void {
    if(this.floorPlanInData?.editInfo){
      this.floorForm.patchValue({
        floorplan_name:this.floorPlanInData?.editInfo?.floorname,
        floorplan_type_id:this.floorPlanInData?.editInfo?.floorplan_type_id,
        units:this.floorPlanInData?.editInfo?.total_unit
      });
      this.floorForm.get('units').disable()
    }
    if(this.unitsInData?.res){
      this.unitForm.patchValue({
        unit:this.unitsInData?.res?.name
      })
    }
    if(this.moodInData?.res){
      this.mbData = this.moodInData?.res[0];
      if(this.moodInData?.type=='floor'){
        this.moodInData?.units?.forEach((x:any)=>{
          x.selected = true
        })
      }
    }
    if(this.amountInData?.rent_value){
      this.amountInData.data.rent_adjustment_value =this.amountInData?.rent_value
    }
    if(this.otherServiceInData?.data?.length){
      for(let item of this.otherServiceInData?.data){
        this.createServiceFormGroup(item)
      }
    } else {
      this.createServiceFormGroup()
    }
    this.projectForm = this.fb.group({
      sgid:[''],
      company_id:[this.companyInData?.company_id,Validators.required],
      user_id:[this.ls.getFromLocal().userId,Validators.required],
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
    if (this.advanceAmountInData) {
      for (let i = 1; i <= 6; i++) {
        let item = this.advanceAmountInData? this.advanceAmountInData?.res.find((x) => Number(x.installment_number) == i): "";
        let obj = {
          invoice_description: item ? item?.invoice_description : '',
          installment_number: item ? item.installment_number : i,
          installment_value: item ? item.installment_value : "0",
        };
        this.installmentform(obj);
      }
    }
  }
  get installmentDates(){
    return this.advanceAmountForm.controls['installment_datas'] as FormArray
  }
  installmentform(data){
    const installment_datas = this.fb.group({
      invoice_description:[data?.invoice_description],
      installment_number:[data.installment_number],
      installment_value: [data.installment_value],
    })
    this.installmentDates.push(installment_datas)
    this.calulation()
  }
  createServiceFormGroup(item?){
    const serviceForm = this.fb.group({
      sgid:[item?.sgid || ''],
      service_name: [item?.service_name || '',Validators.required],
      service_value: [item?.service_value || '',Validators.required],
    })
    this.services.push(serviceForm);
    
  }
 
  removeFloorMb(data){
    this.quoteMbOpData.emit(data);
  }
  addFloorPlan(data:any){
    if(this.floorForm.valid && data=='add'){
      this.floorPlanOpData.emit({...this.floorForm.value,...{type:data}})
    }
    if(this.floorForm.valid && data=='update'){
      this.floorPlanOpData.emit({...this.floorForm.value,...{type:data}})
    }
  }
  addUnits(type){
    if(type=='add')this.unitsOpData.emit(this.unitForm.value);
    if(type=='update'){
      this.unitsOpData.emit(this.unitForm.value.unit)
    }
    
  }
  selectMb(data){
    this.mbData = data
  }
  isAllUnit(type){
    if (type=='1') {
      this.moodInData?.units.forEach(elem => {
        elem.selected = true;

      });
    } if (type=='0') {
      this.moodInData?.units.forEach(elem => {
        elem.selected = false;
      });
    }
  }
  addFloorUnits(){
    let obj={
      floorplan_id:this.floorUnitsInData?.unit?.floorplan_id,
      quote_id:this.floorUnitsInData?.unit?.quote_id
    }
    this.floorUnitsOpData.emit({...this.floorUnitForm.value,...obj})
  }
  selectUnit(data){
    data.selected =!data?.selected
  }
  addMoodboard(){
    if (this.moodInData?.type == 'floor') {
      let floorId = this.moodInData?.units[0]
      let data = []
      this.moodInData?.units.map(x => {
        if (x.selected == true) {
          data.push(x.sgid)
        }
      })
      let obj = {
        floorplan_id: floorId?.floorplan_id,
        moodboard_id: this.mbData?.sgid,
        quote_id: floorId?.quote_id,
        units: data
      }
      this.moodOpData.emit(obj)
    }
    if (this.moodInData?.type == 'unit'){
      this.moodOpData.emit(this.mbData?.sgid)
    }
  }
  deliveryFee(data){
    this.deliveryFeeShow = data;
    this.quoteDeliveryFee='';
  }
  updateDeliveryFee(type){
    let obj
    if(type=='unit_level'){
      obj={
        "fee_type": "delivery",
        "fee": this.quoteDeliveryFee.toFixed(2),
        "quote_id": this.deliveryFeeInData?.delivery_fee?.quote?.sgid,
        "update_on":this.deliveryFeeShow
      }
    }
    if(type=='order_level'){
      obj={
        "fee_type": "delivery",
        "order_delivery_fee": this.quoteDeliveryFee.toFixed(2),
        "quote_id": this.deliveryFeeInData?.delivery_fee?.quote?.sgid,
        "update_on":this.deliveryFeeShow
      }
    }
    this.deliveryFeeOpData.emit({data:obj,type:this.deliveryFeeInData?.dialogType})
  }
  updatePickupFee(){
    let obj={
      "fee_type": "pickup",
      "fee": this.quotePickupFee.toFixed(2),
      "quote_id": this.deliveryFeeInData?.delivery_fee?.quote?.sgid
    }
    this.deliveryFeeOpData.emit({data:obj,type:this.deliveryFeeInData?.dialogType})
  }
  itemRentchange(type:any){
    if(type=='+'){
      this.amountInData.data.rent_adjustment_type = '1'
    }
    if(type=='-'){
      this.amountInData.data.rent_adjustment_type = '0'
    }
}
itemDiscount(event,type){
  if(type=='buy_discount_amount'){
    const parsedValue = parseFloat(event.target.value);
    this.amountInData.data.buy_discount = Math.round(parsedValue * 100) / 100;
  }
  if(type=='rent_adjument_amount'){
    const parsedValue = parseFloat(event.target.value);
    this.amountInData.data.rent_adjustment_value = Math.round(parsedValue * 100) / 100;
  }
}
submitAdjustAmount(){
  this.amountOpData.emit(this.amountInData)
}

//  amountAdjustPopup

floorItemRentchange(type:any){
  if(type=='+'){
   this.flooramountInData.data.indv_unit.rent_adjustment_type = '1';
  
  }
  if(type=='-'){
    this.flooramountInData.data.indv_unit.rent_adjustment_type = '0';
  
  }
this.flooramountInData.data.indv_unit.rent_adjustment_value = this.rent_value ? this.rent_value: this.flooramountInData?.data?.rent_adjument_value

}
floorItemDiscount(event,type){
  if(type=='buy_discount_amount')this.flooramountInData.data.indv_unit.buy_discount = event?.target.value;
  if(type=='rent_adjument_amount'){
    this.flooramountInData.data.indv_unit.rent_adjustment_value = event.target.value;
    this.rent_value = event.target.value

  }
}

submitFloorAdjustAmount(){
  this.flooramountOpData.emit(this.flooramountInData)
}
nonTaxCharges(event,type){
  const parsedValue = parseFloat(event.target.value);
  if(type=='freight_charges'){
   
    this.freightInData.data.freight_charges = Math.round(parsedValue * 100) / 100;
  }
  if(type=='other_services'){
    this.freightInData.data.other_services=Math.round(parsedValue * 100) / 100;
  }
}

taxSubmit(){
  this.freightOpData.emit(this.freightInData)
}

addServices(){
  const serviceForm = this.fb.group({
    sgid:[''],
    service_name: ['',Validators.required],
    service_value: ['',Validators.required],
  })
  this.services.push(serviceForm)
}
submitServiceForm(){
  let services = this.servicesForm.value.services
  for(let service of services){
    service.service_value = parseFloat(service.service_value).toFixed(2)
  }
  this.otherServiceOpData.emit({services})
}
removeIndex(data,index){
  if(data?.value.sgid){
    this.otherServiceOpData.emit({result:data,i:index,type:'delete'})
  }
  else{
    this.services.removeAt(index)
  }
}
sumbitCompany(){
  
  this.spinner.show()
  this.quoteService.createCompany(this.companyForm.value).subscribe((res:any)=>{
    this.spinner.hide()
    if(res){
      this.toastr.success(res?.message);
      this.companyOpData.emit({data:res?.result,type:this.companyInData?.dialogType})
    }
  })
}
sumbitProject(){
  
  this.spinner.show()
  this.quoteService.createUpdateProject(this.projectForm.value).subscribe((res:any)=>{
    this.spinner.hide();
    if(res){
      this.toastr.success(res?.message);
      this.companyOpData.emit({data:res?.result,type:this.companyInData?.dialogType})
    }
  })
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
paymentType(type){
  if(type=='Percentage'){
    this.advanceAmountInData.installment_type='Percentage';
    
    if(this.intallmentMemoObj){
      let values = this.intallmentMemoObj
      this.installmentDates.patchValue(values)
    } else {
      this.intallmentAmtObj = JSON.parse(JSON.stringify(this.installmentDates.value))
      this.resetInstallmentAmount()
    }
  } else if(type=='Amount'){
   
    this.advanceAmountInData.installment_type='Amount';
    if(this.intallmentAmtObj){
      let values = this.intallmentAmtObj
      this.installmentDates.patchValue(values)
    } else {
      this.intallmentMemoObj = JSON.parse(JSON.stringify(this.installmentDates.value))
      this.resetInstallmentAmount()
    }
  }
  this.total_due=0;
  this.total_after_tax_due=0;
  this.calulation()
}
advanceType(type,event){
  
  if(type=='Percentage'){
    if(event?.target.value >=0 && event?.target.value <=100 ){
      this.calulation()
    }
    else{
      this.toastr.error('Percentage value beteween 0 to 100');
      console.log(this.installmentDates)
      let values = this.installmentDates.value.map(x=>{
        
        if(x.installment_value>100 || x.installment_value<0){
          x.installment_value = 0
        }
        return x
      });
      this.installmentDates.patchValue(values)
    }
  }
  if(type=='Amount'){
    if(event?.target.value <=0){
      this.toastr.error('Please Enter valid number');
      let values = this.installmentDates.value.map(x=>{
        
        if(x.installment_value<0){
          x.installment_value = 0
        }
        return x
      });
      this.installmentDates.patchValue(values)
    }
    this.calulation()
  }
  
}
calulation(){
  
  if(this.advanceAmountInData?.installment_type=='Percentage' && this.advanceAmountInData?.dialogType=='item'){
    this.total_due = this.advanceAmountForm.value.installment_datas.map(x=>((x.installment_value* this.advanceAmountInData.tax_befor_order_amt)/100)).reduce((a,b)=>Number(a)+Number(b),0);
    if(this.advanceAmountInData?.delivery_nonTax==0){
      this.total_after_tax_due = 0;
    }
    else{
      this.total_after_tax_due = (this.total_due*this.advanceAmountInData?.data?.tax_percentage)/100;
    }
    
  }
  
  else if(this.advanceAmountInData?.installment_type=='Amount' && this.advanceAmountInData?.dialogType=='item'){
    this.total_due = this.advanceAmountForm.value.installment_datas.map(x=>x.installment_value).reduce((a,b)=>Number(a)+Number(b),0);
    if(this.advanceAmountInData?.is_tax_exempt==1){
      this.total_after_tax_due = 0;
    }
    else{
      this.total_after_tax_due = (this.total_due*this.advanceAmountInData?.data?.tax_percentage)/100;
    }
    
  }
  else if(this.advanceAmountInData?.installment_type=='Percentage' && this.advanceAmountInData?.dialogType=='service'){
    this.total_due = this.advanceAmountForm.value.installment_datas.map(x=>((x.installment_value* this.advanceAmountInData.service_before_amt)/100)).reduce((a,b)=>Number(a)+Number(b),0)
    if(this.advanceAmountInData?.delivery_nonTax==0){
      this.total_after_tax_due = 0;
    }
    else{
      this.total_after_tax_due = (this.total_due*this.advanceAmountInData?.data?.tax_percentage)/100;
    }
   
    console.log(this.total_after_tax_due)
  }
  else if(this.advanceAmountInData?.installment_type=='Amount' && this.advanceAmountInData?.dialogType=='service'){
    this.total_due = this.advanceAmountForm.value.installment_datas.map(x=>x.installment_value).reduce((a,b)=>Number(a)+Number(b),0);
    if(this.advanceAmountInData?.is_tax_exempt==1){
      this.total_after_tax_due = 0;
    }
    else{
      this.total_after_tax_due = (this.total_due*this.advanceAmountInData?.data?.tax_percentage)/100;
    }
    
  }
}
 resetInstallmentAmount(){
  let values = this.installmentDates.value.map(x=>{
    x.installment_value = 0,
    x.invoice_description=''
    return x
  });
  this.installmentDates.patchValue(values)
 }
submitAdvanceForm(){
  let obj={
    quote_id:this.advanceAmountInData?.data?.sgid,
    installment_type:this.advanceAmountInData?.installment_type,
    order_type:this.advanceAmountInData?.order_type,
    quote_order_amount:this.advanceAmountInData.button_type=='0' ? this.advanceAmountInData?.data?.total_rent_order_amount_after_taxes : this.advanceAmountInData?.data?.total_buy_order_amount_after_taxes,
    installment_datas:this.advanceAmountForm.value?.installment_datas
  }
  if(this.advanceAmountInData?.dialogType=='item'){
    obj['quote_order_amount'] = this.advanceAmountInData.button_type=='0' ? this.advanceAmountInData?.data?.total_rent_order_amount_after_taxes : this.advanceAmountInData?.data?.total_buy_order_amount_after_taxes
  }
  if(this.advanceAmountInData?.dialogType=='service'){
    obj['quote_order_amount'] = this.advanceAmountInData.data.total_services_order_amount
  }
  this.advanceAmountOpData.emit(obj)
}
setTwoNumberDecimal(data){
  return parseFloat(data).toFixed(2);
}
onInput(event) {
  const parsedValue = parseFloat(event.target.value);
    this.amountInData.data.buy_discount = Math.round(parsedValue * 100) / 100;

}
}