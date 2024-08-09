import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { LocalStorageService } from './local-storage/local-storage.service';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  supplierPartner:any;
  categories: any;
  suppliers: any;
  warehouse: any;
  productcategories: any;
  location: any;
  private ImageLens = new Subject<any>();
  constructor(private http: HttpClient,
              private ls: LocalStorageService
    ) { }
     httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      token : 'bearer' + this.ls.getFromLocal().userId
    };

  getItems(page, obj, publishVal,count): Observable<any> {
    let qparam = obj;
    if (publishVal !== undefined && publishVal !== '') {
      if (publishVal === 'true') {
        qparam = '&isProcured=' + 1;
      } else {
        qparam = '&isProcured=' + 0;
      }
    }
    if (qparam) {
      qparam =  qparam.replace(/%2C/g, ',');
    }

    if (localStorage.getItem('noInventoryFilter')) {
      qparam += `&config_mode=${localStorage.getItem('noInventoryFilter')}&switch_on=1`;
    }
    return this.http.get<any>(environment.endPoint + 'product/filterNew?start=' + page + '&count=' +count + qparam, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${this.ls.getItem('access_token')}` })
    });
  }
  getLatestFilter(page, obj, publishVal): Observable<any> {
    let qparam = obj;
    if (publishVal !== undefined && publishVal !== '') {
      if (publishVal === 'true') {
        qparam = '&isProcured=' + 1;
      } else {
        qparam = '&isProcured=' + 0;
      }
    }
    if (qparam) {
      qparam =  qparam.replace(/%2C/g, ',');
    }

    if (localStorage.getItem('noInventoryFilter')) {
      qparam += `&config_mode=${localStorage.getItem('noInventoryFilter')}&switch_on=1`;
    }
    return this.http.get<any>(environment.endPoint + 'filter/product?start=' + page + '&count=18' + qparam, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${this.ls.getItem('access_token')}` })
    });
  }
  getItems1(page, count, obj, publishVal, sort = false): Observable<any> {
    let qparam = obj;
    if (publishVal !== undefined && publishVal !== '') {
      if (publishVal === 'true') {
        qparam = '&isProcured=' + 1;
      } else {
        qparam = '&isProcured=' + 0;
      }
    }

    if (qparam) {
      qparam =  qparam.replace(/%2C/g, ',');
    }
    if (sort) {
      qparam += '';
    }

    if (localStorage.getItem('noInventoryFilter')) {
      qparam += `&config_mode=${localStorage.getItem('noInventoryFilter')}&switch_on=1`;
    }

    
    return this.http.get<any>(environment.endPoint + 'filter/product?start=' + page + '&count=' + count + qparam, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${this.ls.getItem('access_token')}` })
    });
  }
  getPackages(page, obj, publishVal): Observable<any> {
   /*  let r  =  new URL("http://abcd.com?"+obj)
    r.searchParams.set('start',page)
     obj = r.search.replace("?","")
 */
if (obj) {
  obj =  obj.replace('start=0&count=12', '&');
}
// obj.slice(-1)
if (obj.slice(-1) === '&') {
  obj = obj.slice(0, -1);
}

obj =  obj.replace('&&', '&');
let qparam = obj;
if (publishVal !== undefined && publishVal !== '') {
      if (publishVal === 'true') {
        qparam = '&isProcured=' + 1;
      } else {
        qparam = '&isProcured=' + 0;
      }
    }
   // qparam.start = page
return this.http.get<any>(environment.endPoint + 'getPackage?start=' + page + '&count=12' + qparam, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${this.ls.getItem('access_token')}` })
    });
  }
  searchItems(search_type, page, searchString): Observable<any> {
    // tslint:disable-next-line: max-line-length
     return this.http.get<any>(environment.endPoint + 'product/filterNew?keywords=' + searchString + '&search_type=' + search_type+ '&start=' + page + '&count=18');
  }
  getBoardItems() {
    return this.http.get<any>(environment.endPoint + 'scrape/products/get?start=0&count=60');
  }
  scrape(url): Observable<any> {
    return this.http.get<any>(environment.bookmarkletEndPoint + 'scrape?url=' + url);
  }
  getItem(obj): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'productNew', obj);
  }
  getInventoryqty(id, sku) {
    return this.http.post<any>(environment.endPoint + 'productInventoryCount', { product_id: id, sku_variation: sku });

  }
  getAttributesList(category_id) {
    return this.http.get<any>(environment.endPoint + 'getAttribute?category='+ category_id);

  }
  getquoteInventoryqty(id, sku) {
    return this.http.post<any>(environment.endPoint + 'productQuoteCount', { product_id: id, sku_variation: sku  });

  }

  getPackageItem(id): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'package?package_id=' + id);
  }
  // getCounts(): Observable<any> {
  //   return this.http.get<any>(environment.endPoint + 'dashboard');
  // }
  procure(prod): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'product/add/', prod);
  }
  addOrUpdateAttribute(sku, ids): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'saveAttribute', {"sku_variation_id": sku, "attributes": ids});
  }
  addImage(prod): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'product/image/add/', prod);
  }
  // getCategories(): Observable<any> {
  //   if (this.categories) {
  //     return of(this.categories);
  //   } else if (this.ls.getItem('supplier_id') !== 0) {
  //     return this.http.get<any>(environment.endPoint + 'getCategory?supplier_id=' + this.ls.getItem('supplier_id')).pipe(
  //       tap(data => this.categories = data)
  //     );
  //   } else {
  //     return this.http.get<any>(environment.endPoint + 'getCategory').pipe(
  //       tap(data => this.categories = data)
  //     );
  //   }
  // }
  getCategories(params){
    return this.http.get<any>(environment.endPoint + 'getCategory',{params:params})
  }
  getCity(){
    return this.http.get<any>(environment.endPoint + 'warehouse/location')
  }
  getCategoriesFilter(sp, supp): Observable<any> {
   
   return this.http.get<any>(environment.endPoint + 'getCategory?s_id=' + supp + '&c_id=null&w_id=' + sp);

  }
  getCategoriesFilter1(sp, supp,location): Observable<any> {
    
    return this.http.get<any>(environment.endPoint + 'getCategory?s_id=' + supp + '&c_id=null&w_id=' + sp +'&location='+location);
 
   }
  getwarehouseCategoriesFilter(wr, cat): Observable<any> {
       return this.http.get<any>(environment.endPoint + 'product/suppliers?s_id=null&c_id=' + cat + '&w_id=' + wr);

   }

  getPackageCategories(): Observable<any> {
      return this.http.get<any>(environment.endPoint + 'getPackageCategory');
  }

  // getSuppliers(): Observable<any> {
  //   if (this.suppliers) {
  //     return of(this.suppliers);
  //   } else {
  //     return this.http.get<any>(environment.endPoint + 'product/suppliers').pipe(
  //       tap(data => this.suppliers = data)
  //     );
  //   }
  // }
  getSuppliers(paramas){
    return this.http.get<any>(environment.endPoint + 'product/suppliers',{params:paramas})
  }
  getSuppliersFilter(sp, supp): Observable<any> {

      return this.http.get<any>(environment.endPoint + 'product/suppliers?s_id=' + supp + '&w_id=' + sp + '&c_id=null');

  }
  getWarehouse(): Observable<any> {
    if (this.warehouse) {
      return of(this.warehouse);
    } else {
      return this.http.get<any>(environment.endPoint + 'warehouse').pipe(
        tap(data => this.warehouse = data)
      );
    }
  }

  getWarehouseFilter(sp): Observable<any> {

      return this.http.get<any>(environment.endPoint + 'warehouse?s_id=' + sp + '&w_id=null&c_id=null');

  }
  getSupplierWarehouseFilter(sp, wi, cid): Observable<any> {

    return this.http.get<any>(environment.endPoint + 'supplierPartnerWarehouse?s_id=' + sp + '&w_id=' + wi + '&c_id=' + cid);

}
  getWarehouseCategoryFilter(sp, cat): Observable<any> {

    return this.http.get<any>(environment.endPoint + 'warehouse?s_id=' + sp + '&w_id=null&c_id=' + cat);

}

getCategoryWarehouse(ct) {
  return this.http.get<any>(environment.endPoint + 'warehouse?s_id=null&w_id=null&c_id=' + ct);
}

getCategorySupplier(ct) {
  return this.http.get<any>(environment.endPoint + 'product/suppliers?s_id=null&w_id=null&c_id=' + ct);
}

  getCategoriesFilterSupp(sp, wh,location): Observable<any> {

    return this.http.get<any>(environment.endPoint + 'getCategory?s_id=' + sp + '&c_id=null&w_id=' + wh+'&location='+location);

}

  getLocation(): Observable<any> {
    const supplier_id = this.ls.getItem('supplier_id');

    if (this.location) {
      return of(this.location);
    } else {
      return this.http.get<any>(environment.endPoint + 'warehouse/location').pipe(
        tap(data => this.location = data)
      );
    }
    // return this.http.get<any>(`${environment.endPoint}getDashboard?supplier_id=${supplier_id}`);
  }
  unpublish(id): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'product/unPublish?productId=' + id);
  }
  publish(id): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'product/publish?productId=' + id);
  }
  publishAdd(id): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'product/add?productId=' + id);
  }

  editDesc(desc ,  productid): Observable<any> {
    const params = {
      product_id: productid,
      product_description: desc
    };
    return this.http.post<any>(environment.endPoint + 'updateProductDescription', params , this.httpOptions);
  }
  editFeat(feat ,  productid): Observable<any> {
    const params = {
      product_id: productid,
      product_feature: feat
    };
    return this.http.post<any>(environment.endPoint + 'updateProductFeature', params , this.httpOptions);
  }
  editDimension(dimension , sku,  productid): Observable<any> {
    const params = {
      product_id: productid,
      sku: sku,
      product_dimension: dimension
    };
    return this.http.post<any>(environment.endPoint + 'updateProductDimension', params , this.httpOptions);
  }
  updateProductName(obj): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'updateProductName', obj);
  }
  updatePrice(price, sku, prodId): Observable<any> {
    const params = {
      product_id : prodId,
      sku,
      asset_value: price
    };
    return this.http.post<any>(environment.endPoint + 'updateInhabitrPrice', params , this.httpOptions);
  }
  updateAssetPrice(obj): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'updateAssetPrice',obj);
  }

  registerInOps(sgid: any, sku) {
    return this.http.post<any>(`${environment.endPoint}publishProduct`, {product_id: sgid, sku_variation: sku});
  }

  published(prod_id , status): Observable<any> {
    let url;
    let params;
    if (status === 1) {
      params = {
        product_id: prod_id,
        publishSaffron: status
      };
      url = 'publishSaffronEnv';
    } else {
        params = {
        product_id: prod_id,
        unpublishSaffron: status
      };
        url = 'unpublishSaffronEnv';
    }
    return this.http.post<any>(environment.endPoint + url , params , this.httpOptions);
  }

  buyUsedPublished(prodId, sku, status) {
    const params = {
      product_id: prodId,
      sku_variation: sku,
      publishUsedFurniture: status
    };
    return this.http.post<any>(environment.endPoint + 'publishUsedFurniture' , params , this.httpOptions);
  }


  publishedpackage(prod_id , status): Observable<any> {
    let url;
    let params;
    if (status === 1) {
      params = {
        package_id: prod_id,
        publishSaffron: status
      };
      url = 'PublishPackageSaffronEnv';
    } else {
        params = {
        package_id: prod_id,
        unpublishSaffron: status
      };
        url = 'PublishPackageSaffronEnv';
    }
    return this.http.post<any>(environment.endPoint + url , params , this.httpOptions);
  }

  updateBuyPrice(price, prodId): Observable<any> {
    const params = {
      product_id : prodId,
      buyPrice: price
    };
    return this.http.post<any>(environment.endPoint + 'updateBuyPrice', params , this.httpOptions);
  }

  getProductCategoryList(): Observable<any> {
    if (this.productcategories) {
      return of(this.productcategories);
    } else {
      return this.http.get<any>(environment.endPoint + 'getCategory').pipe(
        tap(data => this.productcategories = data)
      );
    }
  }

  updateProductCategoryName(prod_id ,  sgid): Observable<any> {
    const params = {
      product_id: prod_id,
      category_id: sgid
    };
    return this.http.post<any>(environment.endPoint + 'updateCategoryName', params , this.httpOptions);
  }

  getSupplierPartner(): Observable<any> {
      return this.http.get<any>(environment.endPoint + 'supplierPartnerWarehouse').pipe(
        tap(data => this.supplierPartner = data)
      );
  }

  getUpdatedCategories(s_ids, c_ids, w_ids): Observable<any> {
      return this.http.get<any>(environment.endPoint + 'getCategory?s_id=' + s_ids + '&c_id=' + c_ids + '&w_id=' + w_ids).pipe(
        tap(data => this.categories = data)
      );
  }
  AddVariationProduct(obj): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'add/moodboard/itemBySKU', obj, this.httpOptions);
  }
  getAttributes(cat): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'getAttribute?category=' + cat);

}
setRoomBuilder(obj){
  return this.http.post(environment.endPoint + 'setRoomBuilderOrOptionalFromDetailPage', obj)
}
updateMoodboardPublic(moodboard_id,status): Observable<any>{
  const params = {
    moodboard_id: Number(moodboard_id),
    public:status
  };
  return this.http.post<any>(environment.endPoint + 'setMoodboardPublic', params,this.httpOptions);
}
productsCountInSuppliers(params){
  return this.http.get(environment.endPoint + 'productsCountInSuppliersLocation', {params:params})
}
productsCountInCategorysWarehouse(warehouse: any, somthing:any): Observable<any> {
  return this.http.get<any>(environment.endPoint + `productsCountInSuppliersLocation?warehouse=${warehouse}&location=0&suplier_warehouse=${somthing}`);
}
productsCountInCategorys(warehouse: any): Observable<any> {
  return this.http.get<any>(environment.endPoint + `productsCountInSuppliersLocation?warehouse=${warehouse}&location=1`);
}
AssetPriceFilterRange(){
  return this.http.get<any>(environment.endPoint + `getAssetPriceFilterRange`);
}
budgetRange(params:any){
  return this.http.get(environment.endPoint + 'get/filter/budgetRange',{params:params})
}
getGoogleLensPrice(obj){
  const data = {image: obj.image,
    product_id: obj.product_id,
    variation_id: obj.variation_id};
  return this.http.post(environment.endPoint + 'getGoogleLensPrice', obj)
}
// https://devpdmbackend.inhabitr.com/api/getGoogleLensUpdatedPrice?product_id=10267&variation_id=8092?

getLensPriceDetails(product_id:any,variation_id:any){
 return this.http.get(environment.endPoint + `getGoogleLensUpdatedPrice?product_id=${product_id}&variation_id=${variation_id}`)
}
updateMb(obj:any){
  return this.http.post(environment.endPoint + 'update/moodboard/product/btntype', obj);
}
gigaData(params:any){
  return this.http.get(environment.endPoint + 'getSupplierDetails',{params:params})
}
getProductInspOnMB(obj:any){
  return this.http.post(environment.endPoint + 'getProductFromInspirationOnMB', obj);
}
getInExConfig(params:any){
  return this.http.get(environment.endPoint + 'get/internal-external-config',{params:params})
}
updateInExConfig(obj:any){
  return this.http.post(environment.endPoint + 'update/internal-external-config', obj);
}
getSearchCategory(params:any){
  return this.http.get(environment.endPoint + 'getCategory',{params:params})
}
getSearchSupplier(params:any){
  return this.http.get(environment.endPoint + 'product/suppliers',{params:params})
}
getPpt(params:any){
  return this.http.get(environment.endPoint + 'moodboard/ppt/create',{params:params,responseType:'blob'})
}
getQutotePpt(params:any){
  return this.http.get(environment.endPoint + 'quote/ppt/create',{params:params,responseType:'blob'})
}
altRequestDetails(params:any){
  return this.http.get(environment.endPoint + 'alternateRequestDetails',{params:params})
}
getInspirationItems(params:any){
  return this.http.get(environment.endPoint + 'get/inspiration/list',{params:params})
}
inspirationDetails(params:any){
  return this.http.get(environment.endPoint + 'get/inspiration/detail',{params:params})
}
getCategoryRequiredAttribute(params){
  return this.http.get(environment.endPoint + 'getCategoryRequiredAttribute',{params:params})
}
getAttributeVariation(params){
  return this.http.get(environment.endPoint + 'getVariationAllAttributeListing',{params:params})
}
deleteAttribute(obj){
  return this.http.post(environment.endPoint + 'deleteAttributeFromDetailPage',obj)
}
deleteMultiAttr(obj){
  return this.http.post(environment.endPoint + 'deleteAttributesFromDetailPage',obj)
}
SaveAttribute(obj){
  return this.http.post(environment.endPoint + 'saveColorSizeMaterialAttribute',obj)
}
setDefalutImg(obj){
  return this.http.post(environment.endPoint + 'updateImageDefault',obj)
}
getProductAttributes(obj){
  return this.http.post(environment.endPoint + 'newProduct/getProductAttributes',obj)
}
getSuppliersSelected(id){
  const url = `${environment.endPoint}newSupplier/getSuppliersSelected${id ? '/' + id : ''}`;
  return this.http.get(url);
}
getWarehousesForSupplier(id){
  return this.http.get(environment.endPoint + `newSupplier/getWarehousesForSupplier${'/'+id}`);
}
createUpdateSupplier(obj){
  return this.http.post(environment.endPoint + 'newSupplier/createOrUpdateSupplier',obj)
}
saveProduct(obj){
  return this.http.post(environment.endPoint + 'newProduct/saveProduct',obj)
}
uploadProductImg(obj){
  return this.http.post(environment.endPoint + 'newProduct/saveProductImage',obj,{
    reportProgress: true,
    observe: 'events',
  })
}
getLeadTimes(){
  return this.http.get(environment.endPoint + 'newProduct/getAvailableLeadTimes');
}
bulkUpload(obj){
  return this.http.post(environment.endPoint + 'bulkUpload/uploadNewXls',obj,{
    reportProgress: true,
    observe: 'events',
  })
}
}
