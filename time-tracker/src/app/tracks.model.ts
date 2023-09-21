export class Tasks {
  taskName: string;
  isTaskActive: boolean;
  timer: any;
  taskStartedTime: any;
  taskList: Task[]
}

export class Task {
  startTime: any;
  endTime: string;
  seconds: number;
  totalTime: string;
}
