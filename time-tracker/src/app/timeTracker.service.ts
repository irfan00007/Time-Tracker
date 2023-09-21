import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {

  timer;
  seconds: number = 0;
  currentTimeTracked = this.timeTrackedFormatter(this.seconds, false);

  timerStop() {
    clearInterval(this.timer);
    this.seconds = 0;
    this.currentTimeTracked = this.timeTrackedFormatter(this.seconds, false);
  }

  timeTrackedFormatter(seconds, isTotal) {
    let minutes = 0;
    let hours = 0;
    while (seconds >= 3600) {
      seconds -= 3600;
      hours++;
    }
    while (seconds >= 60) {
      seconds -= 60;
      minutes++;
    }
    if (isTotal) {
      return ((hours < 10) ? "" + hours : hours) + "hr " + ((minutes < 10) ? "" + minutes : minutes) + "min " + ((seconds < 10) ? "" + seconds : seconds) + "sec";
    } else {
      return ((hours < 10) ? "0" + hours : hours) + ":" + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
    }
  }

}
