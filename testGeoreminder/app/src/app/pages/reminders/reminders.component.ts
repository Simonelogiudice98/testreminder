import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {

  reminders:{ id: number; latlng: L.LatLngExpression; reminder: string }[] = [];
  reminderPopup!:string;
  savedId!:number;
  savedLatlng!:L.LatLngExpression;
  savedReminder!:string;

  constructor() { }

  ngOnInit(): void {
    this.reminders = JSON.parse(localStorage.getItem('markers') || '[]');



  }

  deleteReminder(id:number){


    let reminders:{ id: number; latlng: L.LatLngExpression; reminder: string }[] = JSON.parse(localStorage.getItem('markers')|| '[]');


    const filtered:{ id: number; latlng: L.LatLngExpression; reminder: string }[] = reminders.filter(reminders => reminders.id !== id);


    localStorage.setItem('markers', JSON.stringify(filtered))
  }

 editReminder(){
    let reminders:{ id: number; latlng: L.LatLngExpression; reminder: string }[] = JSON.parse(localStorage.getItem('markers')|| '[]');

    const index:number = reminders.findIndex(reminders => reminders.id == this.savedId);
    let editReminder:{id:number,latlng: L.LatLngExpression,reminder: string } = {
      id: this.savedId,
      latlng: this.savedLatlng,
      reminder:this.savedReminder
    }
    reminders.splice(index, 1,editReminder);

    this.reminders = reminders

    localStorage.setItem('markers', JSON.stringify(reminders))
 }

 saveMarkerToEdit(id:number,latlng: L.LatLngExpression,reminder: string ){


  this.savedId = id;
  this.savedLatlng = latlng;
  this.savedReminder = reminder;
 }

}
