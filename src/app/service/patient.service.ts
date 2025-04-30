import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HomeComponent } from '../home/home/home.component';
import { StmtModifier } from '@angular/compiler';

import ds from '../../../public/assets/texts.json'

type QPatient = typeof ds.patient
// TO DO Recréer l' interface patient à partir de qPatient

// const test: QPatient = {
  
// }

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
  fumeur : string | null;  // Oui Non
  score2 : number | null;
  score2op : number | null; 
  score2diabete : number | null;  //stocke le score en fonction de la méthode de calul 
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
    score2diabete: null
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
  //parcourir le fichier json par les attributs pour créer le patientKeys 
  patientKeys: (keyof Patient)[] = [
    'age', 'sexe', 'diabetique', 'ageApparition', 'prevention',
    'creatinine', 'ascendance', 'dfge', 'ratio', 'rationondispo', 
    'neuropathie', 'retinopathie', 'pa', 'cholesTotal',
    'hdl', 'hba1c', 'fumeur', 'score2', 'score2op', 'score2diabete'
  ];

  hidden :   (keyof Patient)[]  = [
    
  ]; 

  //pour mettre à jour un des champs de patient
  updateField(fieldName: string, value: any) {
    const key = fieldName as keyof Patient;
  
    if (this.patientKeys.includes(key) && !this.hidden.includes(key)) {
      // Remplacer la virgule par un point si c'est une chaîne contenant une virgule
      if (typeof value === 'string' && value.includes(',')) {
        value = value.replace(',', '.');
      }
    
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
      score2diabete: null
    };
  
    // Émet la nouvelle valeur (réinitialisée)
    this.patientSubject.next({ ...this.patientData });
  
    console.log('Patient réinitialisé à null.');
  }

  calculAgeApparition(anneeApparition :string): number {
    let age =0; 
    //TO DO a finir 
    const anneeEnCours = new Date().getFullYear();
    const anneeNaissance = Number(anneeEnCours) - Number(this.patientData.age); 
    age = Number(anneeApparition) - Number(anneeNaissance); 
    return age; 
  }
  
  calculDFGe(): number {
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
    if (CR == 0) {
      return 0; 
    }
    const age = this.patientData.age ? this.patientData.age : 0;

    const DFGe = 141 * Math.pow(Math.min(CR/k, 1), alpha) * Math.pow(Math.max(CR/k, 1), -1.209)*Math.pow(0.993,age)* fem * asc; 

    return DFGe 
  }


  calculscore2() : number{
    let score = 0; 

    /**
     * On transforme les données utiles du patient 
     */
    const cage = (Number(this.patientData.age)-60)/5; 
    const csbp = (Number(this.patientData.pa)-120)/20; 
    const ctchol = (Number(this.patientData.cholesTotal)-6)/1; 
    const chdl = (Number(this.patientData.hdl)-1.3)/0.5; 

    let smoking = 0; 
    if (this.patientData.fumeur == "Oui") {
      smoking = 1; 
    } 
    /**
     * On multiplie les transformations par cage
     */
    const smokingcage = smoking * cage; 
    const csbpcage = csbp * cage; 
    const ctcholcage = ctchol * cage; 
    const chdlcage = chdl * cage; 
    
    /**
     * On crée une liste avec tous les infos 
     */
    const transf = [
      cage, 
      smoking,
      csbp, 
      ctchol, 
      chdl, 
      smokingcage, 
      csbpcage, 
      ctcholcage, 
      chdlcage
    ]

    /**
     * On a la liste des logSHR par élément pour homme et femme
     * l'ordre : age, smoking, csbp, ctchol, cthdl, smokingcage, csbpcage, ctcholcage, cthdlcage, baselin survival
     */

    const logSHRHomme = [
      0.3742, 
      0.6012, 
      0.2777,
      0.1458,
      -0.2698,
      -0.0755,
      -0.0255,
      -0.0281,
      0.0426,
      
    ]; 

    const logSHRFemme = [
      0.4648,
      0.7744,
      0.3131,
      0.1002,
      -0.2606,
      -0.1088,
      -0.0277,
      -0.0226,
      0.0613,
      
    ]
    console.log('logSHR', logSHRHomme[0]); 


    /**
     * Mutiplier logSHR et les valeurs transformées pour calculer le linear predictor
     * on renseigne egalement les paramètres en fonction du sexe
     * les scale utilisés sont ceux de la zone à faible risque
     */
    let linearPredictor = 0; 
    let baselinsurvival =0;
    let scale1 = 0; 
    let scale2 =0; 
    if (this.patientData.sexe == "Homme"){
      baselinsurvival=0.9605; 
      scale1 = -0.5699; 
      scale2 = 0.7476; 

      logSHRHomme.forEach((log, index) => {
        linearPredictor = linearPredictor + log * transf[index]; 
      })
    } else if (this.patientData.sexe == "Femme"){
      baselinsurvival = 0.9776; 
      scale1 = -0.738; 
      scale2 = 0.7019; 

      logSHRFemme.forEach((log, index) => {
        linearPredictor = linearPredictor + log * transf[index]; 
      })
    }

    console.log("Linear Predictor", linearPredictor); 

    /**
     * On calcule le 10 year risk estimation
     */
    const risk10 = 1 - Math.pow(baselinsurvival,Math.exp(linearPredictor)); 
    console.log("10 year risk", risk10); 

    /**
     * On calcule calibrated 10yrs risk
     */

    const risk10cal = 1 - Math.exp(-Math.exp(scale1 + scale2 * Math.log(-Math.log(1-risk10)))); 
    console.log("risk 10 cal", risk10cal); 

    /**
     * Le score final est le pourcentage obtenu
     */
    score = risk10cal*100; 
    return score; 
  }

  calculscore2op() : number{
    let score = 0; 

    /**
     * On transforme les données utiles du patient 
     */
    const cage = Number(this.patientData.age)-73; 
    const csbp = Number(this.patientData.pa)-150; 
    const ctchol = Number(this.patientData.cholesTotal)-6; 
    const chdl = Number(this.patientData.hdl)-1.4; 

    let smoking = 0; 
    if (this.patientData.fumeur == "Oui") {
      smoking = 1; 
    } 
    /**
     * On multiplie les transformations par cage
     */
    const smokingcage = smoking * cage; 
    const csbpcage = csbp * cage; 
    const ctcholcage = ctchol * cage; 
    const chdlcage = chdl * cage; 
    
    /**
     * On crée une liste avec tous les infos 
     */
    const transf = [
      cage, 
      smoking,
      csbp, 
      ctchol, 
      chdl, 
      smokingcage, 
      csbpcage, 
      ctcholcage, 
      chdlcage
    ]

    /**
     * On a la liste des logSHR par élément pour homme et femme
     * l'ordre : age, smoking, csbp, ctchol, cthdl, smokingcage, csbpcage, ctcholcage, cthdlcage, baselin survival
     */

    const logSHRHomme = [
      0.0634, 
      0.3524,
      0.0094,
      0.085,
      -0.3564,
      -0.0247,
      -0.0005,
      0.0073,
      0.0091
    ]; 

    const logSHRFemme = [
      0.0789,
      0.4921,
      0.0102,
      0.0605,
      -0.304,
      -0.0255,
      -0.0004,
      -0.0009,
      0.0154      
    ]
    console.log('logSHR', logSHRHomme[0]); 


    /**
     * Mutiplier logSHR et les valeurs transformées pour calculer le linear predictor
     * on renseigne egalement les paramètres en fonction du sexe
     * les scale utilisés sont ceux de la zone à faible risque
     */
    let linearPredictor = 0; 
    let baselinsurvival = 0;
    let scale1 = 0; 
    let scale2 =0; 
    let k =0; 
    if (this.patientData.sexe == "Homme"){
      baselinsurvival=0.7576; 
      scale1 = -0.34; 
      scale2 = 1.19; 
      k=0.0929; 

      logSHRHomme.forEach((log, index) => {
        linearPredictor = linearPredictor + log * transf[index]; 
      })
    } else if (this.patientData.sexe == "Femme"){
      baselinsurvival = 0.8082; 
      scale1 = -0.52; 
      scale2 = 1.01; 
      k=0.229; 

      logSHRFemme.forEach((log, index) => {
        linearPredictor = linearPredictor + log * transf[index]; 
      })
    }

    console.log("Linear Predictor", linearPredictor); 

    /**
     * On calcule le 10 year risk estimation
     */
    const risk10 = 1 - Math.pow(baselinsurvival,Math.exp(linearPredictor-k)); 
    console.log("10 year risk", risk10); 

    /**
     * On calcule calibrated 10yrs risk
     */

    const risk10cal = 1 - Math.exp(-Math.exp(scale1 + scale2 * Math.log(-Math.log(1-risk10)))); 
    console.log("risk 10 cal", risk10cal); 

    /**
     * Le score final est le pourcentage obtenu
     */
    score = risk10cal*100; 
    return score; 
  }


  calculscore2diabet() : number{
    let score = 0; 

    /**
     * On transforme les données utiles du patient 
     */
    const cage = (Number(this.patientData.age)-60)/5; 
    const csbp = (Number(this.patientData.pa)-120)/20; 
    const ctchol = (Number(this.patientData.cholesTotal)-6)/1; 
    const chdl = (Number(this.patientData.hdl)-1.3)/0.5;
    let smoking = 0; 
    if (this.patientData.fumeur == "Oui") {
      smoking = 1; 
    } 
    //propre au diabetique
    const diabet = 1; 
    const cagediab = (Number(this.patientData.ageApparition)-50)/5;
    const chba1c = (Number(this.patientData.hba1c)-31)/9.34;
    const clnegfr = (Math.log(Number(this.patientData.dfge))-4.5)/0.15;
    
    

    /**
     * On multiplie les transformations par cage
     */
    const smokingcage = smoking * cage; 
    const csbpcage = csbp * cage; 
    const ctcholcage = ctchol * cage; 
    const chdlcage = chdl * cage; 
    //propre au diabetique
    const diabetcage = diabet * cage; 
    const clnegfr2 = clnegfr * clnegfr; 
    const chba1ccage = chba1c * cage; 
    const clnegfrcage = clnegfr * cage

    
    /**
     * On crée une liste avec tous les infos 
     */
    const transf = [
      cage, 
      smoking,
      csbp, 
      diabet, 
      ctchol, 
      chdl, 
      smokingcage, 
      csbpcage, 
      ctcholcage, 
      chdlcage, 
      diabetcage, 
      cagediab, 
      chba1c, 
      clnegfr, 
      clnegfr2, 
      chba1ccage,
      clnegfrcage
    ]

    /**
     * On a la liste des logSHR par élément pour homme et femme
     */
    const logSHRHomme = [
      0.5368,
      0.4774,
      0.1322,
      0.6457,
      0.1102,
      -0.1087,
      -0.0672,
      -0.0268,
      -0.0181,
      0.0095,
      -0.0983,
      -0.0998,
      0.0955,
      -0.0591,
      0.0058,
      -0.0134,
      0.0115
    ];

    const logSHRFemme = [
      0.6624,
      0.6139,
      0.1421,
      0.8096,
      0.1127,
      -0.1568,
      -0.1122,
      -0.0167,
      -0.02,
      0.0186,
      -0.1272,
      -0.118,
      0.1173,
      -0.064,
      0.0062,
      -0.0196,
      0.0169
    ];
    console.log('logSHR', logSHRHomme[0]); 


    /**
     * Mutiplier logSHR et les valeurs transformées pour calculer le linear predictor
     * on renseigne egalement les paramètres en fonction du sexe
     * les scale utilisés sont ceux de la zone à faible risque
     */
    let linearPredictor = 0; 
    let baselinsurvival = 0;
    let scale1 = 0; 
    let scale2 =0; 
    

    if (this.patientData.sexe == "Homme"){
      baselinsurvival=0.9605; 
      scale1 = -0.5699; 
      scale2 = 0.7476; 

      logSHRHomme.forEach((log, index) => {
        linearPredictor = linearPredictor + log * transf[index]; 
      })
    } else if (this.patientData.sexe == "Femme"){
      baselinsurvival = 0.9776; 
      scale1 = -0.738; 
      scale2 = 0.7019; 

      logSHRFemme.forEach((log, index) => {
        linearPredictor = linearPredictor + log * transf[index]; 
      })
    }

    console.log("Linear Predictor", linearPredictor); 

    /**
     * On calcule le 10 year risk estimation
     */
    const risk10 = 1 - Math.pow(baselinsurvival,Math.exp(linearPredictor)); 
    console.log("10 year risk", risk10); 

    /**
     * On calcule calibrated 10yrs risk
     */

    const risk10cal = 1 - Math.exp(-Math.exp(scale1 + scale2 * Math.log(-Math.log(1-risk10)))); 
    console.log("risk 10 cal", risk10cal); 

    /**
     * Le score final est le pourcentage obtenu
     */
    score = risk10cal*100; 
    return score; 
  }
}
