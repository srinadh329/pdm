import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }


  getNoInventoryString(selection) {
    const noInventory = {
      inhabitr: 'Switched Off <span class="blue">Inhabitr</span> Products with No Inventory',
      supplier: 'Switched Off <span class="blue">Supplier</span> Products with No Inventory',
      all: 'Switched Off <span class="blue">Either Inhabitr or Supplier</span> Products with No Inventory',
      both: 'Switched Off <span class="blue">Both Inhabitr and Supplier</span> Products with No Inventory'
    };
    return noInventory[selection];
  }

  getCompanyList(params): Observable<any> {
    return this.http.get(environment.endPoint + "getCompanyListNew" ,{params:params}).pipe(map((list: any) => {
      if (list.result === 'No Data Found') {
        return []
      } else {
        return list.result.filter(data => data.company).map(x => { return { company: x.company, sgid: x.sgid } });
      }
    }))
  }
  // getProjectList(param = ""): Observable<any> {
  //   return this.http.get(environment.endPoint + 'getProjectNameByCompany' + param).pipe(map((list: any) => {
  //     if (list.result === 'No Data Found') {
  //       return []
  //     } else {
  //       return list.result.filter(x => x.project_name);
  //     }
  //   }))
  // }
  getProjectList(params:any){
    return this.http.get(environment.endPoint + 'getProjectNameByUser',{params:params})
  }
  getStates(): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'load/states').pipe(map(x => x.states));
  }

  getCities(stateid): Observable<any> {
    return this.http.get<any>(environment.endPoint + 'load/cities?state_id=' + stateid).pipe(map(x => x.cities));
  }

  validateZipCode(data): Observable<any> {
    return this.http.post(environment.endPoint + 'validateCityAndZipcode', data).pipe(map((x: any) => x.status))
  }
}
