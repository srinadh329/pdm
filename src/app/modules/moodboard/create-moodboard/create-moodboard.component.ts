import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MoodboardDailogComponent } from 'src/app/modules/moodboard/moodboard-dailog/moodboard-dailog.component'
import { EncryptService } from 'src/app/encrypt.service';

@Component({
  selector: 'app-create-moodboard',
  templateUrl: './create-moodboard.component.html',
  styleUrls: ['./create-moodboard.component.css']
})
export class CreateMoodboardComponent implements OnInit {
  moodboardInfo:UntypedFormGroup;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter();
  @Input () productDetailsMd:any
  @Output() productDetailsMdOp = new EventEmitter();
  design:any={
    res:[],
    is_show:false
  };
  designRoomType:any={
    res:[],
    is_show:false
  };
  addInfo:any={
    bug:[],
    is_show:false
  }
  designInfo:any={
    id:'',
    type:''
  }
  roomInfo:any={
    sub_id:'',
    sub_type:''
  }
  today = new Date();
  showUnitRoom: any;
  design_mb=[
    {sgid:[1],img:'/assets/images/mbIcons/hotel.svg'},
    {sgid:[2],img:'/assets/images/mbIcons/multi_family_apartment.svg',url:'/assets/images/mbIcons/multi_family_apartment_white.svg'},
    {sgid:[4],img:'/assets/images/mbIcons/student_housing.svg'},
    {sgid:[5],img:'/assets/images/mbIcons/senior_living.svg'},
    {sgid:[6],img:'/assets/images/mbIcons/commercial_office.svg'},
    {sgid:[7],img:'/assets/images/mbIcons/rent.svg'},
    {sgid:[3,8,10],img:'/assets/images/mbIcons/mfr_common_area.svg'},
    {sgid:[11],img:'/assets/images/mbIcons/Senior-living-common-area.svg'}
  ]
  room_mb=[
    {sgid:[1],img:'/assets/img/mbIcons/king.png'},
    {sgid:[2],img:'/assets/img/mbIcons/king_suite.png'},
    {sgid:[3],img:'/assets/img/mbIcons/queen.png'},
    {sgid:[4],img:'/assets/img/mbIcons/double_queen.png'},
    {sgid:[5],img:'/assets/img/mbIcons/queen_suite.png'},
    {sgid:[6,12,21,53,59],img:'/assets/img/mbIcons/question.png'},
    {sgid:[7,48],img:'/assets/img/mbIcons/studio.png'},
    {sgid:[8,9,10,11,23,24,26,27,28,29,49,50,51,52,55,56,57,58],
     img:'/assets/img/mbIcons/1-bed.png',url:'/assets/img/mbIcons/1-bed-white.svg'},
    {sgid:[13,43],img:'/assets/img/mbIcons/lobby.png'},
    {sgid:[14],img:'/assets/img/mbIcons/leasing_office.png'},
    {sgid:[15],img:'/assets/img/mbIcons/manager_office.png'},
    {sgid:[16],img:'/assets/img/mbIcons/clubroom.png'},
    {sgid:[17],img:'/assets/img/mbIcons/outdoor_rooftop.png'},
    {sgid:[18,47],img:'/assets/img/mbIcons/pool_area.png'},
    {sgid:[19],img:'/assets/img/mbIcons/courtyard.png'},
    {sgid:[20],img:'/assets/img/mbIcons/other.png'},
    {sgid:[22,25,54],img:'/assets/img/mbIcons/studio.png'},
    {sgid:[30],img:'/assets/img/mbIcons/break_room.png'},
    {sgid:[31],img:'/assets/img/mbIcons/conference_room.png'},
    {sgid:[32],img:'/assets/img/mbIcons/lounge.png'},
    {sgid:[33],img:'/assets/img/mbIcons/office_room.png'},
    {sgid:[34],img:'/assets/img/mbIcons/reception.png'},
    {sgid:[35],img:'/assets/img/mbIcons/telephone_area.png'},
    {sgid:[44],img:'/assets/img/mbIcons/restaurant.png'},
    {sgid:[45],img:'/assets/img/mbIcons/coridor.png'},
    {sgid:[46],img:'/assets/img/mbIcons/meeting-room.png'},
  ]
  form_key:any=[
    {sgid:1,no_of_rooms:'',budget:'',showUnitRoom:'rooms',showMoodboard:false,lable_type:'Room Type'},
    {sgid:2,no_of_units:'',budget:'',moodboard_type_id:'',
    showUnitRoom:'units',showMoodboard:true,lable_type:'Floor Plan Type'},
    {sgid:3,square_feet:'',budget:'',showUnitRoom:'square_feet',showMoodboard:false,lable_type:'Square Feet Area'},
    {sgid:4,no_of_units:'',no_of_rooms:'',no_of_beds:'',showUnitRoom:'both',showMoodboard:false,},
    {sgid:5,no_of_units:'',budget:'',showUnitRoom:'units',showMoodboard:false,lable_type:'Floor Plan Type'},
    {sgid:6,no_of_units:'',budget:'',showUnitRoom:'units',showMoodboard:false,lable_type:'Room Type'},
    {sgid:7,no_of_units:'',budget:'',moodboard_type_id:'',showUnitRoom:'units',showMoodboard:true,lable_type:'Floor Plan Type'},
    {sgid:8,square_feet:'',budget:'',showUnitRoom:'square_feet',showMoodboard:false,lable_type:'Square Feet Area'},
    {sgid:10,no_of_units:'',budget:'',moodboard_type_id:'',showUnitRoom:'units',showMoodboard:true,lable_type:'Room Type'},
    {sgid:11,no_of_units:'',budget:'',moodboard_type_id:'',showUnitRoom:'units',showMoodboard:true,lable_type:'Room Type'},
  ]
  moodboardType: any=[];
 designType: any=[];
  showMoodboard: boolean=false;
  prod_id: any;
  skuVariationId: any;
  productType: any;
  customOptions: OwlOptions = {
    loop: false,
    autoWidth: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
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
    navText: ['<span> </span>' ,'<span></span>']
  }
  inspIndex:any;
  fileElement: any;
  mb_type_name: any;
  design_type_value: any;
  uuid: any;
  constructor(
    private auth: AuthenticateService,
    private formBuilder: UntypedFormBuilder,
    private shop: ItemsService,
    private router: Router,
    private cMbService: CreateMoodboardService,
    private spinner: NgxSpinnerService,
    private sharedService : SharedService,
    private toasterService: ToastrService,
    private ls: LocalStorageService,
    private activeRout:ActivatedRoute,
    private modalService: NgbModal,
    private encryptService: EncryptService
  ) { 
    this.moodboardInfo= this.formBuilder.group({
      no_of_rooms:[''],
      no_of_units:[''],
      no_of_beds:[''],
      square_feet:[''],
      budget:[''],
      moodboard_type_id:[''],
      design_type_id:[],
      delivery_date:['']
    })
    this.activeRout.queryParams.subscribe((res:any)=>{
      if(res.params) {
        res = this.encryptService.decryptData(res.params)
      }
      if(res?.productType=='productDetails'){
        this.prod_id = res?.productId;
        this.skuVariationId = res?.productSkuId;
        this.productType = res?.productType
      }
      let form = this.moodboardInfo.value;
      if(res){
        this.designInfo={
          id: res?.id,
          type:res?.type
        }
        this.roomInfo={
          sub_id: res?.sub_id,
          sub_type: res?.sub_type
        }
       
      }
      if(res?.step==1){
        this.getDesign();
      }
      if(res?.id && res?.step==2){
        if(this.designInfo.id) this.getDesignType();
        for(let key in form){
          this.moodboardInfo.get(key).setValidators([]);
        }
      }
      if(res?.step==3 && res?.addInfo){
        let data = JSON.parse(res?.addInfo)
        this.moodboardInfo.patchValue(data)
        if(this.designInfo.id)this.getBudgetRange()
        this.designTypeList();
      }
      if(res?.step==4 && res?.addInfo){
        this.design.is_show=false;
        this.addInfo.is_show=false;
        this.uuid = res?.token;
        let data = JSON.parse(res?.addInfo)
        this.moodboardInfo.patchValue(data)
        if(this.moodboardInfo?.value?.design_type_id) this.designTypeList();
        if(this.designInfo.id)this.getBudgetRange()
      }
      
      let f_id = this.form_key.find(x=>x?.sgid== this.designInfo?.id)
      if(f_id?.sgid==this.designInfo?.id){
        this.showUnitRoom = f_id?.showUnitRoom;
        this.showMoodboard = f_id?.showMoodboard;
        this.MoodboardTypeList()
        for(let f_key in f_id){
          for(let key in form){
            if(f_key == key){
              this.moodboardInfo?.get(key).setValidators(Validators.required);
            }
          }
        }
      }
    }) 
  }
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
   
  }
  getDesign(){
    this.spinner.show()
    this.cMbService.getDesign().subscribe((res:any)=>{
      this.spinner.hide();
      for(let item of res?.result){
        let value = this.design_mb.find(x=>x.sgid.includes(item.sgid));
        if(value){
          item['img'] = value?.img;
          item['url'] = value?.url;
        }
        else{
          item['img'] = "/assets/img/mbIcons/question.png"
        }
       
      }
      if(res.statusCode==200){
        this.design = {
          res:res?.result.sort((a:any,b:any)=>a.design_type.localeCompare(b.design_type)),
          is_show:true
        }
      }
      this.designRoomType.is_show=false;
      this.addInfo.is_show=false;
    },error=>{
      this.spinner.hide()
    })
  }
  selectDesign(data:any){
    if(data?.sgid==1){
      this.showUnitRoom = 'rooms';
      this.showMoodboard = false;
    }
    if(data?.sgid==2){
      this.showUnitRoom = 'units';
      this.showMoodboard = true;
    }
    if(data?.sgid==3 || data?.sgid==5 || data?.sgid==6){
      this.showUnitRoom = 'units'
      this.showMoodboard = false;
    }
    if(data?.sgid==4){
      this.showUnitRoom = 'both';
      this.showMoodboard = false;
    }
    this.designInfo={
      id:data?.sgid,
      type:data?.design_type
    }
    this.roomInfo={
      sub_id: '',
      sub_type:''
    }
    this.moodboardInfo.patchValue({
      no_of_rooms:'',
      no_of_units:'',
      no_of_beds:'',
      budget:'',
      square_feet:'',
      moodboard_type_id:'',
      design_type_id:'',
      delivery_date:''
    });
    this.mb_type_name="";
  }
  getDesignType(){
    this.spinner.show()
    this.cMbService.getDesignType({design_type:this.designInfo.id}).subscribe((res:any)=>{
      this.spinner.hide()
      if(res?.statusCode==200){
        for(let item of res?.result){
          let value = this.room_mb.find(x=>x.sgid.includes(item.sgid));
          if(value){
            item['img'] = value?.img;
            item['url'] = value?.url;
          }
          else{
            item['img'] = "/assets/img/mbIcons/question.png"
          }
        }
        this.designRoomType = {
          res:res?.result.sort((a,b)=>a.sgid-b.sgid),
          is_show:true
        }
        if(this.designInfo.id==1 || this.designInfo.id==6 || this.designInfo.id==4){
          this.designRoomType['title']='What kind of Room Type'
          this.designRoomType['title2']='are you furnishing?'
        }
        if(this.designInfo.id==2 || this.designInfo.id==5 || this.designInfo.id==7){
          this.designRoomType['title']='What kind of Apartment'
          this.designRoomType['title2']='are you furnishing?'
        }
        if(this.designInfo.id==3){
          this.designRoomType['title']='What kind of Multi-Family Common Area'
          this.designRoomType['title2']='are you furnishing?'
        }
        if(this.designInfo.id==8){
          this.designRoomType['title']='What kind of Common Area'
          this.designRoomType['title2']='are you furnishing?'
        }
        this.design.is_show=false;
        this.addInfo.is_show=false;
      }
    },error=>{
      this.spinner.hide()
    })
  }
  selectRoom(data:any){
    this.roomInfo = {
      sub_id:data?.sgid,
      sub_type:data?.room_type_name
    }
  }
  getBudgetRange(){
    this.getBudget()
    this.design.is_show=false;
    this.designRoomType.is_show=false;
    this.addInfo.is_show=true;
    document.body.style.overflow="auto"
  }
  getBudget(){
    this.spinner.show()
    this.cMbService.getBudgetRange({budget_type:'1',design_type_id:this.designInfo.id}).subscribe((res:any)=>{
      this.spinner.hide()
      if(res?.statusCode==200){
        this.addInfo.budget=res?.result;
      }
    },error=>{
      this.spinner.hide()
    })
  }
  getStep(type) {
    let step: any = "";
    switch (type) {
      case "designRoomType":
        step = 2;
        break;
      case "additionalInfo":
        step = 3;
        break;
      case "inspiration":
        step = 4;
        break;

      default:
        step = 1;
        break;
    }
    return step;
  }
  navigation(data){
    let obj =  { id:this.designInfo?.id, type:this.designInfo?.type, sub_id:this.roomInfo?.sub_id, 
      sub_type:this.roomInfo?.sub_type, step: this.getStep(data),
      productType:this.productType,productId:this.prod_id,productSkuId:this.skuVariationId,
      addInfo:JSON.stringify(this.moodboardInfo.value) }
    
    this.router.navigate(["/admin/moodboard/create"], {
      queryParams: {
        params: this.encryptService.encryptData(obj)
      },
    });
  }
  

  randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
budgetOpt(data){
  
  this.moodboardInfo.patchValue({
    budget:data?.budget
  })
}

  createMB(){
    let userId = this.ls.getFromLocal();
    
    if(this.uuid==undefined)this.uuid=this.randomString(24, 'aA#');
    let form = this.moodboardInfo?.value;
    for(let key in form){
      form[key]= form[key] ? form[key]: 0
    }
    let budget
    console.group(form)
    if(form){
      budget = this.addInfo?.budget?.find(x=>x.budget==form.budget);
    }
    
    let obj={
      design_type:this.designInfo?.id,
      room_type: this.roomInfo?.sub_id ? this.roomInfo?.sub_id : '',
      token:this.uuid,
      budget_type:1,
      user_id:userId?.userId,
      budget_start: budget?.budget_start,
      budget_end: budget?.budget_end,
      image_url:this.inspIndex
    }
    
  
    if(this.moodboardInfo?.valid && this.uuid){
      this.spinner.show()
      this.cMbService.createWizard({...obj,...form}).subscribe((res:any)=>{
        this.spinner.hide()
        if(res?.statusCode==200){
          if(this.productType !=='productDetails'){
            this.toasterService.success(res?.message);
            localStorage.removeItem('mdFilter')
            localStorage.removeItem('mbSelectedProductFilters')
            localStorage.removeItem('mdSupplierFilter')
            this.router.navigate(['/admin/moodboard/view', res?.moodboard_id]);
          }
          if(this.productType =='productDetails'){
            this.toasterService.success(`Moodboard ${res?.moodboard_id}- ${res?.moodboard_name} Created Successfully`);
            this.router.navigate([`/admin/products/view/${this.prod_id}`],{queryParams:{skuid:this.skuVariationId,type:'mb'}});
          }
          document.body.style.overflow="auto"
        }
      },error=>{
        this.spinner.hide()
      })
    }
  }
  MoodboardTypeList(){
    this.cMbService.MoodboardTypeList().subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.moodboardType = res?.result;
      }
      this.mb_type_name = this.moodboardType.find(x=>x.type_id==this.moodboardInfo?.value?.moodboard_type_id)?.typename;
    },error=>{})
  }
  mbType(data){
    this.mb_type_name = data?.typename
    this.moodboardInfo.patchValue({
      moodboard_type_id:data?.type_id
    })
  }
  designTypeList(){
    this.cMbService.DesignTypeList().subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.designType = res?.result
      }
      this.design_type_value = this.designType.find(x=>x.sgid==this.moodboardInfo?.value?.design_type_id);
      
    },error=>{})
  }
  designValue(data){
    this.design_type_value = data;
    this.moodboardInfo.patchValue({
      design_type_id:data?.sgid
    })
  }
  // inpiratin API


}
