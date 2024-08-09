import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { LocalStorageService } from './local-storage/local-storage.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient,
    private ls: LocalStorageService) { }
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      token : 'bearer' + this.ls.getFromLocal().userId
    };
    getClientList(params:any){
      return this.http.get(environment.endPoint + 'get/company/lists',{params:params})
    }
    createClient(obj:any){
      return this.http.post(environment.endPoint + 'create/client',obj)
    }
    createCompany(obj:any){
      return this.http.post(environment.endPoint + 'create/company',obj)
    }
    getCompanyList(params:any){
      return this.http.get<any>(environment.endPoint + 'getClientCompanyList',{params:params});
    }
    getClients(params:any){
      return this.http.get<any>(environment.endPoint + 'get/company/clients',{params:params});
    }
    getIndividualClient(params:any){
      return this.http.get<any>(environment.endPoint + 'get/company/client',{params:params});
    }
    saveClient(obj:any){
      return this.http.post(environment.endPoint + 'update/company',obj)
    }
    deleteContact(params:any){
      return this.http.get<any>(environment.endPoint + 'deleteCompanyClientInfo',{params:params});
    }
}
