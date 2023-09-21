import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { Tasks } from '../tracks.model';
import { TimeTrackerService } from '../timeTracker.service';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-track-time',
  templateUrl: './track-time.component.html',
  styleUrls: ['./track-time.component.css']
})
export class TrackTimeComponent implements OnInit {

  subscription: Subscription;
  id: number;
  tasks: Tasks[];

  display: boolean = false;

  taskExist: boolean = false;

  taskForm: FormGroup;

  timer;

  constructor(public timeTrackerService: TimeTrackerService,
    public tasksService: TasksService, private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.subscription = this.tasksService.tasksChanged
      .subscribe(
        (tasks: Tasks[]) => {
          this.tasks = tasks;
        }
      )
    this.tasks = this.tasksService.getTasks();
  }

  onStartTimer(taskName) {
    for (let task of this.tasks) {
      if (task.taskName === taskName) {
        let seconds = 0;
        task.isTaskActive = true;
        task.taskStartedTime = new Date();
        this.timer = setInterval(() => {
          if (task.isTaskActive) {
            seconds++;
            task.timer = this.timeTrackerService.timeTrackedFormatter(seconds, false);
          } else {
            clearInterval(this.timer);
            task.timer = this.timeTrackerService.timeTrackedFormatter(0, false);
          }
        }, 1000);
      }
    }
  }

  onStopTimer(taskName) {
    for (let task of this.tasks) {
      if (task.taskName === taskName) {
        task.isTaskActive = false;
        this.tasksService.startTask(taskName, task.taskStartedTime);
        clearInterval(this.timer);
        task.timer = this.timeTrackerService.timeTrackedFormatter(0, false);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
    this.taskForm = new FormGroup({
      'taskName': new FormControl(''),
    });
  }

  saveTask() {
    if (this.tasks.some(task => task.taskName === this.taskForm.value.taskName)) {
      this.taskExist = true;
      return;
    } else {
      this.taskExist = false;
    }
    if (this.taskForm.valid) {
      this.tasksService.newTask(this.taskForm.value.taskName);
      this.tasks = this.tasksService.getTasks();
      this.taskForm = new FormGroup({
        'taskName': new FormControl(''),
      });
      this.display = false;
    }
  }

  deleteTask(taskName) {
    this.tasks.forEach((task, index) => {
      if (task.taskName === taskName) {
        this.tasksService.deleteTask(index);
      }
    });
  }
}
