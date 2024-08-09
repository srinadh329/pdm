import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-lens',
  templateUrl: './image-lens.component.html',
  styleUrls: ['./image-lens.component.css']
})
export class ImageLensComponent implements OnInit {

  similarProducts = [];
  otherAttributes;
  google_lens_info;
  constructor(private route: ActivatedRoute, private http: HttpClient,private item: ItemsService,
    private spinner: NgxSpinnerService) {
    let queryParams = this.route.snapshot.queryParams
    
    if(Object.keys(queryParams).length){
      this.fetchLensData(queryParams)
    }
    
   }
  
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // this.getLensData();
   
   
  }
  countOfMatch:any;
  fetchLensData(obj){
    this.spinner.show();
    this.item.getGoogleLensPrice(obj).subscribe((res:any)=>{
      if(res.statusCode==200){
        this.otherAttributes = res?.result;
        this.google_lens_info = JSON.parse(res.result?.google_lens_info);
        this.similarProducts = this.google_lens_info?.item?.match;
        this.countOfMatch = this.google_lens_info.item?.match?.length;
      }
      
      localStorage.setItem('LENS_DATA',JSON.stringify(
        {sgid:res?.result?.product_id,sku_variation_id:res?.result?.sku_variation_id}
      ))
      this.spinner.hide();
    })
  }

}
