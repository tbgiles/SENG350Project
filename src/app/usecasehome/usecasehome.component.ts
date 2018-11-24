import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { AuthService } from '../_services/auth.service';
import { User } from '../user';
import { UseCase } from '../usecase';
import { Router } from '@angular/router'
import { response } from '../response';

@Component({
  selector: 'app-usecasehome',
  templateUrl: './usecasehome.component.html',
  styleUrls: ['./usecasehome.component.css']
})
export class UseCaseHomeComponent implements OnInit {

  usecases: Array<UseCase>;
  selectedUseCase: UseCase;

  constructor(private _dataService: DataService, private router: Router) {
    this.selectedUseCase = null;
    this.getUseCases();
  }

  ngOnInit() {
  }

  getUseCases(): void {
    this._dataService.getUseCases()
      .subscribe((res: response) => {
        this.usecases = res.data;
      });
  }

  onSelect(usecase: UseCase) {
    this.selectedUseCase = usecase;
  }

  // Undecided on how this should work.
  /*
  openUseCase(){
    this.router.navigateByUrl(`/usecase/${this.selectedProject._id}`);
  }
  */
}
