import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HomeComponent } from '../home/home/home.component';

export interface Patient {
  age: number | null;
  sexe : string | null; // Homme ou Femme 
  diabetique : string | null; // Oui Non
  ageApparition : number| null; 
  prevention : string | null; //primaire ou secondaire
  creatinine : number | null; 
  ascendance : string | null; // oui non ne se prononce pas 
  dfge: number | null; 
  ratio : number | string | null; //soit la valeur, soit non dispo
  rationondispo : string | null; 
  neuropathie : string | null; // Oui Non
  retinopathie : string | null; // Oui Non
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
    rationondispo: null,
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
    'creatinine', 'ascendance', 'dfge', 'ratio', 'rationondispo', 
    'neuropathie', 'retinopathie', 'pa', 'cholesTotal',
    'hdl', 'hba1c', 'fumeur', 'score2', 'score2op', 'score2diabet'
  ];

  hidden :   (keyof Patient)[]  = [
    
  ]; 

  //pour mettre à jour un des champs de patient
  updateField(fieldName: string, value: any) {
    const key = fieldName as keyof Patient;
  
    if (this.patientKeys.includes(key) && !this.hidden.includes(key)) {
      this.patientData[key] = value;
      this.patientSubject.next({ ...this.patientData });
      console.log(`Champ "${key}" mis à jour avec :`, value);
    } else {
      console.warn('Mise à jour ignorée pour la clé :', key);
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
      rationondispo: null, 
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
  
  calculDFGe(): number {
    console.log("lancement calcul dfge", this.patientData)

    let k; 
    let alpha; 
    let fem; 
    switch (this.patientData.sexe) {
      case "Homme":
        k = 79.6;
        alpha = -0.411;
        fem = 1; 
        break;
      case "Femme":
        k = 61.9;
        alpha = -0.329;
        fem = 1.018; 
        break;
      default:
        k = 0; 
        alpha = 0; 
        fem = 1; 
        break;
    }; 

    let asc; 
    switch (this.patientData.ascendance) {
      case "Oui": //afro caribéen
         asc= 1.159; 
        break;
      default : // non ou bien ne se prononce pas 
        asc = 1;
        break;
    }

    const CR = this.patientData.creatinine ? this.patientData.creatinine : 0; 
    const age = this.patientData.age ? this.patientData.age : 0;

    const DFGe = 141 * Math.pow(Math.min(CR/k, 1), alpha) * Math.pow(Math.max(CR/k, 1), -1.209)*Math.pow(0.993,age)* fem * asc; 

    return DFGe 
  }
}
