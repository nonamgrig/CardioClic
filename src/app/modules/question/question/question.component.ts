import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TexteService } from '../../../service/texte.service';
import { QuestionService } from '../../../service/question.service';
import { Question } from '../../../service/question.service'
import { PatientService } from '../../../service/patient.service';

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

  //pour gérer les pop up
  showDialog = false;
  dialogMessage = '';

  constructor(
    private router: Router,
    private texteService: TexteService,
    private questionService: QuestionService,
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
    }
  }

  loadQuestion(): void {
    // Charger la question via le service
    const index = this.questionId - 1;  // index basé sur le questionId
    this.question = getQuestionByIndex(this.texteService.questions, index);
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
        if (question.units && typeof question.units === 'object') {
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
      console.log("question selected", this.userAnswer)
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
    if (label === null) return false;
    return Array.isArray(subquestion.userAnswer) && subquestion.userAnswer.includes(label);
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

      if (this.subquestionsArray.length == 0 ) {
        //on a une seule question sur la page 
        this.patientService.updateField(key, this.userAnswer);
      } else {
        //il y a plusieurs réponses à enregistrer
        this.subquestionsArray.forEach(subquestion => {
          this.patientService.updateField(subquestion.key, subquestion.userAnswer);
        })
      }
      //pour envoyer l'unité utilisé au service pour les calculs
      let cholesTotalUnit;
      let hdlUnit;
      let hba1cUnit 

      //pour les questions avec un calcul, on appelle la fonction de calcul dans patientService
      switch (this.question?.title) {
        case "apparition": //calculer l'age à l'apparition du diabète 
        //si une année d'apparition a été renseignée, elle prévaut ?
        //TO DO : choisir qui prévaut l'age ou l'année si les deux sont enregistrées 
          if (this.subquestionsArray[0].userAnswer) {
            console.log("annee d'apparition donnée", this.subquestionsArray[0].userAnswer); 
            let ageApparition = this.patientService.calculAgeApparition(this.subquestionsArray[0].userAnswer as string).toString()
            console.log("age apparition diabete", ageApparition); 
            this.patientService.updateField("ageApparition", ageApparition); 
          }
          
          break;

        case "aide": //la réponse de user
        //TO DO trancher si on veut ou pas stocker les réponses à l'aide (pour l'instant nan)
        //Lorsqu'on retourne en arrière on n'efface pas les réponses mais elles n'apparaissent pas een déjà cochée non plus 
          // Met à jour selected global (Oui si au moins 1 case cochée/ vide)
          this.selectedAnswer = this.aideSelections.size > 0 ? 'Oui' : '';
          break; 
        case "CKD":
          const creatinineUnit = this.subquestionsArray[0].selectedUnit ? this.subquestionsArray[0].selectedUnit : ''; 
          let DFGe = arrondirSiNecessaire(this.patientService.calculDFGe(creatinineUnit)); //'avec 2 chiffres après la virgule
          if (DFGe == "0"){
            DFGe = ""; 
          }
          this.patientService.updateField("dfge", DFGe); 
          break;
        case "score2": 
          //Attention dépend de l'ordre du json
          cholesTotalUnit = this.subquestionsArray[1].selectedUnit ? this.subquestionsArray[1].selectedUnit : ''; 
          hdlUnit = this.subquestionsArray[2].selectedUnit ? this.subquestionsArray[2].selectedUnit : ''; 
          let score2 = arrondirSiNecessaire(this.patientService.calculscore2(cholesTotalUnit, hdlUnit)); 
          this.patientService.updateField("score2", score2); 
          break;
        case "score2op": 
          cholesTotalUnit = this.subquestionsArray[1].selectedUnit ? this.subquestionsArray[1].selectedUnit : ''; 
          hdlUnit = this.subquestionsArray[2].selectedUnit ? this.subquestionsArray[2].selectedUnit : ''; 
          let score2op = arrondirSiNecessaire(this.patientService.calculscore2op(cholesTotalUnit, hdlUnit)); 
          this.patientService.updateField("score2op", score2op); 
          break;  
        case "score2diabete": 
        cholesTotalUnit = this.subquestionsArray[1].selectedUnit ? this.subquestionsArray[1].selectedUnit : ''; 
        hdlUnit = this.subquestionsArray[2].selectedUnit ? this.subquestionsArray[2].selectedUnit : ''; 
        hba1cUnit = this.subquestionsArray[3].selectedUnit ? this.subquestionsArray[3].selectedUnit : ''; 
          let score2diabete = arrondirSiNecessaire(this.patientService.calculscore2diabet(cholesTotalUnit, hdlUnit, hba1cUnit)); 
          this.patientService.updateField("score2diabete", score2diabete); 
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