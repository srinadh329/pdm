import { Component, OnInit } from '@angular/core';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { DashboardService } from "src/app/services/dashboard.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
// import { ViewEncapsulation } from '@angular/core'

@Component({
  selector: "app-supplier-dashboard-history",
  templateUrl: "./supplier-dashboard-history.component.html",
  styleUrls: ["./supplier-dashboard-history.component.css"],
  // encapsulation: ViewEncapsulation.None
})
export class SupplierDashboardHistoryComponent implements OnInit {
  supplierList: any;
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  p: any;
  selectedSupp: any = 0;
  supplierTData: any=[];
  filterSelections = [];
  constructor(private DashboardService: DashboardService,private modalService: NgbModal,
    private spinner: NgxSpinnerService,) {}

  ngOnInit(): void {
   
    this.getSupplierDropdownValues();
    this.dropdownSettings = {
      singleSelection: false,
      idField: "sgid",
      textField: "name",
      allowSearchFilter: true,
      selectAllText: "Select All",
      unSelectAllText: "Select All",
      itemsShowLimit: 0,
      "limitSelection": -1
    };
    this.suppliersList();
  }

  getSupplierDropdownValues() {
    this.DashboardService.getAllActiveSupplier().subscribe((res) => {
      
      this.supplierList = res;
    });
  }
  sortType = 'desc'
  assing(value){
  
  this.sortType = value;
  this.supplierTData=[]
  this.suppliersList()
  }

  desing(value){
  
  this.sortType = value;
  this.supplierTData=[]
  this.suppliersList()
  }

  suppliersList(){
   
    this.spinner.show()
    this.DashboardService.getTableList(this.selectedSupp, this.sortType).subscribe((data) => {
      this.spinner.hide()
      if(data.result=="Supplier Data not Found."){
        this.supplierTData=[];
        return
      }
      else{
        this.supplierTData = data.result;
      }
    },error=>{
      this.spinner.hide()
    });
  }
 
  onItemSelect(item: any) {
    this.filterSelections.push(item);
    let selectedSuppValue = this.filterSelections.map((x) => x.sgid);
    this.selectedSupp = selectedSuppValue;
    this.supplierTData=[]
    this.suppliersList()
  }
  onItemDeSelect(item: any) {
    let filterIndex = this.filterSelections.findIndex((x) => x.sgid === item.sgid);
    if (filterIndex != -1) this.filterSelections.splice(filterIndex, 1);
    let selectedSuppValue = this.filterSelections.map((x) => x.sgid);
    this.selectedSupp = selectedSuppValue;
    this.supplierTData=[]
    this.suppliersList()
  }

  onSelectAll(items: any) {
    this.filterSelections = items;
    let selectedSuppValue = this.filterSelections.map((x) => x.sgid);
    this.selectedSupp = selectedSuppValue;
    this.supplierTData=[]
    this.suppliersList()
  }

  onUnSelectAll() {
    this.selectedSupp = 0;
    this.supplierTData=[];
    this.filterSelections=[];
    this.suppliersList()
  }
  inventoryDialog(){
    this.spinner.show()
    this.DashboardService.supplierHistory().subscribe((res:any)=>{
      this.spinner.hide()
      if(res?.statusCode==200){
        const modalRef = this.modalService.open(DialogBoxComponent, {
          backdrop: "static",
          centered: true,
          windowClass:'supply-history'
        });
        let dataMb = {
          content: "Inventory Log",
          dialogType: "inventory-log",
          res:res?.result
        };
        modalRef.componentInstance.invIp = dataMb;
      }
    },error=>{
      this.spinner.hide()
    }) 
  
}
}
