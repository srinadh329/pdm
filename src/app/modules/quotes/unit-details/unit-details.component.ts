import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { QuoteService } from 'src/app/services/quote.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.css']
})
export class UnitDetailsComponent implements OnInit {
  @Input() unitDetails:any;
  @Input() order_status:any
  @Output() quote_view:EventEmitter<any> = new EventEmitter();
  unitSummaryInfo:any={
    floorplan:'',
    items:'',
    indv_unit:'',
    moodboards:'',
    unitData:'',
    assign_floorplan:'',
    is_show:false
  }
  button_type: any;
  quoteId: any;
  show_delete: any='cancel';
  assingFloorPlan: any;
  
  constructor(
    private spinner: NgxSpinnerService,
    private quoteService: QuoteService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private mbs: CreateMoodboardService,
  ) { }

  ngOnInit(): void {
    
    if(this.unitDetails){
      this.quoteId = this.unitDetails?.quote_id;
      if(this.unitDetails?.floorplan_id){
        this.unitInfo(this.unitDetails)
        this.getMoodboardListOfUnit(this.unitDetails)
      }
      if(!this.unitDetails?.floorplan_id){
        this.getFloorPlans()
      }
    }

  }
  unitInfo(data){
    this.spinner.show();
    
    this.quoteService.getUnitProducts(data?.sgid,data?.floorplan_id,data?.quote_id).subscribe((res:any)=>{
      this.spinner.hide()
      if(res?.statusCode==200){
        this.unitSummaryInfo.floorplan=res?.floorplan,
        this.unitSummaryInfo.items=res?.result,
        this.unitSummaryInfo.indv_unit=res?.unit,
        this.unitSummaryInfo.is_show=true
      }
      this.button_type = res?.result[0]?.button_type;
      
    },error=>{
      this.spinner.hide()
    })
  }  
  
  getMoodboardListOfUnit(data){
    this.spinner.show()
    this.quoteService.getMoodboardListOfUnit({sgid:data?.sgid}).subscribe((res:any)=>{
      this.spinner.hide()
      
      this.unitSummaryInfo.moodboards = res?.result;
      
    })
  }
  getFloorPlans() {
    this.spinner.show()
    this.quoteService.getFloorPlanDetails(this.quoteId).subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        this.unitSummaryInfo.assign_floorplan = res?.result;
        this.assingFloorPlan = res?.result[0]
      }
    })
  }
  selectFloor(data){
    
    this.assingFloorPlan = data;
  }

  AddFloorplanunitlevel() {
    const obj = {
      unit: this.unitDetails?.unit,
      floorplan_id: this.assingFloorPlan?.sgid,
      quote_id: this.quoteId,
      sgid: this.unitDetails?.sgid
    };
    this.quoteService.addFloorPlanatunitlevel(obj).subscribe(resp => {
      
      if (resp.statusCode === 200) {
        this.spinner.hide();
        this.toastr.success(resp.message);
        this.quote_view.emit(true);
      }

    }, error => { });
  }
  // add units popup

  updateUnitDialog(){
    const modalRef = this.modalService.open(DialogBoxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let UnitData = {
      dialogType: "add-units",
      title:'Update Unit Name',
      res:this.unitDetails
    };
    modalRef.componentInstance.unitsInData = UnitData;
    modalRef.componentInstance.unitsOpData.subscribe((res:any)=>{
      modalRef.componentInstance.activeModal.close();
      
      if(res){
        this.unitSummaryInfo.indv_unit.name = res;
        this.updateUnit()
      }
      
    })
  }

// add units popup
  backToQuote(){
    this.quote_view.emit(true);
  }

  // delete unit moodboard
  deleteUnitMoodboard(data){
    
    this.conformationDialog(data,'unit_moodboard')
  }

  // delete unit moodboard
  // delete item
  deleteItem(data){
    this.conformationDialog(data,'item')
    
  }
  removeProduct(data){
    this.spinner.show()
    this.quoteService.removeProduct({item_id:data?.sgid,quote_id:this.quoteId}).subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        this.show_delete='cancel'
        this.unitInfo(this.unitDetails)
        this.getMoodboardListOfUnit(this.unitDetails)
      }
    })
  }
  // delete item


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
        if(type=='unit_moodboard'){
          
          this.spinner.show()
          let obj={
            floorplan_id:res?.floorplan_id,
            moodboard_id:res?.moodboard_id,
            quote_id:res?.quote_id,
            sgid:res?.unit_id,
            unit:this.unitSummaryInfo.indv_unit?.unit
          }
          this.quoteService.removeSingleUnitforMb(obj).subscribe((res:any)=>{
            this.spinner.hide()
            if(res){
              this.toastr.success(res?.message);
              this.unitInfo(this.unitDetails)
              this.getMoodboardListOfUnit(this.unitDetails)
            }
          })
        }
      }
    })
  }

  // conformation dialog

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
          type:data
        };
        modalRef.componentInstance.moodInData = moodData;
        modalRef.componentInstance.moodOpData.subscribe((res:any)=>{
          if(res){
            this.spinner.show()
            if(data=='unit'){
              let obj={
                floorplan_id:this.unitSummaryInfo.indv_unit?.floorplan_id,
                moodboard_id:res,
                quote_id:this.unitSummaryInfo.indv_unit?.quote_id,
                sgid:this.unitSummaryInfo.indv_unit?.sgid,
                unit:this.unitSummaryInfo.indv_unit?.unit
              }
              this.quoteService.addSingleUnitforMb(obj).subscribe((res:any)=>{
                this.spinner.hide()
                if(res){
                  modalRef.componentInstance.activeModal.close();
                  this.toastr.success(res?.message);
                  this.unitInfo(this.unitDetails)
                  this.getMoodboardListOfUnit(this.unitDetails)
                }
              })
            }
          }
        })
      }
    })
  }
  // get moodboards


  // unit table calculation
  unitQty(data,type){
    
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
    this.unitAmountCal()
  }
  unitItemCal(event,data,type){
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
    this.unitAmountCal()
  }
  unitAmountCal(){
    if(this.button_type=='0'){
      this.unitSummaryInfo.indv_unit.rent_net_total= this.unitSummaryInfo.items.reduce((int, item) => { return int + item.is_total }, 0);
    
    }
    if(this.button_type=='1'){
      this.unitSummaryInfo.indv_unit.buy_net_total = this.unitSummaryInfo.items.reduce((int, item) => { return int + item.is_total }, 0);
    }
  }
  unitMonth(data,type){
    if (data.months < 12 && type=='+'){
      data.months++;
      // this.getUnitMonthPrice(data)
    }
    if (data.months > 1 && type=='-'){
      data.months--;
      // this.getUnitMonthPrice(data)
    }
  }
  // unit table calculation

  updateUnit(){
    this.unitSummaryInfo.items.forEach((x:any)=>{
      x['qty']=x.is_qty,
      x['sale_price']=x.is_sale_price
      x['total_price']=x.is_total
    })
    let obj=[];
    obj.push({items:this.unitSummaryInfo.items})
    obj.push({unit:[this.unitSummaryInfo.indv_unit]})
    obj.push({quote_id:this.quoteId})
    
    this.spinner.show()
    this.quoteService.updateUnit(obj).subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        this.toastr.success(res?.result);
        this.unitInfo(this.unitDetails)
        this.getMoodboardListOfUnit(this.unitDetails)
      }
    })
  }
  removeItem(data){
    this.show_delete = data
  }
 
}
