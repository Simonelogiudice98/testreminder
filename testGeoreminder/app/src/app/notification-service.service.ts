import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  constructor(public http: HttpClient) { }


  webpush = require('web-push');

  vapidKeys = this.webpush.generateVAPIDKeys();



  sendNotification(){
    console.log(this.vapidKeys);

  }

}
