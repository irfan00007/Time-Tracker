import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { TimeTrackerService } from "./timeTracker.service";
import { Task, Tasks } from "./tracks.model";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private timeTrackerService: TimeTrackerService) { };
  tasksChanged = new Subject<Tasks[]>();
  private tasks: Tasks[] = [];

  setTasks(tasks: Tasks[]) {
    this.tasks = tasks;
    this.tasksChanged.next(this.tasks.slice());
  }

  newTask(taskName) {
    let task = {
      taskName: taskName,
      isTaskActive: false,
      timer: this.timeTrackerService.timeTrackedFormatter(0, false),
      taskStartedTime: new Date(),
      taskList: []
    }
    this.tasks.push(task);
  }

  startTask(
    taskName,
    startTime
  ) {
    for (let task of this.tasks) {
      if (task.taskName === taskName) {
        let newTask: Task = {
          startTime: startTime.toLocaleTimeString(),
          endTime: new Date().toLocaleTimeString(),
          seconds: this.timeTrackerService.seconds,
          totalTime: this.timeTrackerService.timeTrackedFormatter(Math.round((new Date().getTime() - startTime.getTime()) / 1000), false),
        }
        task.taskList.push(newTask);
      }
    }
  }

  getTasks() {
    return this.tasks.slice();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.tasksChanged.next(this.tasks.slice());
  }

  getTodaysDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  }

  getTotalTime() {
    let totalTime = 0;
    for (let task of this.tasks) {
      if (task.taskList.length > 0) {
        for (let history of task.taskList) {
          totalTime = totalTime + (Math.round((new Date('1970-01-01 ' + history.endTime).getTime() - new Date('1970-01-01 ' + history.startTime).getTime()) / 1000));
        }
      }
    }
    return this.timeTrackerService.timeTrackedFormatter(totalTime, true)
  }

}
