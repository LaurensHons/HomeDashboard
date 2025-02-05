import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, of } from 'rxjs';
import {
  NMBSDeparture,
  NMBSStation,
  NMBSStop,
  NMBSTrain,
} from '../models/nmbs.models';

@Injectable({
  providedIn: 'root',
})
export class BRFunctionsService {
  baseUrl = 'https://gpsgadget.buienradar.nl/data/raintext';

  constructor(private httpClient: HttpClient) {}

  getRadarInfo(lat: number, lon: number) {
    return this.httpClient
      .get(`${this.baseUrl}?lat=${lat}&lon=${lon}`, {
        responseType: 'text',
      })
      .pipe(first());
  }
}
