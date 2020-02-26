import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import {mensaje} from './mensaje';

@Injectable({
    providedIn: 'root'
  })
  export class service {
    me: mensaje;

    constructor(private http: HttpClient) { }

    readonly URL_API = 'http://localhost:8000';


    enviarMe() {
        this.me = new mensaje();
        console.log(this.me);
        return this.http.post(this.URL_API + '/hola', this.me);
      }
  }
  