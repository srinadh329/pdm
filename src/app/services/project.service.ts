import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient,
    private ls: LocalStorageService) { }
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      token : 'bearer' + this.ls.getFromLocal().userId
    };
    getCompanyList(){
      return this.http.get<any>(environment.endPoint + 'getCompanyListNew');
    }
    getProjectCompanyList(){
      return this.http.get<any>(environment.endPoint + 'getCompanyListNew?type=project_builder');
    }
    createProject(obj){
      return this.http.post(environment.endPoint + 'create/project', obj);
    }
    updateProject(obj){
      return this.http.post(environment.endPoint + 'update/project', obj);
    }
    getProjectById(params){
      return this.http.get(environment.endPoint + 'get/project',{params:params})
    }
    // latest
    createGroup(obj){
      return this.http.post(environment.endPoint + 'create/group',obj);
    }
    updateGroup(obj){
      return this.http.post(environment.endPoint + 'update/group',obj);
    }
    getUnitGropById(params){
      return this.http.get(environment.endPoint + 'get/project/group',{params:params})
    }
    getDeleteGroup(obj){
      return this.http.post(environment.endPoint + 'delete/project/group',obj)
    }
    updateMoodboardCategory(params){
      return this.http.get(environment.endPoint + 'get/moodboard/category/distribution',{params:params})
    }
    updateMoodboardDistribution(obj){
      return this.http.post(environment.endPoint + 'update/moodboard/category/distribution', obj);
    }
    deleteMoodboardDistribution(obj){
      return this.http.post(environment.endPoint + 'delete/moodboard/category/distribution',obj)
    }
    deleteMoodboardItem(obj){
      return this.http.post(environment.endPoint + 'remove/moodboard/item',obj)
    }
    getProjectGroupUnits(params){
      return this.http.get(environment.endPoint + 'get/project/unit/groups',{params:params})
    }
    getProjectGroupUnitList(params){
      return this.http.get(environment.endPoint + 'get/unassigned/units',{params:params})
    }
    getUnitGroup(params){
      return this.http.get(environment.endPoint + 'get/project/unit/groups',{params:params})
    }
    getUnits(params){
      return this.http.get(environment.endPoint + 'get/project/units',{params:params})
    }
    getDesignType(){
      return this.http.get(environment.endPoint + 'design-type/list')
    }
    getDesignTypeNew(supplier_id:any){
      return this.http.get(environment.endPoint + `design-type/list/usingSupplier?supplier_ids=${supplier_id}`)
    }
    getCategories(params){
      return this.http.get(environment.endPoint + 'getCategory',{params:params})
    }
    getRoomType(){
      return this.http.get(environment.endPoint + 'room-type/list')
    }
    getSupplierList(){
      return this.http.get(environment.endPoint + 'product/suppliers')
    }
    createMoodboard(obj){
      return this.http.post(environment.endPoint + 'unit/group/create/moodboard',obj)
    }
    UpdateMoodboard(obj){
      return this.http.post(environment.endPoint + 'unit/group/update/moodboard',obj)
    }
    getGroupWiseMoodboardList(params){
      return this.http.get(environment.endPoint + 'get/unit/group/moodboard/list',{params:params})
    }
    getMoodboardWiseCategories(params){
      return this.http.get(environment.endPoint + 'get/unit/group/moodboard/categories',{params:params})
    }
    getMoodboardItems(params){
      return this.http.get(environment.endPoint + 'get/unit/group/moodboard/items',{params:params})
    }
    // latest

    getProjectUnits(params){
      return this.http.get(environment.endPoint + 'get/project/units',{params:params})
    }
   
    getUnitPackages(params){
      return this.http.get(environment.endPoint + 'get/unit/packages',{params:params})
    }

    getPackageItems(params){
      return this.http.get(environment.endPoint + 'get/unit/package/items',{params:params})
    }
    deleteMoodboard(obj){
      return this.http.post(environment.endPoint + 'unit/group/delete/moodboard',obj)
    }
    editMoodboard(params){
      return this.http.get(environment.endPoint + 'unit/group/get/moodboard',{params:params})
    }
    getProjectList(params:any){
      return this.http.get(environment.endPoint + 'get/project',{params:params})
    }
    getCategoryItemRange(params:any,type:any){
      if(type=='get'){
        return this.http.get(environment.endPoint + 'get/itemInRange',{params:params})
      }
      if(type=='post'){
        return this.http.post(environment.endPoint + 'get/itemInRange',params)
      }
    }
    getSkuData(params:any){
      return this.http.get(environment.endPoint + 'get/skudata',{params:params})
    }
    addItemsToMoodboard(obj){
      return this.http.post(environment.endPoint + 'add/moodboard/item',obj)
    }
    getPercentageDistribution(params:any){
      return this.http.get(environment.endPoint + 'get/moodboard/percentage/distribution',{params:params})
    }
    updatePercentageDistribution(obj){
      return this.http.post(environment.endPoint + 'update/moodboard/percentage/distribution',obj)
    }
    getSummaryResult(params:any){
      return this.http.get(environment.endPoint + 'get/all/moodboard/items',{params:params})
    }
    getQuote(obj){
      return this.http.post(environment.endPoint + 'createQuoteUsingProject',obj)
    }
    getProject(obj){
      return this.http.post(environment.endPoint + 'get/asset-value',obj)
    }
    getGroupDistribution(params:any){
      return this.http.get(environment.endPoint + 'get/group/distribution',{params:params})
    }
    updateGroupDistribution(obj){
      return this.http.post(environment.endPoint + 'update/group/distribution',obj)
    }
    projectValues(params:any){
      return this.http.get(environment.endPoint + 'get/project/values',{params:params})
    }
    sizeValidation(params:any){
      return this.http.get(environment.endPoint + 'get/product/size/validation',{params:params})
    }
    getRentAssetValues(obj){
      return this.http.post(environment.endPoint + 'project/rent/asset/calc',obj)
    }
    getMoodboardList(){
      return this.http.get(environment.endPoint + 'get/allsource/moodboard/list')
    }
    getExistingMoodboard(obj){
      return this.http.post(environment.endPoint + 'create/moodBoard/from/existing',obj)
    }
    getAutoPackages(params){
      return this.http.get(environment.endPoint + 'autoPackages',{params:params})
    }
    getAutoPackageItems(params){
      return this.http.get(environment.endPoint + 'autoPackage/items',{params:params})
    }
    createAutopackageMb(obj){
      return this.http.post(environment.endPoint + 'create/moodBoard/from/autopackage',obj)
    }
    getAutopackageMb(obj){
      return this.http.post(environment.endPoint + 'add/autopackage/moodboard/item',obj)
    }
    getPriceRange(params){
      return this.http.get(environment.endPoint + 'autoPackage/roombuilder/price/range',{params:params})
    }
    uploadImage(obj){

      return this.http.post(environment.endPoint + 'uploadImageToStorage',obj)
    }
    getProductFromInspiration(obj){
      return this.http.post(environment.endPoint + 'getProductFromInspiration',obj)
    }
    getProjectListNew(params){
      return this.http.get(environment.endPoint + 'getProjectListNew',{params:params})
    }
}
