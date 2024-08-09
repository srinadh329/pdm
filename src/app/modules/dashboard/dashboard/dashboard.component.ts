import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';
import { DashboardService } from 'src/app/services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  showMenu = false;
  dashboardCounts: any = {};
  mySubscription: any;
  dashboardCount:any =[
   { 
    url: '/admin/products/list',
    image: 'assets/img/dashboard/Total_products.jpg',
    title: 'Total Live Products',
    name:'totalProduct'
  },
  {
    url: '/admin/products/list',
    image: 'assets/img/dashboard/total-supplier.png',
    title: 'Total Live Suppliers',
    name:'totalSupplier'
  },
  {
    url: '/admin/quote/list/all',
    image: 'assets/img/dashboard/customer.png',
    title: 'Active B2B Customers',
    name:'totalCustomer'
  },
  {
    url: '/admin/moodboard/list/all',
    image: 'assets/img/dashboard/Published_Quotes.png',
    title: 'Moodboards',
    name:'totalMoodboard'
  },
  {
    url: '/admin/projects/list',
    image: 'assets/img/dashboard/project-management.png',
    title: 'Projects',
    name:'totalProject'
  },
  {
    url: '/admin/quote/orders/all',
    image: 'assets/img/dashboard/Order_Created.png',
    title: 'Active B2B Orders',
    name:'totalOrder'
  },
  {
    url: '/admin/supplier/supplierHistory',
    image: 'assets/img/dashboard/history.png',
    title: 'Dashboard History for Supplier Load ',
  },
  ]
           
  constructor(private auth: AuthenticateService,
              private spinner: NgxSpinnerService,
              private shop: ItemsService,
              private route: Router,
              private dashboardservice: DashboardService,
             ) {
                // tslint:disable-next-line: only-arrow-functions
                this.route.routeReuseStrategy.shouldReuseRoute = function() {
                  return false;
                };
                this.mySubscription = this.route.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    // Trick the Route into believing it's last link wasn't previously loaded
                    this.route.navigated = false;
                  }
                }); }
  ngOnInit() {
    this.auth.currentMessage.subscribe(message => this.showMenu = message);
    // this.getCounts();
    this.getDashboardCounts();
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  getDashboardCounts() {
    this.spinner.show();
    this.dashboardservice.getDashboardData().subscribe(
      resp => {
        this.spinner.hide();
        if(resp){
          for(let key in resp){
            this.dashboardCount.forEach((x:any)=>{
              if(x.name==key){
                x['count'] = resp[key]
              }
            })
          }
        }
      },
      err => {
        this.spinner.hide();
      }
    );
  }
  
}
