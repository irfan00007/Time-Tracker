import { Component, OnInit } from '@angular/core';
import { TimeTrackerService } from '../timeTracker.service';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public timeTrackerService: TimeTrackerService,
    public tasksService: TasksService) { }

  ngOnInit(): void {
  }

  getTotalTime() {
    return this.tasksService.getTotalTime();
  }

}
