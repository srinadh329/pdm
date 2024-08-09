
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { Options } from 'ng5-slider';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsService } from 'src/app/services/items.service';
import { SearchService } from 'src/app/services/search.service';
import { DialogComponent } from '../dialog/dialog.component';

declare var $: any;

@Component({
  selector: 'app-items-new',
  templateUrl: './items-new.component.html',
  styleUrls: ['./items-new.component.css']
})
export class ItemsNewComponent implements OnInit {
  category: any = null;
  supplier: any = null;
  warehouse: any = null;
  warehouse_location_new: any = null;
  warehouseId: any;
  parameters: any;
  page: any = 0;
  publishVal = "";
  productdata: any = [];
  isLoading: boolean;
  isMoreProducts: boolean = true;
  modalOptions: NgbModalOptions;
  modalOptions2: NgbModalOptions;
  closeResult: string;
  modalVal: string;
  assetPriceForm: FormGroup;
  attributeSelected: any = [];
  filterList: any = [
    { id: 1, type: "City", name: "City" },
    { id: 2, type: "Warehouse", name: "Warehouse" },
    { id: 3, type: "Suppliers", name: "Suppliers" },
    { id: 4, type: "Categories", name: "Categories" },
    { id: 5, type: "Attributes", name: "Attributes" },
    { id: 6, type: "AssetPrice", name: "Asset Price Range" },
    { id: 7, type: "Inventory", name: "Inventory" },
  ];
  cityLocationList: any = [];
  type: any = [];
  filterSelections: any = [];
  selectedProductFilters: any = [];
  supplierList: any = [];
  c_id: any = null;
  w_id: any = null;
  s_id: any = null;
  isLocationSearch = "0";
  categoryList: any = [];
  warehouseList: any = [];
  SupplierPartnerList: any = [];
  atttributeList: any;
  filter: string;
  deliverySupplier: any;
  loadingData: any;
  subIndex: any;
  attribute: any;
  inventoryForm: FormGroup;
  inventoryAttr = [{ name: "inhabitr", checked: false, DisplayName: "Inhabitr Inv", disable: false },
  { name: "supplier", checked: false, DisplayName: "Supplier Inv", disable: false },
  { name: "all", checked: false, DisplayName: "Either Inhabitr Inv OR Supplier Inv", disable: false },
  // { name: "both", checked: false, DisplayName: "Both Inhabitr Inv AND Supplier Inv", disable: false }
];
  publisheValue = [{ name: "Published to Inhabitr Ops", value: "register_with_ops", type: "Publish Status", isPublishOps: 1, isUnpublishOps: null },
  { name: "Not Published to Inhabitr Ops", value: "unregister_from_ops", type: "Publish Status", isPublishOps: null, isUnpublishOps: 1 },
  // { name: "Publish to Used Furniture", value: "publish_to_saffron", type: "Publish Status", isPublish: 1, isUnpublish: null },
  // { name: "Not Publish to Used Furniture", value: "unpublish_to_saffron", type: "Publish Status", isPublish: null, isUnpublish: 1, }
];
  filterData: any;
  min_price_inventory: any;
  inventory_filter_request_type: any;
  selectedPriceRangeList: any = [];
  invType: any = [];
  publish: any = [];
  hideWareHouseList: any;
  hideCityList: any;
  attributeView: any;
  @ViewChild('viewFilterList', { static: true }) template: ElementRef | null = null;
  filterIndexView = 'startView';
  filterIndexListView: any;
  cityChecked: any;
  warehouseChecked: any;
  publishStatusView: any;
  selectedState: any;
  countOfCategorys: any = [];
  inputData: any;
  resultData: any;
  resultData2: any;
  resultCount: any;
  catCount: any;
  deliWareCount: number;
  search: any='';
  search_type: any='prod_name';
  enableSearch: boolean=false;
  leadInfo: any={
    name:'',
    result:[]
  };
  
  constructor(
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private modalService: NgbModal,
    private searchSer: SearchService,
    private toastr: ToastrService,
    private formbuilder: FormBuilder,
    private router: Router,
  ) {
    this.modalOptions = {
      size: "lg", backdrop: "static", backdropClass: "customBackdrop", centered: true,
    };
    this.modalOptions2 = {
      size: "md", backdrop: "static", backdropClass: "customBackdrop", centered: true,
    };
    this.assetPriceForm = this.formbuilder.group({
      minValue: ["",],
      maxValue: [""],
      assetValue: ['']
    });
    this.inventoryForm = this.formbuilder.group({
      minInvValue: ["", [Validators.required]],
      name: [""],
    });
  }

  ngOnInit() {
    //this.productList();
    this.initialLoaded();
    this.getLeadTimes()
    //this.getAssetPriceFilterRange();

  }
  // All product list
  resultOneErrorMsg: any
  errorMsg: boolean = false
  sameWareID: any=[];
  productList() {
    this.spinner.show();
    this.isLoading = true;
    let count = 12
    this.shop.getItems(this.page, this.parameters, this.publishVal,count).subscribe(
      (res: any) => {
        
        this.spinner.hide();
        this.isLoading = false;
        this.page += 12;
        this.resultOneErrorMsg = res.dis_msg;
        this.inputData=res.input;
        if (res.dis_msg) {
          this.errorMsg = true
        } else {
          this.errorMsg = false
        }
        if (res.result && res.result.length) {
          this.productdata = [...this.productdata, ...res.result];
          this.isMoreProducts = res.result && res.result.length ? true : false;
          this.resultCount = res.result
          this.resultData = true;
          this.resultData2 = false;
        } else if (!res.result.length) {
          
          this.productdata = [...this.productdata, ...res.result2];
          this.isMoreProducts = res.result2 && res.result2.length ? true : false;
          this.resultCount = res.result2
          this.resultData2=true;
          this.resultData = false;
          
        }
      
        this.getLocationList();
        this.deliverySupplierWarehouseList("delivery");
        // this.deliverySupplierWarehouseList("supplier");
        this.getSuppliersList();
        this.getCategorieslist();
        //this.getAssetPriceFilterRange();
      },
      (error) => {
        this.isLoading = false;
        this.spinner.hide();
      }
    );
  }

  // on scroll product list
  @HostListener("window:scroll", ["$event"])
  getScrollHeight(event: any) {
    let remaining =
      document.documentElement.scrollHeight -
      (window.innerHeight + window.pageYOffset);
    if (Math.round(remaining) < 800 && !this.isLoading && this.isMoreProducts) {
      if(this.resultCount.length >= 12){
        this.onScroll();
      }
    }
  }
  onScroll() {
    this.productList();
  }
  // on scroll product list
  // All product list

  invQty(data:any,id:any,sear_w_id:any){
    
    let invTotal: number=0;
    if(this.resultData){
      if(this.inputData.warehouse=='null'){
        data.forEach(element=>{
          if(element?.is_inhabitr_warehouse=='Y'){
            invTotal += parseInt(element.non_assigned_inv ? element.non_assigned_inv : 0); 
          }
        });
        
      }
      else if(this.inputData.warehouse !='null'){
        let result =[]
          sear_w_id?.forEach(x=>{
            data.filter(y=>{
              if(x==y.warehouse_id){
                result.push(y)
              }
            })
          })
          
          result.forEach(element=>{
            if(element?.is_inhabitr_warehouse=='Y'){
              invTotal += parseInt(element.non_assigned_inv ? element.non_assigned_inv : 0);
            }
          })
      }
      else if((this.inputData.warehouse && this.inputData.category && this.inputData.supplier 
        && this.inputData?.inventory_filter_request_type=='all')){
          let result =[]
          sear_w_id.forEach(x=>{
          data.filter(y=>{
              if(x==y.warehouse_id){
                result.push(y)
              }
            })
          })
          
          result.forEach(element=>{
            if(element?.is_inhabitr_warehouse=='Y'){
              invTotal += parseInt(element.non_assigned_inv ? element.non_assigned_inv : 0);
            }
          })
      }
    }
    else if(this.resultData2){
      if(!this.inputData.warehouse){
        
        data.forEach(element=>{
          if(element?.is_inhabitr_warehouse=='Y'){
            invTotal += parseInt(element.non_assigned_inv ? element.non_assigned_inv : 0); 
          }
        });
      }
      else if(this.inputData.warehouse && !this.inputData.category && !this.inputData.supplier){
        
        data.forEach(element=>{
          if(element?.is_inhabitr_warehouse=='Y' && element.warehouse_id==id){
            invTotal = element?.non_assigned_inv;
          }
        })
      }
      else if((this.inputData.warehouse && this.inputData.category && this.inputData.supplier 
        && this.inputData?.inventory_filter_request_type=='both') ||
        (this.inputData.warehouse && this.inputData.category && this.inputData.supplier 
          && this.inputData?.inventory_filter_request_type=='inhabitr')){
        
          let result =[]
          sear_w_id.forEach(x=>{
          data.filter(y=>{
              if(x==y.warehouse_id){
                result.push(y)
              }
            })
          })
          
          result.forEach(element=>{
            if(element?.is_inhabitr_warehouse=='Y'){
              invTotal += parseInt(element.non_assigned_inv ? element.non_assigned_inv : 0);
            }
          })
      }
    } 
    return invTotal
  }
  // Inhabitr Inv Qty
 // Supplier Inv Qty
 suppQty(data:any,id:any,sear_w_id:any){
  let supTotal: number=0;
  if(this.resultData){
    if(this.inputData.warehouse=='null'){
      data.forEach(element=>{
        if(element?.is_inhabitr_warehouse=='N'){
          supTotal += parseInt(element.supplier_quantity ? element.supplier_quantity : 0)
         
        }
      });
    }
    else if(this.inputData.warehouse !='null'){
      let result =[]
        sear_w_id?.forEach(x=>{
          data.filter(y=>{
            if(x==y.warehouse_id){
              result.push(y)
            }
          })
        })
        result.forEach(element=>{
          
          if(element?.is_inhabitr_warehouse=='N'){
            supTotal += parseInt(element.supplier_quantity ? element.supplier_quantity : 0);
          }
        })
    }
    else if((this.inputData.warehouse && this.inputData.category && this.inputData.supplier 
      && this.inputData?.inventory_filter_request_type=='all')||
        (this.inputData.warehouse && this.inputData.category && this.inputData.supplier 
          && this.inputData?.inventory_filter_request_type=='supplier')){
        let result =[]
        sear_w_id.forEach(x=>{
         data.filter(y=>{
            if(x==y.warehouse_id){
              result.push(y)
            }
          })
        })
        
        result.forEach(element=>{
          
          if(element?.is_inhabitr_warehouse=='N'){
            supTotal += parseInt(element.supplier_quantity ? element.supplier_quantity : 0);
          }
        })
    }
  }
  else if(this.resultData2){
    if(!this.inputData.warehouse){
      data.forEach(element=>{
        if(element?.is_inhabitr_warehouse=='N'){
          supTotal += parseInt(element.supplier_quantity ? element.supplier_quantity : 0) 
        }
      });
    }
    else if(this.inputData.warehouse && !this.inputData.category && !this.inputData.supplier){
      data.forEach(element=>{
        if(element?.is_inhabitr_warehouse=='N' && element.warehouse_id==id){
          supTotal = element?.supplier_quantity;
        }
      })
    }
    else if((this.inputData.warehouse && this.inputData.category && this.inputData.supplier 
      && this.inputData?.inventory_filter_request_type=='both')){
        let result =[]
        sear_w_id.forEach(x=>{
         data.filter(y=>{
            if(x==y.warehouse_id){
              result.push(y)
            }
          })
        })
        
        result.forEach(element=>{
          
          if(element?.is_inhabitr_warehouse=='N'){
            supTotal += parseInt(element.supplier_quantity ? element.supplier_quantity : 0);
          }
        })
    }
  } 
  return supTotal
}
// Supplier Inv Qty
  // modal popup
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  open(content, filterType) {
    this.modalVal = filterType;
    if (this.modalVal == "City") {
      this.getLocationList();
    }
    if (this.modalVal == "Warehouse") {
      this.deliverySupplierWarehouseList("delivery");
    }
    if (this.modalVal == "Suppliers") {
      this.getSuppliersList();
      this.loadingData = false;
    }
    if (this.modalVal == "Categories") {
      this.getCategorieslist();
    }
    if (this.modalVal != "Attributes" && this.modalVal != "AssetPrice" &&
      this.modalVal != "Inventory" && this.modalVal != "warehouseContent" && this.modalVal != "cityContent") {
      this.modalService.open(content, this.modalOptions).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

        }
      );
    }
    if (this.modalVal && this.modalVal == "Attributes") {
      let select = this.filterSelections.find((x) => x.type == "Categories");
      if (select?.selected.length > 0) {
        this.modalService.open(content, this.modalOptions2).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.isMoreProducts = false;
          }
        );
      } else {
        if (this.atttributeList?.length == 0)
          this.toastr.error("No Select Attributes Items");
        else {
          this.toastr.error("Please select Category");
        }
      }
    }
    if (
      this.modalVal == "AssetPrice" || this.modalVal == "Inventory" ||
      this.modalVal == "warehouseContent" || this.modalVal == "cityContent") {
      this.modalService.open(content, this.modalOptions2).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }
  // modal popup
  initialLoaded() {
    this.searchSer.setHeaserSearch(true);
    this.filterSelections = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : this.filterSelections;
    this.attributeSelected = JSON.parse(localStorage.getItem("attribute")) ? JSON.parse(localStorage.getItem("attribute")) : this.attributeSelected;
    this.selectedPriceRangeList = JSON.parse(localStorage.getItem("selectedPriceRangeList")) ? JSON.parse(localStorage.getItem("selectedPriceRangeList")) : this.selectedPriceRangeList;
    this.invType = JSON.parse(localStorage.getItem("invType")) ? JSON.parse(localStorage.getItem("invType")) : this.invType;
    let invPrice = this.invType.map((x) => x.minInvValue);
    if (invPrice)
      this.inventoryForm.patchValue({
        minInvValue: invPrice,
      });
    this.selectedProductFilters = JSON.parse(localStorage.getItem("selectedProductFilters")) ? JSON.parse(localStorage.getItem("selectedProductFilters")) : this.selectedProductFilters;
    let AssetPrice = this.selectedPriceRangeList.find((x) => x.type === "AssetPrice");
    if (AssetPrice)
      this.assetPriceForm.patchValue({
        minValue: AssetPrice.minValue,
        maxValue: AssetPrice.maxValue,
      });

    this.publish = JSON.parse(localStorage.getItem("publish")) ? JSON.parse(localStorage.getItem("publish")) : this.publish;
    this.filterResult();
  }
  // get city list
  getLocationList() {
    this.loadingData = true;
    this.shop.getLocation().subscribe(
      (res) => {
        if (res) {
          this.loadingData = false;
          this.cityLocationList = res.data;
          let filter = [];
          filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "City");
          this.cityLocationList.forEach((element) => {
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
            element.type = "City";
          });
          let count = Math.ceil (res.data?.length/3);
          this.catCount = count
        }
      },
      (error) => { }
    );
  }
  // get city list

  // getLeadTimes
  getLeadTimes(){
    this.shop.getLeadTimes().subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.leadInfo.result = res?.result
      }
    })
  }


  // getLeadTimes
 
  //  get warehouse SupplierPartner list
  supplierIsTrue:boolean = false
  something
  deliverySupplierWarehouseList(data) {
    // debugger
    
    this.deliverySupplier = data;
    if (data === "delivery" && !this.s_id) {
      this.loadingData = true;
      this.shop.getWarehouse().subscribe((res) => {
        if (res) {
          this.loadingData = false;
          this.warehouseList = res.data;
          this.something=0
          let filter = [];
          filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "Warehouse");
          this.warehouseList.forEach((element) => {
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
            element.type = "Warehouse";
          });
          let count = Math.ceil (res.data?.length/3);
          this.deliWareCount = count
          
        }
      }, error => { });
    }
    else if (data === "supplier" && !this.s_id) {
      if(data ==="supplier"){
        this.supplierIsTrue= true
      }
      
      this.loadingData = true;
      this.shop.getSupplierPartner().subscribe((res) => {
        if (res) {
          this.SupplierPartnerList = res?.data;
          this.loadingData = false;
          let filter = [];
          this.something = 1
          filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "Warehouse");
          this.SupplierPartnerList.forEach((element) => {
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
            element.type = "Warehouse";
          });     
          
          
        }
      });
    }
    else if (data === "supplier" && this.s_id) {
      this.getSuppliersList();
    }
  }
  //  get warehouse SupplierPartner listgetSuppliersList

  // suppliers list
  getSuppliersList() {
    let isSupplierList = true;
    let wareSupplierList = [];
    wareSupplierList = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : wareSupplierList;
    this.loadingData = true;
    wareSupplierList.forEach(ele => {
      if (ele.type == 'Warehouse' && this.w_id) {
        // /api/product/suppliers?s_id
        this.shop.getSuppliersFilter(this.w_id, null).subscribe((res) => {
          this.loadingData = false;
          this.supplierList = res.result;
          let selectedFiler = wareSupplierList.find((x) => x.type === "Suppliers");
          this.supplierList.forEach((element) => {
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
            element.type = "Suppliers";

          });
          isSupplierList = false
        })
      }
      else if (ele?.type == 'City' && this.w_id || ele?.type == 'City' && this.s_id || ele?.type == 'City' && this.c_id) {
        isSupplierList = true;
      }
      else if (ele.type == 'Categories' && this.c_id) {
        this.shop.getCategorySupplier(this.c_id).subscribe((res) => {
          this.loadingData = false;
          this.supplierList = res.result;
          let selectedFiler = wareSupplierList.find((x) => x.type === "Suppliers");
          this.supplierList.forEach((element) => {
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
            element.type = "Suppliers";

          });
          isSupplierList = false
        })
      }

    })
    if (isSupplierList) {
      // api/product/suppliers
      this.shop.getSuppliers('').subscribe((res) => {
        if (res) {
          this.loadingData = false;
          this.supplierList = res.result;
          
          let selectedFiler = wareSupplierList.find((x) => x.type === "Suppliers");
          this.supplierList.forEach((element) => {
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
            element.type = "Suppliers";
          });
        }
      },
        (error) => { }
      );
      // api/product/suppliers
    }
  }
  // suppliers list
  // category list
  getCategorieslist() {
    if (this.w_id || this.s_id) {
      this.loadingData = true;
      let locationSearch = [];
      locationSearch = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : locationSearch;
      let selectedFiler = locationSearch.find((x) => x.type === "City");
      let location = selectedFiler && selectedFiler ? '1' : '0';
      this.categoryList = [];
     
      this.shop.getCategoriesFilterSupp(this.s_id, this.w_id, location).subscribe((res) => {
        if (res) {
          this.loadingData = false;
          this.categoryList = res.result;
        
          let filter = [];
          filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "Categories");
          this.categoryList.forEach((element) => {
            element.selected =
              selectedFiler && selectedFiler.selected.includes(element.sgid)
                ? true
                : false;
            element.type = "Categories";
          });
        }
      }, error => { });
    }
    else {
      this.loadingData = true;
      this.categoryList = [];
      this.shop.getCategories('').subscribe((res) => {
        if (res) {
          this.loadingData = false;
          this.categoryList = res.result;
          let filter = [];
          filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
          let selectedFiler = filter.find((x) => x.type === "Categories");
          this.categoryList.forEach((element) => {
            element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
            element.type = "Categories";
          });
        }
      },
        (error) => { }
      );
    }
  }
  // category list
  // Attributes list
  getAttributesList() {
   
    this.shop.getAttributes(this.c_id).subscribe((res) => {
      if (res) {
        this.atttributeList = res?.result;
        this.attributeView = this.atttributeList.length ? true : false;
        let filter = [];
        filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "Attributes");
        this.atttributeList.forEach(element => {
          element.attribute_list.forEach(ele => {
            let index = selectedFiler?.selected?.findIndex(x => x?.name == element?.name)
            if (ele.sgid == selectedFiler?.selected[index]?.sgid) {
              ele.selected = true;
            }
          })
        });
       
      }
    });
  }
  // Attributes list
  getSelectedAttribute(event, attrName) {
    this.productdata = [];
    
    this.modalVal = "Attributes";
    let attrvalue = []
    attrvalue = attrName.attribute_list.find(x => x.sgid == event.target.value);
  
    let index = this.filterSelections?.findIndex((x) => x.type === "Attributes");
    if (index != -1) {
      let subIndex = this.filterSelections[index].selected.findIndex((x) => x.name === attrName.name);
      if (subIndex != -1) {
        this.filterSelections[index].selected[subIndex].sgid = event.target.value;
      } else {
        this.filterSelections[index].selected.push({
          name: attrName.name,
          sgid: event.target.value,
        });
      }
    } else {
      this.filterSelections.push({
        type: this.modalVal,
        selected: [{ name: attrName.name, sgid: event.target.value }],
      });
    }
    let value = attrName.attribute_list.find((x) => x.sgid == event.target.value);
    let attributeIndex = this.attributeSelected.findIndex((x) => x.name === attrName.name);
    if (attributeIndex != -1) {
      this.attributeSelected[attributeIndex].value = value.attribute_value;
      this.attributeSelected[attributeIndex].sgid = event.target.value;
    } else {
      this.attributeSelected.push({
        name: attrName.name,
        value: value.attribute_value,
        type: this.modalVal,
        sgid: event.target.value
      });
    }
    localStorage.setItem("filter", JSON.stringify(this.filterSelections));
    localStorage.setItem("attribute", JSON.stringify(this.attributeSelected));
    this.filterResult();
  }
  attributeRemove(attributeSelect) {
    let index = this.filterSelections?.findIndex((x) => x.type === attributeSelect.type);
    if (index != -1) {
      let selectedSubIndex = this.filterSelections[index]?.selected.findIndex((x) => x.sgid === attributeSelect.sgid);
      if (selectedSubIndex != -1) {
        this.filterSelections[index]?.selected.splice(selectedSubIndex, 1);
        this.attributeSelected.splice(selectedSubIndex, 1);
      }
    }
    localStorage.setItem("filter", JSON.stringify(this.filterSelections));
    localStorage.setItem("attribute", JSON.stringify(this.attributeSelected));
    this.filterResult();
  }
  selectedWarehouse_Id: any
  getSelectedCategory(data, type) {
    this.productdata = [];
    data.selected = !data.selected;
    if (type != null) {
      this.modalVal = type;
    }
    let index = this.filterSelections?.findIndex((x) => x.type === this.modalVal);
  
    if (data.selected) {
      if (index != -1) {
        this.filterSelections[index]?.selected?.push(data.sgid);
        this.filterSelections[index]?.name.push(
          data.warehouse_name ? data.warehouse_name : data?.name
        );
      } else {
        this.filterSelections.push({
          type: this.modalVal,
          name: [data.warehouse_name ? data.warehouse_name : data?.name],
          selected: [data.sgid],
        });
      }
      let filterIndex = this.selectedProductFilters.findIndex((x) => x.sgid === data.sgid && x.type === this.modalVal);
      if (filterIndex == -1) {
        let type = { type: this.modalVal };
        this.selectedProductFilters.push({ ...data, ...type });
      }

    } else {
      if (index != -1) {
        let selectedSubIndex = this.filterSelections[index]?.selected.findIndex((x) => x === data.sgid);
        if (selectedSubIndex != -1)
          this.filterSelections[index]?.selected.splice(selectedSubIndex, 1);
        let nameSubIndex = this.filterSelections[index]?.name.findIndex((x) => x === data.warehouse_name ? data.warehouse_name : data?.name);
        if (nameSubIndex != -1)
          this.filterSelections[index]?.name.splice(nameSubIndex, 1);
        let filterIndex = this.selectedProductFilters.findIndex((x) => x.sgid === data.sgid && x.type === this.modalVal);
        if (filterIndex != -1)
          this.selectedProductFilters.splice(filterIndex, 1);
      }
    }
    // filter selection
    localStorage.setItem("filter", JSON.stringify(this.filterSelections));
    localStorage.setItem("selectedProductFilters", JSON.stringify(this.selectedProductFilters));
    this.filterResult();
  }
  smoothScroll() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  filterResult() {
    this.filterData = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : this.filterData;
    this.filterData?.forEach((ele) => {
      // debugger/
      if (ele.type === "City") {
        this.warehouse = `${ele.selected.length ? ele.selected : null}`;
        this.warehouseId = `${ele.selected.length ? ele.selected : ''}`;
        this.page = 0;
        this.hideWareHouseList = ele.selected.length ? true : false;
        this.w_id = `${ele.selected.length ? ele.selected : null}`;
        this.isLocationSearch = `${ele.selected.length ? 1 : 0}`;
        this.isMoreProducts = false;
        this.smoothScroll();
        this.cityLocationList.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
        });
        if (ele.selected.length) {
          this.cityChecked = true;
          this.listShow('locationList')
          // this.filterIndexListView='locationList';
          this.warehouseChecked = false;
        }

         //this.getSuppliersList();
        this.productsCountInCategory()
        // this.getCategorieslist();
      } else if (ele.type === "Suppliers") {
        this.supplier = `${ele.selected.length ? ele.selected : null}`;
        this.page = 0;
        this.isMoreProducts = false;
        this.smoothScroll();
        this.s_id = `${ele.selected.length ? ele.selected : null}`;
        this.supplierList.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
        });
        this.countOfCategorys?.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
        });
        this.getLocationList();
        // this.getCategorieslist();
        // this.deliverySupplierWarehouseList("delivery");
        // this.deliverySupplierWarehouseList("supplier");
      } else if (ele.type === "Categories") {
       
        this.category = `${ele.selected.length ? ele.selected : null}`;
       
        this.page = 0;
        this.isMoreProducts = false;
        this.smoothScroll();
       
        this.c_id = `${ele.selected.length ? ele.selected : null}`;
       
        this.categoryList.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
        });
        this.getAttributesList();
        this.getLocationList();
        this.deliverySupplierWarehouseList("delivery");
        this.deliverySupplierWarehouseList("supplier");
        // this.getSuppliersList();
      } else if (ele.type === "Warehouse") {

        this.warehouse = `${ele.selected.length ? ele.selected : null}`;
        this.page = 0;
        this.isMoreProducts = false;
        this.smoothScroll();
        this.hideCityList = ele.selected.length ? true : false;
        this.w_id = `${ele.selected.length ? ele.selected : null}`;
        this.warehouseList.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
        });
        this.SupplierPartnerList.forEach((element) => {
          element.selected = ele && ele.selected.includes(element.sgid) ? true : false;
        });
        if (ele.selected.length) {
          this.warehouseChecked = true;
          this.cityChecked = false;
          this.listShow('Warehouse')
          // this.filterIndexListView='Warehouse';
        }
        
        // this.deliverySupplierWarehouseList('delivery');
        this.getSuppliersList();
        this.warehousesCountInCategory()
        // this.getCategorieslist();s
      } else if (ele.type === "Attributes") {
        this.page = 0;
        this.isMoreProducts = false;
        this.smoothScroll();
        let value = [];
        value = ele?.selected.map((x) => {
          return x?.sgid;
        });
        this.attribute = value?.length ? value : null;
      }
    });
    this.parameters = "&category=" + this.category + "&supplier=" + this.supplier + "&warehouse=" + this.warehouse + "&location=" +
      this.isLocationSearch;
    if (this.attribute) {
      this.parameters = this.parameters + "&attribute=" + this.attribute;
    }
    let min_price = this.selectedPriceRangeList.map((x) => x.minValue);
    let max_price = this.selectedPriceRangeList.map((x) => x.maxValue);
    if (min_price != '' || max_price != '') {
      this.parameters = this.parameters + "&min_price=" + min_price + "&max_price=" + max_price;
    }
    let minInv = this.invType.map((x) => x.minInvValue);
    let invType = this.invType.map((x) => x.name);
    let selectedFiler = this.invType.find((x) => x.type === "Inventory");
    this.inventoryAttr.forEach((element) => {
      element.checked = selectedFiler && selectedFiler.name.includes(element.name) ? true : false;
    });
    if (minInv != '' && invType != '') {
      this.parameters = this.parameters + "&min_price_inventory=" + minInv + "&inventory_filter_request_type=" +
        invType;
    }
    let isPublish = this.publish.map((x) => x.isPublish);
    let isUnpublish = this.publish.map((x) => x.isUnpublish);
    let isPublishOps = this.publish.map((x) => x.isPublishOps);
    let isUnpublishOps = this.publish.map((x) => x.isUnpublishOps);
    if (isPublish != '' || isUnpublish != '' || isPublishOps != '' || isUnpublishOps != '') {
      this.parameters = this.parameters + "&is_publish=" + isPublish + "&is_unpublish=" + isUnpublish +
        "&is_publish_ops=" + isPublishOps + "&is_unpublish_ops=" + isUnpublishOps;
    }
    if(this.search && this.search_type){
      this.parameters =this.parameters + '&keywords=' + this.search + '&search_type=' + this.search_type
    }
    if(this.leadInfo?.name){
      this.parameters =this.parameters + '&lead_time=' + this.leadInfo?.name 
    }
    this.productList();
    this.getAssetPriceFilterRange();
  }
  maxAssetPrice: any;
  minAssetPrice: any;
  onChange(event) {
    
    if (event.target.value == 'none' ) {
      this.selectedPriceRangeList = []
      this.maxAssetPrice = 0
      this.minAssetPrice = 0
      this.assetPriceFormData()
    }else{
      let data = this.assetPriceFilter.find(x => x.label == event.target.value)
      this.maxAssetPrice = data.max;
      this.minAssetPrice = data.min;
     
      this.assetPriceFormData()
    }
  }

  // asset filter
  assetPriceFormData() {
    let index = this.selectedPriceRangeList.findIndex((x) => x.type == "AssetPrice");
    let form = {
      minValue: this.minAssetPrice,
      maxValue: this.maxAssetPrice
    }
    if (index != -1) {
      let type = { type: 'AssetPrice' }
      
      this.selectedPriceRangeList = [{ ...type, ...form }]
    }
    else {
      this.selectedPriceRangeList.push({
        type: 'AssetPrice',
        minValue: form.minValue,
        maxValue: form.maxValue,
      });
    }
   
    localStorage.setItem("selectedPriceRangeList", JSON.stringify(this.selectedPriceRangeList));
    this.page = 0;
    this.isMoreProducts = false;
    this.smoothScroll();
    this.productdata = [];
    this.assetPriceFormPatchValue();
    this.filterResult();
    let filter = [];
    filter = JSON.parse(localStorage.getItem("selectedPriceRangeList")) ? JSON.parse(localStorage.getItem("selectedPriceRangeList")) : filter;
    let selectedFiler = filter.find((x) => x.type === "AssetPrice");
   
    this.assetPriceFilter?.forEach(ele => {
      if (ele?.max == selectedFiler?.maxValue) {
        ele.selected = true;
      }
      else {
        ele.selected = false;
      }
    })
  }
  assetPriceFormPatchValue() {
    let form = this.assetPriceForm.value;
    this.assetPriceForm.patchValue({
      minValue: form.minValue,
      maxValue: form.maxValue,
    })
  }
  priceRemove(data) {
    if (data.type == "AssetPrice") {
      this.selectedPriceRangeList = [];
      this.assetPriceForm.reset();
      localStorage.removeItem("selectedPriceRangeList");
      this.assetPriceFilter?.map(x => {
        x.selected = false;
      })
    }
    if (data.type == "Inventory") {
      this.invType = [];
      localStorage.removeItem("invType");
      this.inventoryForm.reset();
    }
    if (data.type == "Publish Status") {
      this.publish = [];
      localStorage.removeItem("publish");
      this.publishStatusView = false;
    }
    this.page = 0;
    this.productdata = [];
    this.filterResult();
  }
  // asset filter

  // inventory filter
  inventoryFormFormData() {
    if (this.inventoryForm.valid) {
      let invForm = this.inventoryForm.value
      let index = this.invType.findIndex((x) => x.type == "Inventory")
      if (index != -1) {
        let type = { type: "Inventory" }
        this.invType = [{ ...type, ...invForm }]
      }
      else {
        this.invType.push({
          type: "Inventory",
          minInvValue: invForm.minInvValue,
          name: invForm.name,
        });
      }
      localStorage.setItem("invType", JSON.stringify(this.invType));
      this.page = 0;
      this.isMoreProducts = false;
      this.smoothScroll();
      this.productdata = [];
      this.inventoryPatchValue();
      this.filterResult();
    }
    else {
      this.toastr.error("Please Enter min value");
    }
  }
  inventoryPatchValue() {
    let minvalue = this.inventoryForm.value.minInvValue;
    this.inventoryForm.patchValue({
      minInvValue: minvalue
    })
  }
  // inventory filter
  // PublishStatusFilter
  getPublishStatusFilter(data: any) {
    this.publishStatusView = data?.name
    let index = this.publish?.findIndex((x) => x.type === data.type);
    if (index != -1) {
      this.publish = [data];
    } else {
      this.publish.push(data);
    }
    localStorage.setItem("publish", JSON.stringify(this.publish));
    this.page = 0;
    this.isMoreProducts = false;
    this.smoothScroll();
    this.productdata = [];
    this.filterResult();
  }
  // PublishStatusFilter
  selectLead(data){
    console.log(data)
    if(data)this.leadInfo.name = data?.lead_time;
    this.page = 0;
    this.isMoreProducts = false;
    this.smoothScroll();
    this.productdata = [];
    this.filterResult();
  }
  // clear filter
  removeFilter() {   
    this.filterSelections = [];
    this.attributeSelected = [];
    this.selectedPriceRangeList = [];
    this.invType = [];
    this.selectedProductFilters = [];
    this.publish = [];
    localStorage.setItem("filter", JSON.stringify(this.filterSelections));
    localStorage.removeItem("selectedProductFilters");
    localStorage.removeItem("attribute");
    localStorage.removeItem("selectedPriceRangeList");
    localStorage.removeItem("invType");
    localStorage.removeItem("publish");
    this.page = 0;
    this.warehouse = null;
    this.hideWareHouseList = false;
    this.hideCityList = false;
    this.w_id = null;
    this.isLocationSearch = "0";
    this.assetPriceForm.reset();
    this.inventoryForm.reset();
    this.supplier = null;
    this.s_id = null;
    this.category = null;
    this.c_id = null;
    this.attribute = null;
    this.productdata = [];
    this.leadInfo.name='';
    this.cityLocationList = this.cityLocationList.map(x => {
      x.selected = false;
      return x;
    });
    this.warehouseList = this.warehouseList.map(x => {
      x.selected = false;
      return x;
    });
    this.SupplierPartnerList = this.SupplierPartnerList.map(x => {
      x.selected = false;
      return x;
    });
    this.supplierList = this.supplierList.map(x => {
      x.selected = false;
      return x;
    });
    this.categoryList = this.categoryList.map(x => {
      x.selected = false;
      return x;
    });
    this.assetPriceFilter?.map(x => {
      x.selected = false;
      return x;
    })
    this.publishStatusView = false;
    this.getLocationList();
    this.deliverySupplierWarehouseList("delivery");
    this.deliverySupplierWarehouseList("supplier");
    this.getSuppliersList();
    this.getCategorieslist();
    this.filterResult();
    this.shop.productsCountInCategorys('').subscribe(data => {
    
      this.countOfCategorys = data.result
     
    })
  }
  viewFilter(content) {
    {
      this.modalService.open(content, this.modalOptions).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.filterIndexView = 'startView';
        }
      );
    }
  }
  // view filter list
  filterShow(data) {
    
    this.filterIndexView = data;
    if (data == 'location') {
      this.cityChecked = true;
      this.listShow('locationList')
      this.warehouseChecked = false;
      this.filterSelections.forEach(ele => {
        if (ele.type == "Warehouse" && ele.selected.length) {
          this.warehouseChecked = true;
          this.cityChecked = false;
          this.listShow('Warehouse')
        }
      })
    }
  }
  listShow(data) {
  
    this.filterIndexListView = data;
    // if (data == 'Warehouse') this.deliverySupplierWarehouseList('delivery');

  }
  assetpricePrevious() {
    if (this.attributeView) {
      if (this.assetPriceForm.value.minValue || this.assetPriceForm.value.maxValue) this.assetPriceFormData();
      this.filterShow('attributes')
    }
    else {
      if (this.assetPriceForm.value.minValue || this.assetPriceForm.value.maxValue) this.assetPriceFormData();
      this.filterShow('categories');
    }
  }
  assetPriceNext() {
    if (this.assetPriceForm.value.minValue || this.assetPriceForm.value.maxValue) this.assetPriceFormData();
    this.filterShow('inventory')
  }
  // view filter list


  productsCountInCategory() {
    this.shop.productsCountInCategorys(this.warehouseId).subscribe(data => {
      if (data) {
        this.loadingData = false;
        this.countOfCategorys = data.result;
        this.getCategorieslist()
        let filter = [];
        filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "Suppliers");
        this.countOfCategorys?.forEach((element) => {
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
          element.type = "Suppliers";
        });
       
      }
    })
  }
  warehousesCountInCategory() {
    if(this.supplierIsTrue == true){
    }
    this.shop.productsCountInCategorysWarehouse(this.warehouse,this.something).subscribe(data => {
      if (data) {
        this.loadingData = false;
        this.countOfCategorys = data.result;
        this.getCategorieslist()
        let filter = [];
        filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "Suppliers");
        this.countOfCategorys.forEach((element) => {
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
          element.type = "Suppliers";
        });
        if(this.supplierIsTrue == true){
          this.countOfCategorys = this.countOfCategorys?.filter(x =>{
            return x.total_product>0
           })
        }
      }
    })
  }

  assetPriceFilter: any = [];
  getAssetPriceFilterRange() {
    this.shop.AssetPriceFilterRange().subscribe(data => {
    
      this.assetPriceFilter = data.result;
      let filter = [];
      filter = JSON.parse(localStorage.getItem("selectedPriceRangeList")) ? JSON.parse(localStorage.getItem("selectedPriceRangeList")) : filter;
      let selectedFiler = filter.find((x) => x.type === "AssetPrice");
      this.assetPriceFilter?.forEach(ele => {
        if (ele?.max == selectedFiler?.maxValue) {
          ele.selected = true;
        }
        else {
          ele.selected = false;
        }
      })
    })
  }
  serchType(event){
    
    this.search_type = event.target.value
  }
  searchResult(){
    if(this.search && this.search_type){
      this.productdata = [];
      this.page=0;
      this.enableSearch = true;
      this.filterResult();
    }
  }
  backProduct(){
    this.productdata = [];
    this.page=0;
    this.search_type=''
    this.search=''
    window.location.reload();
  }
 
  bulkPopup(){
    const modalRef = this.modalService.open(DialogComponent, {
      size: "xl",
      backdrop: "static",
      centered: true,
      windowClass:'bulkUpload-popup'
    });
    let excelData = {
      content:"",
      dialogType: "bulk-popup",
    };
    document.body.style.overflow = 'hidden';
    modalRef.componentInstance.excelIn = excelData;
  }
}