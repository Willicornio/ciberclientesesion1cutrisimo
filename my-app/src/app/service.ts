import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import {mensaje} from './mensaje';
import  * as big from 'bigint-crypto-utils';



@Injectable({
    providedIn: 'root'
  })
  export class service {
    me: mensaje;
  

    constructor(private http: HttpClient) { }
    
    readonly URL = 'http://localhost:8000';


    
    enviarMe(mensaje: any) {

      return this.http.post(this.URL + '/hola', {
        mensaje
      });
    }

    dameClave() {
      return this.http.get(this.URL + '/key');
    }
  }
  