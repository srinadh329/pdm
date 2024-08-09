import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/services/items.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from 'src/app/services/search.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoodboardDailogComponent } from 'src/app/modules/moodboard/moodboard-dailog/moodboard-dailog.component';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';

declare var $: any;

@Component({
  selector: 'app-moodboard-filter',
  templateUrl: './moodboard-filter.component.html',
  styleUrls: ['./moodboard-filter.component.css']
})
export class MoodboardFilterComponent implements OnInit {
  categoryList: any=[];
  supplierList: any=[];
  cityList: any=[];
  warehouseInfo:any={
    delivery_warehouse:[],
    suppliery_warehouse:[]
  }
  filter_show_info:any={
    city:true,
    warehouse:true
  }
  budget:any= { res:[], label:'', bgtTypevalue:'' };
  isLoading: boolean=true;
  page: number=0;
  productdata: any=[];
  isMoreProducts: boolean;
  filterSelections: any=[];
  parameters: string;
  publishVal: any='';
  appliedResult: any=[];
  assetLable:any ='';
  invValue:any='';
  gigaValue:any=''
  supplier_type: any='all';
  search: any;
  search_type: any;
  @Input() mbData:any
  @Output() mbOpData: EventEmitter<any> = new EventEmitter();
  searchproduct: string;
  category_id: any;
  publisheValue:any = [
  { name: "Published to Inhabitr Ops", type: "publish_status", value: 1,flag:0},
  { name: "Not Published to Inhabitr Ops",type: "publish_status", value: 1,flag:1 },
]
publish_flag:any='';
atttributeList: any=[];
inventoryAttr = [{ name: "inhabitr", checked: false, DisplayName: "Inhabitr Inv", disable: false },
  { name: "supplier", checked: false, DisplayName: "Supplier Inv", disable: false },
  { name: "all", checked: false, DisplayName: "Either Inhabitr Inv OR Supplier Inv", disable: false },
];
  constructor(
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private modalService: NgbModal,
    private searchSer: SearchService,
    private toastr: ToastrService,
    private formbuilder: FormBuilder,
    private router: Router,
    private actRoute: ActivatedRoute,
    private ls: LocalStorageService,
    private auth: AuthenticateService,
    private mbs: CreateMoodboardService,
  ){
    this.budgetRange();
    this.getCategorieslist();
    this.getSuppliersList();
    this.getCity();
    this.getWarehouse();
    this.getSupplierPartner();
  }
  ngOnInit() {
    
    
    let giga = JSON.parse(localStorage.getItem("giga")) ? JSON.parse(localStorage.getItem("giga")) :'';
    if(giga?.type=='giga'){
      this.budgetRange()
      this.giga(true);
    }
  }
  
  // city list
  getCity(){
    this.spinner.show()
    this.shop.getCity().subscribe((res)=>{
      if(res){
        this.cityList = res?.data;
        let filter = [];
        filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "city");
        this.cityList.forEach((element) => {
          element.type = "city";
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
        });
      }
    },error=>{
      this.spinner.hide()
    })

  }
//  city list

  // warehouse list
  getWarehouse(){
    this.spinner.show()
    this.shop.getWarehouse().subscribe((res)=>{

      if(res){
        this.warehouseInfo.delivery_warehouse = res?.data;
        let filter = [];
        filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "warehouse");
        this.warehouseInfo.delivery_warehouse.forEach((element) => {
          element.type = "warehouse";
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
        });
      }
    },error=>{
      this.spinner.hide()
    })
  }
  getSupplierPartner(){
    this.spinner.show();
    this.shop.getSupplierPartner().subscribe((res:any)=>{
      if(res){
        this.warehouseInfo.suppliery_warehouse = res?.data;
        let filter = [];
        filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "warehouse");
        this.warehouseInfo.suppliery_warehouse.forEach((element) => {
          element.type = "warehouse";
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
        });
      }
    },error=>{
      this.spinner.hide()
    })
  }

  // warehouse list

  // category list
    getCategorieslist() {
    let obj={
      s_id:'',
      c_id:'',
      w_id:'',
      location:0
    }
    for(let item of  this.filterSelections){
      if(item.type=="city"){
        obj.w_id = `${item.selected.length ? item.selected : ''}`;
        obj.location=1
      }
      if(item.type=="warehouse"){
        obj.w_id = `${item.selected.length ? item.selected : ''}`;
        obj.location=0
      }
      if(item?.type=="suppliers"){
        obj.s_id = `${item.selected.length ? item.selected : ''}`;
      }
      if(item?.type=="categories"){
        obj.c_id = `${item.selected.length ? item.selected : ''}`;
        this.getAttributes(obj.c_id)
      }
    }
    this.shop.getCategories(obj).subscribe((res) => {
      
      if (res) {
        this.categoryList = res.result;
        let filter = [];
        filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "categories");
        this.categoryList.forEach((element) => {
          element.type = "categories";
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
        });
      }
    },
      (error) => { 
        this.spinner.hide()
      }
    );
  }
  // category list


  // attribute popup
  attributePopup(){
    if(this.atttributeList?.length){
      const modalRef = this.modalService.open(MoodboardDailogComponent, {
        size: "md",
        backdrop: "static",
        centered: true,
      });
      let attributeData = {
        res: this.atttributeList,
        dialogType: "attributepopup",
        content:'Attributes',
      };
      modalRef.componentInstance.attributeInData = attributeData;
      modalRef.componentInstance.attributeOpData.subscribe((res:any)=>{
        
        if(res){
         this.selectAttribute(res)
        }
      })
    }
    else{
      this.toastr.error('Please select Category')
    }
  }
  // attribute popup
  selectAttribute(res){
    
    let index = this.filterSelections?.findIndex((x) => x.type === "attribute");
    let subIndex = this.filterSelections[index]?.selected.findIndex((x) => x.name === res?.attr?.name);
    // paramas filter
    if(index !=-1){
      if (subIndex != -1) {
        this.filterSelections[index].selected[subIndex].sgid = res?.data?.sgid;
      } else {
        this.filterSelections[index]?.selected.push({
          name: res?.attr?.name,
          sgid: res?.data?.sgid,
        });
      }
    }
    else{
      this.filterSelections.push({
        type: res?.type,
        selected: [{ name: res?.attr?.name, sgid: res?.data?.sgid}],
      });
    }
    // paramas filter
    // bread crumb
    let attrindex = this.appliedResult?.findIndex((x) => x.type === "attribute" && x.name==res?.attr?.name);
    let appliedIndex = this.appliedResult[attrindex]?.name === res?.attr?.name;
    
      if (attrindex != -1) { 
        if (appliedIndex){
          this.appliedResult[attrindex].name = res?.attr?.name;
          this.appliedResult[attrindex].value = res?.data?.attribute_value;
          this.appliedResult[attrindex].type = res?.type,
          this.appliedResult[attrindex].sgid = res?.data?.sgid
        } 
        else {
          this.appliedResult.push({
            name: res?.attr?.name,
            value: res?.data?.attribute_value,
            type: res?.type,
            sgid: res?.data?.sgid
          });
        } 
      }
      else{
        this.appliedResult.push({
          name: res?.attr?.name,
          value: res?.data?.attribute_value,
          type: res?.type,
          sgid: res?.data?.sgid
        });
      }
    // bread crumb
    localStorage.setItem("mbFilter", JSON.stringify(this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.appliedResult));
    this.filterResult();
  }

  // remove attribute
  attributeRemove(data){
    
    
    let index = this.filterSelections?.findIndex((x) => x.type === data.type);
    let attributeIndex = this.appliedResult?.findIndex((x) => x.type==data?.type && x.sgid==data.sgid)
    if (index != -1) {
      let selectedSubIndex = this.filterSelections[index]?.selected.findIndex((x) => x.sgid === data.sgid);
      if (selectedSubIndex != -1) {
        this.filterSelections[index]?.selected.splice(selectedSubIndex, 1);
       
      }
    }
    if(attributeIndex !=-1){
      this.appliedResult.splice(attributeIndex, 1);
    }
    localStorage.setItem("mbFilter", JSON.stringify(this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.appliedResult));
    this.filterResult();
  }

  // remove attribute
  // attribute list
  getAttributes(id){
    if(id){
      this.shop.getAttributes(id).subscribe((res)=>{
        if(res){
          this.atttributeList = res?.result;
         let filter = [];
         filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
           let selectedFiler = filter.find((x) => x.type === "attribute");
           this.atttributeList.forEach(element => {
             element.attribute_list.forEach(ele => {
               let index = selectedFiler?.selected?.findIndex(x => x?.name == element?.name)
               if (ele.sgid == selectedFiler?.selected[index]?.sgid) {
                 ele.selected = true;
               }
             })
           });
        }
       },error=>{
        this.spinner.hide()
       })
    }
   
  }


  // attributes list

  // suppliers list
  getSuppliersList() {
    let obj={
      s_id:'',
      c_id:'',
      w_id:'',
      location:0
    }
    for(let item of  this.filterSelections){
      if(item.type=="city"){
        obj.w_id = `${item.selected.length ? item.selected : ''}`;
        obj.location=1
      }
      if(item.type=='warehouse'){
        obj.w_id = `${item.selected.length ? item.selected : ''}`;
      }
      if(item?.type=="suppliers"){
        obj.s_id = `${item.selected.length ? item.selected : ''}`;
      }
      if(item?.type=="categories"){
        obj.c_id = `${item.selected.length ? item.selected : ''}`;
        this.getAttributes(obj.c_id)
      }
    }
    this.shop.getSuppliers(obj).subscribe((res) => {
      if (res) {
        this.supplierList = res.result;
        let filter = [];
        filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "suppliers");
        this.supplierList.forEach((element) => {
          element.type = "suppliers";
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
        });
      }
    },
      (error) => { 
        this.spinner.hide()
      }
    );
  }
  // suppliers list

  // productsCountInSuppliersLocation
    supplierCount(){
      let obj={
        warehouse:'',
        location:0,
        suplier_warehouse:0
      }
      for(let item of  this.filterSelections){
        if(item.type=="city"){
          obj.warehouse = `${item.selected.length ? item.selected : ''}`;
          obj.location=1
        }
        if(item.type=='warehouse'){
          obj.warehouse = `${item.selected.length ? item.selected : ''}`;
          obj.location=0;
          obj.suplier_warehouse=0
        }
      }
      this.shop.productsCountInSuppliers(obj).subscribe((res:any)=>{
        if (res) {
          this.supplierList = res.result;
          let filter = [];
          filter = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "suppliers");
          this.supplierList.forEach((element) => {
            element.type = "suppliers";
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
          });
        }
      },error=>{})
    }

  // productsCountInSuppliersLocation
  
  // budget range
  budgetRange() {
    let roleType = JSON.parse(localStorage.getItem('role_type'));
    let Userdetails = this.ls.getFromLocal();
    this.spinner.show()
    this.shop.AssetPriceFilterRange().subscribe((res:any) => {
      
      this.budget={
        res:res?.result,
        label:res?.budget_label,
        bgtTypevalue:res?.budget_type_value
      }
      this.filterResult()
    },error=>{
      this.spinner.hide()
    })
    }
    
  // budget range

  // category popup
  categoryPopup(){
    
    const modalRef = this.modalService.open(MoodboardDailogComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let categoryData = {
      res: this.categoryList,
      dialogType: "categorypopup",
      content:'Categories',
    };
    modalRef.componentInstance.categoryInData = categoryData;
    modalRef.componentInstance.categoryOpData.subscribe((res) => {
      if (res?.data?.type=="categories") {
        this.getSelectedCategory(res?.data,res?.type)
      }
      if (res?.type=="search") {
        this.categoryList = res?.data;
      }
    });
  
  }
  // category popup
  // city popup
  cityPopup(){
    const modalRef = this.modalService.open(MoodboardDailogComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let cityData = {
      res: this.cityList,
      dialogType: "citypopup",
      content:'City',
    };
    modalRef.componentInstance.cityInData = cityData;
    modalRef.componentInstance.cityOpData.subscribe((res)=>{
      
      if (res?.data?.type=="city") {
        this.getSelectedCategory(res?.data,res?.type)
      }
    })
  }


  // city popup
  // filter popup
  filterPopup(data:any,content){
    
    const modalRef = this.modalService.open(MoodboardDailogComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let filterData = {
      res: data,
      dialogType: "filter-popup",
      content:content,
    };
    modalRef.componentInstance.filterInData = filterData;
    modalRef.componentInstance.filterOpData.subscribe((res)=>{

    })
  }


  // filter popup

  // supplier popup
  supplierPopup(){
    const modalRef = this.modalService.open(MoodboardDailogComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let supplierData = {
      res: this.supplierList,
      dialogType: "supplierpopup",
      content:'Suppliers',
    };
    modalRef.componentInstance.supplierInData = supplierData;
    modalRef.componentInstance.supplierOpData.subscribe((res) => {
      if (res?.data?.type=="suppliers") {
        this.getSelectedCategory(res?.data,res?.type)
      }
      if (res?.type=="search") {
        this.supplierList = res?.data;
      }
    });
  }

  // supplier popup

  // ware house popup
  warehousePopup(){
    const modalRef = this.modalService.open(MoodboardDailogComponent, {
      size: "lg",
      backdrop: "static",
      centered: true,
    });
    let warehouseData = {
      res: this.warehouseInfo,
      dialogType: "warehousepopup",
      content:'Warehouse',
    };
    modalRef.componentInstance.warehouseInData = warehouseData;
    modalRef.componentInstance.warehouseOpData.subscribe((res)=>{
      if (res?.data?.type=="warehouse") {
        this.getSelectedCategory(res?.data,res?.type)
      }
    })
  }


  // ware house popup



  // selected option
  getSelectedCategory(data:any,popup?){
   
    if(!popup){
      data.selected = !data.selected;
    }
    let index =  this.filterSelections?.findIndex((x) => x.type == data?.type);
    if(data.selected){
      // api result
      if(index !=-1){
        this.filterSelections[index]?.selected?.push(data.sgid);
        this.filterSelections[index]?.name.push(data.warehouse_name ? data.warehouse_name : data?.name);
       
      }
      else{
        this.filterSelections.push({
          type: data?.type,
          name: [data.warehouse_name ? data.warehouse_name : data?.name],
          selected: [data.sgid]
        })
      }
      // api result
      // breadcrumb result
      let filterIndex = this.appliedResult.findIndex((x) => x.type === data?.type);
      if (filterIndex != -1) {
        this.appliedResult.push(data);
      }
      else{
        this.appliedResult.push(data);
      }
      // breadcrumb result
    }
    else{
      if(index !=-1){
        let subIndex =  this.filterSelections[index].selected.findIndex(x=>x==data.sgid);
       if(subIndex !=-1){
        this.filterSelections[index].selected.splice(subIndex,1)
        this.filterSelections[index].name.splice(subIndex,1)
       }
       let filterIndex = this.appliedResult.findIndex((x) => x.sgid === data.sgid && x.type === data?.type);
       if (filterIndex != -1)
         this.appliedResult.splice(filterIndex, 1);
      }
      if(data.name=='Gigacloud' && this.supplier_type=='giga-cloud'){
        this.gigaValue='';
        this.supplier_type='all'
        this.getSuppliersList();
        this.supplierList.forEach((x=>{
          x.selected=false;
        }))
        localStorage.removeItem("giga");
      }
      
    }
    localStorage.setItem("mbFilter", JSON.stringify(this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.appliedResult));
    this.filterResult();
  }

  // selected option

  // asset price option
  assetPrice(event:any,select?){
   
    let data =  this.budget?.res.find(x=>String(x.label)==String(event?.target?.value ? event?.target?.value : event));
    
    this.assetLable = data?.label;
    let index =  this.filterSelections?.findIndex((x) => x.type == 'assetPrice');
    if(index !=-1){
      this.filterSelections[index].min_value = data?.min;
      this.filterSelections[index].max_value = data?.max;
      this.appliedResult[index].min_value = data?.min;
      this.appliedResult[index].max_value = data?.max;
    }
    else{
      this.filterSelections.push({
        type: 'assetPrice',
        min_value:data?.min,
        max_value:data?.max
      })
      this.appliedResult.push({
        type: 'assetPrice',
        min_value:data?.min,
        max_value:data?.max
      })
    }
    localStorage.setItem("mbFilter", JSON.stringify(this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.appliedResult));
    if(!select)this.filterResult();
  }

  // asset price option

  // asset price remove
  assetPriceRemove(data:any){
    
    let index =  this.filterSelections?.findIndex((x) => x.type == data?.type);
    if(index !=-1){
      this.filterSelections.splice(index,1)
      this.appliedResult.splice(index,1)
    }
    this.assetLable='';
    localStorage.setItem("mbFilter", JSON.stringify( this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.filterSelections));
    this.filterResult();
  }

  // asset price remove

  // inventory remove price
  invRemove(data){
    let index =  this.filterSelections?.findIndex((x) => x.type == data?.type);
    if(index !=-1){
      this.filterSelections.splice(index,1)
      this.appliedResult.splice(index,1)
    }
    this.invValue='';
    this.inventoryAttr.forEach((x:any)=>{
      x.checked=false;
    })
    localStorage.setItem("mbFilter", JSON.stringify( this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.appliedResult));
    this.filterResult();
  }
  inventoryFormFormData(data,event){
  
    if(event.target.checked==true && !this.invValue){
      this.toastr.error('Please Enter min value')
      return event.target.checked=false;
    }
    if(this.invValue){
      let index =  this.filterSelections?.findIndex((x) => x.type == 'inventory');
    if(index !=-1){
      this.filterSelections[index].inv_min_value = this.invValue;
      this.filterSelections[index].name = data?.name;
      this.appliedResult[index].inv_min_value = this.invValue;
      this.appliedResult[index].name = data?.name;
    }
    else{
      this.filterSelections.push({
        type: 'inventory',
        inv_min_value:this.invValue,
        name:data?.name
      })
      this.appliedResult.push({
        type: 'inventory',
        inv_min_value:this.invValue,
        name:data?.name
      })
    }
    localStorage.setItem("mbFilter", JSON.stringify( this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.appliedResult));
    this.filterResult();
    }
    
  }
  // inventory remove price
 
  // publish status

  publishStatus(event){
    let index =  this.filterSelections?.findIndex((x) => x.type == 'publish_status');
    let data = this.publisheValue.find((x) => x.type == 'publish_status' && x.flag==event?.target.value);
    if(index !=-1){
      this.filterSelections.splice(index,1)
      this.appliedResult.splice(index,1)
      this.filterSelections.push(data);
      this.appliedResult.push(data);
    }
    else{
      
      this.filterSelections.push(data);
      this.appliedResult.push(data);
    }
   
    localStorage.setItem("mbFilter", JSON.stringify(this.filterSelections));
    localStorage.setItem("mbAppliedfilter", JSON.stringify(this.appliedResult));
    this.filterResult();
  }
  // publish status



  // giga result
  giga(event:any){
    if(event?.target?.checked == false){
      this.filterClear()
    }
    if(event?.target?.checked == true || event==true){
      let filter = JSON.parse(localStorage.getItem('filter')) ?  JSON.parse(localStorage.getItem('filter')):[];
      let index = filter.findIndex(x=>x.type=='suppliers')
      if(index !=-1){
        filter[index].selected=[];
        filter[index].name=[];
      }
      let mbAppliedfilter = JSON.parse(localStorage.getItem('mbAppliedfilter')) ? JSON.parse(localStorage.getItem('mbAppliedfilter')):[];
      mbAppliedfilter = mbAppliedfilter.filter((item:any)=>{
        return item.type !=="suppliers"
      })
      
      localStorage.setItem("mbFilter", JSON.stringify(filter));
      localStorage.setItem('mbAppliedfilter', JSON.stringify(mbAppliedfilter));
      localStorage.setItem('giga', JSON.stringify({type:'giga'}));
      this.gigaValue = 'giga-cloud';
      this.gigaData('giga-cloud');
    }
  }

  gigaData(data:any){
    let filter = JSON.parse(localStorage.getItem('mbFilter')) ?  JSON.parse(localStorage.getItem('mbFilter')):[];
    let mbAppliedfilter = JSON.parse(localStorage.getItem('mbAppliedfilter')) ? JSON.parse(localStorage.getItem('mbAppliedfilter')):[];
    this.spinner.show()
    this.shop.gigaData({supplier_type:data}).subscribe((res:any)=>{
      res.result.category = res?.result?.category.map(item=>{
        return{ name:item?.category_name,
         sgid:item?.category_id,
         count:item?.count 
         }
       })
       this.spinner.hide();
       let supplierId='';
      if(res?.statusCode==200){
        this.supplier_type = res?.result?.type ;
        supplierId  = res?.result?.supplier_id ? res?.result?.supplier_id : null;
         this.categoryList = res?.result?.category
         this.supplierList = res?.result?.supplier
      }
      this.page = 0;
      this.productdata = [];
      if(this.categoryList){
        let selectedFiler = filter.find((x) => x.type === "categories");
        this.categoryList.forEach((element) => {
          element.type = "categories";
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
        });
      }
      if(this.supplierList){
        let selectedFiler = filter.find((x) => x.type === "suppliers");
        this.supplierList.forEach((element) => {
          element.type = "suppliers";
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
        });
      }
      let data = this.supplierList.find(x=>x.sgid== supplierId);
      data.selected=true
      let index = filter.findIndex((x:any)=>x.type=='suppliers')
      if(index !=-1){
        filter[index].selected = [data.sgid];
        filter[index].name = [data.name];
      }
      else{
        filter.push({
        type: data?.type,
        name: [data.warehouse_name ? data.warehouse_name : data?.name],
        selected: [data.sgid]
      })
      }
      let appliedIndex = mbAppliedfilter.findIndex((x:any)=>x.type=='suppliers')
      if(appliedIndex !=-1){
        return
      }
      else{
        mbAppliedfilter.push(data)
      }
      localStorage.setItem("mbFilter", JSON.stringify(filter));
      localStorage.setItem('mbAppliedfilter', JSON.stringify(mbAppliedfilter));
      this.filterResult()
    },error=>{})

  }
  // giga result

  // clear filter

  filterClear(){
    localStorage.removeItem('mbFilter');
    localStorage.removeItem('mbAppliedfilter');
    localStorage.removeItem('giga');
    this.invValue='';
    this.assetLable='';
    this.supplier_type='all';
    this.appliedResult=[];
    this.gigaValue='';
    this.filterSelections=[];
    this.supplierList = this.supplierList.map(x => {
      x.selected = false;
      return x;
    });
    this.categoryList = this.categoryList.map(x => {
      x.selected = false;
      return x;
    });
    this.warehouseInfo.delivery_warehouse = this.warehouseInfo.delivery_warehouse.map(x=>{
      x.selected =false;
      return x
    })
    this.warehouseInfo.suppliery_warehouse = this.warehouseInfo.suppliery_warehouse.map(x=>{
      x.selected =false;
      return x
    })
    this.inventoryAttr.forEach((x:any)=>{
      x.checked=false;
    })
    this.filter_show_info={
      city:true,
      warehouse:true
     }
    this.getCategorieslist()
    this.getSuppliersList();
    this.budgetRange();
    this.getCity();
    this.page=0;
    this.filterResult();
  }
  // clear filter

  // filter options
  filterResult(){
    
    this.filterSelections = JSON.parse(localStorage.getItem("mbFilter")) ? JSON.parse(localStorage.getItem("mbFilter")) : [];
    this.appliedResult = JSON.parse(localStorage.getItem("mbAppliedfilter")) ? JSON.parse(localStorage.getItem("mbAppliedfilter")) : [];
    let c_id=null , s_id=null ,w_id=null ,min_value='' , max_value='', inv_min_value='' ,inventory_filter_request_type='', location=0 ,is_publish_ops='',is_unpublish_ops='',attribute=null
    this.filterSelections?.forEach((ele) => {
      if(ele.type=="city"){
         // parameters id
         w_id = `${ele.selected.length ? ele.selected :null}`;
         location= ele.selected.length ? 1 : 0;
         this.filter_show_info={
          city:true,
          warehouse:ele.selected.length ? false : true
         }
         this.cityList.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
          });
         // parameters id
         setTimeout(() => {
          this.getCategorieslist();
          this.supplierCount();
         }, 1000);
         
      }
      if(ele.type=="warehouse"){
        // parameters id
        w_id = `${ele.selected.length ? ele.selected :null}`;
        this.filter_show_info={
          city:ele.selected.length ? false : true,
          warehouse:true
         }
         this.warehouseInfo?.delivery_warehouse.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
          });
          this.warehouseInfo?.suppliery_warehouse.forEach((element) => {
            element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
            });
        // parameters id
        setTimeout(() => {
          this.getCategorieslist();
          this.getSuppliersList();
         }, 1000);
     }
      if (ele.type == "categories") {
        // parameters id
        c_id = `${ele.selected.length ? ele.selected :null}`;
        this.category_id = c_id;
        // parameters id
        this.getSuppliersList()
        this.getCategorieslist()
        }
     if (ele.type == "suppliers") {
      // parameters id
      s_id = `${ele.selected.length ? ele.selected :null}`
      // parameters id
      this.getCategorieslist()
     }
     if(ele.type=="attribute"){
      let value = [];
        value = ele?.selected.map((x) => {
          return x?.sgid;
        });
        attribute = value?.length ? value : null;
        this.atttributeList?.forEach(element => {
          element?.attribute_list?.forEach(ele => {
            if (ele.sgid==value) {
              ele.selected = true;
            }
          })
        });
        
     }
     if (ele.type == "assetPrice") {
      
      let data =  this.budget.res.find(x=>x.max==ele?.max_value && x.min==ele?.min_value);
      
      this.assetLable = data?.label;
        // parameters id
        min_value = ele?.min_value;
        max_value = ele?.max_value;
        // parameters id
        this.getCategorieslist()
        this.getSuppliersList()
     }
     if (ele.type == "inventory") {
      this.invValue =ele?.inv_min_value;
      // parameters id
      inv_min_value = ele?.inv_min_value;
      inventory_filter_request_type = ele?.name;
      this.inventoryAttr.forEach((x:any)=>{
        if(x.name==ele?.name){
          x.checked=true
        }
        else{
          x.checked=false
        }
      })
      // parameters id
      this.getCategorieslist()
      this.getSuppliersList();
    }
    if(ele.type == 'publish_status'){
      this.publish_flag = ele.flag
      if(ele.flag == 0) is_publish_ops='1';
      if(ele.flag == 1) is_unpublish_ops='1'
    }
   });
   
   this.parameters = "&category=" + c_id + "&supplier=" + s_id + "&warehouse=" +w_id +"&location=" +location
   + "&mood_inv=" +1
   if(min_value&& max_value){
    this.parameters = this.parameters + "&min_price=" + min_value + "&max_price=" + max_value;
        }
   if(inv_min_value){
    this.parameters = this.parameters + "&min_price_inventory=" + inv_min_value + "&inventory_filter_request_type=" +inventory_filter_request_type;
    }
    if(attribute) this.parameters = this.parameters + "&attribute=" + attribute;
    if(is_publish_ops) this.parameters = this.parameters + "&is_publish_ops=" + is_publish_ops;
    if(is_unpublish_ops) this.parameters = this.parameters + "&is_unpublish_ops=" + is_unpublish_ops;
    if(this.supplier_type)  this.parameters =   this.parameters + '&supplier_type=' + this.supplier_type;
    if(this.search && this.search_type){
      this.parameters =this.parameters + '&keywords=' + this.search + '&search_type=' + this.search_type
    }
    if(this.mbData?.moodboard_wizard?.moodboard_id)this.parameters =this.parameters + '&moodboard_id=' + this.mbData?.moodboard_wizard?.moodboard_id;
   this.page = 0;
   this.productdata=[];
   this.searchproduct='';
   this.smoothScroll();
   this.productList();
  }
    
  // filter options
  smoothScroll() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  // productlist
    productList() {
      this.spinner.show();
      this.isLoading = true;
      let count = 20
      this.shop.getItems(this.page, this.parameters,this.publishVal,count).subscribe(
        (res: any) => {
  
          this.spinner.hide();
          this.isLoading = false;
          this.page += 20;
          if(res.statusCode==200){
            if (res.result && res.result.length) {
              this.onSuccess(res);
             
            } 
            this.isMoreProducts = res.result && res.result.length >=12 ? true : false;
          }
        },
        (error) => {
          this.isLoading = false;
          this.spinner.hide();
        }
      );
      }
  
  // productlist
  onSuccess(res) {
    this.spinner.show()
    if(res.statusCode==200){
      if(res.result){
        this.productdata = [...this.productdata, ...res.result];
      }
    }
  }
    // onscroll
    @HostListener("window:scroll", ["$event"])
    getScrollHeight(event: any) {
     
      let remaining =
        document.documentElement.scrollHeight -
        (window.innerHeight + window.pageYOffset);
      if (Math.round(remaining) < 800 && !this.isLoading && this.isMoreProducts) {
        this.loadMore();
      }
  }
    // onscroll
    loadMore(){
      if(!this.searchproduct){
        this.productList();
      }
      if(this.searchproduct){
        this.searchResult()
      }
    }
      // search result
        getSearchItems() {
          this.page= 0;
          this.productdata=[];
          this.searchResult()
        }
        searchResult(){
          this.spinner.show();
          this.isLoading = true;
          this.shop.searchItems('moodboard',this.page, this.searchproduct).subscribe(res => {
            this.spinner.hide();
            this.isLoading = false;
            this.page += 18;
            if(res?.statusCode==200){
              this.onSuccess(res);
            }
            this.isMoreProducts = res.result && res.result.length >=12 ? true : false;
          },error=>{
            this.isLoading = false;
            this.spinner.hide();
          });
        }

  // search result  
    // onscroll
    productDetails(data){
      if(data){
        this.spinner.show()
        let roleType = JSON.parse(localStorage.getItem('role_type'));
        let Userdetails = this.ls.getFromLocal();
        this.shop.getItem({product_id:data?.product_id,user_id:Userdetails.userId}).subscribe((res:any)=>{
          this.spinner.hide()
          if(res?.statusCode==200){
            const modalRef = this.modalService.open(MoodboardDailogComponent, {
              size: "xl",
              backdrop: "static",
              centered: true,
              keyboard: false,
            });
            let productData = {
              res: res?.result,
              configs:res?.configs,
              sku_id:data?.sku_variation_id,
              roleType:roleType,
              dialogType: "productDetailspopup",
              content:`${data?.product_name} - ${data?.product_id}`,
            };
            document.body.style.overflow = 'hidden';
            modalRef.componentInstance.productDetailsInData = productData;
            modalRef.componentInstance.productDetailsOpData.subscribe((res) => {
              modalRef.componentInstance.activeModal.close();
              this.addMb(res)
            });
          }
        },error=>{
          this.spinner.hide()
        })
      }
    }

    addMb(data:any){
      this.spinner.show()
      let userId = this.mbData?.moodboard?.userid;
      let other_user_id = this.auth.getProfileInfo('userId');
      let id = this.mbData?.moodboard_wizard?.moodboard_id ? this.mbData?.moodboard_wizard?.moodboard_id : this.mbData?.moodboard?.sgid
      let obj={
        "mood_board_id": id,
        "product_ids": data?.product_id,
        "user_id": userId,
        "sku":data?.sku,
        "product_id": data?.product_id,
        "button_type": data?.button_type,
        "quantity": data?.quantity,
        "month": data?.month,
        "other_user_id": other_user_id,
        "force_add": data?.force_add
      }
      this.mbs.addProdsToCart1(obj).subscribe((res:any)=>{
        if(res){
          this.spinner.hide()
          if(res.type=='INVALID_VARIATION'){
            this.variationPopUp(res,data)
          }
          else{
            this.toastr.success(res?.result);
            this.mbOpData.emit(id);
            document.body.style.overflow="auto"
          }
        }
      },error=>{
        this.spinner.hide()
      })
    }
    variationPopUp(data:any,obj:any){
      const modalRef = this.modalService.open(MoodboardDailogComponent, {
        size: "md",
        backdrop: "static",
        centered: true,
      });
      let variationData = {
        dialogType: "variationpopup",
        res:data,
        variation:obj
      };
      modalRef.componentInstance.variationInData = variationData;
      modalRef.componentInstance.variationOpData.subscribe((res) => {
        modalRef.componentInstance.activeModal.close();
        this.addMb(res)
      });
    
    }
}

