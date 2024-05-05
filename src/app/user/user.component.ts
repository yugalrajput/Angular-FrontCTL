import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  form = {
    id: null,
    firstName: '',
    lastName: '',
    loginId: '',
    password: '',
    dob: '',
    roleId: null,
  };
  list: any = [];
  fileToUpload: any = null;

  constructor(
    private httpService: HttpServiceService,
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) {
    var self = this;
    httpService.getPathVariable(route, function (params: any) {
      self.form.id = params['id'];
    });
  }

  ngOnInit(): void {
    this.preload();
    if (this.form.id && this.form.id > 0) {
      this.display();
    }
  }

  preload() {
    var self = this;
    this.httpService.get(
      'http://localhost:8080/User/preload',
      function (res: any) {
        self.list = res.result;
      }
    );
  }

  display() {
    var self = this;
    this.httpService.get(
      'http://localhost:8080/User/get/' + self.form.id,
      function (res: any) {
        self.form = res.result.data;
      }
    );
  }

  onFileSelect(event: any) {
    this.fileToUpload = event.target.files.item(0);
    console.log(this.fileToUpload);
  }

  myFile() {
    var self = this;
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    return this.httpClient
      .post('http://localhost:8080/User/profilePic/' + this.form.id, formData)
      .subscribe(
        (data) => {
          console.log(this.fileToUpload);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  save() {
    console.log('save dob => ', this.form.dob);
    var self = this;
    this.httpService.post(
      'http://localhost:8080/User/save',
      this.form,
      function (res: any) {
        self.form.id = res.result.data;
        self.myFile();
      }
    );
  }

  convertISODate(isoDate: string): string {
    return isoDate.split('T')[0];
  }
}
