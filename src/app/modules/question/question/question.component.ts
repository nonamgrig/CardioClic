import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TexteService } from '../../../service/texte.service';
import { QuestionService } from '../../../service/question.service';
import { Question } from '../../../service/question.service'
import { Patient, PatientService } from '../../../service/patient.service';

@Component({
  selector: 'app-question',
  standalone: false,
  templateUrl: './question.component.html',
  styleUrl: './question.component.less'
})
export class QuestionComponent implements OnInit, OnChanges {

  @Input() questionId: number = 0;
  question: Question | undefined;
  userAnswer: any = null;
  selectedAnswer : any = null; 
  selectedUnit: string = '';

  subquestionsArray: (Question & { key: string })[] = [];

  @Input() patient! : Patient; //on récupère le patient 

  //pour gérer les pop up
  showDialog = false;
  dialogMessage = '';

  constructor(
    private router: Router,
    private texteService: TexteService,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    // Charger les questions dès le début si ce n'est pas déjà fait
    this.texteService.loadQuestions().subscribe(() => {
      this.loadQuestion();
      //pour initialiser les questions supplémentaires
      this.initSubquestions();

      this.texteService.dialog$.subscribe((msg: string) => {
      this.dialogMessage = msg;
      this.showDialog = true;
      this.aideSelections= new Set(); 
    });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si le questionId change, on recharge la question
    if (changes['questionId']) {
      //pour ré-initialiser les valeurs pour la nouvelle question
      this.userAnswer=""; 
      this.selectedAnswer=""; 
      this.subquestionsArray=[]; 
      this.loadQuestion();
      //pour initialiser les questions supplémentaires
      this.initSubquestions();
      this.aideSelections= new Set(); 
    }
  }

  loadQuestion(): void {
    // Charger la question via le service
    const index = this.questionId - 1;  // index basé sur le questionId
    this.question = getQuestionByIndex(this.texteService.questions, index);
    // Si la question a des unités (clé 'units'), extraire les valeurs de l'objet et les convertir en tableau
    if (this.question?.units && typeof this.question?.units == 'object') {
      const unitsArray = Object.values(this.question.units);
      this.question.units =unitsArray; // Extraire les valeurs et les mettre dans un tableau
      this.question.selectedUnit = unitsArray[0]; // Sélectionner par défaut la première unité
    }
  }

  // Fonction pour transformer l'objet responses en tableau
  getResponseArray() {
    if (this.question?.responses){
      return Object.keys(this.question.responses).map(key => {
        return { key: key, label: this.question?.responses? this.question.responses[key] : null };
      });
    } else {return null}
  }

  //pour transformer les réponses d'une subquestion en tableau
  getResponseArraySubquestion(subquestion : Question) {

    if (subquestion?.responses){
      const array = Object.keys(subquestion.responses).map(key => {
        return { key: key, label: subquestion?.responses? subquestion.responses[key] : null };
      });
      return array;
    } else {
      console.warn('getResponseArraySubquestion - Pas de réponses dispo')
      return null}
  }


  //Fonction pour transformer subquestion en tableau
  initSubquestions() {
    const subquestions = this.question?.subquestion;
  
    if (subquestions) {
      this.subquestionsArray = Object.keys(subquestions).map((key) => {
        const question = {
          ...subquestions[key],
          key: key
        };
  
        // Si la question a des unités (clé 'units'), extraire les valeurs de l'objet et les convertir en tableau
        if (question.units && typeof question.units == 'object') {
          const unitsArray = Object.values(question.units);
          question.units =unitsArray; // Extraire les valeurs et les mettre dans un tableau
          question.selectedUnit = unitsArray[0]; // Sélectionner par défaut la première unité
        }
        return question;
      });
    }
  }
  

  //on récupère la réponse de la case conchée 
  onCheckboxChangeSubquestion(event: Event, response: any, subquestion : Question) {
    const checkbox = event.target as HTMLInputElement;
  
    if (checkbox.checked) {
      subquestion.userAnswer = response.label;
    } else {
      subquestion.userAnswer = '';
    }
  }

  //pour la question aide on doit sélectionner plusieurs réponses 
  aideSelections: Set<string> = new Set(); // pour suivre les cases cochées
  onAideCheckboxChange(event: Event, response: any, subquestion: Question) {
    const checkbox = event.target as HTMLInputElement;
  
    // Initialiser le tableau si vide
    if (!Array.isArray(subquestion.userAnswer)) {
      subquestion.userAnswer = [];
    }
  
    if (checkbox.checked) {
      // Ajouter si pas déjà présent
      if (!subquestion.userAnswer.includes(response.label)) {
        subquestion.userAnswer.push(response.label);
      }
      this.aideSelections.add(response.label);
    } else {
      // Retirer si décoché
      subquestion.userAnswer = subquestion.userAnswer.filter(label => label !== response.label);
      this.aideSelections.delete(response.label);
    }
  
   
  }

  //pour tester si subquestion.userAnswer est un array et si la reponse est dans la liste des réponses
  isChecked(subquestion: any, label: string | null): boolean {
    console.log("check",this.patient[subquestion.key]);
    console.log("label",label);
    if (this.patient[subquestion.key] == label) return true; 
    if (label === null) return false; 
    return (Array.isArray(subquestion.userAnswer) && subquestion.userAnswer.includes(label));
  }

  //pour ferrmer la dialogue box
  onDialogConfirm() {
    this.showDialog = false;
    this.texteService.confirmDialog();
  }


  async onAnswerSubmit() {
    if (this.questionId) {
      //enregistrer la réponse de l'utilisateur, utile ? 
      console.log('onAnswerSubmit - Réponse utilisateur :', this.userAnswer);
      console.log('onAnswerSubmit - Clé sélectionnée :', this.selectedAnswer);
      //on a stocké les réponses aux questions dans les subquestions directement
      console.log("subquestion with answer", this.subquestionsArray);
      console.log("key", this.question?.title); 

      const key = this.question?.title ? this.question.title : "titre vide";

       //pour récupérer les unités sélectionnées et enregistrer la valeur convertie et l'envoyer aux fonctions de calcul de score 
      let creatinineUnit; 
      let cholesTotalUnit;
      let hdlUnit;
      let hba1cUnit; 

      if (this.subquestionsArray.length == 0 ) {
        //on a une seule question sur la page 
        if (this.userAnswer == "") { //si la personne n'a rempli aucune valeur il n'y a rien à modifier
        } else {this.patientService.updateField(key, this.userAnswer);}
      } else {
        //il y a plusieurs réponses à enregistrer
        this.subquestionsArray.forEach(subquestion => {
          if (subquestion.userAnswer == "") { 
            //si la personne n'a rempli aucune valeur il n'y a rien à modifier
          } else {
            this.patientService.updateField(subquestion.key, subquestion.userAnswer);
          }
        })
      }

      let valueTotal; 
      let oldValueTotal; 
      let newValueTotal
      let valueHDL; 
      let oldValueHDL; 
      let newValueHDL; 
     

      //pour les questions avec un calcul, on appelle la fonction de calcul dans patientService
      switch (this.question?.title) {
        case "apparition": //calculer l'age à l'apparition du diabète 
        //si un âge d'apparition est enregistré, il prévaut sur l'année d'apparition
          if (this.subquestionsArray[1].userAnswer){ //si on a un age d'apparition
            //on vérifie si l'âge renseigné est inférieur ou égal à l'âge du patient 
            if (!this.patientService.checkAgeApparition(this.subquestionsArray[1].userAnswer as string)){
              //si on a pas un age d'apparition correct, on supprime la donnée
              this.patientService.updateField("ageApparition", null);
            }
          } else { //si on a pas d'âge d'apparition
            if (this.subquestionsArray[0].userAnswer) {
              console.log("annee d'apparition donnée", this.subquestionsArray[0].userAnswer); 
              let ageApparition = this.patientService.calculAgeApparition(this.subquestionsArray[0].userAnswer as string)
              console.log("age apparition diabete", ageApparition); 
              if (ageApparition > 0) { //si on a bien une année d'apparition
                this.patientService.updateField("ageApparition", ageApparition.toString());
              }
            }  
          }                    
          break;
        case "prevention": 
          if (this.userAnswer == "J'ai un doute, aidez moi !") {
            //si la réponse est j'ai un doute, on ne doit pas l'enregistrer 
            this.patientService.updateField("prevention", null); 
          }
          break; 
        case "aide1": //la réponse de user
        //TO DO trancher si on veut ou pas stocker les réponses à l'aide (pour l'instant nan)
        //Lorsqu'on retourne en arrière on n'efface pas les réponses mais elles n'apparaissent pas een déjà cochée non plus 
          // Met à jour selected global (Oui si au moins 1 case cochée sinon vide)
          this.selectedAnswer = this.aideSelections.size > 0 ? 'Oui' : '';
          if (this.selectedAnswer == 'Oui') {
            //prévention secondaire 
            this.patientService.updateField("prevention", "Secondaire")
          } else {
            //on passe à l'aide 2
            //this.patientService.updateField("prevention", "primaire")
          }
          break; 
        case "aide2": 
          if (this.selectedAnswer == 'response4') {
            this.patientService.updateField("prevention", "Primaire")
          }
          break; 
        case "coro": //la réponse de user
        //TO DO trancher si on veut ou pas stocker les réponses à l'aide (pour l'instant nan)
        //Lorsqu'on retourne en arrière on n'efface pas les réponses mais elles n'apparaissent pas een déjà cochée non plus 
          // Met à jour selected global (Oui si au moins 1 case cochée sinon vide)
          this.selectedAnswer = this.aideSelections.size > 0 ? 'Oui' : '';
          if (this.selectedAnswer == 'Oui') {
            //prévention secondaire
            this.patientService.updateField("prevention", "Secondaire")
          } else {
            //prévention primaire
            this.patientService.updateField("prevention", "Primaire")
          }
          break;
        case "doppler": //la réponse de user
        //TO DO trancher si on veut ou pas stocker les réponses à l'aide (pour l'instant nan)
        //Lorsqu'on retourne en arrière on n'efface pas les réponses mais elles n'apparaissent pas een déjà cochée non plus 
          // Met à jour selected global (Oui si au moins 1 case cochée sinon vide)
          this.selectedAnswer = this.aideSelections.size > 0 ? 'Oui' : '';
          if (this.selectedAnswer == 'Oui') {
            //prévention secondaire
            this.patientService.updateField("prevention", "Secondaire")
          } else {
            //prévention primaire
            this.patientService.updateField("prevention", "Primaire")
          }
          break;
        case "calcique": //la réponse de user
        //TO DO trancher si on veut ou pas stocker les réponses à l'aide (pour l'instant nan)
        //Lorsqu'on retourne en arrière on n'efface pas les réponses mais elles n'apparaissent pas een déjà cochée non plus 
          // Met à jour selected global (Oui si au moins 1 case cochée sinon vide)
          this.selectedAnswer = this.aideSelections.size > 0 ? 'Oui' : '';
          if (this.selectedAnswer == 'Oui') {
            //prévention secondaire
            this.patientService.updateField("prevention", "Secondaire")
          } else {
            //prévention primaire
            this.patientService.updateField("prevention", "Primaire")
          }
          break;
        case "CKD":
          //si on a pas remplit l'ascendance alors on enregistre "Ne souhaite pas répondre"
          if(!this.subquestionsArray[1].userAnswer) {
            this.patientService.updateField("ascendance", "Ne souhaite pas répondre"); 
          }
          //on récupère l'unité choisie
          creatinineUnit = this.subquestionsArray[0].selectedUnit ? this.subquestionsArray[0].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          let value =  this.subquestionsArray[0].userAnswer as string
          let oldValue = value ? Number(value.replace(',', '.')) : 0; 

          //on calcule la nouvelle valeur dans l'unité standard
          const newValue = oldValue * this.patientService.convertCreatinine(creatinineUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[0].key, arrondirSiNecessaire(newValue))

          //on calcule le score 
          let DFGe = arrondirSiNecessaire(this.patientService.calculDFGe(creatinineUnit)); //'avec 2 chiffres après la virgule
          this.patientService.updateField("dfge", DFGe);
          break;
        case "ratio" : 
          //si on a une valeur de ratio, on doit vider ratiodispo 
          if (this.subquestionsArray[0].userAnswer){
            this.patientService.updateField('rationondispo', null)
          }
          break; 
        case "score2": 
          //Attention dépend de l'ordre du json
          cholesTotalUnit = this.subquestionsArray[1].selectedUnit ? this.subquestionsArray[1].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          valueTotal =  this.subquestionsArray[1].userAnswer as string; 
          oldValueTotal = valueTotal ? Number(valueTotal.replace(',', '.')) : 0; 

          //on calcule la nouvelle valeur dans l'unité standard
          newValueTotal = oldValueTotal * this.patientService.convertCholesTotal(cholesTotalUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[1].key, arrondirSiNecessaire(newValueTotal))

          hdlUnit = this.subquestionsArray[2].selectedUnit ? this.subquestionsArray[2].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          valueHDL =  this.subquestionsArray[2].userAnswer as string; 
          oldValueHDL = valueHDL ? Number(valueHDL.replace(',', '.')) : 0; 

          //on calcule la nouvelle valeur dans l'unité standard
          newValueHDL = oldValueHDL* this.patientService.convertCholesTotal(hdlUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[2].key, arrondirSiNecessaire(newValueHDL))

          //si il nous manque une des deux valeurs, on ne peut pas calculer les scores
          if (oldValueTotal == 0 || oldValueHDL == 0 || this.subquestionsArray[3].userAnswer == undefined) {
            this.patientService.updateField("score2", "");
          } else {
            //on calcule le score 
            let score2 = arrondirSiNecessaire(this.patientService.calculscore2(cholesTotalUnit, hdlUnit)); 
            if (score2 == "NaN") {this.patientService.updateField("score2", "")}
            else {this.patientService.updateField("score2", score2);} 
          }
          break;
        case "score2op": 
          //Attention dépend de l'ordre du json
          cholesTotalUnit = this.subquestionsArray[1].selectedUnit ? this.subquestionsArray[1].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          valueTotal =  this.subquestionsArray[1].userAnswer as string; 
          oldValueTotal = valueTotal ? Number(valueTotal.replace(',', '.')) : 0; 

          //on calcule la nouvelle valeur dans l'unité standard
          newValueTotal = oldValueTotal* this.patientService.convertCholesTotal(cholesTotalUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[1].key, arrondirSiNecessaire(newValueTotal))

          hdlUnit = this.subquestionsArray[2].selectedUnit ? this.subquestionsArray[2].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          valueHDL =  this.subquestionsArray[2].userAnswer as string; 
          oldValueHDL = valueHDL ? Number(valueHDL.replace(',', '.')) : 0; 

          //on calcule la nouvelle valeur dans l'unité standard
          newValueHDL = oldValueHDL* this.patientService.convertCholesTotal(hdlUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[2].key, arrondirSiNecessaire(newValueHDL))

          if (oldValueTotal == 0 || oldValueHDL == 0 || this.subquestionsArray[3].userAnswer == undefined) {
            this.patientService.updateField("score2op", "");
          } else {
            let score2op = arrondirSiNecessaire(this.patientService.calculscore2op(cholesTotalUnit, hdlUnit)); 
            if (score2op == "NaN") {this.patientService.updateField("score2op", "")}
            else {this.patientService.updateField("score2op", score2op);} 
          }
          break;  
        case "score2diabete": 
          //Attention dépend de l'ordre du json
          cholesTotalUnit = this.subquestionsArray[1].selectedUnit ? this.subquestionsArray[1].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          valueTotal =  this.subquestionsArray[1].userAnswer as string; 
          oldValueTotal = valueTotal ? Number(valueTotal.replace(',', '.')) : 0; 

          //on calcule la nouvelle valeur dans l'unité standard
          newValueTotal = oldValueTotal* this.patientService.convertCholesTotal(cholesTotalUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[1].key, arrondirSiNecessaire(newValueTotal))

          hdlUnit = this.subquestionsArray[2].selectedUnit ? this.subquestionsArray[2].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          valueHDL =  this.subquestionsArray[2].userAnswer as string; 
          oldValueHDL = valueHDL ? Number(valueHDL.replace(',', '.')) : 0; 

          //on calcule la nouvelle valeur dans l'unité standard
          newValueHDL = oldValueHDL* this.patientService.convertCholesTotal(hdlUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[2].key, arrondirSiNecessaire(newValueHDL))

          hba1cUnit  = this.subquestionsArray[3].selectedUnit ? this.subquestionsArray[3].selectedUnit : ''; 
          //on récupère la valeur donnée par l'utilisateur
          let valueHbA1c =  this.subquestionsArray[2].userAnswer as string; 
          let oldValueHbA1c = valueHbA1c ? Number(valueHbA1c.replace(',', '.')) : 0; 

          
          //on calcule la nouvelle valeur dans l'unité standard
          let newValueHbA1c = oldValueHbA1c * this.patientService.convertHb1AcA(hba1cUnit)+this.patientService.convertHb1AcB(hba1cUnit)
          //on enregistre la nouvelle valeur en écrasant la précédente 
          this.patientService.updateField(this.subquestionsArray[3].key, arrondirSiNecessaire(newValueHbA1c))


          if (oldValueTotal == 0 || oldValueHDL == 0 || oldValueHbA1c == 0 || this.subquestionsArray[4].userAnswer == undefined) {
            this.patientService.updateField("score2diabete", "");
          } else {
            let score2diabete = arrondirSiNecessaire(this.patientService.calculscore2diabet(cholesTotalUnit, hdlUnit, hba1cUnit)); 
            if (score2diabete == "NaN") {this.patientService.updateField("score2diabete", "")}
            else {this.patientService.updateField("score2diabete", score2diabete);} 
          }
        break; 

        default : 
        
        break;
      }


      // Trouver la question suivante en fonction de la réponse
      const nextQuestionId = await this.texteService.getNextQuestion(this.questionId, this.selectedAnswer);
      if (nextQuestionId) {
        this.router.navigate(['/question', nextQuestionId]);
      } else {
        console.log("pas de question suivante");
      }
    }
  }
}

// Fonction pour récupérer un élément par son index dans la Map de questions
function getQuestionByIndex(map: Map<string, Question>, index: number): Question | undefined {
  const entriesArray = Array.from(map);
  const entry = entriesArray[index];
  return entry ? entry[1] : undefined;
}

function arrondirSiNecessaire(val : number) {
  const arrondi = Math.round(val * 100) / 100;
  return Number.isInteger(arrondi) ? arrondi.toString() : arrondi.toFixed(2);
}