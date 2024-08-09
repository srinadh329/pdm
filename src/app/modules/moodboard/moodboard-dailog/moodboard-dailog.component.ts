import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { ItemsService } from 'src/app/services/items.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-moodboard-dailog',
  templateUrl: './moodboard-dailog.component.html',
  styleUrls: ['./moodboard-dailog.component.css']
})
export class MoodboardDailogComponent implements OnInit {
  @Input() mbTypeInData;
  @Input() categoryInData;
  @Input() supplierInData;
  @Input() productDetailsInData;
  @Input() shareMbInData;
  @Input() variationInData:any;
  @Input() prodDeleteInData:any;
  @Input() segementInData:any;
  @Input() inspLibInData:any;
  @Input() mbDetailsInData:any;
  @Input() filterInData:any;
  @Input() cityInData:any;
  @Input() attributeInData:any;
  @Input() warehouseInData:any;
  @Input() updateOldMbIn:any;
  @Output() mbTypeOpData: EventEmitter<any> = new EventEmitter();
  @Output() categoryOpData: EventEmitter<any> = new EventEmitter();
  @Output() supplierOpData: EventEmitter<any> = new EventEmitter();
  @Output() productDetailsOpData: EventEmitter<any> = new EventEmitter();
  @Output() shareMbOpData: EventEmitter<any> = new EventEmitter();
  @Output() variationOpData: EventEmitter<any> = new EventEmitter();
  @Output() prodDeleteOpData: EventEmitter<any> = new EventEmitter();
  @Output() mbDetailsOpData: EventEmitter<any> = new EventEmitter();
  @Output() filterOpData: EventEmitter<any> = new EventEmitter();
  @Output() cityOpData: EventEmitter<any> = new EventEmitter();
  @Output() attributeOpData: EventEmitter<any> = new EventEmitter();
  @Output() warehouseOpData: EventEmitter<any> = new EventEmitter();
  @ViewChild('scrollDiv') scrollDiv: ElementRef | null = null;
  @ViewChild('colorDiv') colorDiv: ElementRef | null = null;
  customOptions: OwlOptions = {
    loop: false,
    autoWidth: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    navText: ['<span> </span>' ,'<span></span>']
  }
  selectedIndex: any;
  selectedProduct:any
  productResult: any;
  skuVariationId: any;
  leftImgId: any;
  totalQtyOfSku: number;
  monthNums: any=12;
  commonQty: number=1;
  emailAdd:any
  valueIn: any='';
  variation_id: any;
  swapProducts: any=[];
  priceOption: any='rent';
  inspIndex: any;
  intervalRunning:boolean=false;
  interval: any;
  imgData: any;
  fileElement: any;
  isLoading: boolean;
  category: any;
  supply_opts: any='delivery_partner';
  constructor(public activeModal: NgbActiveModal, private spinner: NgxSpinnerService,
    private toasterService: ToastrService, private shop: ItemsService,
    private mbs:CreateMoodboardService) { }

  ngOnInit(): void {
    if(this.categoryInData?.dialogType=='categorypopup'){
      this.selectedIndex = this.categoryInData.index;
    }
    if(this.productDetailsInData?.dialogType=='productDetailspopup'){
      this.getProduct()
    }
    
  }
  changeType(data:any){
    this.mbTypeOpData.emit({type:'yes',result:data})
  }
  changeTypeNo(){
    this.mbTypeOpData.emit({type:'no'})
  }
  selectedCategory(data){
    
    data.selected = !data?.selected;
    this.categoryOpData.emit({data,type:'categoryPopup'})
    let filter = [];
    filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
    let selectedFiler = filter.find((x) => x.type === "categories");
    this.categoryInData?.res?.forEach((element) => {
      element.type = "categories";
      element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
    });
    
  }
  selectedSupplier(data){
    data.selected = !data?.selected;
    this.supplierOpData.emit({data,type:'supplierPopup'})
  }
  selectedWarehouse(data){
    data.selected = !data?.selected;
    this.warehouseOpData.emit({data,type:'warehousePopup'})
  }
  selectedCity(data){
    data.selected = !data?.selected;
    this.cityOpData.emit({data,type:'cityPopup'})
  }
  selectedAttribute(data,attributeName){
    data.selected = !data?.selected;
    this.attributeOpData?.emit({data,attr:attributeName,type:'attribute'})
    let filter = [];
    filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
    let selectedFiler = filter?.find((x) => x.type === "attribute");
    if(selectedFiler){
      this.attributeInData?.res?.forEach(element => {
        element?.attribute_list?.forEach(ele => {
          let index = selectedFiler?.selected?.findIndex(x => x?.name == element?.name)
          if (ele.sgid == selectedFiler?.selected[index]?.sgid) {
            ele.selected = true;
          }
          else{
            ele.selected = false;
          }
        })
      });
    }
  }
  getProduct(){
      if(this.productDetailsInData){
        this.productResult = this.productDetailsInData?.res
        let prod =  this.productDetailsInData?.res;
        
        let variations = prod.variations.filter(x=> x.sgid==this.productDetailsInData?.sku_id)
        let variation = variations[0];
        this.skuVariationId = variation.sku_variation_id;
        this.variation_id = this.skuVariationId;
        let color;
        if(prod?.bed_size?.length>0){
          color = prod?.color?.filter(x=>x.sku_variation_id ==this.skuVariationId && x.attribute_value !=='')
        }
        this.selectedProduct  ={
          category:prod.category,
          bed_size:prod?.bed_size?.filter(x=>x.attribute_value !==''),
          color:color ? color :prod?.color?.filter(x=>x.attribute_value !==''),
          category_id:prod.category_id,
          description:prod.description,
          features:prod.features,
          dimension:variation?.dimension,
          attributes:variation?.attribute_info,
          mattress_size:prod.mattress_size,
          name:prod.name,
          sgid:prod.sg,
          sku_variation:variation?.sku_variation_id,
          sku:prod.sku,
          product_id:variation?.product_id,
          asset_value:variation.asset_value,
          buyPrice:variation.buy_new_price,
          rental_price:variation.default_price.find(x=>x.month==12),
          quantity:this.skuVariationId?.quantity,
          default_image:variation.default_images.map(x=>x.image_url.small)[0],
          default_images:variation.default_images.map(x=>x.image_url.small),
          other_variations:prod.variations,
          default_price:variation.default_price,
          warehouseLocations:variation?.warehouse_location_new,
          source:prod?.source,
          supplier_name:variation?.supplier,
          supplier_sku:variation?.supplier_sku,
          inhabitr_sku:variation?.inhabitr_sku,
          is_ops_db:variation?.is_ops_db
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
      }
      
  }
  variationImage(img:any){
    
    this.selectedProduct.default_image = img
  }
  productClose(){
    this.activeModal.close();
    document.body.style.overflow="auto"
  }
  variationReuslt(data:any){
    this.spinner.show();
    this.leftImgId = data?.sgid;
    let prod = this.productResult
    let variation = data;
    this.variation_id=data?.sgid ? data?.sgid : '';
    let color;
    if(prod?.bed_size.length>0){
      color = prod?.color?.filter(x=>x.sku_variation_id ==data?.sgid && x.attribute_value !=='')
    }
    setTimeout(() => {
      if(prod && variation){
        this.selectedProduct  ={
          category:prod.category,
          bed_size:prod?.bed_size?.filter(x=>x.attribute_value !==''),
          color:color ? color :prod?.color?.filter(x=>x.attribute_value !==''),
          category_id:prod.category_id,
          description:prod.description,
          features:prod.features,
          dimension:variation?.dimension,
          attributes:variation?.attribute_info,
          mattress_size:prod.mattress_size,
          name:prod.name,
          sgid:prod.sg,
          sku_variation:variation?.sku_variation_id,
          sku:prod.sku,
          product_id:variation?.product_id,
          asset_value:variation.asset_value,
          buyPrice:variation.buy_new_price,
          rental_price:variation.default_price.find(x=>x.month==12),
          quantity:this.skuVariationId?.quantity,
          default_image:variation.default_images.map(x=>x.image_url.small)[0],
          default_images:variation.default_images.map(x=>x.image_url.small),
          other_variations:prod.variations,
          default_price:variation.default_price,
          warehouseLocations:variation?.warehouse_location_new,
          supplier_name:variation?.supplier,
          source:prod?.source,
          supplier_sku:variation?.supplier_sku,
          inhabitr_sku:variation?.inhabitr_sku,
          is_ops_db:variation?.is_ops_db
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
  updateRent(event:any){
    this.monthNums = event.target.value;
    let value =  this.selectedProduct?.default_price?.find(x=>x.month==event.target.value);
    this.selectedProduct.rental_price = value;
    
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
  quanityInput(data){
    if(data){
      if(data <= this.totalQtyOfSku){
        this.commonQty = data;
        return
      }
      else{
        this.commonQty=1
        this.toasterService.error('Cannot increase quantity above available quantity')
      }
    }
    
    if(data==1){
      return
    }
   
  }
  addMb(){
    let obj={
      "sku": this.selectedProduct?.sku_variation,
      "product_id": this.selectedProduct?.product_id,
      "button_type": null,
      "quantity": this.commonQty,
      "month": this.monthNums,
    }
    this.productDetailsOpData.emit(obj)
  }
  forceAddMb(data){
    data.force_add='1';
    
    this.variationOpData.emit(data)
  }
  shareMb(){
    this.shareMbOpData.emit(this.emailAdd)
  }
  searchfilter(data:any,type){
    if (data) {
      let string = data?.split(" ");
      for (var i = 0; i < string.length; i++) {
        string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
      }
      data = string.join(" ");
    } 
    
    if(type=="Categories" && data !==''){
      this.categorySearch(data)
    }
    else if(type=="Categories" && data ==''){
      this.valueIn = data
      this.categorySearch(data)
    }
    if(type=="Suppliers" && data !==''){
      this.supplierSearch(data)
    }
    else if(type=="Suppliers" && data ==''){
      this.valueIn = data
      this.supplierSearch(data)
    }
  }
  categorySearch(data){
    this.spinner.show()
      this.shop.getSearchCategory({search_key:data}).subscribe((res:any)=>{
        this.spinner.hide()
        if(res){
          this.categoryInData.res = res?.result;
          this.categoryInData.index =-1;
          let filter = [];
          filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "categories");
          this.categoryInData.res.forEach((element,index) => {
            element.type = "categories";
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
          });
          this.categoryOpData.emit({data:this.categoryInData.res,type:'search'})
        }
      },error=>{this.spinner.hide()})
  }
  supplierSearch(data){
    this.spinner.show()
      this.shop.getSearchSupplier({search_key:data}).subscribe((res:any)=>{
        this.spinner.hide()
        if(res){
          this.supplierInData.res = res?.result;
          let filter = [];
          filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "suppliers");
          this.supplierInData.res.forEach((element) => {
            element.type = "suppliers";
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
          });
          this.supplierOpData.emit({data:this.supplierInData.res,type:'search'})
        }
      },error=>{this.spinner.hide()})
  }
  sizeVariation(event){
    let data = this.selectedProduct?.other_variations.find(x=>x.sgid==event?.target?.value);
    if(data)this.variationReuslt(data);
  }
  deleteProduct(data){
    this.prodDeleteOpData.emit(data)
  }
  shareMbDetails(data){
    this.mbDetailsOpData.emit(data)
  }
  scroll(data,type){
    if(type=='scroll'){
      this.scrollDiv?.nativeElement?.scrollBy(data, 0);
    }
    if(type=='color'){
      this.colorDiv?.nativeElement?.scrollBy(data, 0);
    }
  }
  warehouseOpts(data){
    this.supply_opts = data;
  }
}


