import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from 'src/app/services/items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { QuoteService } from 'src/app/services/quote.service';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { SharedService } from 'src/app/services/shared.service';
import { MoodboardDailogComponent } from 'src/app/modules/moodboard/moodboard-dailog/moodboard-dailog.component';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { forkJoin} from 'rxjs'; 
import { EncryptService } from 'src/app/encrypt.service';


@Component({
  selector: 'app-moodboard-details',
  templateUrl: './moodboard-details.component.html',
  styleUrls: ['./moodboard-details.component.css'],
})
export class MoodboardDetailsComponent implements OnInit   {
  mbId: string;
  mbInfo:any={
    moodboard:'',
    moodboard_items:[],
    moodboard_summery:'',
    moodboard_wizard:'',
    is_show:false
  };
  productShowTabs: any='moodboard';
  userId: any;
  page = 0;
  selectedIndex: any;
  category: any='';
  parameters: any;
  lable: { asset_enable: any; buy_enable: any; rent_enable: any; };
  publishVal: any;
  isMoreProducts: boolean;
  disMsg: any;
  selectedminval: any;
  selectedmaxval: any;
  buyLable: any='none';
  supplier: any='';
  supplierselection: any=[];
  isLoadMore: boolean=true;
  isFilterFlag: boolean;
  moodboard_summery: any;
  mbForm: any;
  companyOptions: any;
  projectOptions:any;
  supplier_type: any;
  selectedSupplierId: any;
  showMoodboard: boolean=false;
  inspOptions: OwlOptions = {
    loop: false,
    autoplay:false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    navText: ['<span>Previous </span>' ,'<span>Next</span>']
  }
  inspInfo:any={
    packages:[],
    is_show:false
  }
  single_package:any;
  designIndex: any=0;
  inspCategory: any=[];
  inspCategoryValue:any='';
  swaptOptPackage: boolean=false;
  @ViewChild('owlOpt', { static: false }) owlOpt: any;
  buy_total: any=0;
  sale_total: any=0;
  packageInverval: any;
  intervalRunning:boolean=false;
  interval: any;
  inspMsg: any;
  form_key:any=[
    {sgid:1,showUnitRoom:'rooms',showMoodboard:false,lable_type:'Room Type'},
    {sgid:2,showUnitRoom:'units',showMoodboard:true,lable_type:'Floor Plan Type'},
    {sgid:3,showUnitRoom:'square_feet',showMoodboard:false,lable_type:'Square Feet Area'},
    {sgid:4,showUnitRoom:'both',showMoodboard:false,},
    {sgid:5,showUnitRoom:'units',showMoodboard:false,lable_type:'Floor Plan Type'},
    {sgid:6,showUnitRoom:'units',showMoodboard:false,lable_type:'Room Type'},
    {sgid:7,showUnitRoom:'units',showMoodboard:true,lable_type:'Floor Plan Type'},
    {sgid:8,showUnitRoom:'square_feet',showMoodboard:false,lable_type:'Square Feet Area'},
    {sgid:10,showUnitRoom:'units',showMoodboard:true,lable_type:'Room Type'},
    {sgid:11,showUnitRoom:'units',showMoodboard:true,lable_type:'Room Type'},
  ]
  constructor(
    private auth: AuthenticateService,
    private cMbService: CreateMoodboardService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mbs: CreateMoodboardService,
    private ls: LocalStorageService,
    private quoteservice: QuoteService, private item: ItemsService, private sharedService: SharedService,
    private _location: Location,
    private encryptService: EncryptService
 ) {
  this.mbId =  this.route.snapshot.paramMap.get('id');
  if(this.mbId) this.getMoodBoardDetails(this.mbId);
}
ngOnInit() {
  this.userId = this.auth.getProfileInfo('userId');
}
// mb details
getMoodBoardDetails(id:any){
  this.spinner.show()
  this.mbs.getMoodBoardDetails(id).subscribe((res:any)=>{
    this.spinner.hide()
    for(let item of res?.moodboard_items){
      let img = item?.variation?.images[0]?.image_url?.small;
      let dimension = item?.variation?.dimension;
      item['image']=img;
      item['dimension'] = dimension
    }
    if(this.userId !=res?.moodboard?.userid && res?.moodboard?.is_public == 0){
      this.toastr.info('Not Your Moodboard');
      res.moodboard['disable']=false;
    }
    else if(this.userId!=res?.moodboard?.userid && res?.moodboard?.is_public == 1){
      this.toastr.info('This is Public Moodboard');
      res.moodboard['disable']=true;
    }
    else{
      res.moodboard['disable']=true;
    }
    let data = res?.moodboard_wizard;

    let f_id = this.form_key.find(x=>x.sgid==data.moodboard_design_type_id)
    if(f_id.sgid==data.moodboard_design_type_id){
      res.moodboard_wizard['showUnitRoom']= f_id?.showUnitRoom;
      res.moodboard_wizard['showMoodboard'] = f_id?.showMoodboard;
      res.moodboard_wizard['lable_type'] = f_id?.lable_type;
    }

    if(res?.statusCode==200){
      this.mbInfo= {
        moodboard:res?.moodboard,
        moodboard_items:res?.moodboard_items,
        moodboard_summery:res?.moodboard_summery,
        moodboard_wizard:res?.moodboard_wizard,
        is_show:true
      }
    }

  },error=>{
    this.spinner.hide()
  })
}

// mb details

// mb details popup
mbDetailsPopup(){
  
  if(this.mbInfo){
    const modalRef = this.modalService.open(MoodboardDailogComponent, {
      backdrop: "static",
      centered: true,
      windowClass: 'mb_details'
    });
    let mbDetailsData = {
      dialogType: "mbDetailsPopup",
      res:this.mbInfo
    };
    modalRef.componentInstance.mbDetailsInData = mbDetailsData;
    modalRef.componentInstance.mbDetailsOpData.subscribe((res) => {
      modalRef.componentInstance.activeModal.close();
      if(res==='share'){
        this.shareMb()
      }
      else if(res==='copy'){

        if(this.mbInfo?.moodboard_wizard?.moodboard_design_type_id ==''){
          this.updateOldMbpopUp()
        }
        else{
          this.copyMb(res)
          this.productShowTabs=''
        }
       
      }
      else if(res==='edit'){
        this.copyMb(res)
        this.productShowTabs=''
      }
    });
  }
}


updateOldMbpopUp(){
  const modalRef = this.modalService.open(MoodboardDailogComponent, {
    size: "md",
    backdrop: "static",
    centered: true,
  });
  let updateOldMbData = {
    dialogType: "update_old_moodboard_details",
  };
  modalRef.componentInstance.updateOldMbIn = updateOldMbData;
}


// mb details popup

productTabs(data:any){
  this.productShowTabs = data;
  if(data=='add-prodcuts'){
    this.page = 0;
    this.mbInfo.is_show =false;
    this.inspInfo.is_show = false;
    this.productShowTabs =data;
    this.mbForm=false;
  }
  if(data=='moodboard'){
    this.mbInfo.is_show =true;
    this.inspInfo.is_show = false;
    this.productShowTabs =data;
    this.mbForm=false;
  }
}


deletePopUp(data:any){
  if(data)this.deleteProductPopup(data)
}
deleteItem(data:any){
  
  let other_user_id = this.auth.getProfileInfo('userId');
  this.spinner.show();
  let obj={
    moodboard_id: data?.moodboard_id, 
    button_type: data?.button_type, 
    product_id: data?.product_id, 
    user_id: this.userId, 
    sku: data.sku,
    other_user_id:other_user_id
  }
  this.mbs.removeProduct(obj).subscribe(res => {
    if(res?.statusCode==200){
      this.toastr.success(res?.result);
      this.getMoodBoardDetails(this.mbId)
    }
  });
}
deleteProductPopup(data){
  const modalRef = this.modalService.open(MoodboardDailogComponent, {
    size: "md",
    backdrop: "static",
    centered: true,
  });
  let variationData = {
    dialogType: "delete-popup",
    res:data
  };
  modalRef.componentInstance.prodDeleteInData = variationData;
  modalRef.componentInstance.prodDeleteOpData.subscribe((data) => {
    if(data){
      modalRef.componentInstance.activeModal.close();
      this.deleteItem(data)
    }
 
  });
}
qtyUpdate(data,event){
  if(event.target.value==0){
    this.toastr.error('Zero value not accepcted')
    return
  }
  if(event.target.value){
    data.qty = event.target.value;
    let obj= {
      sgid: data.sgid,
      moodboard_id: data.moodboard_id,
      qty: data.qty,
      months: data.months,
      total: data.total,
      price: data.price,
      sale_price: data.sale_price,
      asset_value: data.asset_value,
      button_type:data.button_type,
      buy_price:data.buy_price
     
    };
    this.updateQuantity(obj)
  }
  
}
itemQtyUpdate(data:any,type:any){
  let obj;
  if(data && type =='-'){
    if(data.qty==1){
      return
    }else{
      data.qty--;
    }
  }
  if(data && type =='+'){
    data.qty++;
  }
  obj= {
    sgid: data.sgid,
    moodboard_id: data.moodboard_id,
    qty: data.qty,
    months: data.months,
    total: data.total,
    price: data.price,
    sale_price: data.sale_price,
    asset_value: data.asset_value,
    button_type:data.button_type,
    buy_price:data.buy_price
   
  };
  this.updateQuantity(obj)
}
updateQuantity(data:any){
  if (data) {
    this.spinner.show()
    this.mbs.moodboardSingleItem(data).subscribe(res => {
      this.spinner.hide();
      if(res?.statusCode==200){
        this.toastr.success('Moodboard Quantity Updated Successfully');
        this.getMoodBoardDetails(this.mbId)
      }
     
    },error=>{
      this.spinner.hide()
    });
  }
}
pptGenerate(){
  this.spinner.show()
  this.item.getPpt({moodboard_id:this.mbId}).subscribe(res=>{
    var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'moodboard.ppt';
        link.click();
        this.spinner.hide();
  },erro=>{
    this.spinner.hide()
  })
}

shareMb(){
  const modalRef = this.modalService.open(MoodboardDailogComponent, {
    size: "md",
    backdrop: "static",
    centered: true,
  });
  let shareMbData = {
    dialogType: "share-mb-popup",
  };
  modalRef.componentInstance.shareMbInData = shareMbData;
  modalRef.componentInstance.shareMbOpData.subscribe((res) => {
    if(res){
      let obj ={
        email:res,
        url:location.href,
        user_id:this.auth.getProfileInfo('userId')
      }
      this.spinner.show()
      this.cMbService.shareMoodboard(obj).subscribe((resp: any) => {
          this.spinner.hide()
          this.toastr.success(resp.message);
          modalRef.componentInstance.activeModal.close();
        });
    }
  });
}
copyMb(data:any){
  this.mbForm=true;
  this.mbInfo.moodboard_wizard['mbForm']=data;
  this.mbInfo.moodboard_wizard['design_type']= this.mbInfo?.moodboard_wizard?.moodboard_design_type_id,
  this.mbInfo.moodboard_wizard['room_type']= this.mbInfo?.moodboard_wizard?.moodboard_room_type_id,
  this.mbInfo.moodboard_wizard['delivery_date']= this.mbInfo?.moodboard_wizard?.expected_delivery_date?.slice(0,10)
}
editMbOpData(data){
  this.mbForm=false;
  this.getMoodBoardDetails(data);
  this.productShowTabs='moodboard'
}
mbOpData(data){
  this.getMoodBoardDetails(data);
  this.productShowTabs='moodboard';
}
 
changeStatus(event){
  
  let obj={
    moodboard_id:'',
    public:0
  }
  if(event.target.checked==true){
    obj={
      moodboard_id:this.mbId,
      public:1
    }
  }
  if(event.target.checked==false){
    obj={
      moodboard_id:this.mbId,
      public:0
    }
  }
  this.spinner.show()
  this.cMbService.setMoodboardPublic(obj).subscribe((res:any)=>{
    this.spinner.hide()
    if(res?.statusCode==200){
      this.toastr.success(res?.message)
      this.getMoodBoardDetails(this.mbId)
    }
  },error=>{
    this.spinner.hide()
  })
}
}