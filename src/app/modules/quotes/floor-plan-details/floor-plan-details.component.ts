import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuoteService } from 'src/app/services/quote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-floor-plan-details',
  templateUrl: './floor-plan-details.component.html',
  styleUrls: ['./floor-plan-details.component.css']
})
export class FloorPlanDetailsComponent implements OnInit {
  @Input() floorDetails:any;
  @Input() tax_details:any;
  @Input() order_status:any
  @Output() quote_view:EventEmitter<any> = new EventEmitter();
  floorSummaryInfo:any={
    units:'',
    floor_units:'',
    indv_unit:'',
    items:'',
    floorplan:'',
    moodboards:'',
    rent_adjument_value:''
  }
  show_delete: any='cancel';
  button_type: any;
  quoteId: any;
  rent_adjustment_type: string;
  constructor(
    private spinner: NgxSpinnerService,
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private mbs: CreateMoodboardService,
  ) { }

  ngOnInit(): void {
    
    if(this.floorDetails){
      this.quoteId=this.floorDetails?.quote_id
      this.getFloorplanMoodbaord(this.floorDetails);
      this.getMoodboardsSummary(this.floorDetails);
      this.getFloorplanUnits(this.floorDetails)
    }
  }

  backToQuote(){
    this.quote_view.emit(true);
  }

  getFloorplanMoodbaord(data){
    this.spinner.show()
    this.quoteService.getFloorplanMoodbaord(data?.sgid,data?.quote_id).subscribe((res:any)=>{
      this.spinner.hide()
      
      this.floorSummaryInfo.moodboards = res?.floorplans
    })
  }
  getMoodboardsSummary(data){
    this.spinner.show()
    this.quoteService.getMoodboardsSummary(data?.sgid).subscribe((res:any)=>{
      
      this.spinner.hide()
      this.floorSummaryInfo.units = res?.result
    })
  }
  getFloorplanUnits(data){
    this.quoteService.getFloorplanUnits(data?.sgid,data?.quote_id).subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.floorSummaryInfo.floor_units=res?.result;
        
        if(this.floorSummaryInfo.floor_units)this.getUnitProducts(this.floorSummaryInfo.floor_units[0])
      }
      
    })
  }
  
   // each unit info
   getUnitProducts(data:any){
    this.spinner.show();
    
    this.quoteService.getUnitProducts(data?.sgid,data?.floorplan_id,data?.quote_id).subscribe((res:any)=>{
      this.spinner.hide()
      if(res?.statusCode==200){
        if(res?.unit)res.unit.rent_adjustment_value = res.unit.rent_adjustment_value ? res.unit.rent_adjustment_value : 0
        this.floorSummaryInfo.floorplan=res?.floorplan,
        this.floorSummaryInfo.items=res?.result,
        this.floorSummaryInfo.indv_unit=res?.unit
        this.floorSummaryInfo.rent_adjument_value = res?.unit.rent_adjustment_value
        this.tax_details = res?.sales_tax_rate
      }
      
      this.floorSummaryInfo.indv_unit.rent_adjustment_type =null;
      this.floorSummaryInfo.indv_unit.rent_adjustment_value=0;
      this.button_type = res?.result[0]?.button_type;
    },error=>{
      this.spinner.hide()
    })
  }
  // each unit info

  floorunit(data){
    this.getUnitProducts(data)
  }

  removeItem(data){
    this.show_delete = data
  }

  // remove units
  removeUnits(data){
    
    this.conformationDialog(data,'removeUnit')
  }

  // remove units


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
        if(type=='item'){
          this.removeProduct(res)
        }
        if(type=='removeUnit'){
          this.spinner.show()
          this.quoteService.removeUnitsInFloorPlan(res.quote_id, res.unit, res?.floorplan_id ,res.sgid).subscribe((res:any)=>{
            this.spinner.hide();
            if(res?.statusCode==200){
              this.toastr.success(res?.message)
              this.getFloorplanMoodbaord(this.floorDetails);
              this.getMoodboardsSummary(this.floorDetails);
              this.getFloorplanUnits(this.floorDetails)
            }
          },error=>{this.spinner.hide()})
        }
        if(type=='moodboard'){
          this.spinner.show()
          this.quoteService.removeFPMoodbard(res?.quote_id,res?.moodboard_id,res?.floorplan_id).subscribe((res:any)=>{
            this.spinner.hide();
            if(res){
              this.toastr.success('Removed successfully')
              this.getFloorplanMoodbaord(this.floorDetails);
              this.getMoodboardsSummary(this.floorDetails);
              this.getFloorplanUnits(this.floorDetails)
            }
          })
        }
      }
    })
  }

  // conformation dialog

  removeProduct(data){
    this.spinner.show()
    this.quoteService.removeProduct({item_id:data?.sgid,quote_id:this.quoteId}).subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        this.show_delete='cancel'
        this.getFloorplanMoodbaord(this.floorDetails);
        this.getMoodboardsSummary(this.floorDetails);
        this.getFloorplanUnits(this.floorDetails)
      }
    })
  }


  addFloorUnitDialog(){
    const modalRef = this.modalService.open(DialogBoxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let floorUnitData = {
      dialogType: "add-floor-units",
      title:'Add Number of Units',
      unit:this.floorSummaryInfo.floor_units[0]
    };
    modalRef.componentInstance.floorUnitsInData = floorUnitData;
    modalRef.componentInstance.floorUnitsOpData.subscribe((resp:any)=>{
      if(resp){
        this.spinner.show()
        
        modalRef.componentInstance.activeModal.close();
        this.quoteService.addUnitsforFloor(resp?.quote_id,resp?.floorplan_id,resp?.unit).subscribe((res:any)=>{
          this.spinner.hide()
          if(res){
            let data={
              sgid:resp?.floorplan_id,
              quote_id:resp?.quote_id
            }
            this.getFloorplanMoodbaord(this.floorDetails);
            this.getMoodboardsSummary(this.floorDetails);
            this.getFloorplanUnits(this.floorDetails)
          }
        })
      }
    })
  }

  deleteMoodboard(data){
    
    this.conformationDialog(data,'moodboard')
  }

  // get moodboards
  getMoodboards(data){
    let start = 0;
    let count = 1000;
    this.spinner.show()
    this.mbs.getMyMoodboards(null,null,start,count).subscribe((res:any)=>{
      
      this.spinner.hide()
      if(res){
        const modalRef = this.modalService.open(DialogBoxComponent, {
          size: "md",
          backdrop: "static",
          centered: true,
        });
        let moodData = {
          res: res?.result,
          dialogType: "moodboard-popup",
          title:'Add Moodboard',
          units: this.floorSummaryInfo.floor_units,
          type:data
        };
        modalRef.componentInstance.moodInData = moodData;
        modalRef.componentInstance.moodOpData.subscribe((res:any)=>{
          if(res){
            this.spinner.show()
            if(data=='floor'){
              this.quoteService.addmoodbaordtoFloorPlan(res).subscribe((res:any)=>{
                this.spinner.hide()
                if(res){
                  modalRef.componentInstance.activeModal.close();
                  if(res?.message) this.toastr.error(res?.message);
                  if(!res?.message) this.toastr.success('Moodboard added successfully');
                  let data = res?.floorplans[0];
                  let obj = {
                    sgid:data?.floorplan_id,
                    quote_id:data?.quote_id
                  }
                  this.getFloorplanMoodbaord(this.floorDetails);
                  this.getMoodboardsSummary(this.floorDetails);
                  this.getFloorplanUnits(this.floorDetails)
                }
              })
            }
          }
        })
      }
    })
  }
  // get moodboards


  // floor table calculation
  qty(event,data,type){
    if(type=='-'){
      if(data.is_qty==1){
        return
      }
      else{
        data.is_qty -=1
      }
      
    }
    if(type=='+'){
      data.is_qty +=1
    }
    if(this.button_type=='0') data.is_total= (Number(data?.price)- Number(data?.discount)) * Number(data?.is_qty);
    if(this.button_type=='1') data.is_total= (Number(data?.buy_price)- Number(data?.discount)) * Number(data?.is_qty);
    this.floorAmountCal()
  }
  floorItemCal(event,data,type){
    if(this.button_type=='0'){
      if(type=='price') data.price = event?.target.value;
      if(type=='discount') data.discount = event?.target.value;
      data.is_total= (Number(data?.price)- Number(data?.discount)) * Number(data?.is_qty);
    }
    if(this.button_type=='1'){
      if(type=='buy_price') data.buy_price = event?.target.value;
      if(type=='discount') data.discount = event?.target.value;
      data.is_total= (Number(data?.buy_price)- Number(data?.discount)) * Number(data?.is_qty); 
    }
    this.floorAmountCal()
  }
  floorItemDiscount(event,type){
    if(type=='buy_total_discount')this.floorSummaryInfo.indv_unit.buy_discount = event?.target.value;
    if(type=='rent_total_discount'){
      this.floorSummaryInfo.indv_unit.rent_adjustment_value = event?.target.value;
    }
    // this.floorAmountCal()
  }
  
  itemRentchange(type:any){
    if(type=='+'){
     this.floorSummaryInfo.rent_adjustment_type = '1'
    }
    if(type=='-'){
      this.floorSummaryInfo.rent_adjustment_type = '0'
      
    }
    this.updateUnit()
    // this.floorAmountCal()
  }
  floorAmountCal(){
    if(this.button_type=='0'){
      this.floorSummaryInfo.indv_unit.monthly_rent= this.floorSummaryInfo.items.reduce((int, item) => { return int + item.is_total }, 0);
      this.floorSummaryInfo.indv_unit.rent_after_adjustment_value = Number(this.floorSummaryInfo.indv_unit.monthly_rent) - Number(this.floorSummaryInfo.indv_unit.rent_adjustment_value);
      this.floorSummaryInfo.indv_unit.tax_amount = ((Number(this.floorSummaryInfo.indv_unit.rent_after_adjustment_value) + Number(this.floorSummaryInfo.indv_unit.delivery_fee))* Number(this.tax_details))/100;
      this.floorSummaryInfo.indv_unit.net_total = Number(this.floorSummaryInfo.indv_unit.rent_after_adjustment_value) + Number(this.floorSummaryInfo.indv_unit.tax_amount) + Number(this.floorSummaryInfo.indv_unit.delivery_fee)
    }
    if(this.button_type=='1'){
      this.floorSummaryInfo.indv_unit.buy_price = this.floorSummaryInfo.items.reduce((int, item) => { return int + item.is_total }, 0);
      this.floorSummaryInfo.indv_unit.buy_net_total = Number(this.floorSummaryInfo.indv_unit.buy_price) - Number(this.floorSummaryInfo.indv_unit.buy_discount);
      this.floorSummaryInfo.indv_unit.tax_amount = ((Number(this.floorSummaryInfo.indv_unit.buy_net_total ) + Number(this.floorSummaryInfo.indv_unit.delivery_fee))* Number(this.tax_details))/100;
      this.floorSummaryInfo.indv_unit.net_total = Number(this.floorSummaryInfo.indv_unit.buy_net_total) + Number(this.floorSummaryInfo.indv_unit.tax_amount) + Number(this.floorSummaryInfo.indv_unit.delivery_fee)
    }
  }

  // floor table calculation

  deleteItem(data){
    this.conformationDialog(data,'item')
    
  }

  month(data,type){
    
    if (data.months < 12 && type=='+'){
      data.months++;
      // this.getMonthPrice(data)
    }
    if (data.months > 1 && type=='-'){
      data.months--;
      // this.getMonthPrice(data)
    }
  }
  // getMonthPrice(data){
  //   this.quoteService.getMonthPrice({quote_id:data?.quote_id,unit_id:data?.sgid,floorplan_id:data?.floorplan_id,month:data?.months}).subscribe((res:any)=>{
  //     
  //   })
  // }

  updateUnit(){
    let obj=[];
    this.floorSummaryInfo.items.forEach((x:any)=>{
      x['qty']=x.is_qty,
      x['sale_price']=x.is_sale_price
      x['total_price']=x.is_total
    })
    obj.push({items:this.floorSummaryInfo.items})
    obj.push({unit:[this.floorSummaryInfo.indv_unit]})
    obj.push({quote_id:this.quoteId})
    this.spinner.show()
     this.quoteService.updateUnit(obj).subscribe((res:any)=>{
       this.spinner.hide()
       if(res){
         this.toastr.success(res?.result);
         this.getFloorplanMoodbaord(this.floorDetails);
         this.getMoodboardsSummary(this.floorDetails);
         this.getFloorplanUnits(this.floorDetails)
       }
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
      data:this.floorSummaryInfo,
    };
    modalRef.componentInstance.flooramountInData = amountData;
    modalRef.componentInstance.flooramountOpData.subscribe((res:any)=>{
      if(res){
        modalRef.componentInstance.activeModal.close();
        this.updateUnit()
      }
    })
  }

  //  amountAdjustPopup

  onInput(event) {
    const parsedValue = parseFloat(event.target.value);
      this.floorSummaryInfo.indv_unit.delivery_fee = Math.round(parsedValue * 100) / 100;
  
  }
}
