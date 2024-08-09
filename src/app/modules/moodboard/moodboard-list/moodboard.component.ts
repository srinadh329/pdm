import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { SharedService } from 'src/app/services/shared.service';
import { MoodboardDailogComponent } from 'src/app/modules/moodboard/moodboard-dailog/moodboard-dailog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './moodboard.component.html',
  styleUrls: ['./moodboard.component.css']
})

export class MoodboardComponent implements OnInit {
  count:number= 6;
  start:number= 0;
  param: { start: 0; count: 12; }
  isLoading: boolean=true;
  isMoreProdcuts:boolean = true;
  filterType:any='segment'
  sgementList: any=[];
  companyResult: any=[];
  roomType: any=[];
  designId: any='';
  roomId:any = '';
  companyId:any='';
  ProjectId:any='';
  user_id: any='';
  mdFilterList: any;
  constructor(private auth: AuthenticateService,
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private mbservice: CreateMoodboardService,
    private toastr: ToastrService,
    private ls: LocalStorageService,
    private sharedService: SharedService,
    private modalService: NgbModal,
  ) { }
  showMenu = false;
  showStudio = false;
  showBoards = true;
  listQuote = false;
  hideOnPrint = false;
  moodboardData: any=[];
  data = [];
  UserId: any;

  selected: any;
  selectedNav: any;
  mytype: any = 'all';

  selectedCompany:any = "";
  companyPlaceholder = "Select Company";
  companyList = []
  selectedProject = "";
  projectPlaceholder = 'Select Project';
  projectList:any = [];

  ngOnInit() {
    let Userdetails = this.ls.getFromLocal();
    this.UserId = Userdetails.userId;
    this.auth.currentMessage.subscribe(message => this.showMenu = message);
    this.actRoute.paramMap.subscribe((params) => {
      
      this.selectedNav = params.get('type');
      this.mytype=params.get('type');
      this.user_id = this.UserId;
     
      this.roomId='';
      this.designId='';
      this.companyId='';
      this.ProjectId='';
      this.mbList(this.filterType)
      this.initMoodboards();
    });
    let listingFilter = JSON.parse(localStorage.getItem("mbFilterList")) ? JSON.parse(localStorage.getItem("mbFilterList")) :'';
    this.filterType = listingFilter?.mb_filter_type;
   
    if(listingFilter?.type =='all'){
      this.mbList(listingFilter?.mb_filter_type);
      if(listingFilter?.mb_filter_type=='segment'){
        this.selectSegement(listingFilter?.segment_type_id);
        setTimeout(() => {
          this.selectRoomType(listingFilter?.room_type_id);
        }, 1500);
      }
      if(listingFilter?.mb_filter_type=='company'){
        this.selectCompany(listingFilter?.company_id);
        setTimeout(() => {
          this.selectProject(listingFilter?.project_id);
        }, 1500);
       
      }
    }
    if(listingFilter?.type =='my'){
      this.mbList(listingFilter?.mb_filter_type)
      if(listingFilter?.mb_filter_type=='segment'){
        this.selectSegement(listingFilter?.segment_type_id);
        setTimeout(() => {
          this.selectRoomType(listingFilter?.room_type_id);
        }, 1500);
        
      }
      if(listingFilter?.mb_filter_type=='company'){
        this.selectCompany(listingFilter?.company_id);
        setTimeout(() => {
          this.selectProject(listingFilter?.project_id);
        }, 1500);
      }
    }
    else{
      this.filterType='segment';
      // this.mbList(this.filterType)
      // this.initMoodboards();
    }
    
  }

  initMoodboards() {
   
    // 
    if (this.selectedNav === 'all') {
      
      let obj={
        mb_filter_type:this.filterType,
        start:this.start,
        count:this.count,
        segment_type_id:this.designId,
        room_type_id:this.roomId,
        company_id:this.companyId,
        project_id:this.ProjectId,
      }
      
      this.getMoodboards(obj);
    
    } else if (this.selectedNav === 'my') {
      let obj={
        mb_filter_type:this.filterType,
        start:this.start,
        count:this.count,
        user_id:this.UserId,
        segment_type_id:this.designId,
        room_type_id:this.roomId,
        company_id:this.companyId,
        project_id:this.ProjectId,
      }
      this.getMoodboards(obj);
    }
    else if (this.selectedNav === 'disable') {
      let obj={
        mb_filter_type:this.filterType,
        start:this.start,
        count:this.count,
        user_id:this.UserId,
        section:'disable',
        segment_type_id:this.designId,
        room_type_id:this.roomId,
        company_id:this.companyId,
        project_id:this.ProjectId,
      }
      this.getMoodboards(obj);
    }
   
  }
  getBoards(type) {
    this.mytype = type;
    this.selectedProject='';
    this.route.navigate(['/admin/moodboard/list', type]);
    this.start=0;
  }
  createMooodBoard() {
    this.route.navigate(['/admin/moodboard/create'],{queryParams: {step:'1'}});
  }
  
  arrowLoad(type){
    
    if(type=="left"){    
      if(this.start==6){
        this.moodboardData=[];
        this.start =0
        this.initMoodboards();
        return
      }
      if(this.start ==0){
        return
      }
      else{
        this.moodboardData=[];
        this.start -=6
        this.initMoodboards();
      }
     
    }
    if(type=="right" && this.isMoreProdcuts){
      this.moodboardData=[];
      this.start +=6
      this.initMoodboards();
    }
  }
  getMoodboards(data) {
    this.spinner.show();
    this.isLoading = true;
    this.mbservice.mbFilterType(data).subscribe((resp:any) => {
      if(resp?.statusCode==200){
        this.spinner.hide();
        this.isLoading = false;
          if( resp.result && resp.result.length)
          this.moodboardData = resp.result;
          this.isMoreProdcuts =  resp.result && resp.result.length >= 6 ? true : false;    
      }
     
    },error=>{
    this.isLoading = false;
      this.spinner.hide();
    });
  }

  ActiveMoodboard(moodboardid, userid) {
    this.mbservice.ActivateModdboard(moodboardid, userid).subscribe((resp) => {
      this.moodboardData=[];
      let obj={
        mb_filter_type:'segment',
        start:0,
        count:this.count,
        user_id:this.UserId,
        section:'disable'
      }
      this.getMoodboards(obj);
      this.toastr.success("Moodboard Enabled Successfully");
      this.spinner.hide();
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
        
        this.DeleteModdboard(data.sgid,data.userid)
      }
   
    });
  }
  DeleteModdboard(moodboardid, userid) {
    this.spinner.show()
    this.mbservice.DeleteModdboard(moodboardid, userid).subscribe((resp) => {
      this.moodboardData=[];
      this.spinner.hide();
      if (this.selectedNav == 'all') {
        let obj={
          mb_filter_type:'segment',
          start:0,
          count:this.count
        }
        this.getMoodboards(obj);
      }
      else if (this.selectedNav == 'my') {
        let obj={
          mb_filter_type:'segment',
          start:0,
          count:this.count,
          user_id:this.UserId
        }
        this.getMoodboards(obj);
      }
      this.toastr.success("Moodboard Disabled Successfully");
      this.spinner.hide();
    });
  }
  details(id) {
    this.route.navigate(['/admin/moodboard/view', id]);
    let obj
    if(this.designId || this.roomId){
      obj = {
        mb_filter_type:this.filterType,
        segment_type_id:this.designId,
        room_type_id:this.roomId,
        type:this.selectedNav
      }
      localStorage.setItem('mbFilterList',JSON.stringify(obj))
    }
    if(this.companyId || this.ProjectId){
      obj = {
        mb_filter_type:this.filterType,
        company_id:this.companyId,
        project_id:this.ProjectId,
        type:this.selectedNav
      }
      localStorage.setItem('mbFilterList',JSON.stringify(obj))
    }
   
  }
  mbFiler(data){
    this.filterType=data;
    this.start=0;
    
    if(data=='segment'){
      this.companyId='';
      this.ProjectId='';
      this.mbList(this.filterType);
      this.initMoodboards()
    }
    if(data=='company'){
      this.designId='';
      this.roomId='';
      this.mbList(this.filterType);
      this.initMoodboards()
    }

  }
  mbList(data){
    this.spinner.show()
      this.mbservice.mbFilterSegement({mb_filter_type:data}).subscribe((res:any)=>{
        
        this.spinner.hide()
        if(res?.statusCode==200){
          if(data=='segment'){
            this.sgementList = res?.result.sort((a:any,b:any)=>a.segment_type.localeCompare(b.segment_type));
            
          }
          if(data==='company'){
            this.companyResult = res?.result;
          }
        }
        
      })
  }
  selectSegement(data:any){
    this.spinner.show()
    this.roomId='';
    this.start=0;
    this.designId= data
   
    let obj;
    this.mbservice.getDesignType({design_type:data}).subscribe((res:any)=>{
      
      this.spinner.hide();
      if(res?.statusCode==200){
        this.roomType = res.result
      }
    })
    if (this.selectedNav == 'all') {
      obj={
        mb_filter_type:this.filterType,
        segment_type_id:data,
        room_type_id:'',
        start:0,
        count:this.count
      }
    }
    if (this.selectedNav == 'my') {
      obj={
        mb_filter_type:this.filterType,
        segment_type_id:data,
        room_type_id:'',
        start:0,
        count:this.count,
        user_id:this.UserId,
      }
    }
    if (this.selectedNav == 'disable') {
      obj={
        mb_filter_type:this.filterType,
        segment_type_id:data,
        room_type_id:'',
        start:0,
        count:this.count,
        user_id:this.UserId,
        section:'disable'
      }
      
    }
    this.moodboardData=[];
    this.getMoodboards(obj);
  }
  selectRoomType(data){
    this.roomId = data;
    let obj;
   
    if (this.selectedNav == 'all') {
      obj={
        mb_filter_type:this.filterType,
        segment_type_id:this.designId,
        room_type_id:data,
        start:0,
        count:this.count
      }
     
      
    }
    if (this.selectedNav == 'my') {
      obj={
        mb_filter_type:this.filterType,
        segment_type_id:this.designId,
        room_type_id:data,
        start:0,
        count:this.count,
        user_id:this.UserId,
      }
    }
    if (this.selectedNav == 'disable') {
      obj={
        mb_filter_type:this.filterType,
        segment_type_id:this.designId,
        room_type_id:data,
        start:0,
        count:this.count,
        user_id:this.UserId,
        section:'disable'
      }
    }
    this.moodboardData=[];
    this.getMoodboards(obj);
  }
  selectCompany(data:any){
    this.start=0;
    this.companyId = data;
    this.moodboardData=[];
    this.spinner.show();
    this.mbservice.getProjectListNew({company_id:data}).subscribe((res:any) => {
      this.spinner.hide()
      if(res?.statusCode==200){
        if(res?.result=='No Data Found'){
          this.projectList = [];
        } 
        else{
          this.projectList = res?.result;
          
        }
       
      }
      
    },error=>{
      this.spinner.hide()
    });
    if (this.selectedNav == 'all') {
      let obj={
        mb_filter_type:this.filterType,
        company_id:data,
        project_id:'',
        start:0,
        count:this.count
      }
      this.getMoodboards(obj);
    }
    if(this.selectedNav == 'my'){
      let obj = {
        mb_filter_type:this.filterType,
        company_id:data,
        project_id:'',
        start:0,
        count:this.count,
        user_id:this.user_id
      }
      this.moodboardData=[];
      this.getMoodboards(obj);
    }
    if(this.selectedNav == 'disable'){
      let obj = {
        mb_filter_type:this.filterType,
        company_id:data,
        project_id:'',
        start:0,
        count:this.count,
        user_id:this.user_id,
        section:'disable'
      }
      this.moodboardData=[];
      this.getMoodboards(obj);
    }
  }
  selectProject(data){
    this.ProjectId=data;
    if (this.selectedNav == 'all') {
      let obj={
        mb_filter_type:this.filterType,
        company_id:this.companyId,
        project_id:data,
        start:0,
        count:this.count
      }
      this.moodboardData=[];
      this.getMoodboards(obj);
    }
    if(this.selectedNav == 'my'){
      let obj = {
        mb_filter_type:this.filterType,
        company_id:this.companyId,
        project_id:data,
        start:0,
        count:this.count,
        user_id:this.user_id
      }
      this.moodboardData=[];
      this.getMoodboards(obj);
    }
    if(this.selectedNav == 'disable'){
      let obj = {
        mb_filter_type:this.filterType,
        company_id:this.companyId,
        project_id:data,
        start:0,
        count:this.count,
        user_id:this.user_id,
        section:'disable'
      }
      this.moodboardData=[];
      this.getMoodboards(obj);
    }
  }
  clearFilter(){
    localStorage.removeItem('mbFilterList')
    this.roomId='';
    this.designId='';
    this.companyId='';
    this.ProjectId='';
    this.start=0;
    this.moodboardData=[];
    this.initMoodboards();
  }
}

