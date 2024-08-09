import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchShow = new Subject<any>();
  
  constructor(private route:Router) { }
  ngOnInit(){
    if(this.route.url.includes('search') || this.route.url.includes('products/list')){
       this.searchShow.next(true);
    }else{
       this.searchShow.next(false);
    }
  }
  setHeaserSearch(bool) {
    this.searchShow.next(bool);
    }



// clearMessages() {
//     this.subject.next();
// }

getsearchShow(): Observable<any> {
    return this.searchShow.asObservable();
}
}
