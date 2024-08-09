import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  showMenu = false;
  searchString = '';
  subscription: Subscription;
  showSearch: any = false;
  supplierId: any;
  is_show:boolean=true;
  noInventorySelected: any ='prod_name';
  coasterLogo = '../assets/images/coaster-logo.png';
  noInventoryAttr = [
    {name: 'Product Name', value: 'prod_name'},
    {name: 'Supplier SKU', value: 'supplier_sku'},
    {name: 'Inhabitr SKU', value: 'inhabitr_sku'},
  ];
  searchValue: any;
  inventory_value='prod_name'
  navLinks = [
    {name:'Dashboard',url:'/admin/dashboard'},
    {name:'Products',url:'/admin/products/list'},
    {name:'Projects',url:'/admin/projects/list'},
    {name:'Moodboards',url:'/admin/moodboard/list/all'},
    {name:'Quotes',url:'/admin/quote/list/all'},
    {name:'Orders',url:'/admin/quote/orders/all'},
    // {name:'Configuration',url:'/admin/B2Borderconfig'}
  ]
  navigationQueryParam:any;
  hideNav:boolean = true
  roleType: any;
  constructor(
    public auth: AuthenticateService,
    private rte: Router,
    private searchSer: SearchService,
     private ls: LocalStorageService,
     private router: Router,
     private _router : ActivatedRoute,
     ) {

      this.router.events.subscribe((event:any) => {
        if(event instanceof ActivationEnd) {
         let e:any = event;               
         if(e.snapshot.routeConfig.path == "imageLens" || e.snapshot.routeConfig.path == "roombuilder"){
          this.hideNav = false
         }
         if(e.snapshot._routerState.url.slice(0,25) == "/admin/products/imageLens"){
          this.is_show =false
         }
        }
        document.body.style.overflow="auto"
      })
      this.searchString = '';
    }

  toggleMenu() {
    this.showMenu =  !this.showMenu;
    this.auth.changeMessage(this.showMenu);
    const element = document.getElementsByClassName('sidebar_text');

    for (let i = 0; i < element.length; i++) {
      element[i].classList.add('hide');
    }
  }

  ngOnInit() {
    
    this.supplierId = this.ls.getItem('supplier_id');
    this.subscription = this.searchSer.getsearchShow().subscribe(message => {
      if (message) {
       this.showSearch = message;
        
        
      } else {
        this.showSearch = false;
      }
    });
    this.auth.currentMessage.subscribe(message => this.showMenu = message);
    this.roleType = JSON.parse(localStorage.getItem('role_type'));
  }
  logout() {
      // @ts-ignore
      
      google.accounts.id.disableAutoSelect()
      this.supplierId = this.ls.getItem('supplier_id');
      localStorage.clear();
      sessionStorage.removeItem('role_type');
      this.rte.navigate(['/login']);
  }
  navigate(type) {
    if (type === 'packages') {
      this.rte.navigate(['/admin/packages']);
    } else if (type === 'no-inventory') {
      this.rte.navigate(['/admin/no-inventory']);
    } else if (type === 'settings') {
      this.rte.navigate(['/admin/settings']);
    }
  }


  // onChange(event:any){
   
  // }
  inventoryValue(data){
    this.noInventorySelected =data
  }

  search() {
   
    this.searchSer.setHeaserSearch(true);
      this.rte.navigate(['/admin/products/list'], {queryParams: {search:this.noInventorySelected, keywords: this.searchString}});
      this.searchString = '';
      this.inventory_value='prod_name'
  }
}
