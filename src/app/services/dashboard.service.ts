import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { LocalStorageService } from './local-storage/local-storage.service';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient,
    private ls: LocalStorageService) { }


    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      token : 'bearer' + this.ls.getFromLocal().userId
      }
      
    
      getDashboardData(): Observable<any> {
        let supplier_id = this.ls.getItem('supplier_id')
        return this.http.get<any>(`${environment.endPoint}getDashboard/new?supplier_id=${supplier_id}`);
      }
      getAllActiveSupplier():Observable<any>{
        return this.http.get<any>(`${environment.endPoint}getAllActiveSupplier`);
      }
      getTableList(id:any,orderType:any):Observable<any>{
        return this.http.get<any>(`${environment.endPoint}getSupplierLoadingInfo?supplier_id=${id}&sort_type=${orderType}`);
        // return this.http.get<any>(`${environment.endPoint}getSupplierLoadingInfo?supplier_id=${id}`);
        // api/getSupplierLoadingInfo?supplier_id=0&sort_type=desc / asc
      }
      supplierHistory(){
        return this.http.get(environment.endPoint + 'loadSupplierInventoryLog')
      }
};


