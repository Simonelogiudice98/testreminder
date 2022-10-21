import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PositionServiceService {

  mapLoading:boolean = true;
  lastMapPos: L.LatLngExpression = [0,0]



  constructor() { }
}
