import { Injectable } from '@angular/core';


export interface Preconisation {
  id : string; 
  question: string;
  type: string;
  message : string[] | null; 
  preconisation : string; 
  rcv : string; 
  reco : { [key: string]: Reco } | null; 
  recalcul : string; 
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

    // Fonction pour récupérer un élément par son index dans la Map de questions
  getPreconisationByIndex(map: Map<string, Preconisation>, index: number): Preconisation | undefined {
    const entriesArray = Array.from(map);
    const entry = entriesArray[index];
    return entry ? entry[1] : undefined;
  }

}
