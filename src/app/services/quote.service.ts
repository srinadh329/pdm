import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { LocalStorageService } from './local-storage/local-storage.service';

import { Subject, Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private modalClose = new Subject<any>();
  constructor(private http: HttpClient,
    private ls: LocalStorageService
) { }
httpOptions = {
headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
token : 'bearer' + this.ls.getFromLocal().userId
};
 floorplanIdForSummary : number;

  
 getCompanyListByUserQuote(userId): Observable<any>{
  return this.http.get(environment.endPoint+'API?user_id='+userId);
 }
  getStates(): Observable<any> {
   return this.http.get<any>(environment.endPoint + 'load/states');
  }
  getFloorTypes(): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'getFloorplanType');
   }

  getCities(stateid):Observable<any>{
    return this.http.get<any>(environment.endPoint + 'load/cities?state_id='+stateid);
  }
  createCustomerInformation(cusInfo):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'create/customer/infoNew',cusInfo, this.httpOptions);
  }
  udpateCustomerInformation(cusInfo):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'update/customer/info',cusInfo, this.httpOptions);
  }
  copyQuote(userObj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'clone/quote',userObj,this.httpOptions);
  }
  addUnits(quoteId, unitvalue):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'addUnit',{quote_id:quoteId ,unit: unitvalue},this.httpOptions);
  }
  getFloorplanUnits(planId, quoteid ){
    this.floorplanIdForSummary = planId;
    return this.http.get<any>(environment.endPoint + 'getFloorPlanUnits?quote_id='+quoteid+'&floorplan_id='+planId);
  }
  getFloorplanSummary(fpid, unitId,quoteId):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'load/floorplan/unit/products',{unit_id: unitId,floorplan_id: fpid,quote_id:quoteId},this.httpOptions);
  }
  removeUnits(quoteId, unit, sgid ):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'removeUnit',{quote_id:quoteId , unit : unit, sgid:sgid},this.httpOptions);
  }
  removeUnitsInFloorPlan(quoteId, unit, floorplan_id , sgid):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'removeFloorPlanUnit',{quote_id:quoteId , unit : unit,floorplan_id:floorplan_id,sgid:sgid},this.httpOptions);
  }
  removeFPMoodbard(quoteId, moodboard_id ,floorplan_id):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'remove/floorplan/moodboard',{quote_id:quoteId , moodboard_id :moodboard_id,floorplan_id:floorplan_id},this.httpOptions);
  }
  addUnitsforFloor(quoteId,floorPlan_id, unitvalue):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'addFloorPlanUnits',{quote_id:quoteId ,unit: unitvalue, floorplan_id:floorPlan_id},this.httpOptions);
  }
  addSingleUnitforMb(obj):Observable<any>{
    // change api 
    return this.http.post<any>(environment.endPoint + 'addUnit_toFloorPlan',obj,this.httpOptions);
  }
  removeSingleUnitforMb(obj):Observable<any>{
    // change api 
    return this.http.post<any>(environment.endPoint + 'deleteUnit_Moodboard',obj,this.httpOptions);
  }
  removeFloor(quoteId, floorid):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'removeFloorPlan',{quote_id:quoteId , floorplan_id : floorid},this.httpOptions);
  }
  addFloorPlan(obj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'addFloorPlan',obj,this.httpOptions);
  }
  updateFloorplan(obj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'updateFloorplan',obj,this.httpOptions);
  }
  getFloorPlanDetails(quoteId){
    
    return this.http.post<any>(environment.endPoint + 'getFloorplanDetails',{quote_id:quoteId},this.httpOptions);
  }
  getFloorPlanDetailsByUserId(userid){
    
    return this.http.post<any>(environment.endPoint + 'getFloorplanByUser',{userid:userid},this.httpOptions);
  }
  
  
  getMoodboardsSummary(floorplan_id):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'getMoodboardsSummary',{floorplan_id:floorplan_id},this.httpOptions);
  }
  getUnitWithoutPlan(quoteId){
    return this.http.post<any>(environment.endPoint + 'getUnits',{quote_id:quoteId},this.httpOptions);
  }
  addmoodbaordtoFloorPlan(obj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'add/floorplan/moodboard',obj,this.httpOptions);
  }
  getMoodboardListOfUnit(obj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'getUnitMoodboards',obj,this.httpOptions);
  }
  addProductToFloorPlan(obj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'put/product/quote',obj,this.httpOptions);
  }
  addProductCartQuote(obj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'put/product/commonQuoteForProductAndMoodboard',obj,this.httpOptions);
  }
  saveQuotes(obj){
    return this.http.post<any>(environment.endPoint + 'save/quote/items',obj,this.httpOptions);
  }
  updateFloorplanSummary(obj){
    return this.http.post<any>(environment.endPoint + 'update/floorplan/unit/products',obj,this.httpOptions);
  }
  
  loadunitProductwithoutMb(obj):Observable<any>{
    return this.http.post<any>(environment.endPoint + 'load/floorplan/product/images',obj,this.httpOptions);
  }

  getQuotes(companyName?,projectName?):Observable<any>{
    return this.http.get<any>(environment.endPoint + 'load/customer/quotes?user_id='+this.ls.getFromLocal().userId+ '&company_name='+companyName+'&project_name='+projectName);
    
  } 

getQuotes1(companyName?,projectName?,start?,count?,segementId?,comapnyId?,projectId?):Observable<any>{
  return this.http.get<any>(environment.endPoint + 'load/customer/quotes?user_id='+this.ls.getFromLocal().userId+ '&company_name='+companyName+'&project_name='+projectName+'&start='+start+'&count='+count+'&segment_id='+segementId+'&company_id='+comapnyId+'&project_id='+projectId);
  
}

getAllQuotes(companyName, projectName):Observable<any>{
  return this.http.get<any>(`${environment.endPoint}load/customer/quotes?supplier_id=${this.ls.getItem('supplier_id')}&company_name=${companyName}&project_name=${projectName}`);
  
}

getAllQuotes1(companyName, projectName,start,count):Observable<any>{
  return this.http.get<any>(`${environment.endPoint}load/customer/quotes?supplier_id=${this.ls.getItem('supplier_id')}&company_name=${companyName}&project_name=${projectName}`+'&start='+start+'&count='+count);
  
}




getQuoteDetail(quoteid):Observable<any>{
  return this.http.get<any>(environment.endPoint + 'load/quote/info?quote_id='+quoteid);
  
} 
getQuotationDetails(quoteid){
  return this.http.get<any>(environment.endPoint + 'quote/items/new?quote_id='+quoteid);   
}

getFloorplanMoodbaord(floorplan_id, quote_id){
  return this.http.get<any>(environment.endPoint + 'load/floorplan/moodboards?quote_id='+quote_id+'&floorplan_id='+floorplan_id);
}

updateQuoteStatus(quote_id, status){
   return this.http.post<any>(environment.endPoint + 'put/quote/publish/status',{quote_id:quote_id, flag:status},this.httpOptions);
}


orderCreate(quote_id){
  return this.http.post<any>(environment.endPoint + 'create/order',{quote_id:quote_id},this.httpOptions);
}
sendEmailQuote(quote_id, email){
  return this.http.post(environment.endPoint + 'send/lease/email', {quote_id:quote_id, email},this.httpOptions);
}
getUserleaseAgreement(obj){
  return this.http.post(environment.endPoint + 'getUserleaseAgreement', obj);
}
updateLeaseAgreement(obj){
  return this.http.post(environment.endPoint + 'saveEditedLeaseAgreement', obj);
}


getUnitProducts(unitId, fpid?, quoteid?):Observable<any>{
  let obj = {unit_id:unitId};
  if (fpid) obj['floorplan_id'] = fpid;
  if (quoteid) obj['quote_id'] = quoteid;
  return this.http.post<any>(environment.endPoint + 'load/floorplan/unit/products',obj,this.httpOptions);
}

updateUnit(obj){
  return this.http.post<any>(environment.endPoint + 'update/floorplan/unit/products',obj,this.httpOptions);
}

removeProduct(obj) {
  return this.http.post<any>(environment.endPoint + 'remove/quote/items', obj);
}
addFloorPlanatunitlevel(obj):Observable<any>{
  return this.http.post<any>(environment.endPoint + 'addUnitFloorPlan',obj,this.httpOptions);
}

getUsers(term):Observable<any>{
  
  return this.http.post<any>(environment.endPoint + 'ajaxUser',{term:term},this.httpOptions);
}
getCustomerDetailsBasedonId(id):Observable<any>{
  return this.http.get<any>(environment.endPoint + 'getUserDetails?sgid='+id,this.httpOptions);
}
getb2borderDetails()
{
  return this.http.get<any>(environment.endPoint + 'load/b2bOrderConfiguration',this.httpOptions);
}

updateB2Borderconfig(obj):Observable<any>{
  return this.http.post<any>(environment.endPoint + 'update/b2bOrderConfiguration',obj,this.httpOptions);
}
getB2BconfigDetails(quoteid,flag){
  return this.http.post<any>(environment.endPoint + 'quote/B2BDiscountConfig/items',{quote_id:quoteid,flag:flag},this.httpOptions);
  

}
addProductToQuoteWithoutMoodBoard(obj:any){
  return this.http.post(environment.endPoint+'addProductToQuoteWithoutMoodBoard',JSON.stringify(obj))
}

rentUpdates(obj) {
  return this.http.post<any>(environment.endPoint + 'update/quote/product/type', obj);
}

setModalDialog(){
  this.modalClose.next()
}
getModalClose(){
  return this.modalClose.asObservable()
}
getHistryDetials(productId:any,variationId:any){
  // https://devpdmbackend.inhabitr.com/api/updateAssetPriceHistory?product_id=2&variation_id=2
  return this.http.get<any>(environment.endPoint + `updateAssetPriceHistory?product_id=${productId}&variation_id=${variationId}`)
}
postLeaseAgrement(obj):Observable<any>{
  return this.http.post<any>(environment.endPoint + 'getLeaseAgreementHistoryDetails',obj);
}
updateQutote(obj:any){
  return this.http.post(environment.endPoint + 'changeQuoteProductType', obj);
}
QuoteAllProductType(obj){
  return this.http.post<any>(environment.endPoint + 'changeQuoteAllProductType', obj);
}
getMonthPrice(params){
  return this.http.get<any>(environment.endPoint + 'load/rent/price',{params:params});
}
updateFee(obj){
  return this.http.post<any>(environment.endPoint + 'updateFee',obj)
}
createUpdateProject(obj:any){
  return this.http.post(environment.endPoint + 'create/update/project', obj);
}
getSegment(){
  return this.http.get<any>(environment.endPoint + 'get/design/type');
}
segementCompany(params){
  return this.http.get<any>(environment.endPoint + 'get/company/segment',{params:params});
}
createCompany(obj:any){
  return this.http.post(environment.endPoint + 'create/company', obj);
}
deleteOtherService(obj:any){
  return this.http.post(environment.endPoint + 'deleteOtherService', obj);
}
getQuoteOtherServices(params:any){
  return this.http.get(environment.endPoint + 'getQuoteOtherServices', {params:params});
}
updateOrCreateOtherServices(obj:any){
  return this.http.post(environment.endPoint + 'updateOrCreateOtherServices', obj);
}
publishToBusinees(obj){
  return this.http.post<any>(environment.endPoint +'publishToBusinees',obj)
}
getInstallment(params:any){
  return this.http.get(environment.endPoint + 'get/installment',{params:params})
  }
  updateQuoteInstallment(obj:any){
    return this.http.post(environment.endPoint + 'updateQuoteInstallment', obj);
  }
  
}
