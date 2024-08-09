import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { AuthenticateService } from './authenticate.service';
import { LocalStorageService } from './local-storage/local-storage.service';


const httpOptions = {
 headers: new HttpHeaders({'Content-Type': 'application/json'}),
  Authorization: 'Bearer 1',
};
@Injectable({
  providedIn: 'root'
})
export class CreateMoodboardService {
  constructor(
    private http: HttpClient,
    private auth: AuthenticateService,
    private ls: LocalStorageService
    ) { }

  getCompanyListByUserMD(user_id){
    return this.http.get<any>(environment.endPoint + 'getcompanyByUserMoodboard?user_id='+ user_id).pipe(map((list:any)=> list.result.map(x=>x.company)));

  }
  createMoodboard(moodboardDetails): Observable <any> {
    return this.http.post<any>(environment.endPoint + 'createMoodBoardNew', moodboardDetails);
  }

  MoodboardTypeList(): Observable<any> {
      return this.http.get<any>(environment.endPoint + 'getMoodBoardType');
  }
  DesignTypeList(): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'design-type/list');
}
  getMoodBoardDetails(moodboardId): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'load/moodboard/items', {moodboard_id: moodboardId});
  }
  addProdsToCart(moodboardId, prodIds, userId): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post<any>(environment.endPoint + 'add/moodboard/items', {mood_board_id: moodboardId, product_ids : prodIds , user_id: userId});
  }
  addProdsToCart1(obj): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post<any>(environment.endPoint + 'add/moodboard/items', obj);
  }
  getProjectListMD(id: any){
    return this.http.get<any>(environment.endPoint + 'getProjectListNew?company_id='+ id).pipe(map((list:any)=> list.result));
  }
 

  getMoodboards(companyName,projectName,start,count,userId): Observable<any> {
    
    this.ls.getItem('supplier_id');
   
    return this.http.get<any>(environment.endPoint + 'getMoodBoardNew?supplier_id=' + this.ls.getItem('supplier_id')+"&company_name="+companyName+'&project_name='+projectName+'&start='+start+'&count='+count + '&user_id='+userId);
  }
  getMyMoodboards(companyName?,projectName?,start?,count?,quote?): Observable<any> {
    
    return this.http.post<any>(environment.endPoint  + 'getMoodBoardByUser', { userid :  this.ls.getFromLocal().userId, company_name : companyName,project_name :projectName,start:start,count:count,quote_id:quote} );
  }
  getMonthPrice(productId, month): Observable<any> {
   
    return this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + productId + '&month=' + month);
  }
  saveQuote(obj) {
    return this.http.post<any>(environment.endPoint + 'update/moodboard/items', obj);
  }
  moodboardSingleItem(obj){
    return this.http.post<any>(environment.endPoint + 'update/moodboard/singleitem', obj);
  }
  removeProduct(obj) {
    return this.http.post<any>(environment.endPoint + 'remove/moodboard/items', obj);
  }
  updateMoodBoard(obj) {
    return this.http.post<any>(environment.endPoint + 'updateMoodBoard', obj);
  }
  getImageUrl(url) {
    return this.http.get<any>(environment.endPoint + 'image/convert/base64?img_url=' + url);
  }
  DeleteModdboard(moodboard_id, user_id): Observable<any> {
   
    return this.http.get<any>(environment.endPoint + 'disable/moodboard?moodboard_id=' + moodboard_id + '&user_id=' + user_id);
  }
  ActivateModdboard(moodboard_id, user_id): Observable<any> {
   
    return this.http.get<any>(environment.endPoint + 'activate/moodboard?moodboard_id=' + moodboard_id + '&user_id=' + user_id);
  }
  getDeletedModdboard(user_id,componyName,projectName,start,count): Observable<any> {
    
    return this.http.get<any>(environment.endPoint + 'disable_moodboards?userid=' + user_id+"&company_name="+componyName+'&project_name='+projectName+'&start='+start+'&count='+count);
  }
  moodBoardList(obj) {
    return this.http.post<any>(environment.endPoint + 'update/moodboard/product/type', obj);
  }
  shareMoodboard(obj){
    return this.http.post(
      environment.endPoint + 'shareMoodBoardLink', obj);
  }
  updateMoodboardByPublic(params){
    return this.http.post<any>(environment.endPoint + 'updateMoodboardByPublic', params);
  }
  updateMoodboardByPublicHistory(params,page){
    return this.http.post<any>(environment.endPoint + 'load/moodboard/history', {moodboard_id:params,start:page,count:12});
  }
  getDesign(){
    return this.http.get<any>(environment.endPoint + 'get/moodboard/design/type');
  }
  getDesignType(params){
    return this.http.get<any>(environment.endPoint + 'get/moodboard/room/type',{params:params});
  }
  getBudgetRange(params){
    return this.http.get<any>(environment.endPoint + 'get/moodboard/budgetRange',{params:params});
  }
  createWizard(params){
    return this.http.post<any>(environment.endPoint + 'save/moodboard/wizard', params);
  }
  getCompanyFromClient(params){
    return this.http.get<any>(environment.endPoint + 'getCompanyFromClient',{params:params});
  }
  getCompanySegment(params){
    return this.http.get(environment.endPoint + 'get/company/clients',{params:params});
  }
  mbFilterSegement(params){
    return this.http.get(environment.endPoint + 'get/moodboard/filter/type',{params:params});
  }
  mbFilterType(params){
    return this.http.get(environment.endPoint + 'get/moodboard/list',{params:params});
  }
  getProjectListNew(params){
    return this.http.get(environment.endPoint + 'getProjectListNew',{params:params});
  }
  getInspiration(params){
    return this.http.get(environment.endPoint + 'get/inspiration/library',{params:params});
  }
  getPackageFromInspiration(obj:any){
    return this.http.post(environment.endPoint + 'getPackageFromInspiration',obj)
  }
  inspirationStatus(params){
    return this.http.get(environment.endPoint + 'get/inspiration/status',{params:params})
  }
  getUserInspiration(obj:any){
    return this.http.post(environment.endPoint + 'upload/inspiration/image',obj)
  }
  getInspirationAutoPackage(params){
    return this.http.get(environment.endPoint + 'inspiration/autoPackage/items',{params:params})
  }
  addInspPackage(obj:any){
    return this.http.post(environment.endPoint + 'addInspirationPackageInMoodBoard',obj)
  }
  swapCategroyOpt(params){
    return this.http.get(environment.endPoint + 'raoptions',{params:params})
  }
  inspPackages(params){
    return this.http.get(environment.endPoint + 'get/inspiration/packages',{params:params})
  }
  getSwapProducts(obj:any){
    return this.http.post(environment.endPoint + 'swap/autoPackage/item',obj)
  }
  swapInspirationItem(obj:any){
    return this.http.post(environment.endPoint + 'swap/inspiration/item',obj)
  }
  getInspCategory(params){
    return this.http.get(environment.endPoint + 'get/inspiration/category/tags',{params:params})
  }
  getInspItemsTag(params){
    return this.http.get(environment.endPoint + 'get/inspiration/items/bytag',{params:params})
  }
  categroyOptions(params){
    return this.http.get(environment.endPoint + 'raoptions',{params:params})
  }
  getProducts(obj:any){
    return this.http.post(environment.endPoint + 'productNew',obj)
  }
  getImgView(params){
    return this.http.get(environment.endPoint + 'get/replace/status',{params:params})
  }
  relpaceImg(obj){
    return this.http.post(environment.endPoint + 'replace/image',obj)
  }
  packageQtyUpdate(obj){
    return this.http.post(environment.endPoint + 'update/autoPackage/quantity',obj)
  }
  setMoodboardPublic(obj){
    return this.http.post(environment.endPoint + 'setMoodboardPublic',obj)
  }
}
