import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';
import { DialogComponent } from '../dialog/dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inspiration-details',
  templateUrl: './inspiration-details.component.html',
  styleUrls: ['./inspiration-details.component.css']
})
export class InspirationDetailsComponent implements OnInit {
  item:any={
    budget:'',
    created_at:'',
    image_url:'',
    lights:'',
    matching_requests:'',
    package_request:'',
    packages:'',
    segmented_image_url:'',
  }
  constructor( private route:ActivatedRoute,
    private shop: ItemsService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,) { 

  }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams["id"];
    if(id){
      this.inspirationDetails(id)
    }
  }
  inspirationDetails(id:any){
    this.spinner.show()
    this.shop.inspirationDetails({sgid:id}).subscribe((res:any)=>{
      this.spinner.hide();
      
      if(res?.statusCode==200){
        for(let data of res?.result?.packages){
          let totalValue = 0
          data?.items.forEach((ele:any)=>{
            totalValue += Number(ele?.buy_price)
          })
          data['total'] = totalValue;
        }
        for(let item of res?.result?.matching_requests){
          
          item.request_json=JSON.parse(item?.request_json)
          item.response_json=JSON.parse(item?.response_json)
        }
        this.item={
          budget:res?.result?.budget,
          created_at:res?.result?.created_at,
          image_url:res?.result?.image_url,
          lights:res?.result?.lights,
          matching_requests:res?.result?.matching_requests,
          package_request:res?.result?.package_request ? JSON.parse(res?.result?.package_request) : '',
          packages:res?.result?.packages,
          segmented_image_url:res?.result?.segmented_image_url,
        }
      }
      
    },error=>{
      this.spinner.hide()
    })
  }
  segmentView(){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let segmentData = {
      content:"",
      dialogType: "segment-view",
      url:this.item?.segmented_image_url
    };
    this.spinner.hide();
    modalRef.componentInstance.segmentIn = segmentData;
  }
}