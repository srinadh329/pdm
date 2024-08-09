import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../../../services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../../../services/items.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../../services/search.service';


declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent{

  search:any={
    key:'',
    type:''
  }
  constructor(private auth: AuthenticateService,
              private spinner: NgxSpinnerService,
              private shop: ItemsService,
              private route: Router,
              private actRoute: ActivatedRoute,
              private modalService: NgbModal,
              private searchSer: SearchService
              ) {
                this.actRoute.queryParams.subscribe(params => {
                 
                  if (params.keywords) {
                    this.search={
                      key:params.keywords,
                      type:params.search
                    }
                  }
              });
              }


}

