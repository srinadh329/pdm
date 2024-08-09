import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DialogComponent } from "../dialog/dialog.component";
import { ItemsService } from "src/app/services/items.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CreateMoodboardService } from "src/app/services/create-moodboard.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-product",
  templateUrl: "./create-product.component.html",
  styleUrls: ["./create-product.component.css"],
})
export class CreateProductComponent implements OnInit {
  categoryList: any;
  originalCategoryList: any;
  supplierList: any;
  originalsupplierList: any;
  attributeList: any;
  productForm: any;
  productInfo: any;
  is_img_show: boolean = false;
  fileElement: any;
  previews: any = [];
  productType: any = [
    { value: "B2B", key: "B2B", sgid: 1 },
    { value: "B2C", key: "B2C", sgid: 2 },
    { value: "Both", key: "Both", sgid: 3 },
  ];
  @ViewChild("scrollDiv") scrollDiv: ElementRef | null = null;
  warehouseList: any;
  warehouseCount: any;
  is_submitted: boolean = false;
  constructor(
    private modalService: NgbModal,
    private shop: ItemsService,
    private spinner: NgxSpinnerService,
    private cMbService: CreateMoodboardService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ["", Validators.required],
      lead_time: [""],
      product_id: [""],
      product_type: ["", Validators.required],
      sku: [""],
      inhabitr_sku: [""],
      category_id: ["", Validators.required],
      category_name: ["", Validators.required],
      asset_value: ["", Validators.required],
      pricing_asset_value: ["", Validators.required],
      supplier_id: ["", Validators.required],
      supplier_name: ["", Validators.required],
      buy_new_multiplier: [""],
      supplier_sku: ["", Validators.required],
      images: [""],
      attributes: ["", Validators.required],
      attributes_name: [""],
      dimension: ["", Validators.required],
      features: ["", Validators.required],
      description: ["", Validators.required],
      // inventory:this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getCategorieslist();
    this.getProductAttributes();
    this.getSuppliersSelected("");
  }
  categoryDialog() {
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let createCategoryData = {
      content: "Add Category",
      dialogType: "create-category",
    };
    modalRef.componentInstance.createCategoryInData = createCategoryData;
  }
  supplierDialog(data) {
    const modalRef = this.modalService.open(DialogComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let createSupplierData = {
      content: "Add Supplier",
      dialogType: "create-supplier",
      segment: data,
      supplier: this.supplierList,
    };
    modalRef.componentInstance.createSupplierInData = createSupplierData;
    modalRef.componentInstance.createSupplierOpData.subscribe((res: any) => {
      if (res) {
        modalRef.componentInstance.activeModal.close();
        this.spinner.show();
        this.shop.createUpdateSupplier(res).subscribe((res: any) => {
          console.log(res);
          if (res?.statusCode == 200) {
            this.spinner.hide();
            this.getSuppliersSelected(res?.result?.sgid);
          }
        });
      }
      console.log(res);
    });
  }
  getCategorieslist() {
    this.spinner.show();
    this.shop.getCategories({}).subscribe((res) => {
      this.spinner.hide();
      if (res?.statusCode == 200) {
        this.categoryList = res?.result;
        this.originalCategoryList = res?.result;
      }
      console.log(this.categoryList);
    });
  }
  onSelectedFrontImg(event: any) {
    console.log(event);
    const files = event.target ? event.target.files : event;
    this.fileElement = files;
    const fileLength = files.length;
    this.previews = [];
    for (let i = 0; i < fileLength; i++) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        console.log(e.target.result);
        this.previews.push(e.target.result);
      };

      reader.readAsDataURL(this.fileElement[i]);
    }
  }
  searchCategory(event: any, type: any) {
    const searchTerm = event?.target?.value?.toLowerCase();
    if (type == "category") {
      if (searchTerm) {
        this.categoryList = this.originalCategoryList.filter((x: any) =>
          String(x.name).toLowerCase().includes(searchTerm)
        );
      } else {
        this.categoryList = [...this.originalCategoryList]; // Reset to original list
      }
    } else if (type == "supplier") {
      if (searchTerm) {
        this.supplierList = this.originalsupplierList.filter((x: any) =>
          String(x.name).toLowerCase().includes(searchTerm)
        );
      } else {
        this.supplierList = [...this.originalsupplierList]; // Reset to original list
      }
    }
  }
  getSegment() {
    this.spinner.show();
    this.cMbService.getDesign().subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res) {
          this.supplierDialog(res?.result);
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  getProductAttributes() {
    this.spinner.show();
    this.shop.getProductAttributes({}).subscribe((res: any) => {
      this.spinner.hide();
      if (res?.statusCode == 200) {
        this.attributeList = res?.result;
      }
      console.log(res);
    });
  }
  getSuppliersSelected(data) {
    this.spinner.show();
    this.shop.getSuppliersSelected(data).subscribe((res: any) => {
      this.spinner.hide();
      console.log(res);
      if (res?.statusCode == 200) {
        this.supplierList = res?.result;
        this.originalsupplierList = res?.result;
        this.supplierList.forEach((item: any) => {
          if (item?.selected == "yes" && item?.sgid == data) {
            this.productForm.patchValue({
              supplier_name: item?.name,
              supplier_id: item?.sgid,
              buy_new_multiplier: item?.buy_new_multiplier,
            });
          }
        });
      }
    });
  }
  selectCategory(data: any, type: string) {
    if (data?.sgid && type == "category") {
      this.productForm.patchValue({
        category_id: data?.sgid,
        category_name: data?.name,
      });
    } else if (data?.sgid && type == "supplier") {
      this.productForm.patchValue({
        supplier_name: data?.name,
        supplier_id: data?.sgid,
        buy_new_multiplier: data?.buy_new_multiplier,
        asset_value:
          Number(this.productForm.value?.asset_value) *
          Number(data?.buy_new_multiplier),
      });
      // this.getWarehousesForSupplier(data?.sgid);
    }
  }
  purchasePriceCal(event) {
    console.log(event?.target?.value);
    this.productForm.patchValue({
      asset_value:
        Number(event.target.value) *
        Number(this.productForm.value?.buy_new_multiplier),
    });
  }
  // getWarehousesForSupplier(id){
  //   this.spinner.show()
  //   this.shop.getWarehousesForSupplier(id).subscribe((res:any)=>{
  //     this.spinner.hide()
  //     if(res?.statusCode==200 && res?.result?.length){
  //       this.warehouseList = res?.result;
  //       this.inventoryForm();
  //     }
  //     else{
  //       while (this.inventoryData.length) {
  //         this.inventoryData.removeAt(0);
  //       }
  //       this.toastr.error('Warehouse details are unavailable. Please update them or choose another supplier.')
  //     }
  //   })
  // }
  selectWarehouse(data, index) {
    const existingWarehouse = this.inventoryData.controls.some(
      (control: FormGroup, i: number) =>
        control.value.warehouse_id == data?.sgid && i !== index
    );

    if (!existingWarehouse) {
      const inventoryForm = this.inventoryData.at(index) as FormGroup;
      inventoryForm.patchValue({
        warehouse_id: data?.sgid,
        warehouse_name: data?.warehouse_name,
      });
    } else {
      this.toastr.error("Warehouse ID already selected");
    }
    console.log(this.productForm.value);
  }
  removeIndex(index) {
    this.inventoryData.removeAt(index);
    this.warehouseCount = this.inventoryData?.length;
  }
  addWarehouse() {
    this.inventoryForm();
  }
  get inventoryData() {
    return this.productForm.controls["inventory"] as FormArray;
  }
  inventoryForm() {
    const inventoryForm = this.fb.group({
      supplier_quantity: ["", Validators.required],
      combination_sku: ["", Validators.required],
      warehouse_id: ["", Validators.required],
      inhabitr_quantity: ["", Validators.required],
      assigned_inv: ["", Validators.required],
      non_assigned_inv: ["", Validators.required],
      b2b_non_assigned_inv: ["", Validators.required],
      in_transit: ["", Validators.required],
      warehouse_name: ["", Validators.required],
    });
    this.inventoryData.push(inventoryForm);
    this.warehouseCount = this.inventoryData?.length;
  }
  selectAttr(data, attribute) {
    if (data?.sgid) {
      attribute.label_name = data?.attribute_value;
      attribute.value = data.sgid;
    }

    // Update the form control value for the attributes array
    const selectedAttributes = this.attributeList
      .map((item) => (item.value ? Number(item.value) : null))
      .filter((value) => value);

    this.productForm.patchValue({
      attributes: selectedAttributes,
    });

    // Check if all attributes are selected and update the form's error state
    this.checkAttributesValidity();
  }

  checkAttributesValidity() {
    const allAttributesSelected = this.attributeList.every(
      (attr) => attr.value
    );

    if (allAttributesSelected) {
      this.productForm.get("attributes").setErrors(null);
    } else {
      this.productForm.get("attributes").setErrors({ required: true });
    }
  }

  selectProduct(data) {
    this.productForm.patchValue({
      product_type: data?.value,
    });
  }
  submit() {
    this.is_submitted = true;
    if (this.productForm.valid) {
      let obj = {
        product: {
          category_id: this.productForm?.value?.category_id,
          supplier_id: this.productForm?.value?.supplier_id,
          name: this.productForm?.value?.name,
          slug: "s2-tribal-look-footed-planter-68-black",
          description: this.productForm?.value?.description,
          features: this.productForm?.value?.features,
          status: 1,
          supplier_sku: null,
          source: "Api",
          variations: [
            {
              supplier_sku: this.productForm?.value?.supplier_sku,
              asset_value: this.productForm?.value?.asset_value,
              pricing_asset_value: this.productForm?.value?.pricing_asset_value,
              weight: "",
              dimension: this.productForm?.value?.dimension,
              stock: "",
              lead_time: this.productForm?.value?.lead_time,
              images: [],
              buy_used_price: "",
              buy_new_price: "",
              status: 1,
              attributes: this.productForm?.value?.attributes,
              inventory: this.productForm?.value?.inventory,
            },
          ],
        },
      };
      console.log(obj);
      this.spinner.show();
      this.shop.saveProduct(obj).subscribe(
        (res: any) => {
          if (res?.statusCode == 200) {
            this.spinner.hide();
            this.is_img_show = true;
            this.productInfo = res[0]?.original?.variations[0];
            this.productForm.patchValue({
              sku: res[0]?.original?.result?.sku,
              inhabitr_sku: this.productInfo?.inhabitr_sku,
            });
          } else {
            this.toastr.error(res?.message);
          }
          console.log(this.productInfo);
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(error?.error?.message);
        }
      );
    }
    else{
      this.toastr.error('Provide required information')
    }
  }
  save() {
    if (this.fileElement) {
      this.spinner.show();
      for (let i = 0; i < this.fileElement.length; i++) {
        this.upload(i, this.fileElement[i]);
      }
    }
  }
  upload(idx, file: File) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("sku_variation_id", this.productInfo?.sgid);
    formData.append("product_id", this.productInfo?.product_id);
    formData.append("image", file.name);
    formData.append("sort_order", idx + 1);
    formData.append("is_default", idx == 0 ? "1" : "0");
    this.shop.uploadProductImg(formData).subscribe(
      (res: any) => {
        if (res?.body?.statusCode == 200) {
          this.spinner.hide();
          this.toastr.success("Product created successfully");
          this.router.navigate(["/admin/products/list"]);
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  scroll(data, type) {
    if (type == "scroll") {
      this.scrollDiv?.nativeElement?.scrollBy(data, 0);
    }
  }
}
