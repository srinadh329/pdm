import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.css']
})
export class AdvanceSearchComponent implements  AfterViewInit, OnDestroy {

  selectedItem : string = '';
  @Input() displayKey : string ;
  @Input() list = [];
  @Output() OnKeyUp = new EventEmitter();
  @Output() OnItemChange = new EventEmitter();
  @Input() placeholder : string = "";

  @ViewChild('searchInput',{static: true}) inputElement : ElementRef;
  inputSubscription : Subscription;
  constructor() {
   }

  ngAfterViewInit(){
   
    this.selectedItem = this.placeholder;
    this.inputSubscription = fromEvent(this.inputElement.nativeElement,'keyup').pipe(
      map((evt:any)=> evt.target.value),
      filter(res=>res),
      debounceTime(500),
      distinctUntilChanged()
      ).subscribe(text=>{
        this.OnKeyUp.emit(text);
      })
  }
  

  onItemChange(item?){
    this.selectedItem =  item ? item[this.displayKey]:'';
    if(item === this.placeholder){
      this.selectedItem =  this.placeholder;
    }
    this.OnItemChange.emit(this.selectedItem);
  }

  ngOnDestroy(){
    this.inputSubscription.unsubscribe();
  }


}
