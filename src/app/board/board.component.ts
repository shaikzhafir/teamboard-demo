import { Component, Inject, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import {
  moveItemInFormArray,
  transferItemInFormArray,
} from './move-item-helper';

import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { boardSwitchy } from './helper';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  faTimesCircle = faTimesCircle;
  boardForm: any;
  boardString: string;
  jobDetails: string;
  jobOwner: string;
  jobBoard: string;
  testing: string;

  boardData: {
    todo: [];
    doing: [];
    done: [];
  };
  currentFormArray: FormArray;
  previousFormArray: FormArray;
  dragging: boolean;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.boardForm = this.fb.group({
      todo: this.fb.array([]),

      doing: this.fb.array([]),

      done: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('board')) {
      const storedBoard = JSON.parse(localStorage.getItem('board'));
      console.log(storedBoard);
      for (const boardType in storedBoard) {
        switch (boardType) {
          case 'todo':
            storedBoard[boardType].forEach((job) => {
              this.todo.push(
                this.fb.group({
                  jobDetails: this.fb.control(job.jobDetails),
                  jobBoard: this.fb.control(boardType),
                  jobOwner : this.fb.control(job.jobOwner)
                })
              );
            });

            break;
          case 'doing':
            storedBoard[boardType].forEach((job) => {
              this.doing.push(
                this.fb.group({ 
                  jobDetails: this.fb.control(job.jobDetails),
                  jobBoard: this.fb.control(boardType),
                  jobOwner : this.fb.control(job.jobOwner) 
                })
              );
            });
            break;
          case 'done':
            storedBoard[boardType].forEach((job) => {
              this.done.push(
                this.fb.group({ 
                  jobDetails: this.fb.control(job.jobDetails), 
                  jobBoard: this.fb.control(boardType),
                  jobOwner : this.fb.control(job.jobOwner)
                })
              );
            });
            break;
          default:
            break;
        }
      }
      console.log(storedBoard);
    } else {
      this.boardData = {
        todo: [],
        doing: [],
        done: [],
      };
    }
  }

  handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  handleClick(event: MouseEvent, item, index, boardType): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }

    this.openDialog(item, index, boardType);
  }

  openDialog(item, index, boardType) {
    console.log(item);
    this.jobOwner = item.value.jobOwner;
    this.jobDetails = item.value.jobDetails;
    this.jobBoard = boardType;
    const dialogRef = this.dialog.open(DialogItem, {
      width: '500px',
      data: {
        jobDetails: this.jobDetails,
        jobBoard: this.jobBoard,
        jobOwner: this.jobOwner,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        item.setValue(
          { jobDetails: result.value.jobDetails, 
            jobOwner: result.value.jobOwner,
            jobBoard : boardType });

        //array.push({owner : result.jobOwner})
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  //can just use this.todo to call
  get todo() {
    return this.boardForm.get('todo') as FormArray;
  }

  get doing() {
    return this.boardForm.get('doing') as FormArray;
  }
  get done() {
    return this.boardForm.get('done') as FormArray;
  }

  onSubmit() {
    /* for (const boardType in this.boardForm.value){
      this.boardData[boardType] = this.boardForm.value[boardType]
    } */
    //console.log(this.boardData);
    this.boardString = JSON.stringify(this.boardForm.value);
    localStorage.setItem('board', JSON.stringify(this.boardForm.value));
    console.log(JSON.parse(localStorage.getItem('board')));
  }

  deleteControl(boardType: String, index: number) {
    switch (boardType) {
      case 'todo':
        this.todo.removeAt(index);
        break;
      case 'doing':
        this.doing.removeAt(index);
        break;
      case 'done':
        this.done.removeAt(index);
        break;
      default:
        break;
    }
  }

  addJob(jobType: String) {
    switch (jobType) {
      case 'todo':
        this.todo.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard : this.fb.control(jobType),
            jobOwner : this.fb.control('')

          })
        );
        break;
      case 'doing':
        this.doing.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard : this.fb.control(jobType),
            jobOwner : this.fb.control('')
          })
        );
        break;
      case 'done':
        this.done.push(
          this.fb.group({
            jobDetails: this.fb.control(''),
            jobBoard : this.fb.control(jobType),
            jobOwner : this.fb.control('')
          })
        );
        break;
      default:
        break;
    }
  }

  editJob(boardType: String, index: number) {}

  drop(event: CdkDragDrop<string[]>) {
    console.log(event.container.data);
    //update index of formgroup?

    //find the current event container array
    let currentBoard = event.container.id;
    switch (currentBoard) {
      case 'todo':
        this.currentFormArray = this.todo;
        break;
      case 'doing':
        this.currentFormArray = this.doing;
        break;
      case 'done':
        this.currentFormArray = this.done;
        break;
      default:
        break;
    }

    if (event.previousContainer === event.container) {
      moveItemInFormArray(
        this.currentFormArray,
        event.previousIndex,
        event.currentIndex
      );
      console.log(this.boardForm);
    } else {
      let previousBoard = event.previousContainer.id;
      switch (previousBoard) {
        case 'todo':
          this.previousFormArray = this.todo;
          break;
        case 'doing':
          this.previousFormArray = this.doing;
          break;
        case 'done':
          this.previousFormArray = this.done;
          break;
        default:
          break;
      }

      switch (currentBoard) {
        case 'todo':
          this.currentFormArray = this.todo;
          break;
        case 'doing':
          this.currentFormArray = this.doing;
          break;
        case 'done':
          this.currentFormArray = this.done;
          break;
        default:
          break;
      }

      transferItemInFormArray(
        this.previousFormArray,
        this.currentFormArray,
        event.previousIndex,
        event.currentIndex
      );

      console.log(this.boardForm);

      //remove formgroup from previous board at previousIndex

      //add formgroup to current board at the currentIndex
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./board.component.scss'],
})
export class DialogItem {
  dialogForm : FormGroup
  constructor(
    public dialogRef: MatDialogRef<DialogItem>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.dialogForm = this.fb.group({
      jobDetails : [data.jobDetails,Validators.required],
      jobBoard : [{value : data.jobBoard, disabled : true},Validators.required],
      jobOwner : [data.jobOwner,Validators.required]
    })

  }

  
  save(){
    if (this.dialogForm.valid){
      console.log(this.dialogForm);
      this.dialogRef.close(this.dialogForm);
    }

    else {
      alert(this.dialogForm.valid)
    }
  }

  onNoClick(): void {
    console.log(this.dialogRef);

    this.dialogRef.close();
  }
}
