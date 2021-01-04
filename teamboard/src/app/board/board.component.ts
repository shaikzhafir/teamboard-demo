import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormArray} from '@angular/forms';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})


export class BoardComponent implements OnInit {
  boardForm: any;
  boardData : {
    todo : [],
    doing : [],
    done : []
  }

  constructor(private fb : FormBuilder) {
    this.boardForm = this.fb.group({
      todo : this.fb.array([
       
      ]),
  
      doing : this.fb.array([
        
      ]),
  
      done : this.fb.array([
        
      ])
  
    })
   }

  ngOnInit(): void {
    
      
    
    
    if (localStorage.getItem('board')){
      const storedBoard = JSON.parse(localStorage.getItem('board'));
      console.log(storedBoard);
      for (const boardType in storedBoard){
        switch(boardType){
          case "todo":
            storedBoard[boardType].forEach(job => {
              this.todo.push(this.fb.group({job : this.fb.control(job.job)}))  
            });
            
            break;
          case "doing":
            storedBoard[boardType].forEach(job => {
              this.doing.push(this.fb.group({job : this.fb.control(job.job)}))  
            });
            break;
          case "done":
            storedBoard[boardType].forEach(job => {
              this.done.push(this.fb.group({job : this.fb.control(job.job)}))  
            });
            break;
          default:
            break;
        }
      }
      
      

      
    }

    else {
      this.boardData = {
        todo : [],
        doing : [],
        done : []
      }
    }

  


  }

  

  get todo(){
    return this.boardForm.get('todo') as FormArray
  }

  get doing(){
    return this.boardForm.get('doing') as FormArray
  }
  get done(){
    return this.boardForm.get('done') as FormArray
  }

  onSubmit(){

    /* for (const boardType in this.boardForm.value){
      this.boardData[boardType] = this.boardForm.value[boardType]
    } */

    //console.log(this.boardData);

    localStorage.setItem('board', JSON.stringify(this.boardForm.value));
    console.log(JSON.parse(localStorage.getItem('board')));
    
    
  }

  deleteControl(boardType:String,index:number){
    
    
    switch(boardType){
      case "todo":
        this.todo.removeAt(index)
        break;
      case "doing":
        this.doing.removeAt(index)
        break;
      case "done":
        this.done.removeAt(index)
        break;
      default:
        break;
    }
    
  }

  addJob(jobType : String){
    switch(jobType){
      case "todo":
        this.todo.push( this.fb.group({
          job : this.fb.control('')
        }))
        break;
      case "doing":
        this.doing.push( this.fb.group({
          job : this.fb.control('')
        }))
        break;
      case "done":
        this.done.push( this.fb.group({
          job : this.fb.control('')
        }))
        break;
      default:
        break;
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    //update index of formgroup?
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      
    }


  }






}
