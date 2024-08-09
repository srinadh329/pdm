/* eslint-disable @angular-eslint/no-empty-lifecycle-method */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../../../services/items.service';
import { AuthenticateService } from '../../../services/authenticate.service';
import { CreateMoodboardService } from '../../../services/create-moodboard.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})

export class ItemDetailsComponent implements OnInit {
  skuVariationId:any;
  price:any
  selectedProduct: any;
  prod_id: string;
  monthNums = 12;
  totalQtyOfSku: number;
  priceIndex: any='rent';
  commonQty:number=1;
  leftImgId: any;
  productResult: any;
  button_type: number=0;
  lable: any;
  variation_id: any;
  @ViewChild('scrollDiv') scrollDiv: ElementRef | null = null;
  @ViewChild('colorDiv') colorDiv: ElementRef | null = null;
  attrList: any;
  searchList: any;
  priceDestails: any;
  countOfMatch: any;
  constructor( private itemsService: ItemsService,private spinner: NgxSpinnerService, 
    private router: Router,private route:ActivatedRoute,private toasterService: ToastrService,
    private cMbService: CreateMoodboardService, private modalService: NgbModal,
    private auth: AuthenticateService,
    private quoteservice: QuoteService,
    private ls: LocalStorageService,) {
      this.route.paramMap.subscribe((params) => {
        this.prod_id = params.get('id');
        this.getCategoryAndProducts();
      });
      this.skuVariationId = this.route.snapshot.queryParams['skuid'];
      this.variation_id = this.skuVariationId;
      let type = this.route.snapshot.queryParams['type']
      if(type=='mb'){
        this.openMbDialog()
      }
      if(type=='quote'){
        this.quoteDialog()
      }
   }
  
  ngOnInit(): void {
    this.localhostLister()
  } 

  localhostLister(){
    if(window.addEventListener) {
      window.addEventListener('storage',this._listener.bind(this),false)
    }
  }
  _listener(event){
   if(event.key ==='LENS_DATA'){
    this.getLensPriceDetails();
   }
  }
  getCategoryAndProducts(){
    let Userdetails = this.ls.getFromLocal();
    this.spinner.show()
    this.itemsService.getItem({product_id:this.prod_id,user_id:Userdetails.userId}).subscribe(responseList=>{
      this.spinner.hide();
      if(responseList){
        this.productResult = responseList.result
        let prod =  responseList.result;
        let variations = prod.variations.filter(x=> x.sgid==this.skuVariationId);
        let variation = variations[0];
        let color;
        if(prod?.bed_size?.length>0){
          color = prod?.color?.filter(x=>x.sku_variation_id ==this.variation_id && x.attribute_value !=='')
        }
        this.selectedProduct  ={
          category:prod.category,
          bed_size:prod?.bed_size?.filter(x=>x.attribute_value !==''),
          color:color ? color :prod?.color?.filter(x=>x.attribute_value !==''),
          category_id:prod.category_id,
          category_name:variation.category_name,
          description:prod.description,
          features:prod.features,
          dimension:variation?.dimension,
          attributes:variation?.attribute_info,
          mattress_size:prod.mattress_size,
          name:prod.name,
          sgid:prod.sg,
          sku:prod.sku,
          asset_value:variation.asset_value,
          buyPrice:variation.buy_new_price,
          buy_used_price:variation.buy_used_price,
          rental_price:variation.default_price.find(x=>x.month==12),
          quantity:this.skuVariationId?.quantity,
          default_image:variation.default_images.map(x=>x.image_url.small)[0],
          default_images:variation.default_images.map(x=>x.image_url.small),
          defaultImage:variation.default_images,
          other_variations:prod.variations,
          default_price:variation.default_price,
          warehouseLocations:variation?.warehouse_location_new,
          source:prod?.source,
          supplier_name:variation?.supplier,
          supplier_sku:variation?.supplier_sku,
          inhabitr_sku:variation?.inhabitr_sku,
          is_ops_db:variation?.is_ops_db,
          buy_new_multiplier:variation?.business_pdm_buy_new_multiplier,
          buy_used_multiplier:variation?.business_pdm_buy_used_multiplier,
          enableCheckbox:prod?.enableCheckbox
        }
        this.leftImgId = variation?.sgid
        let tots: number=0;
        let supTots: number=0;
        this.selectedProduct?.warehouseLocations.forEach(element => {
          if(element.is_inhabitr_warehouse == 'Y' && element.non_assigned_inv !== null) {
            tots += element.non_assigned_inv;
          }
          if(element.is_inhabitr_warehouse == 'N' && element.supplier_quantity !== null) {
            supTots += element.supplier_quantity;
          }
        });
        this.totalQtyOfSku = tots + supTots;
        this.getLensPriceDetails();
      }
    },error=>{
      this.spinner.hide();
    })
  }
  variationImage(img:any){
    
    this.selectedProduct.default_image = img
  }
  variationReuslt(data:any){
    this.spinner.show();
    this.leftImgId = data?.sgid;
    let prod = this.productResult;
    this.variation_id=data?.sgid ? data?.sgid : '';
    let variation = data;
    let color;
    if(prod?.bed_size?.length>0){
      color = prod?.color?.filter(x=>x.sku_variation_id ==data?.sgid && x.attribute_value !=='')
    }
    setTimeout(() => {
      if(prod && variation){
        this.selectedProduct  ={
          category:prod.category,
          bed_size:prod?.bed_size?.filter(x=>x.attribute_value !==''),
          color:color ? color :prod?.color?.filter(x=>x.attribute_value !==''),
          category_id:prod.category_id,
          category_name:variation.category_name,
          description:prod.description,
          features:prod.features,
          dimension:variation?.dimension,
          attributes:variation?.attribute_info,
          mattress_size:prod.mattress_size,
          name:prod.name,
          sgid:prod.sg,
          sku:prod.sku,
          asset_value:variation.asset_value,
          buyPrice:variation.buy_new_price,
          rental_price:variation.default_price.find(x=>x.month==12),
          quantity:this.skuVariationId?.quantity,
          default_image:variation.default_images.map(x=>x.image_url.small)[0],
          default_images:variation.default_images.map(x=>x.image_url.small),
          defaultImage:variation.default_images,
          other_variations:prod.variations,
          default_price:variation.default_price,
          warehouseLocations:variation?.warehouse_location_new,
          supplier_name:variation?.supplier,
          source:prod?.source,
          supplier_sku:variation?.supplier_sku,
          inhabitr_sku:variation?.inhabitr_sku,
          is_ops_db:variation?.is_ops_db,
          buy_new_multiplier:variation?.business_pdm_buy_new_multiplier,
          buy_used_multiplier:variation?.business_pdm_buy_used_multiplier,
          enableCheckbox:prod?.enableCheckbox
        }
        this.skuVariationId = data?.sku_variation_id;
        let tots: number=0;
        let supTots: number=0;
        this.selectedProduct?.warehouseLocations.forEach(element => {
          if(element.is_inhabitr_warehouse == 'Y' && element.non_assigned_inv !== null) {
            tots += element.non_assigned_inv;
          }
          if(element.is_inhabitr_warehouse == 'N' && element.supplier_quantity !== null) {
            supTots += element.supplier_quantity;
          }
        });
        this.totalQtyOfSku = tots + supTots;
        this.spinner.hide();
      }
    }, 200);
     
        
    
  }
  getLensPriceDetails(){
    let obj = this.selectedProduct.defaultImage[0]
    this.itemsService.getLensPriceDetails(this.prod_id,obj.sku_variation_id).subscribe((res:any) =>{
      if(res?.statusCode==200){
        this.priceDestails = res.result
      }
      if(res.result?.google_lens_info){
        let google_lens_info = JSON.parse(res.result?.google_lens_info);
        this.countOfMatch = google_lens_info?.item?.match?.length;
      } 
    })
  }
  updateRent(event:any){
    this.monthNums = event.target.value;
    let value =  this.selectedProduct?.default_price?.find(x=>x.month==event.target.value);
    this.selectedProduct.rental_price = value;
    
  }
  priceType(type:any){
    if(type=='rent'){
      this.button_type = 0
    }
    if(type=='buy'){
      this.button_type = 1
    }
    this.priceIndex = type
  }
  quanity(type,symbol){
    if(type=='minus' && symbol=='-'){
      if(this.commonQty==1){
        return
      }
      else{
        this.commonQty =this.commonQty - 1;
      }
    }
    if(type=='plus' && symbol=='+'){
      if(this.totalQtyOfSku >this.commonQty){
        this.commonQty =this.commonQty +1;
      }
      else{
        this.toasterService.error('Cannot increase quantity above available quantity')
      }
    }
  }
  openMbDialog(){
    let start = 0;
    let count = 20;
    this.spinner.show()
    this.cMbService.getMyMoodboards(null,null,start,count).subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.spinner.hide()
        this.dialog(res?.result)
      }
    })
  }
  dialog(data:any){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let mdData = {
      content:"Add/Select Moodboard",
      dialogType: "add-moodboard",
      res:data
    };
    modalRef.componentInstance.mbIn = mdData;
    modalRef.componentInstance.mbOp.subscribe((res) => {
      if (res?.type=='createDailog') {
        this.spinner.show();
        setTimeout(() => {
          modalRef.componentInstance.activeModal.close();
          this.router.navigate(['/admin/moodboard/create'],
          {queryParams: {step:'1',productType:'productDetails',productId:this.prod_id,productSkuId:this.skuVariationId}});
        }, 500);
       
      }
      if(res?.type=='addMb' && res?.mdId){
        this.addMb(res?.mdId,res?.name,null);
        modalRef.componentInstance.activeModal.close();
        this.router.navigate([`/admin/products/view/${this.prod_id}`],{queryParams:{skuid:this.skuVariationId}})
      }
    });
  }
  createDialog(){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let createmdData = {
      content:"",
      dialogType: "create-moodboard",
    };
    this.spinner.hide();
    modalRef.componentInstance.createMbIn = createmdData;
    modalRef.componentInstance.createMbOp.subscribe((res) => {
      if (res?.type=='created') {
        modalRef.componentInstance.activeModal.close();
        this.openMbDialog()
      }
    });
  }
  addMb(id:any,name:any,forceId:any){
    this.spinner.show()
    let obj={
      "mood_board_id": id,
      "product_ids": this.selectedProduct?.sgid,
      "user_id": this.auth.getProfileInfo('userId'),
      "sku":this.skuVariationId,
      "product_id": this.prod_id,
      "button_type": this.button_type,
      "quantity": this.commonQty,
      "month": this.monthNums,
      "other_user_id": '',
      "force_add": forceId
    }
    this.cMbService.addProdsToCart1(obj).subscribe((res:any)=>{
      this.spinner.hide();
      
      if(res.type=='INVALID_VARIATION'){
        this.variationPopUp(id,name,res)
      }
      if(res?.statusCode==200){
        this.toasterService.success('Product added successfully to ' + name);
      }
    },error=>{
      this.spinner.hide()
    })
  }
  variationPopUp(id:any,name:any,data){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let variationData = {
      dialogType: "variationpopup",
      id:id,
      name:name,
      res:data
    };
    modalRef.componentInstance.variationInData = variationData;
    modalRef.componentInstance.variationOpData.subscribe((res) => {
      modalRef.componentInstance.activeModal.close();
      
      this.addMb(res.id,res.name,res.force_add)
    });
  
  }
  sizeVariation(event){
    let data = this.selectedProduct?.other_variations.find(x=>x.sgid==event?.target?.value);
    if(data)this.variationReuslt(data);
    
  }
  scroll(data,type){
    if(type=='scroll'){
      this.scrollDiv?.nativeElement?.scrollBy(data, 0);
    }
    if(type=='color'){
      this.colorDiv?.nativeElement?.scrollBy(data, 0);
    }
  }
  priceOpt(type){
    if(type=='rent'){
      this.button_type = 0
    }
    if(type=='buy'){
      this.button_type = 1
    }
  }
  updatePopup(type){
    let title
    if(type=='product'){
      title='Update Product Name'
    }
    if(type=='assetPrice'){
      title='Update Inhabitr Asset Price'
    }
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let data = {
      content:title,
      dialogType: type,
      res: this.selectedProduct,
      type:type
    };
    modalRef.componentInstance.updateIn = data;
    modalRef.componentInstance.updateOp.subscribe((res:any)=>{
      modalRef.componentInstance.activeModal.close();
      if(res?.type=='product'){
        let obj={
          product_id:this.prod_id,
          product_name:res?.res.name
        }
        this.spinner.show()
        this.itemsService.updateProductName(obj).subscribe((res:any)=>{
          this.spinner.hide()
          if(res){
            this.toasterService.success(res?.message)
            this.getCategoryAndProducts()
          }
        },error=>{
          this.spinner.hide()
        })
      }
      if(res?.type=='assetPrice'){
        let Userdetails = this.ls.getFromLocal();
        const obj = {
          product_id : this.prod_id,
          variation_id: this.skuVariationId,
          asset_price: res?.res.asset_value,
          user_id:Userdetails.userId
        };
        this.spinner.show()
        this.itemsService.updateAssetPrice(obj).subscribe((res:any)=>{
          this.spinner.hide()
          if(res){
            this.toasterService.success(res?.message)
            this.getCategoryAndProducts()
          }
        },error=>{
          this.spinner.hide()
        })
      }
    })
  }
  attributePopUp(){
    this.getAttributes();
  }

  getAttributes() {
    this.spinner.show()
    this.itemsService.getCategoryRequiredAttribute({product_id:this.prod_id,sku_variation_id:this.skuVariationId}).subscribe((resp:any) => {
      this.attrList = resp.result;
      this.searchList = JSON.parse(JSON.stringify(resp.result));
      this.searchList.forEach((ele)=>{
        ele.attribute_list = [...ele.attribute_list,...[{sgid:'other',attribute_value:'Others',selected:'no'}]]
        ele['custom_value'] = '';
        ele['label_name'] = '';
        ele['search_value'] = '';
        ele['value']=''
      })
      this.attrList.forEach((ele)=>{
        ele.attribute_list = [...ele.attribute_list,...[{sgid:'other',attribute_value:'Others',selected:'no'}]]
        ele['custom_value'] = '';
        ele['label_name'] = '';
        ele['search_value'] = '';
        ele['value']='';
        if(ele?.name){
          let id = ele.attribute_list.find(x=>x.selected=='yes');
          ele.value = id?.sgid
          ele.label_name = id?.attribute_value
        }
      })
      this.getAttributeVariation();
    });
  }
  getAttributeVariation(){
    this.itemsService.getAttributeVariation({sku_variation_id:this.skuVariationId}).subscribe((res:any)=>{
      if(res){
        this.spinner.hide()
        if(this.attrList?.length){
          const modalRef = this.modalService.open(DialogComponent, {
            size: "md",
            backdrop: "static",
            centered: true,
          });
          let attrData = {
            content: "Update Attributes",
            dialogType: "attribute-popup",
            data:this.attrList,
            searchData: this.searchList,
            attrVariation:res?.result
          };
          modalRef.componentInstance.attrIp = attrData;
          modalRef.componentInstance.attrOp.subscribe((res: any) => {
            modalRef.componentInstance.activeModal.close();
            if(res?.type=='update-attribute'){
              this.saveAttr()
            }
            if(res?.type=='delete-variation'){
              this.deletePopUp(res?.result,res?.type)
            }
            if(res?.type=='delete-multiple-variation'){
              this.deletePopUp(res?.result,res?.type)
            }
          });
        }
      }
    })
  }
  deletePopUp(res,type){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let deleteData = {
      content: "",
      dialogType: "delete-popup",
      data:res,
    };
    modalRef.componentInstance.deleteIp = deleteData;
    modalRef.componentInstance.deleteOp.subscribe((res: any) => {
      modalRef.componentInstance.activeModal.close();
      if(res?.type=='yes' && type=='delete-variation'){
        this.deleteAttribute(res?.data)
      }
      if(res?.type=='yes' && type=='delete-multiple-variation'){
        this.deleteMulitpleAtrr(res?.data)
      }
      if(res?.type=='no'){
        this.getAttributes()
      }
    });
  }
  deleteMulitpleAtrr(data){
    data.map((x:any)=>{
      delete x.attribute_list_id,
      delete x.attribute_value,
      delete x.name,
      delete x.slug,
      delete x.type
    });
    console.log(data)
    this.spinner.show()
    let obj={
      sku_variation_id:this.skuVariationId,
      delete_attributes:data
    }
    this.itemsService.deleteMultiAttr(obj).subscribe((res:any)=>{
      this.spinner.hide();
      if(res){
        this.toasterService.success('Attributes Deleted')
        this.getAttributes();
        this.getCategoryAndProducts()
      }
    })
  }
  deleteAttribute(data){
    this.spinner.show()
    let obj={
      sku_variation_id:this.skuVariationId,
      attribute_variation_id:data?.attribute_variation_id,
      attribute_id:data?.attribute_id
    }
    this.itemsService.deleteAttribute(obj).subscribe((res:any)=>{
      
      this.spinner.hide();
      if(res){
        this.toasterService.success('Attribute Deleted')
        this.getAttributes();
        this.getCategoryAndProducts()
      }
    })
  }
  saveAttr() {
    
    let data = {}
    for(let item of this.attrList){
      if(item.value){
      data[item.name.toLowerCase()] =  {list_id: item?.list_id,
        sgid:item?.value,
        other_value:item?.custom_value
        }
      }
    }
    this.spinner.show() 
    this.itemsService.SaveAttribute({sku_variation_id:this.skuVariationId,attributes:data}).subscribe((resp:any) => {
      if(resp.message == "Attribute updated") {
        this.spinner.hide()
        this.toasterService.success("Attributes  updated successfully")
        this.getCategoryAndProducts()
        // this.attr_form.reset();
        // this.editAttr=false
      } else {
        this.toasterService.error("Error")
      }
    })
  }

  serialize (obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  imageLens(){
    let obj = this.selectedProduct.defaultImage[0];
    
    let params={
      image:obj.image_url.large,
      img_sgid:obj.sgid,
      product_id:this.prod_id,
      variation_id:obj.sku_variation_id
    }
    let param = this.serialize(params)
    window.open(`${window.origin}/admin/products/imageLens?${param}`,'_blank')
  }
  getHistory(){
    this.spinner.show()
    this.quoteservice.getHistryDetials(this.prod_id,this.skuVariationId).subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        const modalRef = this.modalService.open(DialogComponent, {
          size: "md",
          backdrop: "static",
          centered: true,
        });
        let assetPrice = {
          content: "Asset Price History",
          dialogType: "asset_price_history",
          data:res?.result,
        };
        modalRef.componentInstance.assetPriceHistory = assetPrice;
      }
    },error=>{
      this.spinner.hide()
    })
  }
  builderDetails(data){

  }
  quoteDialog(){
    this.spinner.show()
    this.quoteservice.getQuotes('','').subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        const modalRef = this.modalService.open(DialogComponent, {
          size: "md",
          backdrop: "static",
          centered: true,
        });
        let quoteData = {
          content: "Add/Select Quote",
          dialogType: "product_quote",
          data:res?.quote,
        };
        modalRef.componentInstance.quoteIn = quoteData;
        modalRef.componentInstance.quoteOp.subscribe((res:any)=>{
          modalRef.componentInstance.activeModal.close();
          if(res?.type=='createQuoteDailog'){
            this.router.navigate(['/admin/quote/create'],
            {queryParams: {productType:'productDetails',productId:this.prod_id,productSkuId:this.skuVariationId}});
          }
          if(res?.type=='floor'){
            this.spinner.show()
            this.quoteservice.getFloorPlanDetails(res?.data.sgid).subscribe((floor:any)=>{
              this.spinner.hide()
              if(!floor?.result?.length){
                this.openFloorPlanDialog(res?.data.sgid)
              }
              else if(floor){
                this.quoteservice.getFloorplanUnits(floor?.result[0].sgid,res?.data.sgid).subscribe((unit:any)=>{
                 this.spinner.hide()
                  if(unit){
                    this.quoteAdd(res?.data,floor,unit)
                  }
                },error=>{
                  this.spinner.hide()
                })
              }
            },error=>{
              this.spinner.hide()
            })
          }
          
        })
      }
      
    },error=>{
      this.spinner.hide()
    })
  }
  openFloorPlanDialog(id){
    this.spinner.show()
    this.quoteservice.getFloorTypes().subscribe((res:any)=>{
      this.spinner.hide()
      const modalRef = this.modalService.open(DialogComponent, {
        size: "md",
        backdrop: "static",
        centered: true,
      });
      let floorPlan = {
        res: res?.result,
        dialogType: "add-floor-plan",
        title:'Add Floor Plans',
        quote:id
      };
      modalRef.componentInstance.floorPlanInData = floorPlan;
      modalRef.componentInstance.floorPlanOpData.subscribe((res:any)=>{
        modalRef.componentInstance.activeModal.close();
        res['quote_id']=id
        res['user_id'] = this.auth.getProfileInfo('userId')
        if(res){
          this.spinner.show()
          this.quoteservice.addFloorPlan(res).subscribe((res:any)=>{
            this.spinner.hide()
            if(res){
              this.toasterService.success(res?.message)
              this.quoteDialog()
            }
          })
        }
      })
    },error=>{
      this.spinner.hide()
    })
  }
  quoteAdd(quote,floor,unit){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let addquote = {
      content: "Add",
      dialogType: "add_quote",
      quoteDetails:quote,
      floorDetails:floor?.result,
      unitDetails:unit?.result
    };
    modalRef.componentInstance.addQuoteIn = addquote;
    modalRef.componentInstance.addQuoteOp.subscribe((res:any)=>{
      modalRef.componentInstance.activeModal.close();
      if(res){
        res['product_id'] = this.prod_id;
        res['user_id'] = this.auth.getProfileInfo('userId'),
        res['sku'] = this.skuVariationId,
        res['quantity'] = this.commonQty
        res['button_type'] = this.button_type,
        res['month'] = this.monthNums
        res['warehouse_id'] = this.selectedProduct?.warehouseLocations[0]?.warehouse_id;
        this.spinner.show()
        this.quoteservice.addProductToQuoteWithoutMoodBoard(res).subscribe((resp:any)=>{
          this.spinner.hide()
          if(resp){
            this.toasterService.success(resp?.result);
            this.router.navigate(['/admin/products/view/'+this.prod_id],
            {queryParams: {skuid:this.skuVariationId}})
          }
        },error=>{
          this.spinner.hide();
          this.toasterService.error(error?.result)
        })
      }
    })
  }
  registerInOps(){
    this.spinner.show()
    this.itemsService.registerInOps(this.prod_id,this.skuVariationId ).subscribe(res => {
      this.spinner.hide()
      if(res.statusCode==200){
       this.toasterService.success('messages.SUCCESSFUL_REGISTER_OPS')
      }
    },error=>{
      this.spinner.show()
      this.toasterService.error(error.result)
    });
  }
  categoryPopup(){
    this.spinner.show()
    this.itemsService.getProductCategoryList().subscribe(resp => {
      this.spinner.hide()
      if (resp.statusCode === 200) {
          for(let item of resp?.result){
            if(item.sgid==this.selectedProduct.category_id){
              item['selected']=true
            }
            else{
              item['selected']=false
            }
          }
        const modalRef = this.modalService.open(DialogComponent, {
          size: "lg",
          backdrop: "static",
          centered: true,
        });
        let addquote = {
          content: "Product Categories",
          dialogType: "product-category",
          res:resp?.result,
        };
        modalRef.componentInstance.prodcutCategoryIn = addquote;
        modalRef.componentInstance.prodcutCategoryOp.subscribe((res:any)=>{
          modalRef.componentInstance.activeModal.close();
          if(res){
            this.spinner.show()
            this.itemsService.updateProductCategoryName(this.prod_id,res).subscribe((resp:any)=>{
              this.spinner.hide()
              if(resp){
                this.toasterService.success(resp?.message);
                this.getCategoryAndProducts()
              }
            },error=>{
              this.spinner.hide()
            })
          }
        })
      }
  },error=>{
    this.spinner.hide()
  })
    
  }
  ngOnDestroy(){
    window.removeEventListener('storage',()=>{},false)
  }
  setDefalutImg(data){
    this.spinner.show()
    let img_info = this.selectedProduct.defaultImage.find((x:any)=>x.image_url.large==data)

    this.itemsService.setDefalutImg({variation_id:img_info?.sku_variation_id,image_id:img_info?.sgid}).subscribe((res:any)=>{
      this.spinner.hide()
      if(res){
        this.toasterService.success("Default Image Updated");
        this.getCategoryAndProducts();
      }
    })
  }
  imgUploadPopup(){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let imguploadInData = {
      content:"",
      dialogType: "img-upload-popup",
    };
    // document.body.style.overflow = 'hidden';
    modalRef.componentInstance.imguploadIn = imguploadInData;
  }
}