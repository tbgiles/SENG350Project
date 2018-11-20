import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '../_services/data.service';
import { Project } from '../project';

@Injectable()
export class ProjectResolver implements Resolve<any> {
  constructor(private _dataService: DataService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    return route.paramMap.get('projectID');
  }
}
