import { Component, HostListener, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { QuoteService } from 'src/app/services/quote.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-myquote',
  templateUrl: './myquote.component.html',
  styleUrls: ['./myquote.component.css']
})
export class MyquoteComponent implements OnInit {
  count:number= 20;
  start:number= 0;
  param: { start: 0; count: 12; };
  isLoading: boolean;
  isMoreProdcuts:boolean = true;
  quotesList :any=[];

  selected: any;
  selectedNav: any;
  currentPage: any
 /**
   * Order Status Constant
   */
  orderStatus: any = {
    '1': 'Order Created',
    '2': 'Delivery in-progress',
    '3': 'Delivered',
    '4': 'Lease ended',
    '5': 'Test Order',
    '6': 'Order cancelled'
  }
  companyPlaceholder = "Select Company"
  selectedCompany ='';
  companyList = []
  selectedProject = '';
  projectList:any = [];
  productResult: any;
  constructor(private route:Router,
    private actRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private quoteservice: QuoteService,
    public auth: AuthenticateService,
    private sharedService : SharedService) { }

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe((params) => {
      this.selectedNav = params.get('type');
      
      this.getCompanyList('')
      // this.initQuotes();  
    });
    // check url
    this.currentPage = this.route.url
    
  }

  advanceSearchCompany(str){
    this.getCompanyList(str)
  }

   /**
   * Get Compony List 
   */
    getCompanyList(value){
      this.spinner.show();
      this.sharedService.getCompanyList({type:'quote'}).subscribe(list=>{
        this.spinner.hide();
        
        this.initQuotes()
        this.companyList = list;
      },()=> {
        this.spinner.hide();
        this.initQuotes()
         this.companyList = [];
      })
    }

    onProjectChnage(){
      this.start = 0;
      this.quotesList.splice(0);
      this.initQuotes();
    }

    onScroll(){
      this.initQuotes();
    }
    @HostListener('window:scroll', ['$event'])
    getScrollHeight(event: any) {
    
    let remaining = document.documentElement.scrollHeight  - (window.innerHeight + window.pageYOffset);
    if (Math.round(remaining) < 1200 && !this.isLoading && this.isMoreProdcuts ) {
      
      this.onScroll();
      
    }
  }

    getProjectList(){
      this.spinner.show();
      this.sharedService.getProjectList('?company_type=quote&company_name='+ this.selectedCompany).subscribe(list=>{
        this.spinner.hide()
       
        this.initQuotes();
        this.projectList =  list;
      },()=>{
        this.spinner.hide()
        
        this.initQuotes()
        this.projectList = []
      })
    }

  

    initQuotes(){
      // this.start = 0;
      // this.quotesList.splice(0);
      if (this.selectedNav === 'all') {
        this.getquotes();
      }  else {
        this.getMyQuotes();
      }
    }

  onCompanyChnage(value){
    this.start = 0;
      this.quotesList.splice(0);
    if (value === this.companyPlaceholder) {
      value = "";
    } 
    this.selectedCompany = value;
    this.selectedProject= ""
    this.projectList = [];
    if(value){
      this.getProjectList()
    } else {
      
      //this.initQuotes();
      this.getCompanyList('');
    }
  }
  createQuote(){
    this.route.navigate(['/admin/quote/create']);
  }
  
  getMyQuotes(){
    this.spinner.show();
    this.isLoading = true;
    this.quoteservice.getQuotes1(this.selectedCompany, this.selectedProject,this.start,this.count).subscribe(resp => {
      if(resp.statusCode === 200){
        this.spinner.hide();
        
        if(this.currentPage.includes('orders')){
          this.spinner.hide();
          this.isLoading = false;
          this.start +=20
          if( resp.quote && resp.quote.length){
            this.quotesList = [...this.quotesList,...resp.quote.filter(obj => obj.is_order == 'YES' )];
          }
          this.isMoreProdcuts =  resp.quote && resp.quote.length>10 ? true : false;
          }else{
          // this.quotesList = resp.quote;
          this.spinner.hide();
          this.isLoading = false;
          this.start +=20
          if( resp.quote && resp.quote.length)
            this.quotesList = [...this.quotesList,...resp.quote];
            this.isMoreProdcuts =  resp.quote && resp.quote.length>10 ? true : false;
          }
          
        
      }else{
        this.spinner.hide();
      }
     
    },error =>{
      this.spinner.hide();
    })
  }

  getquotes(){
    this.spinner.show();
    this.isLoading = true;
    this.quoteservice.getAllQuotes1(this.selectedCompany, this.selectedProject,this.start,this.count).subscribe(resp => {
      if(resp.statusCode === 200){
        this.spinner.hide();
        
        if(this.currentPage.includes('orders')){
          this.spinner.hide();
          this.isLoading = false;
          this.start +=20
          if( resp.quote && resp.quote.length){
            this.quotesList = [...this.quotesList,...resp.quote.filter(obj => obj.is_order == 'YES' )];
          }
          this.isMoreProdcuts =  resp.quote && resp.quote.length>10 ? true : false;
       
        }else{
          this.spinner.hide();
          this.isLoading = false;
          this.start +=20
          if( resp.quote && resp.quote.length)
      this.quotesList = [...this.quotesList,...resp.quote];
      this.isMoreProdcuts =  resp.quote && resp.quote.length>10 ? true : false;
        // this.quotesList = resp.quote;
        }
      }else{
        this.spinner.hide();
      }
     
    },error =>{
      this.spinner.hide();
    })


  }

  getBoards(type) {
    
    if(this.auth.getProfileInfo('role_type') == 2) {
      this.start=0;
      this.quotesList=[];
      this.route.navigate(['/admin/quote/list', "my"]);
      return
    } 
    else {
      this.start=0;
      this.quotesList=[];
      this.route.navigate(['/admin/quote/list', type]);
    }
    this.isMoreProdcuts=false;
  }
  getOrderBoards(type) {
    if(this.auth.getProfileInfo('role_type') == 2) {
      this.start=0;
      this.quotesList=[];
      this.route.navigate(['/admin/quote/orders', "my"]);
      return
    } 
    else {
      this.start=0;
      this.quotesList.splice(0);
      this.route.navigate(['/admin/quote/orders', type]);
    }
    this.isMoreProdcuts=false;
  }
  
}
