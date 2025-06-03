import { Injectable } from '@angular/core';


export interface Preconisation {
  id : string; 
  question: string;
  type: string;
  message : string[] | null; 
  preconisation : string; 
  rcv : string; 
  reco : { [key: string]: Reco } | null; 
}

export interface Reco {
  message1 : string; 
  message2 : string; 
  refIcon : string; 
}

@Injectable({
  providedIn: 'root'
})
export class PreconisationService {

  constructor() { }
}
