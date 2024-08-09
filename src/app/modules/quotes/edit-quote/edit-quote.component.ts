import { Component} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuoteService } from 'src/app/services/quote.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from 'src/app/services/items.service';
import { SharedService } from 'src/app/services/shared.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { PdfGenerationService } from './pdf-generation.service';
@Component({
  selector: 'app-edit-quote',
  templateUrl: './edit-quote.component.html',
  styleUrls: ['./edit-quote.component.css'],

})
export class EditQuoteComponent  {
  quoteId: any;
  quoteInfo:any={
    item_type:'',
    quote:'',
    quote_items:'',
    rent_adjument_value:'',
    is_show:false,
  }
  floorInfo:any={
    floorPlan:[],
    is_show:'remove'
  }
  unitsInfo:any={
    units:[],
    is_show:'remove'
  }
  
  floorSummaryInfo:any={
    is_show:false,
    floorData:''
  }
  unitSummaryInfo:any={
    unitData:'',
    is_show:false
  }
  userId: any;
  tabInfo: any='floor';
  addUnitFloorPlanForm: any;
  button_type: any;
  show_delete: any='cancel';
  monthNums:any='12';
  quotePublic:any;
  currentPage: string;
  quotePublicToBus = false;

  constructor(
    private spinner: NgxSpinnerService,
    private quoteService: QuoteService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private aroute: ActivatedRoute,
    private modalService: NgbModal,
    private route: Router,
    private item: ItemsService,
    private fb:FormBuilder,
    private pdfservice: PdfGenerationService,
    private mds:CreateMoodboardService
  ) {
    this.quoteId = this.aroute.snapshot.params.id;
    let Userdetails = this.ls.getFromLocal();
    this.userId = Userdetails.userId
    if(this.quoteId){
      this.getquotation(this.quoteId)
      this.getFloorPlanDetails(this.quoteId)
    }
    this.addUnitFloorPlanForm = this.fb.group({
      floorplan_id:['',Validators.required]
    }) 
    this.currentPage = this.route.url;
  }

  // ngOnInit(): void {
  // }

  tabView(type:string){
    this.tabInfo = type
    if(type=='units'){
      this.getquotation(this.quoteId)
      this.getUnits();
    }
    if(type=='floor'){
      this.getquotation(this.quoteId)
      this.getFloorPlanDetails(this.quoteId)
    }
  }

  edit(data){
    if(data=='projectedit'){
      window.open(`/admin/projects/list?id=${this.quoteInfo?.quote?.project_id}&type=${data}`,'_blank')
    }
    else{
      this.route.navigate(['/admin/quote/create'],{queryParams:{id:this.quoteId,type:data}})
    }
    
  }

  // floor crud operations start

    // get quote details
    getquotation(id:any){
      this.spinner.show();
      this.quoteService.getQuotationDetails(id).subscribe( (res:any)=>{
        this.spinner.hide()
        res.quote['rent_after_adjustment_value'] = parseFloat(res?.quote?.monthly_rent) + parseFloat(res?.quote?.rent_adjustment_value)
        if(res.quote?.order_status=='3'||res.quote?.order_status=='4'
        ||res.quote?.order_status=='5'|| res.quote?.order_status=='6'){
          res.quote['is_disable']=true
        }
        if(res.statusCode==200){
        
          this.quoteInfo={
            item_type:res?.item_types,
            quote:res?.quote,
            quote_items:res?.quote_items,
            is_show:true,
            rent_adjument_value:res?.quote?.rent_adjustment_value,
          }
         
        }
        this.button_type = res?.quote_items[0]?.button_type;
        this.monthNums = res?.quote_items[0]?.months;
        this.quotePublicToBus = res?.quote?.publish_to_business == 0 ? false : true;
        this.quoteInfo.quote.rent_adjustment_type =null;
        this.quoteInfo.quote.rent_adjustment_value=0;
        
        this.floorSummaryInfo.is_show =false;
        if (res?.quote.is_publish == 1) {
          this.quotePublic = true;
        } else {
          this.quotePublic = false;
        }
        
        this.loadImages()
      },error=>{
        this.spinner.hide()
      })
    }

    async loadImages(){
      let items = this.quoteInfo.quote_items
          for(let item of items){
            
            let base64:any =  await this.mds.getImageUrl(item.product_images.small).toPromise()
              if(base64){
                item['b64img'] = 'data:image/jpeg;base64,' + base64.imageurl;
              }
          }
          this.quoteInfo.quote_items = items;
    }
  // get quote details end

    // get floorplan details
    getFloorPlanDetails(id:any){
      this.spinner.show();
      this.quoteService.getFloorPlanDetails(id).subscribe((res:any)=>{
        this.spinner.hide()
        if(res.statusCode==200){
          this.floorInfo={
            floorPlan:res?.result,
            is_show:'remove'
          }
        }
      },error=>{
        this.spinner.hide()
      })
    }
    // get floorplan details end
    // add floor plan
    addFloor(data){
      
      if(data){
        const obj = {
          quote_id: data.quote_id,
          floorplan_name: data.floorname,
          floorplan_type_id: data.floorplan_type_id,
          units: data.total_unit,
          userid: data.userid

        };
        this.spinner.show()
        
        this.quoteService.addFloorPlan(obj).subscribe((res:any)=>{
          this.spinner.hide()
          if(res?.statusCode==200){
            this.toastr.success(res?.message);
            if(res){
              this.getFloorPlanDetails(data.quote_id)
            }
          }
        },error=>{
          this.spinner.hide()
        })
      }
    } 
    // add floor plan end

     // add floor plan
   addFloorDialog(editInfo?){
    this.spinner.show()
    this.quoteService.getFloorTypes().subscribe(res => {
      this.spinner.hide()
      if (res.statusCode === 200) {
        const modalRef = this.modalService.open(DialogBoxComponent, {
          size: "md",
          backdrop: "static",
          centered: true,
        });
        let floorPlan = {
          res: res?.result,
          dialogType: "add-floor-plan",
          title:'Add Floor Plans'
        };
        if(editInfo){
          floorPlan['editInfo']=editInfo;
          floorPlan['title']='Update Floor Plans'
        } 
        modalRef.componentInstance.floorPlanInData = floorPlan;
        modalRef.componentInstance.floorPlanOpData.subscribe((res)=>{
          if(res){
            
            this.spinner.show()
            res['quote_id'] = this.quoteId,
            res['userid'] = this.userId;
            modalRef.componentInstance.activeModal.close();
            if(res?.type=='add'){
              this.quoteService.addFloorPlan(res).subscribe((res:any)=>{
                this.spinner.hide()
                if(res?.statusCode==200){
                  this.toastr.success(res?.message)
                  this.getFloorPlanDetails(this.quoteId)
                }
              },error=>{this.spinner.hide()})
            }
            if(res?.type=='update'){
              res['sgid'] = editInfo?.sgid;
              delete res['type']
              this.quoteService.updateFloorplan(res).subscribe((res:any)=>{
                this.spinner.hide()
                if(res?.statusCode==200){
                  this.toastr.success(res?.message)
                  this.getFloorPlanDetails(this.quoteId)
                }
              },error=>{this.spinner.hide()})
            }
          }
        })
      }
    }, error => {
      this.spinner.hide()
    });
  }
  // add floor plan
   

    // edit floor plan
    editFloor(data){
      this.addFloorDialog(data)
    }

    // edit floor plan
    // remove floor plan
    removeFloor(data){
      this.conformationDialog(data,'removeFloor')
    }

    // remove floor plan


    // removeFloorButton
    removeFloorButton(data){
      this.floorInfo.is_show=data
    }

    // removeFloorButton


// floor crud operations

// units crud operations

    // get units
    getUnits() {
      this.spinner.show()
      this.quoteService.getUnitWithoutPlan(this.quoteId).subscribe(res => {
        this.spinner.hide()
        
        if(res?.statusCode==200){
          this.unitsInfo={
            units:res?.result,
            is_show:'remove'
          }
        }
      }, error => { this.spinner.hide()});
    }

    // get units

    // add units popup

      addUnitDialog(){
        const modalRef = this.modalService.open(DialogBoxComponent, {
          size: "md",
          backdrop: "static",
          centered: true,
        });
        let UnitData = {
          dialogType: "add-units",
          title:'Add Number of Units'
        };
        modalRef.componentInstance.unitsInData = UnitData;
        modalRef.componentInstance.unitsOpData.subscribe((res:any)=>{
          
          modalRef.componentInstance.activeModal.close();
          if(res){
            this.quoteService.addUnits(this.quoteId, res.unit).subscribe((res)=>{
              if(res){
                this.getUnits();
              }
            })
          }
        })
      }

    // add units popup

    

    // remove units plan

      removeUnitButton(data){
        this.unitsInfo.is_show=data
      }
    // remove units plan
    // remove units
      removeUnits(data){
        this.conformationDialog(data,'removeUnit')
      }

  // remove units
   
// units crud operations

    // unit details
    unitDetails(data){
      this.unitSummaryInfo.unitData = data;
      this.quoteInfo.is_show =false;
      this.floorSummaryInfo.is_show=false;
      this.unitSummaryInfo.is_show =true;
    }
   
    // unit details
    // floor summary details
    floorDetails(data:any){
      this.floorSummaryInfo.floorData=data;
      this.floorSummaryInfo.is_show=true
      this.quoteInfo.is_show =false
    }   
    updateRent(event:any){
      
      this.monthNums = event.target.value;
      let obj ={
        "quote_id":this.quoteId,
        "month":event.target.value
      }
      this.spinner.show()
      this.quoteService.rentUpdates(obj).subscribe((res:any)=>{
        this.spinner.hide()
        if(res){
          this.toastr.success(res?.result);
          this.getquotation(this.quoteId)
          this.getFloorPlanDetails(this.quoteId)
        }
      })
    }
      
    // floor summary details


  // conformation dialog
  conformationDialog(board,type) {
    const modalRef = this.modalService.open(DialogBoxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let quoteMbData = {
      res: board,
      dialogType: "moodboard-delete",
    };
    modalRef.componentInstance.quoteMbInData = quoteMbData;
    modalRef.componentInstance.quoteMbOpData.subscribe((res) => {
      if(res){
        modalRef.componentInstance.activeModal.close();
        if(type=='removeFloor'){
          this.spinner.show()
          this.quoteService.removeFloor(res.quote_id, res.sgid).subscribe((res:any)=>{
            this.spinner.hide();
            if(res?.statusCode==200){
              this.toastr.success(res?.message)
              this.getquotation(this.quoteId)
              this.getFloorPlanDetails(this.quoteId)
            }
          },error=>{this.spinner.hide()})
        }
        if(type=='removeUnit'){
          this.spinner.show()
          this.quoteService.removeUnits(res.quote_id, res.unit, res.sgid).subscribe((res:any)=>{
            this.spinner.hide();
            if(res?.statusCode==200){
              this.toastr.success(res?.message)
              this.getUnits()
            }
          },error=>{this.spinner.hide()})
        }
        if(type=='other_service_delete'){
          
          this.spinner.show()
          this.quoteService.deleteOtherService({quote_id:this.quoteId,other_service_id:res?.value?.sgid}).subscribe((res:any)=>{
            
            this.spinner.hide()
            if(res){
              this.toastr.success(res?.message);
              // this.servicePopup();
              this.getquotation(this.quoteId)
            }
          })
        } 
      }
    })
  }

  // conformation dialog


  // delivery fee popup
  editPopUp(type,popTitle){
    const modalRef = this.modalService.open(DialogBoxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let deliveryData = {
      title:popTitle,
      dialogType: type,
      delivery_fee:this.quoteInfo
    };
    modalRef.componentInstance.deliveryFeeInData = deliveryData;
    modalRef.componentInstance.deliveryFeeOpData.subscribe((res:any)=>{
      if(res){
        modalRef.componentInstance.activeModal.close();
        
        this.spinner.show()
        if(res?.type=='delivery-fee' || res?.type=='pickup-fee'){
          this.updateFee(res?.data)
        }
      }
    })
  }
   // delivery fee popup
   updateFee(data){
    this.quoteService.updateFee(data).subscribe((res:any)=>{
          
      if(res.statusCode==200){
        this.spinner.hide()
        this.toastr.success(res?.message);
        this.getquotation(this.quoteId)
      }
    },error=>{
      this.spinner.hide()
    })
   }

  //  amountAdjustPopup
  amountAdjustPopup(type,popTitle){
    const modalRef = this.modalService.open(DialogBoxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let amountData = {
      title:popTitle,
      dialogType: type,
      data:this.quoteInfo.quote,
      rent_value:this.quoteInfo.rent_adjument_value
    };
    modalRef.componentInstance.amountInData = amountData;
    modalRef.componentInstance.amountOpData.subscribe((res:any)=>{
      if(res){
        modalRef.componentInstance.activeModal.close();
        this.quoteDetails('save')
      }
    })
  }

  //  amountAdjustPopup


  // non tax popup
  taxPopup(type){
   
    const modalRef = this.modalService.open(DialogBoxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let taxData = {
      dialogType:type,
      data:this.quoteInfo.quote,
    };
    modalRef.componentInstance.freightInData=taxData;
    modalRef.componentInstance.freightOpData.subscribe((res:any)=>{
      
      if(res){
        modalRef.componentInstance.activeModal.close();
        this.quoteDetails('save')
      }
    })
  }
  // non tax popup

  // service popup
  servicePopup(){
    
    this.spinner.show()
    this.quoteService.getQuoteOtherServices({quote_id:this.quoteId}).subscribe((res:any)=>{
      this.spinner.hide()
      
      if(res?.result && res?.result){
        const modalRef = this.modalService.open(DialogBoxComponent, {
          size: "md",
          backdrop: "static",
          centered: true,
        });
        let serviceData = {
          dialogType:'other_services',
          data:res?.result,
          title:'Other Services',
          is_disable:this.quoteInfo.quote?.is_disable
        };
        
        modalRef.componentInstance.otherServiceInData=serviceData;
        modalRef.componentInstance.otherServiceOpData.subscribe((res:any)=>{
          if(res && res?.type !=='delete'){
            res['quote_id'] = this.quoteId;
            
            this.spinner.show()
            this.quoteService.updateOrCreateOtherServices(res).subscribe((resp:any)=>{
              this.spinner.hide()
              if(resp){
                modalRef.componentInstance.activeModal.close();
                this.toastr.success(resp?.message);
                this.getquotation(this.quoteId)
              }
            })
          }
          if(res?.type=='delete'){
            modalRef.componentInstance.activeModal.close();
            this.conformationDialog(res?.result,'other_service_delete')
          }
        })
      }
    })
  }

  // service popup

  // changeStatus
  changeStatus() {
    
    let status;
    if (this.quotePublic) {
      status = 1;
    } else {
      status = 0;
    }
    this.spinner.show()
    this.quoteService.updateQuoteStatus(this.quoteId, status).subscribe(resp => {
      this.spinner.hide()
      if (resp.statusCode === 200) {
        this.toastr.success(resp?.result)
        this.getquotation(this.quoteId)
      }
    }, error => {});
  }
  // changeStatus

  publicToBus() {
    
    this.quoteService.publishToBusinees({ quote_id: this.quoteId }).subscribe((data: any) => {
      this.toastr.success(data.message)
      this.quotePublicToBus = true;
    }, (error) => {
      this.toastr.warning(error.message)
    })
  }
  
  // save order

  order(type:any){
    this.quoteDetails(type)
  }
  quoteDetails(type){
    
   
    const postArr = [];
    this.quoteInfo.quote_items.forEach(elem => {
      const obj = {
        sgid: elem.sgid,
        quote_id: this.quoteId,
        id: this.quoteInfo.quote.sgid,
        old_month: elem.old_month,
        qty: elem.is_qty,
        percentage_discount: elem.percentage_discount,
        months: elem.months,
        price: elem.price,
        buy_price: elem.buy_price,
        sale_price: elem.price,
        apply_b2b_discount: elem.b2b_discount,
        total: elem.is_total,
        discount: elem.discount,
        delivery_fee: this.quoteInfo.quote.delivery_fee,
        pickup_fee: this.quoteInfo.quote.pickup_fee,
        tax: this.quoteInfo.quote.tax_amount,
        net_total: this.quoteInfo.quote.net_total,
        quote_discount: this.quoteInfo.quote.discount,
        quote_discount_price: this.quoteInfo.quote.discount_price,
        sub_total: this.quoteInfo.sub_total,
        monthly_rent: this.quoteInfo.quote.monthly_rent,
        rent_adjustment_value:this.quoteInfo.quote?.rent_adjustment_value,
        rent_adjustment_type: this.quoteInfo.quote?.rent_adjustment_type,
        buy_discount: this.quoteInfo.quote.buy_discount?? 0,
        buy_net_total: this.quoteInfo.quote.buy_net_total ?? 0,
        buy_sub_total: this.quoteInfo.quote.buy_sub_total ?? 0,
        rent_net_total: this.quoteInfo.quote.rent_net_total ?? 0,
        rent_sub_total: this.quoteInfo.quote.rent_sub_total ?? 0,
        rent_discount: this.quoteInfo.quote.rent_discount,
        is_delivery_fee_taxable:this.quoteInfo?.quote?.is_delivery_fee_taxable,
        is_freight_charges_taxable:this.quoteInfo?.quote?.is_freight_charges_taxable,
        is_other_services_taxable:this.quoteInfo?.quote?.is_other_services_taxable,
        freight_charges:this.quoteInfo.quote?.freight_charges,
        other_services:this.quoteInfo.quote?.other_services,
        is_tax_exempt:this.quoteInfo.quote?.is_tax_exempt
      };
      postArr.push(obj);
    });
    
    this.saveQuote(postArr,type)
  }
  saveQuote(data,type){
    this.spinner.show();
      this.quoteService.saveQuotes(data).subscribe((res:any)=>{
        if(type=='save'){
          if (res.statusCode == 201) {
            this.toastr.error('Adjustment amount can not be less than Monthly Rent ');
            }else{
              if(res?.quote.order_reference){
                this.toastr.success('Order saved successfully');
              }else{
                this.toastr.success('Quote saved successfully');
              }
            }
            
            this.getquotation(this.quoteId);
        }
        if(type=='create'){
          this.createQuote()
        }
      })
  }
  createQuote(){
    this.spinner.show()
    this.quoteService.orderCreate(this.quoteId).subscribe(resp => {
      this.spinner.hide();
      if (resp.statusCode === 200) {                  
      
       if(!this.currentPage.includes('quote/view')){
        this.toastr.success('Order updated succesfully.');
        }else{
          this.route.navigate([`/admin/quote/order/${this.quoteId}`])
          this.toastr.success('Order created succesfully.');
        }
        this.getquotation(this.quoteId)
      }
      if(resp.statusCode==502){
        this.toastr.error(resp?.result)
      }
    }, error => {
      this.spinner.hide();
    });
  }
  // save order
  // ppt generation
  generatePDF() {

    this.pdfservice.pdfGeneration();
  };

  // ppt generation
 // back to quote

 backToQuote(data){
  
  if(data){
    this.quoteInfo.is_show = true;
    this.floorSummaryInfo.is_show =false;
    this.unitSummaryInfo.is_show = false;
    if(this.tabInfo=='floor'){
      this.getquotation(this.quoteId)
      this.getFloorPlanDetails(this.quoteId)
    }
    if(this.tabInfo=='units'){
      this.getquotation(this.quoteId)
      this.getUnits();
    }
  }
  
}

// back to quote
// both floor unit table calculation
  itemCalulation(event,data,type){
    if(this.button_type=='0'){
      if(type=='price') data.price = event?.target.value;
      if(type=='discount') data.discount = event?.target.value;
      data.is_total= (Number(data?.price)- Number(data?.discount)) * Number(data?.is_qty);
    }
    if(this.button_type=='1'){
      if(type=='buy_price') data.buy_price = event?.target.value;
      if(type=='buy_discount') data.discount = event?.target.value;
      data.is_total= (Number(data?.buy_price)- Number(data?.discount)) * Number(data?.is_qty); 
    }
    this.totalAmountCal()
  }
  totalAmountCal(){
    if(this.button_type=='0'){
      this.quoteInfo.quote.monthly_rent= this.quoteInfo?.quote_items.reduce((int, item) => { return int + item.is_total }, 0);
      this.quoteInfo.quote.rent_after_adjustment_value = Number(this.quoteInfo.quote.monthly_rent) - Number(this.quoteInfo.quote.rent_adjustment_value);
      this.quoteInfo.quote.tax_amount = ((Number(this.quoteInfo.quote.rent_after_adjustment_value) + Number(this.quoteInfo?.quote?.delivery_fee))* Number(this.quoteInfo?.quote?.tax_percentage))/100;
      this.quoteInfo.quote.total = Number(this.quoteInfo.quote.rent_after_adjustment_value) + Number(this.quoteInfo.quote.tax_amount) + Number(this.quoteInfo?.quote?.delivery_fee)
    }
    if(this.button_type=='1'){
      this.quoteInfo.quote.buy_sub_total = this.quoteInfo?.quote_items.reduce((int, item) => { return int + item.is_total }, 0);
      this.quoteInfo.quote.buy_net_total = Number(this.quoteInfo.quote.buy_sub_total) - Number(this.quoteInfo.quote.buy_discount);
      this.quoteInfo.quote.tax_amount = ((Number(this.quoteInfo.quote.buy_net_total ) + Number(this.quoteInfo?.quote?.delivery_fee))* Number(this.quoteInfo?.quote?.tax_percentage))/100;
      this.quoteInfo.quote.total = Number(this.quoteInfo.quote.buy_net_total) + Number(this.quoteInfo.quote.tax_amount) + Number(this.quoteInfo?.quote?.delivery_fee)
    }
    
  }
  // both floor unit table calculation

  nonTaxable(type,event){
   
    if(type=='delivery' && event.target.checked==true){
      this.quoteInfo.quote.is_delivery_fee_taxable=0;
    }
    if(type=='delivery' && event.target.checked==false){
      this.quoteInfo.quote.is_delivery_fee_taxable=1;
    }
    if(type=='freight_charges' && event.target.checked==true){
      this.quoteInfo.quote.is_freight_charges_taxable=0;
    }
    if(type=='freight_charges' && event.target.checked==false){
      this.quoteInfo.quote.is_freight_charges_taxable=1;
    }
    if(type=='other_service' && event.target.checked==true){
      this.quoteInfo.quote.is_other_services_taxable=0;
    }
    if(type=='other_service' && event.target.checked==false){
      this.quoteInfo.quote.is_other_services_taxable=1;
    }
    this.quoteDetails('save')
  }
  taxExempt(event){
    if(event.target.checked==true){
      this.quoteInfo.quote.is_tax_exempt=1;
      this.quoteInfo.quote.is_delivery_fee_taxable=0;
      this.quoteInfo.quote.is_freight_charges_taxable=0;
      this.quoteInfo.quote.is_other_services_taxable=0;
    }
    if(event.target.checked==false){
      this.quoteInfo.quote.is_tax_exempt=0;
      this.quoteInfo.quote.is_delivery_fee_taxable=1;
      this.quoteInfo.quote.is_freight_charges_taxable=1;
      this.quoteInfo.quote.is_other_services_taxable=1;
    }
    this.quoteDetails('save')
  }
  advancePopUP(type,sub_type){
    this.getInstallment(type ,sub_type)
    
  }
  getInstallment(type:any,sub_type:any){
    this.spinner.show()
    this.quoteService.getInstallment({quote_id:this.quoteId,order_type:type}).subscribe((res:any)=>{
      this.spinner.hide();
      if(res){
        if(sub_type =='save_order' || sub_type =='create_order'){    
          return
        }
            const modalRef = this.modalService.open(DialogBoxComponent, {
          size: "lg",
          backdrop: "static",
          centered: true,
        });
        let data = res?.result[0]
        let advanceAmountData = {
          dialogType:data?.order_type !=='' ? data?.order_type :type,
          data:this.quoteInfo.quote,
          installment_type:data?.installment_type !=='' ? data?.installment_type:'Percentage',
          order_type:data?.order_type !=='' ? data?.order_type :type,
          button_type:this.button_type,
          res:res?.result,
          tax_befor_order_amt:this.button_type=='0' ? this.quoteInfo.quote.rent_after_adjustment_value * this.monthNums : this.quoteInfo.quote.buy_net_total,
          service_before_amt:(Number(this.quoteInfo.quote.delivery_fee) + Number(this.quoteInfo.quote.freight_charges)+ Number(this.quoteInfo.quote.other_services)),
          order_amt:this.button_type=='0' ? this.quoteInfo.quote.total_rent_order_amount_after_taxes : this.quoteInfo.quote.total_buy_order_amount_after_taxes,
          delivery_nonTax:this.quoteInfo.quote.is_delivery_fee_taxable,
          is_tax_exempt:this.quoteInfo.quote.is_tax_exempt
        };
        modalRef.componentInstance.advanceAmountInData=advanceAmountData;
        modalRef.componentInstance.advanceAmountOpData.subscribe((res:any)=>{
          
          if(res){
            modalRef.componentInstance.activeModal.close();
            this.spinner.show()
            if(res){
              this.updateQuoteInstallment(res);
            }
          }
        })
      }
  
      
    },error=>{
      this.spinner.hide()
    })
  }
  updateQuoteInstallment(res){
    this.quoteService.updateQuoteInstallment(res).subscribe((data:any)=>{
      this.spinner.hide()
      if(data){
        this.toastr.success(data?.message);
        this.getquotation(this.quoteId)
      }
    },error=>{
      this.spinner.hide()
    })
  }
}
