import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user';
import { response } from '../response';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: Array<User>;

  constructor(private _dataService: DataService) {
    _dataService.getUsers()
      .subscribe((res: response) => {
        this.users = res.data;
      });
  }

  ngOnInit() {
  }

}
