import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { SharedService } from 'src/app/services/shared.service';
import { ProjectService } from 'src/app/services/project.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  activeIndex: any='allProjects';
  projectTable: any=[];
  user_id: any;
  companyList: any;
  companyId: any ="";
  selectedCompanyId: any = '';
  start:any=0;
  count:any=20;
  orderInfo:any=[
    {type:'RTR',value:'RTR'},
    {type:'RTO',value:'RTO'},
    {type:'Sale',value:'Sale'}
  ]
  company:any;
  projectName:any;
  isLoading:boolean;
  isMoreProdcuts:boolean=true;
  project_id:any;
  constructor(private route:Router, 
    private projectService: ProjectService,
    private authService: AuthenticateService,
    private toasterService: ToastrService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private ls: LocalStorageService,
    private sharedservice: SharedService,
    private actRoute: ActivatedRoute,
    ) {
      
      this.getCompanyList();
     }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe((res:any)=>{
      
     if(res?.id){
      this.project_id=res?.id;
      this.singleProject(res?.id)
     }
     else{
      this.projectList();
     }
    })
  }
  
  @HostListener('window:scroll', ['$event'])
  
    getScrollHeight(event: any) {
      let remaining =
      document.documentElement.scrollHeight -
      (window.innerHeight + window.pageYOffset);
    if (Math.round(remaining) < 800 && !this.isLoading && this.isMoreProdcuts) {
      this.projectList();
    }
  }
  projectList(){
    this.spinner.show();
    this.isLoading=true;
    this.projectService.getProjectList({start:this.start,count:this.count,
      company_id:this.company?.sgid ? this.company?.sgid:'',
      project_name:this.projectName ? this.projectName:'' }).subscribe((res:any)=>{
      this.spinner.hide()
      this.isLoading=false;
      this.start +=20;
      if(res){
        this.projectTable=[... this.projectTable,...res?.result];
      }
      this.isMoreProdcuts = res.result && res.result.length ? true : false;
    },error=>{
      this.spinner.hide()
    })
  }
  singleProject(id:any,value?){
    this.projectService.getProjectList({project_id:id}).subscribe((res:any)=>{
      
      if(res){
        this.projectTable=res?.result;
      }
      this.isMoreProdcuts = res.result && res.result.length>=20 ? true : false;
      if(res?.result){
        this.dialog(res?.result)
      }
      
    })
  }
  dialog(res){
    let data = res[0]
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: 'lg',
      backdrop: "static",
      centered: true,
    });
    data['user_id']=this.ls.getFromLocal().userId;
    data['sgid']=data?.project_id;
    let companyData = {
      title:'Edit Project',
      dialogType: 'project_edit',
      res:data,
      orderData:this.orderInfo,
      type:'edit'
    };
    modalRef.componentInstance.projectEditInData = companyData;
    modalRef.componentInstance.projectEditOpData.subscribe((res:any)=>{
      modalRef.componentInstance.activeModal.close();
      if(res){
        this.start=0;
        this.projectTable=[];
        this.singleProject(this.project_id,false)
      }
    })
  }
  editProject(data,type){
    
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: 'lg',
      backdrop: "static",
      centered: true,
    });
    let companyData;
    if(type=='create'){
      companyData = {
        title:'Create Project',
        dialogType: 'project_edit',
        companyData:this.companyList,
        orderData:this.orderInfo,
        type:type,
        user_id:this.ls.getFromLocal().userId
      };
    }
    if(type=='edit'){
      data['user_id']=this.ls.getFromLocal().userId;
      data['sgid']=data?.project_id;
      companyData = {
        title:'Edit Project',
        dialogType: 'project_edit',
        res:data,
        orderData:this.orderInfo,
        type:type
      };
    }
    
    modalRef.componentInstance.projectEditInData = companyData;
    modalRef.componentInstance.projectEditOpData.subscribe((res:any)=>{
      modalRef.componentInstance.activeModal.close();
      if(res){
        this.start=0;
        this.projectTable=[];
        this.projectList()
      }
    })
  }

  getCompanyList() {
    let userId = this.authService.getProfileInfo("userId");
    this.sharedservice.getCompanyList({ company_type: "quote", user_id: userId})
      .subscribe(
        (res: any) => {
          if (res) {
            this.companyList = res;
          }
          
        },
        (error) => {}
      );
  }
  selectCompany(data){
    this.start=0;
    this.projectTable=[];
    this.projectName='';
    if(data){
      this.company=data;
    }
    this.projectList()
  }
  selectProject(data){
    this.start=0;
    this.projectTable=[];
    this.projectName=data;
    this.projectList()
  }
  createProject(){

  }
}
