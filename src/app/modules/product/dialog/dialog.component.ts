import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
})
export class DialogComponent implements OnInit {
  @Input() mbIn: any;
  @Input() createMbIn: any;
  @Input() categoryIn: any;
  @Input() supplierIn: any;
  @Input() viewFilterIn: any;
  @Input() variationInData: any;
  @Input() segmentIn: any;
  @Input() updateIn: any;
  @Input() quoteIn: any;
  @Input() prodcutCategoryIn: any;
  @Input() floorPlanInData: any;
  productDetails: any = "productDetails";
  @Input() createCategoryInData: any;
  @Input() createSupplierInData: any;
  @Input() excelIn:any;
  @Output() mbOp: EventEmitter<any> = new EventEmitter();
  @Output() createMbOp: EventEmitter<any> = new EventEmitter();
  @Output() categoryOp: EventEmitter<any> = new EventEmitter();
  @Output() supplierOp: EventEmitter<any> = new EventEmitter();
  @Output() viewFilteOp: EventEmitter<any> = new EventEmitter();
  @Output() variationOpData: EventEmitter<any> = new EventEmitter();
  @Output() updateOp: EventEmitter<any> = new EventEmitter();
  @Input() attrIp: any;
  @Input() deleteIp: any;
  @Input() assetPriceHistory: any;
  @Input() addQuoteIn: any;
  @Input() imguploadIn:any;
  @Output() attrOp: EventEmitter<any> = new EventEmitter();
  @Output() deleteOp: EventEmitter<any> = new EventEmitter();
  @Output() quoteOp: EventEmitter<any> = new EventEmitter();
  @Output() addQuoteOp: EventEmitter<any> = new EventEmitter();
  @Output() prodcutCategoryOp: EventEmitter<any> = new EventEmitter();
  @Output() floorPlanOpData: EventEmitter<any> = new EventEmitter();
  @Output() createSupplierOpData: EventEmitter<any> = new EventEmitter();
  moodboardTypeId: any;
  moodbTypeName: any = "Select Moodboard";
  filterIndexView = "startView";
  valueIn: any = "";
  is_disable: boolean = true;
  quote_name: any;
  quoteInfo: any;
  product_category_id: any;
  floorForm: any;
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  @ViewChild('fileupload') fileupload: ElementRef;
  isLoading: boolean;
  start: number = 20;
  isMoreProducts: boolean = true;
  multiple_attr: any = [];
  addCategoryForm: any;
  addSupplierForm: any;
  phoneNoPattern = "^(1s?)?((([0-9]{3}))|[0-9]{3})[s-]?[\0-9]{3}[s-]?[0-9]{4}$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  dropdownSettings = {
    singleSelection: false,
    idField: "sgid",
    textField: "design_type",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 1,
    enableCheckAll: false,
  };
  selectSegement: any = [];
  originalsupplierList: any;
  is_show_dropdown: boolean = false;
  is_disabled_multiple:boolean = false;
  excelFile: any;
  fileName: any;
  uploadRes:any={
    is_show:false,
    res:''
  }
  progress: number=0;
  simulatedProgressInterval: any;
  simulatedProgress: number;
  uploadSubscription: any;
  fileuploadSuccess:any={
    is_show:false
  }
  fileuploadError:any={
    is_show:false,
    text:''
  }
  page: any;
  errorValue:any
  originalUploadData:any=[];
  tableHeaders: string[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private toasterService: ToastrService,
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private fb: FormBuilder,
    private cMbService: CreateMoodboardService
  ) {
    this.floorForm = this.fb.group({
      floorplan_name: ["", Validators.required],
      floorplan_type_id: ["", Validators.required],
      units: ["", Validators.required],
    });
    this.addCategoryForm = this.fb.group({
      category_name: ["", Validators.required],
    });
    this.addSupplierForm = this.fb.group({
      name: ["", Validators.required],
      segments: ["", Validators.required],
      email: ["", Validators.required],
      buy_new_multiplier:["", Validators.required],
      contact_person_name: ["", Validators.required],
      contact_no: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.quoteIn?.data) {
      this.quote_name = this.quoteIn?.data[0];
    }
    if (this.addQuoteIn) {
      this.quoteInfo = this.addQuoteIn?.floorDetails[0];
      this.isAllUnit("1");
    }
    if (this.createSupplierInData?.dialogType == "create-supplier") {
      this.originalsupplierList = this.createSupplierInData?.supplier;
    }
  }
  selectMoodbType(data: any) {
    this.moodboardTypeId = data?.sgid;
    this.moodbTypeName = data?.boardname;
  }
  createNewMoodboardPopUp(data: any) {
    this.mbOp.emit({ type: data });
  }

  onScroll() {
    let element = this.myScrollContainer.nativeElement;
    let atBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    console.log(atBottom);
    if (atBottom && !this.isLoading && this.isMoreProducts) {
      this.getMyMoodboards();
    }
  }
  getMyMoodboards() {
    let count = 20;
    this.isLoading = true;
    this.cMbService
      .getMyMoodboards(null, null, this.start, count)
      .subscribe((res: any) => {
        if (res?.statusCode == 200) {
          this.isLoading = false;
          this.start += 20;
          console.log(res);
          this.mbIn.res = [...this.mbIn?.res, ...res?.result];
        }
        this.isMoreProducts =
          res.result && res.result.length >= 20 ? true : false;
      });
  }
  addtoMoodboard() {
    if (this.moodboardTypeId) {
      this.mbOp.emit({
        type: "addMb",
        mdId: this.moodboardTypeId,
        name: this.moodbTypeName,
      });
    } else {
      this.toasterService.error("Please select moodboard");
    }
  }
  forceAddMb(data) {
    data.force_add = "1";

    this.variationOpData.emit(data);
  }
  createDialogClose(data: any) {
    if (data?.type == "created") {
      this.createMbOp.emit({ type: data?.type });
    }
  }
  closeDialog(data: any) {
    this.createMbOp.emit({ type: data });
  }
  // category supplier popup
  getSelectedCategory(data) {
    data.selected = !data.selected;
    if (data?.type == "categories") {
      this.categoryOp.emit({ type: data.type, result: data });
    }
    if (data?.type == "suppliers") {
      this.supplierOp.emit({ type: data.type, result: data });
    }
  }
  // category supplier popup

  // view filter
  filterShow(data) {
    this.filterIndexView = data;
  }
  // view filter
  // view filter selected category
  viewFilterSelectCategory(data) {
    data.selected = !data.selected;
    if (data?.type == "categories") {
      this.viewFilteOp.emit({ type: data.type, result: data });
    }
    if (data?.type == "suppliers") {
      this.viewFilteOp.emit({ type: data.type, result: data });
    }
  }
  // view filter selected category
  // view filter asset price
  assetPrice(event) {
    this.viewFilteOp.emit({ type: "assetPrice", result: event });
  }
  // view filter asset price

  // view filter inventory price
  inventory(data) {
    this.viewFilteOp.emit({ type: "inventory", result: data });
  }
  // view filter inventory price

  // search filter
  searchfilter(data: any, type) {
    if (data) {
      let string = data?.split(" ");
      for (var i = 0; i < string.length; i++) {
        string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
      }
      data = string.join(" ");
    }
    if (type == "categories" && data !== "") {
      this.categorySearch(data);
    } else if (type == "categories" && data == "") {
      this.valueIn = data;
      this.categorySearch(data);
    }
    if (type == "suppliers" && data !== "") {
      this.supplierSearch(data);
    } else if (type == "suppliers" && data == "") {
      this.valueIn = data;
      this.supplierSearch(data);
    }
  }
  categorySearch(data) {
    this.spinner.show();
    this.shop.getSearchCategory({ search_key: data }).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res) {
          this.categoryIn.res = res?.result;
          let filter = [];
          filter = JSON.parse(localStorage.getItem("filter"))
            ? JSON.parse(localStorage.getItem("filter"))
            : filter;
          let selectedFiler = filter.find((x) => x.type === "categories");
          this.categoryIn.res.forEach((element) => {
            element.type = "categories";
            element.selected =
              selectedFiler && selectedFiler.selected.includes(element.sgid)
                ? true
                : false;
          });
          this.categoryOp.emit({
            type: "categorySearchResult",
            result: this.categoryIn.res,
          });
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  supplierSearch(data) {
    this.spinner.show();
    this.shop.getSearchSupplier({ search_key: data }).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res) {
          this.supplierIn.res = res?.result;
          let filter = [];
          filter = JSON.parse(localStorage.getItem("filter"))
            ? JSON.parse(localStorage.getItem("filter"))
            : filter;
          let selectedFiler = filter.find((x) => x.type === "suppliers");
          this.supplierIn?.res.forEach((element) => {
            element.type = "suppliers";
            element.selected =
              selectedFiler && selectedFiler.selected.includes(element.sgid)
                ? true
                : false;
          });
          this.supplierOp.emit({
            type: "supplierSearchResult",
            result: this.supplierIn?.res,
          });
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  // search filter

  updateDetails() {
    this.updateOp.emit(this.updateIn);
  }

  // attribute funtionality

  selectAttr(event, type, attributes) {
    attributes.value = event.sgid;
    attributes.label_name = event?.attribute_value;
    this.is_disable = false;
  }

  searchAttr(type: any, e: any) {
    let list_id = type?.list_id;
    let index = this.attrIp?.data.findIndex((x) => x.list_id == list_id);
    this.attrIp.data[index].attribute_list = this.attrIp?.searchData[
      index
    ].attribute_list.filter((x: any) => {
      if (String(x.attribute_value).toLowerCase().includes(e.toLowerCase())) {
        return x;
      }
    });
  }
  saveAttr() {
    this.attrOp.emit({ type: "update-attribute", data: this.attrIp?.data });
  }
  deleteVariation(data: any) {
    this.attrOp.emit({ type: "delete-variation", result: data });
  }
  attributeMulitiple(data, event) {
    if (event?.target.checked == true) {
      this.multiple_attr.push(data);
      console.log(this.multiple_attr);
    } else if (event?.target?.checked == false) {
      let index = this.multiple_attr.findIndex(
        (x) =>
          x.attribute_id == data?.attribute_id &&
          x.attribute_variation_id == data?.attribute_variation_id
      );
      if (index != -1) {
        this.multiple_attr.splice(index, 1);
        console.log(this.multiple_attr);
      }
    }
  }
  deteleMultiAttr() {
    this.attrOp.emit({
      type: "delete-multiple-variation",
      result: this.multiple_attr,
    });
  }
  cancel(data) {
    this.deleteOp.emit({ type: data });
  }
  deleteAttr(deleteType, result) {
    this.deleteOp.emit({ type: deleteType, data: result });
  }

  // attribute funtionality

  // quote selection
  selectQuote(data) {
    this.quote_name = data;
  }
  addToQuote() {
    this.quoteOp.emit({ type: "floor", data: this.quote_name });
  }
  createNewQuotePopUp(data) {
    this.quoteOp.emit({ type: data });
  }
  selectFloor(data) {
    this.quoteInfo = data;
  }
  isAllUnit(type) {
    if (type == "1") {
      this.addQuoteIn?.unitDetails.forEach((elem) => {
        elem.selected = true;
      });
    }
    if (type == "0") {
      this.addQuoteIn?.unitDetails.forEach((elem) => {
        elem.selected = false;
      });
    }
  }
  selectUnit(data) {
    data.selected = !data?.selected;
  }

  addedQuote() {
    let unit = this.addQuoteIn?.unitDetails.filter((x: any) => {
      if (x?.isactive == 1 && x?.selected == true) {
        return x.sgid;
      }
    });
    let obj = {
      floorplan_id: this.quoteInfo?.sgid,
      quote_id: this.addQuoteIn?.quoteDetails?.sgid,
      units: unit.map((x) => x.sgid),
    };
    this.addQuoteOp.emit(obj);
  }

  // quote selection
  getProdcutCategory(data) {
    this.prodcutCategoryIn?.res?.forEach((x: any) => {
      if (x.sgid == data?.sgid) {
        x.selected = true;
      } else {
        x.selected = false;
      }
    });
    this.product_category_id = data?.sgid;
  }
  updateCategory() {
    this.prodcutCategoryOp.emit(this.product_category_id);
  }
  addFloorPlan() {
    this.floorPlanOpData.emit(this.floorForm.value);
  }
  addSupplier() {
    console.log(this.addSupplierForm.value);
    this.createSupplierOpData.emit(this.addSupplierForm.value)
  }
 
  onItemSelect(data) {
    this.selectSegement.push(data);
    this.addSupplierForm.patchValue({
      segments: this.selectSegement.map((x) => x.sgid),
    });
    console.log(this.addSupplierForm.value?.segments);
  }
  onItemDeSelect(data) {
    let index = this.addSupplierForm?.value.segments.findIndex(
      (x) => x == data.sgid
    );
    if (index !== -1) {
      this.selectSegement.splice(index, 1);
      this.addSupplierForm.patchValue({
        segments: this.selectSegement.map((x) => x.sgid),
      });
    }
    console.log(this.addSupplierForm.value?.segments);
  }
  searchSupplier(event) {
    const searchTerm = event?.target?.value?.toLowerCase();

    if (searchTerm) {
        this.createSupplierInData.supplier = this.originalsupplierList.filter(
            (x: any) => x.name.toLowerCase().includes(searchTerm)
        );
        this.is_show_dropdown = this.createSupplierInData.supplier.length > 0;
    } else {
        this.createSupplierInData.supplier = [...this.originalsupplierList];
        this.is_show_dropdown = false;
    }
}

  selectSupplier(data){
    if(data){
      this.addSupplierForm.patchValue({
        name: data?.name,
      });
      this.is_show_dropdown = false;
      this.addSupplierForm.disable();
      this.is_disabled_multiple=true;
      this.toasterService.error('The supplier already exists. Please select from the dropdown list')
    }
  }
  importExcel(event:any){
    const files = event.target.files[0];
    console.log(files)
    if(files.size > 50 * 1024 * 1024){
      this.fileuploadError={
        is_show:true,
        text:'File size exceeds 50MB. Please upload a smaller file'
      }
      this.fileName = ''
      this.fileupload.nativeElement.value = '';
      return;
    }
    this.fileName = files;
    console.log(this.fileName?.name);
    const reader = new FileReader();

      reader.onload = (e: any) => {
        console.log(e.target.result);
      };

      reader.readAsDataURL(this.fileName);
      this.fileuploadError.is_show = false;
  }

  uploadExcelFile() {
    var formData = new FormData();
    formData.append('filename', this.fileName);
    this.uploadSubscription = this.shop.bulkUpload(formData).subscribe(
      (event: any) => {
        console.log(event)
        switch (Number(event.type)) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            // Initialize progress and start simulation
            this.progress = 0;
            this.simulatedProgress = 0;
            this.startProgressSimulation();
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            // Calculate the actual progress
            let actualProgress = Math.round(event.loaded / event.total * 100);
            // Ensure simulated progress doesn't exceed actual progress
            if (actualProgress > this.simulatedProgress) {
              this.simulatedProgress = actualProgress;
            }
            console.log(`Uploaded! ${this.simulatedProgress}%`);
            break;
          case HttpEventType.Response:
            if (event.body?.statusCode == 200) {
              this.fileuploadSuccess.is_show = true;
              this.uploadRes = {
                is_show: false,
                res: event.body?.outcomes
              }
              if (this.uploadRes.res?.length > 0) {
                this.tableHeaders = Object.keys(this.uploadRes.res?.[0]).filter(
                  key => key !== 'backend_message' && key !== 'backend_status'
                );
                console.log(this.tableHeaders)
              }
              this.progress = 0;
              this.clearSuccessMessage();
            } else if ([400, 401, 500].includes(event.body?.statusCode)) {
              this.fileuploadError={
                is_show:true,
                text:event.body[0]
              }
              // this.clearErrorMessage()
              this.progress = 0;
              this.fileName = ''
              this.fileupload.nativeElement.value = '';
            }
            // Ensure final progress is set to 100% and stop simulation
            this.simulatedProgress = 100;
            this.stopProgressSimulation();
            break;
        }
      },
      error => {
        console.log(error)
        this.spinner.hide();
        this.fileName = ''
        this.fileuploadError={
          is_show:true,
          text:error
        }
        // this.clearErrorMessage()
        // Stop the simulated progress update in case of error
        this.stopProgressSimulation();
      });
  }

startProgressSimulation() {
    this.simulatedProgressInterval = setInterval(() => {
        // Increment the simulated progress by a random value between 10 and 20
        let increment = Math.floor(Math.random() * 11) + 10;
        if (this.simulatedProgress + increment <= 100) {
            this.simulatedProgress += increment;
        } else {
            this.simulatedProgress = 100;
        }
        this.progress = this.simulatedProgress;
    }, 1000); // Update every second
}

stopProgressSimulation() {
    if (this.simulatedProgressInterval) {
        clearInterval(this.simulatedProgressInterval);
        this.simulatedProgressInterval = null;
    }
}

clearSuccessMessage() {
  setTimeout(() => {
    this.uploadRes.is_show = true;
    this.fileuploadSuccess.is_show = false;
  }, 3000); // Clear the message after 3 seconds
}
// clearErrorMessage() {
//   setTimeout(() => {
//     this.fileuploadError={
//       is_show:false,
//       text:''
//     }
//   }, 3000); 
// }
terimateExcelFile(){
  if (this.uploadSubscription) {
    this.uploadSubscription.unsubscribe();
    this.progress = 0;
     this.fileName = ''
     this.fileupload.nativeElement.value = '';
    this.stopProgressSimulation();
    this.fileuploadError={
      is_show:true,
      text:'File upload terminated'
    }
  }
}
errorData(event){
  console.log(this.uploadRes.res)
  if(event.target.checked==true){
    let items = this.uploadRes.res
    this.originalUploadData =  this.uploadRes.res
    this.uploadRes.res = items.filter(x=>x.backend_status=="failed")
   this.page=1
  }
  if(event.target.checked==false){
   
    this.uploadRes.res =  this.originalUploadData
  }
}
bulkuploadPopClose(){
  this.activeModal.close();
  document.body.style.overflow = '';
}

onSelectedImg(event){
  const files = event.target.files[0];
  console.log(files)
}
}