import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';
@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {
  item:any={
    img:'',
    requestResult:[]
  }
  constructor( private route:ActivatedRoute,
    private shop: ItemsService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams["id"];
    if(id){
      this.inspirationDetails(id)
    }
  }
  inspirationDetails(id:any){
    this.spinner.show()
    this.shop.altRequestDetails({id:id}).subscribe((res:any)=>{
      this.spinner.hide()
      if(res?.statusCode==200){
        for(let item of res?.result?.items){
          
          item.request_json=JSON.parse(item?.request_json)
          item.response_json=JSON.parse(item?.response_json)
        }
        this.item={
          img:res?.result?.image_url,
          requestResult:res?.result
        }
      }
    },error=>{
      this.spinner.hide()
    })
  }
}
