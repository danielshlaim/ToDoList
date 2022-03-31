import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface Task {
  name:string;
  isUpdated:boolean;
  isVisible:boolean;
}



enum SortOptions{
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none'
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  tasks: Task [] = [];

  readonly TASKS_KEY = 'tasks';

  sortEnum = SortOptions;
  sort:SortOptions = SortOptions.NONE;

  constructor() {
   }

  ngOnInit(): void {
    let saveTasksJson = localStorage.getItem(this.TASKS_KEY)
    if(saveTasksJson != null){
      this.tasks = JSON.parse(saveTasksJson);
    }
  }

  handleSubmit(addForm:NgForm){
    let newTask = {name: addForm.value.task, isUpdated : false,isVisible:true};
    this.tasks.push(newTask); 
    addForm.resetForm();
  }
  handleRemove(t:string){
    this.tasks = this.tasks.filter((myTask:Task) => myTask.name != t);
  }
  handleUpdate(t:Task){
    t.isUpdated = true;
  }
  handleFinishUpdate(oldTaskName:string,newTaskName:string){
    // pulling task from array into new var
    let updatedTask:Task = this.tasks.filter((t) => t.name === oldTaskName )[0]; 
    // change task name
    updatedTask.name = newTaskName;
    //removing task from edit 
    updatedTask.isUpdated = false;
  }
  handleSort(sortDirection:SortOptions){
    if(sortDirection == this.sort){
      this.sort = SortOptions.NONE;
      return;
    }
    
    //save the current sort status
    this.sort = sortDirection; 
    

    switch (sortDirection) {
      case SortOptions.ASC:
        this.tasks = this.tasks.sort((a,b) => {
          let aLower = a.name.toLowerCase();
          let bLower = b.name.toLowerCase();

          if(aLower < bLower){
            return -1;
          }
          if(aLower > bLower){
            return 1;
          }
          return 0;
        })
        break;
        case SortOptions.DESC:
          this.tasks = this.tasks.sort((a,b) => {
            let aLower = a.name.toLowerCase();
            let bLower = b.name.toLowerCase();
  
            if(aLower < bLower){
              return 1;
            }
            if(aLower > bLower){
              return -1;
            }
            return 0;
          })
          break;
      case SortOptions.NONE:
      default:
        break;
    }

  }

  handleSearch(v:string){
    this.tasks.map((task) => {
      task.isVisible = (task.name.includes(v));
    });
  }

  handleSave() : void{
    localStorage.setItem(this.TASKS_KEY,JSON.stringify(this.tasks))
  }
}
