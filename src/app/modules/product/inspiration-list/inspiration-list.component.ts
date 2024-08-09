/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-inspiration-list',
  templateUrl: './inspiration-list.component.html',
  styleUrls: ['./inspiration-list.component.css']
})
export class InspirationListComponent implements OnInit {
  start:any=0;
  count:any=12;
  inspirationList: any=[];
  isLoading: boolean;
  isMoreProducts: boolean;
 
  today:any = new Date().toISOString().slice(0, 10);
  form_date:any;
  to_date:Date
  inspirationFilter: any;
  isSubmitted:boolean=false;
  constructor(private route:Router,
    private shop: ItemsService,
    private spinner: NgxSpinnerService, private fb:FormBuilder,) {
      this.inspirationFilter = this.fb.group({
        from_date:[this.today,Validators.required],
        to_date:[this.today,Validators.required]
      })
     }

  ngOnInit(): void {
  }
  itemsDetails(data:any){
    this.route.navigate(['/admin/products/inspirationDetails'],{queryParams:{id:data?.sgid}})
  }
  getInspirationItems(){
    this.spinner.show()
    this.isLoading = true;
    let obj={
      start:this.start,
      count:this.count
    }
    if(this.inspirationFilter.value){
      obj = {...obj,...this.inspirationFilter.value}
    }
    this.shop.getInspirationItems(obj).subscribe((res:any)=>{
      this.spinner.hide();
      this.isLoading = false;
      this.start += 12;
      if(res.statusCode==200){
        this.inspirationList = [...this.inspirationList,...res?.result];
      }
       
      this.isMoreProducts = res.result && res.result.length >=12 ? true : false;
       
    },error=>{
      this.spinner.hide();
    })
  }
   // onscroll
   @HostListener("window:scroll", ["$event"])
   getScrollHeight(event: any) {
     let remaining =
       document.documentElement.scrollHeight -
       (window.innerHeight + window.pageYOffset);
     if (Math.round(remaining) < 800 && !this.isLoading && this.isMoreProducts) {
       this.onScroll();
     }
 }
   onScroll() {
     this.getInspirationItems();
   }
 
   // onscroll
 
  //  filter date 
  FilterDateEvent(event:any,type:any){
    if (type == 'from_date') {
      this.inspirationFilter.patchValue({
        from_date:event.target.value
      })
      if(this.inspirationFilter.value.from_date > this.inspirationFilter.value.to_date){
        this.inspirationFilter.patchValue({
          to_date:''
        })
      }
    }
    if (type == 'to_date') {
      this.inspirationFilter.patchValue({
        to_date:event.target.value
      });
      if(this.inspirationFilter.value.from_date > this.inspirationFilter.value.to_date){
        this.inspirationFilter.patchValue({
          from_date:''
        })
      }
    }
    
  }


  // filter date

  filterResult(){
    if(this.inspirationFilter.valid){
      this.start=0;
      this.inspirationList=[];
      this.isSubmitted = true;
      this.getInspirationItems()
    }
  }


}