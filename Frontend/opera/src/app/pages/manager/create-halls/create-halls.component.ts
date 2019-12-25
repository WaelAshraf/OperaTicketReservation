import { Component, OnInit } from '@angular/core';
import { ErrorComponent } from 'src/app/error/error.component';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-create-halls',
  templateUrl: './create-halls.component.html',
  styleUrls: ['./create-halls.component.css']
})
export class CreateHallsComponent implements OnInit {
  serverError: boolean;
  errorCode: string;
  isLoading = false;
  form: FormGroup;

  dialogRef: MatDialogRef<ErrorComponent>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  createHall(formDirective: FormGroupDirective) {
    if (this.form.invalid || this.findInvalidControls()) {
      if (this.dialog.openDialogs.length === 0) {
        this.dialogRef =
          this.dialog.open(ErrorComponent, { data: { message: 'Resolve invalid inputs before submiting' }, panelClass: 'my-dialog' });
      }
      return;
    }
    const formJSON = this.form.getRawValue();
    this.isLoading = true;
    this.http.post<any>(BACKEND_URL + '/Halls/Create', formJSON)
      .subscribe((serverResponse: any) => {
        this.snackBar.open('Successfully Created Hall', null, {
          duration: 3000,
        });
        formDirective.resetForm();
        this.form.reset();
        this.serverError = false;
        this.errorCode = '';
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.errorCode = 'A01001125000';
        this.serverError = true;
        this.isLoading = false;
      });
  }

  findInvalidControls() {
    for (const name in this.form.controls) {
      if (this.form.controls[name].invalid) {
        return true;
      }
    }
    return false;
  }

  onKeydown(event) {
    if ((event.keyCode >= 8 && event.keyCode <= 46 && event.keyCode !== 32) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      return;
    }

    if (event.keyCode > 31 && (event.keyCode < 48 || event.keyCode > 57)) {
      this.snackBar.open('You can enter only numbers', null, {
        duration: 2500,
      });
      return !event;
    }
    this.snackBar.dismiss();
  }

  ngOnInit() {
    this.form = new FormGroup({
      Number_Cols: new FormControl(null, { validators: [Validators.required] }),
      Number_Rows: new FormControl(null, { validators: [Validators.required] }),
    });
  }
}