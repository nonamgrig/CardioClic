import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface Patient {
  age: number | null;
  sexe : string | null; // homme ou femme 
  diabetique : boolean | null; 
  ageApparition : number| null; 
  prevention : string | null; //primaire ou secondaire
  creatinine : number | null; 
  ascendance : number | null; // 0 = non; 1 = oui; 2 = ne se prononce pas
  dfge: number | null; 
  ratio : number | null; 
  neuropathie : boolean | null; 
  retinopathie : boolean | null; 
  pa : number | null; 
  cholesTotal : number | null; 
  hdl : number | null; 
  hba1c : number | null; 
  fumeur : number | null;  
  score2 : number | null;
  score2op : number | null; 
  score2diabet : number | null;  //stocke le score en fonction de la méthode de calul 
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private isLoaded: boolean = false;  // Flag pour vérifier si le patient est chargé
  public situation : any; 

  private patientData: Patient = {
    age: null,
    sexe: null,
    diabetique: null,
    ageApparition: null,
    prevention: null,
    creatinine: null,
    ascendance: null,
    dfge: null,
    ratio: null,
    neuropathie: null,
    retinopathie: null,
    pa: null,
    cholesTotal: null,
    hdl: null,
    hba1c: null,
    fumeur: null,
    score2: null,
    score2op: null,
    score2diabet: null
  };

  constructor(private http: HttpClient) {}

  // Méthode pour charger le patient depuis le fichier JSON
  loadSituation(): Observable<Patient> {
    // Si les questions sont déjà chargées, on ne les recharge pas
    // TODO: utile ?
    if (this.isLoaded) {
      console.log("patient déjà chargé")
    }

    // Si non, on charge le patient depuis le fichier JSON
    return this.http.get<any>('assets/texts.json').pipe(
      map((data: any) => {
        //on crée situation qui comprend les textes du composant votre patient
        this.situation = data.patient; 
      
        // Marquer comme chargé
        this.isLoaded = true;

        return this.situation;  
      })
    );
  }

  // Utilisation d'un BehaviorSubject pour émettre et suivre l'état du patient
  private patientSubject = new BehaviorSubject<Patient>(this.patientData);
  patient$ = this.patientSubject.asObservable();

  //les attributs de patient (doublon avec plastron component)
  //TO DO
  patientKeys: (keyof Patient)[] = [
    'age', 'sexe', 'diabetique', 'ageApparition', 'prevention',
    'creatinine', 'ascendance', 'dfge', 'ratio',
    'neuropathie', 'retinopathie', 'pa', 'cholesTotal',
    'hdl', 'hba1c', 'fumeur', 'score2', 'score2op', 'score2diabet'
  ];

  //pour mettre à jour un des champs de patient
  updateField(fieldName: string, value: any) {
    if (this.patientKeys.includes(fieldName as keyof Patient)) {
      const key = fieldName as keyof Patient;
      this.patientData[key] = value;
      this.patientSubject.next({ ...this.patientData });
      console.log(`Champ "${key}" mis à jour avec :`, value);
    } else {
      console.warn('Clé patient inconnue :', fieldName);
    }
  }
  

  //pour récupérer le patient actuel
  getCurrentPatient(): Patient {
    return this.patientSubject.value;
  }

  resetPatient(): void {
    // Réinitialise tous les champs à null
    this.patientData = {
      age: null,
      sexe: null,
      diabetique: null,
      ageApparition: null,
      prevention: null,
      creatinine: null,
      ascendance: null,
      dfge: null,
      ratio: null,
      neuropathie: null,
      retinopathie: null,
      pa: null,
      cholesTotal: null,
      hdl: null,
      hba1c: null,
      fumeur: null,
      score2: null,
      score2op: null,
      score2diabet: null
    };
  
    // Émet la nouvelle valeur (réinitialisée)
    this.patientSubject.next({ ...this.patientData });
  
    console.log('Patient réinitialisé à null.');
  }
  
}
