import { EventEmitter } from "@angular/core";


export interface TaskComponent {
    data: any;
    progress: any;
    taskSubmitted: EventEmitter<{points:number, answer: any}>;
}
