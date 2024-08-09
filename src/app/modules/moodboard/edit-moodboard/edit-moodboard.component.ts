import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CreateMoodboardService } from 'src/app/services/create-moodboard.service';
import { ItemsService } from 'src/app/services/items.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: "app-edit-moodboard",
  templateUrl: "./edit-moodboard.component.html",
  styleUrls: ["./edit-moodboard.component.css"],
})
export class EditMoodboardComponent implements OnInit {
  stateList: any;
  companyList: any;
  companyOptions: any;
  moodboardForm: any;
  projectList: any[];
  designList: any;
  designRoomType: any;
  buget: any;
  designType: any;
  moodboardType: any;
  form_key:any=[
    {sgid:1,no_of_rooms:'',budget:'',room_type:'',showUnitRoom:'rooms',showMoodboard:false,lable_type:'Room Type'},
    {sgid:2,no_of_units:'',budget:'',room_type:'',design_type_id:'',moodboard_type_id:'',
    showUnitRoom:'units',showMoodboard:true,lable_type:'Floor Plan Type'},
    {sgid:3,square_feet:'',budget:'',room_type:'',
    showUnitRoom:'square_feet',showMoodboard:false,lable_type:'Square Feet Area'},
    {sgid:4,no_of_units:'',no_of_rooms:'',no_of_beds:'',room_type:'',
    showUnitRoom:'both',showMoodboard:false,},
    {sgid:5,no_of_units:'',budget:'',room_type:'',
    showUnitRoom:'units',showMoodboard:false,lable_type:'Floor Plan Type'},
    {sgid:6,no_of_units:'',budget:'',room_type:'',
    showUnitRoom:'units',showMoodboard:false,lable_type:'Room Type'},
    {sgid:7,no_of_units:'',budget:'',room_type:'',design_type_id:'',moodboard_type_id:'',
    showUnitRoom:'units',showMoodboard:true,lable_type:'Floor Plan Type'},
    {sgid:8,square_feet:'',budget:'',room_type:'',
    showUnitRoom:'square_feet',showMoodboard:false,lable_type:'Square Feet Area'},
    {sgid:10,no_of_units:'',budget:'',room_type:'',design_type_id:'',moodboard_type_id:'',
    showUnitRoom:'units',showMoodboard:true,lable_type:'Room Type'},
    {sgid:11,no_of_units:'',budget:'',room_type:'',design_type_id:'',moodboard_type_id:'',
    showUnitRoom:'units',showMoodboard:true,lable_type:'Room Type'},
  ]
  @Input() editMbData: any;
  @Output() editMbOpData: EventEmitter<any> = new EventEmitter();
  projectOptions: boolean;
  constructor(
    private auth: AuthenticateService,
    private cMbService: CreateMoodboardService,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mbs: CreateMoodboardService,
    private sharedService: SharedService
  ) {
    this.getStateList();
    this.getCompanyListByUserMD();
    this.getDesign();
    this.designTypeList();
    this.MoodboardTypeList();
    this.moodboardForm = this.formBuilder.group({
      moodboard_name: ["", Validators.required],
      design_type: [],
      room_type: [],
      no_of_rooms: [],
      no_of_units: [],
      no_of_beds: [],
      square_feet: [],
      budget: [""],
      moodboard_type_id: [],
      design_type_id: [],
      company_id: [],
      company_name: [""],
      project_id: [],
      project_name: [""],
      delivery_date: [""],
      room_type_name: [""],
    });
  }

  ngOnInit(): void {
    
    if (this.editMbData?.moodboard?.company_id)
      this.getProjectListMD(this.editMbData?.moodboard?.company_id);
    if (this.editMbData?.moodboard_wizard?.moodboard_design_type_id)
      this.getDesignType(
        this.editMbData?.moodboard_wizard?.moodboard_design_type_id
      );
    if (this.editMbData?.moodboard_wizard?.mbForm == "copy") {
      this.moodboardForm.disable();
    }
    if (this.editMbData?.moodboard_wizard?.mbForm == "edit") {
      this.moodboardForm.enable();
    }
    setTimeout(() => {
      this.editform();
    }, 1000);
  }

  editform() {
    if (this.editMbData?.moodboard_wizard?.moodboard_design_type_id == "") {
      this.moodboardForm?.controls["design_type"].enable();
      this.editMbData.moodboard_wizard.moodboard_name =
        this.editMbData?.moodboard?.boardname;
      this.moodboardForm?.get("design_type").setValidators(Validators.required);
    } else {
      this.moodboardForm?.controls["design_type"].disable();
      if (this.editMbData?.moodboard_wizard?.no_of_rooms == 0)
        this.moodboardForm?.controls["no_of_rooms"].disable();
      if (this.editMbData?.moodboard_wizard?.no_of_units == 0)
        this.moodboardForm?.controls["no_of_units"].disable();
      if (this.editMbData?.moodboard_wizard?.no_of_beds == 0)
        this.moodboardForm?.controls["no_of_beds"].disable();
      if (this.editMbData?.moodboard_wizard?.budget == 0)
        this.moodboardForm?.controls["budget"].disable();
      if (this.editMbData?.moodboard_wizard?.moodboard_design_type_id == 4)
        this.moodboardForm?.controls["room_type"].disable();
    }
    if (this.editMbData) {
      this.moodboardForm.patchValue(this.editMbData?.moodboard_wizard);
      this.spinner.hide();
    }
  }

  // get state list
  getStateList() {
    this.spinner.show();
    this.sharedService.getStates().subscribe(
      (res) => {
        this.spinner.hide();
        this.stateList = res;
      },
      (error) => {
        this.stateList = [];
        this.spinner.hide();
      }
    );
  }

  // get state list

  // get company list
  getCompanyListByUserMD() {
    let user_id = this.auth.getProfileInfo("userId");
    this.spinner.show();
    this.sharedService
      .getCompanyList({ company_type: "moodboard", user_id: user_id })
      .subscribe(
        (res) => {
          this.spinner.hide();
          if (res) this.companyList = res;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  // get company list

  // select company
  selectCompany(item) {
    if (!this.companyOptions) {
      let index = this.companyList.find((x) => x.sgid == item.target.value);
      if (index?.sgid) {
        this.moodboardForm.patchValue({ company_name: index?.company });
      }
      this.getProjectListMD(item.target.value);
    }
  }
  // select company

  // get project list
  getProjectListMD(compid: any) {
    this.spinner.show();
    this.cMbService.getProjectListMD(compid).subscribe(
      (res) => {
        this.spinner.hide();
        if (typeof res == "string") this.projectList = [];
        else this.projectList = res;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  // get project list

  // select project
  selectProject(event) {
    let name = this.projectList.find((x) => x.sgid == event.target.value);
    this.moodboardForm.patchValue({
      project_name: name.project,
    });
  }
  // select project
  // get design list
  getDesign() {
    this.spinner.show();
    this.cMbService.getDesign().subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.statusCode == 200) {
          this.designList = res?.result;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  // get design list
  // select design
  selectDesign(event: any) {
    let id = Number(event?.target?.value);
    this.editMbData.moodboard_wizard.moodboard_design_type_id=id
    if (id) {
      this.moodboardForm.patchValue({
        design_type: id,
        no_of_rooms:0,
        no_of_units:0,
        no_of_beds:0,
        square_feet:0
      });
      this.getDesignType(id);
    }
    let form = this.moodboardForm.value;
    let f_id = this.form_key.find(x=>x.sgid==id)
    if(f_id.sgid==id){
      this.editMbData.moodboard_wizard.showUnitRoom = f_id?.showUnitRoom;
      this.editMbData.moodboard_wizard.showMoodboard = f_id?.showMoodboard;
      this.editMbData.moodboard_wizard.lable_type = f_id?.lable_type;
      for(let f_key in f_id){
        for(let key in form){
          if(f_key == key){
            this.moodboardForm?.get(key).setValidators(Validators.required);
          }
        }
      }
    }
  }
  // select design
  // get desing type
  getDesignType(data: any) {
    this.spinner.show();
    this.cMbService.getDesignType({ design_type: data }).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res?.statusCode == 200) {
          this.designRoomType = res?.result;
        }
        setTimeout(() => {
          this.getBudgetRange();
        }, 500);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  // get design type
  // select design type
  selectRoom(event: any) {
    let id = Number(event?.target?.value);
    let name = this.designRoomType.find((x) => x.sgid == id);
    
    if (id) {
      this.moodboardForm.patchValue({
        room_type: id,
        room_type_name: name?.room_type_name,
      });
    }
  }
  // select desing type
  // get budget range
  getBudgetRange() {
    this.spinner.show();
    let id = this.moodboardForm.value.design_type
      ? this.moodboardForm.value.design_type
      : this.editMbData?.moodboard_wizard?.moodboard_design_type_id;
    this.cMbService
      .getBudgetRange({ budget_type: "1", design_type_id: id })
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res?.statusCode == 200) {
            this.buget = res?.result;
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  // get budget range

  // select budget
  selectBuget(event: any) {
    if (event?.target?.value) {
      this.moodboardForm.patchValue({
        budget: event?.target?.value,
      });
    }
  }
  // select budget

  // design type
  designTypeList() {
    this.cMbService.DesignTypeList().subscribe(
      (res: any) => {
        if (res?.statusCode == 200) {
          this.designType = res?.result;
        }
      },
      (error) => {}
    );
  }
  designValue(event) {
    let id = Number(event?.target?.value);
    this.moodboardForm.patchValue({
      design_type_id: id,
    });
  }

  // design type
  // moodboard type
  MoodboardTypeList() {
    this.cMbService.MoodboardTypeList().subscribe(
      (res: any) => {
        if (res?.statusCode == 200) {
          this.moodboardType = res?.result;
        }
      },
      (error) => {}
    );
  }
  mbType(event) {
    let id = Number(event?.target?.value);
    this.moodboardForm.patchValue({
      moodboard_type_id: id,
    });
  }

  // moodbouard type
  randomString(length, chars) {
    var mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    var result = "";
    for (var i = length; i > 0; --i)
      result += mask[Math.floor(Math.random() * mask.length)];
    return result;
  }

  // update moodboard form
  updateMbForm() {
    this.moodboardForm.value.moodboard_id = this.editMbData?.moodboard?.sgid;
    this.moodboardForm.value.userid = this.auth.getProfileInfo("userId");
    this.moodboardForm.value.state = this.moodboardForm?.value?.state?.sgid
      ? this.moodboardForm?.value?.state?.sgid
      : "";
    this.moodboardForm.value.design_type =
      this.editMbData?.moodboard_wizard?.moodboard_design_type_id;
    this.moodboardForm.value.moodboard_type =
      this.moodboardForm.value.moodboard_type_id;
    this.moodboardForm.value.company_id =
      this.editMbData?.moodboard?.company_id;
    this.moodboardForm.value.project_id =
      this.editMbData?.moodboard?.project_id;
    if (!this.moodboardForm.value.delivery_date)
      delete this.moodboardForm.value.delivery_date;
    let obj;
    if (this.moodboardForm.value.budget) {
      let budget = this.buget.find(
        (x) => x.budget == this.moodboardForm.value.budget
      );
      obj = {
        // budget_type: this.editMbData?.moodboard_wizard?.budget_type,
        budget_start: budget?.budget_start,
        budget_end: budget?.budget_end,
      };
    }
    
    this.spinner.show();

    let data = { ...this.moodboardForm.value, ...obj };

    if (this.editMbData?.moodboard_wizard?.mbForm == "edit") {
      data["token"] = this.editMbData?.moodboard_wizard?.token ? this.editMbData?.moodboard_wizard?.token: this.randomString(24, "aA#");
      this.mbs.updateMoodBoard(data).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.toastr.success("Moodboard updated successfully");
          let id = this.editMbData?.moodboard_wizard?.moodboard_id
            ? this.editMbData?.moodboard_wizard?.moodboard_id
            : this.editMbData?.moodboard?.sgid;
          this.editMbOpData.emit(id);
          // this.getMoodBoardDetails(this.editMbData?.moodboard_id);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
    if (this.editMbData?.moodboard_wizard?.mbForm == "copy") {
      let uuid = this.randomString(24, "aA#");
      let obj = {
        copy: "1",
        token: uuid,
      };
      data = { ...data, ...obj };
      
      this.mbs.createMoodboard(data).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res) {
            localStorage.removeItem("mdFilter");
            localStorage.removeItem("mbSelectedProductFilters");
            localStorage.removeItem("mdSupplierFilter");
            this.toastr.success(res?.message);
            this.router.navigate([
              `/admin/moodboard/view/${res?.moodboard_id}`,
            ]);
            let id = this.editMbData?.moodboard_wizard?.moodboard_id
              ? this.editMbData?.moodboard_wizard?.moodboard_id
              : this.editMbData?.moodboard?.sgid;
            this.editMbOpData.emit(id);
            // this.getMoodBoardDetails(res?.moodboard_id)
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
    // this.productTabs('moodboard')
  }
  // update moodboard form

  toggle(type: any) {
    if (type == "company") {
      this.companyOptions = !this.companyOptions;
      this.moodboardForm.patchValue({
        company_name: "",
        company_id: "",
      });
    }
    if (type == "project") {
      this.projectOptions = !this.projectOptions;
      this.moodboardForm.patchValue({
        project_id: "",
        project_name: "",
      });
    }
  }
  navigateMbList() {
    let id = this.editMbData?.moodboard_wizard?.moodboard_id
      ? this.editMbData?.moodboard_wizard?.moodboard_id
      : this.editMbData?.moodboard?.sgid;
    this.editMbOpData.emit(id);
  }
}
