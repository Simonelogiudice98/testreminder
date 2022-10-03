import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.bouncemarker';
import Swal from 'sweetalert2';

// declare const L:any;
type M = { id: number; latlng: L.LatLngExpression; reminder: string ; read:boolean }
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  map!: L.Map;
  latLng!: L.LatLngExpression;
  reminder: string = '';
  id:number = 0;
  markers:M[] = [];
  homeMarker!: L.Marker<any>;
  yourLat!: number;
  yourLng!: number;
  radiusInKm: number = 1;
  angleInDegrees: number = 90;
  isWatching:boolean = false;
  positionUpdatable:boolean = true;




  constructor() {}

  // caricamento della mappa

  ngOnInit() {
    if (!navigator.geolocation) {
      console.log('location is not supported');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      this.latLng = [coords.latitude, coords.longitude];


      this.map = L.map('map').setView(this.latLng, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(this.map);
      this.homeMarker = L.marker(this.latLng,{icon:this.homeIcon}).addTo(this.map);
      this.homeMarker
        .bindPopup('You are here', { closeButton: true })
        .openPopup();

      L.circle(this.latLng, {
        color: 'orange',
        radius: 500,
        fillColor: 'orange',
        opacity: 0.5,
      }).addTo(this.map);


      this.getSavedMarkers();

      this.initSavedMarkers();

      this.watchPosition();

      console.log(this.latLng);

    });
  }

  // creazione icona personalizzata

   homeIcon:L.Icon = L.icon({
    iconUrl: '../../assets/img/home.png',

    iconSize:     [48, 65],
    iconAnchor:   [25, 60],
    popupAnchor:  [-3, -76]
});



  // recupero/inizzializazione marker salvati

  getSavedMarkers() {
    let savedMarkers:{ id: number; latlng: L.LatLngExpression; reminder: string; read:boolean }[] = JSON.parse(localStorage.getItem('markers') || '[]');

    this.markers = savedMarkers;
  }

  initSavedMarkers() {
    for (let marker of this.markers) {


      L.marker(marker.latlng, {
        draggable: true,
        bounceOnAdd: true,
        title: 'custom',
      })
        .bindPopup(marker.reminder)
        .addTo(this.map);
    }
  }

  // controllo della posizione

  watchPosition() {


    let desLat: number = 0;
    let desLng: number = 0;
    let id = navigator.geolocation.watchPosition(
      (position) => {
        if(!this.isWatching){

          this.isWatching = true;

        this.yourLng = position.coords.longitude;
        this.yourLat = position.coords.latitude;

        if(this.positionUpdatable == true ){
          this.positionChange([this.yourLat,this.yourLng])
        }

        let arrive: boolean = this.getDistance();
        // if (arrive == true) {
        //   this.reminderAlert()
        // }

        if (position.coords.latitude === desLat) {
          navigator.geolocation.clearWatch(id); //per controllare se abbiamo raggiunto la destinazione e bloccare il watch
        }
      }
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }



  // aggiunta dei markers


  addMarker() {
    let marker = L.marker(this.latLng, {
      draggable: true,
      bounceOnAdd: true,
      title: 'custom',
    })
      .bindPopup(this.reminder)
      .addTo(this.map);
  }

  scan() {

    let newMarkers: {
      id: number;
      latlng:L.LatLng;
      reminder: string;
      read:boolean;
    }[] = [];
    let id: number = 0;

    this.map.eachLayer((layer: any) => {
      console.log(layer);
      if (layer.options.title == 'custom') {
        console.log();



        let markerElements: {
          id: number;
          latlng:L.LatLng;
          reminder: string;
          read:boolean;
        } =
          {id:id++,
            latlng:layer._latlng,
            reminder:layer._popup._content,
            read:false
          };
          console.log(markerElements);

        newMarkers.push(markerElements);
      }
    });
    localStorage.setItem('markers', JSON.stringify(newMarkers));
    this.markers = newMarkers;
  }

  // calcolo distanza

  getDistance() {
    let found:boolean = false;
    let foundMarker:M | false = false;



    for (let marker of this.markers.filter(e =>{
      return e.read == false;
    })) {




      let latlng1 = L.latLng(this.latLng);
      let latlng2 = L.latLng(marker.latlng);
      this.reminder = marker.reminder
      this.id = marker.id


      let distance = latlng1.distanceTo(latlng2) / 1000;


      if (distance <= 0.5) {
        found = true;
        foundMarker = marker;
        break;
      }
    }
    if(foundMarker){
      this.reminderAlert(foundMarker)
    }

    // if(this.markers.filter(e => !e.read).length > 0){
    //   this.getDistance()
    // }
    return found;
  }

  // notifica di prossimità

  reminderAlert(m:M){
    Swal.fire({
      title: 'remember to '+ this.reminder,
      text: "do you want to delete this?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeReminders()
        Swal.fire(
          'Deleted!',
          'Your reminder has been deleted.',
          'success'
        )
      }else{
        m.read = true;
      }
        this.isWatching = false;


    })
  }

  // eliminazione dei markers

  removeReminders(){
    let oldMarkers:{ id: number; latlng: L.LatLngExpression; reminder: string }[] = JSON.parse(localStorage.getItem('markers') || '[]');

    const filteredMarkers:{ id: number; latlng: L.LatLngExpression; reminder: string }[] = oldMarkers.filter(markers => markers.id !== this.id);

    localStorage.setItem('markers', JSON.stringify(filteredMarkers));

  }

  clearReminders(){
    localStorage.clear()
  }

// UPDATE POSITION

  positionChange(latLng:L.LatLngExpression){
    this.homeMarker.setLatLng(latLng)
    this.positionUpdatable = false;
    setTimeout(() => {this.positionUpdatable = true},1000)
  }

}



