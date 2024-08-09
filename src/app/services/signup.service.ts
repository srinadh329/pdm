import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }
  getRoleTypes():Observable<any>{
    return this.http.get<any>(environment.endPoint + 'getUserRole_Type');
    
  }
  getRoles(id):Observable<any>{
    return this.http.get<any>(environment.endPoint + 'getUserRoles?role_type='+id);
    
  }

  getEntityName(id):Observable<any>{
    return this.http.get<any>(environment.endPoint + 'getEntity');
    
  }
}
