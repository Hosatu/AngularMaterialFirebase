import { EventEmitter } from "@angular/core";


export interface TaskComponent {
    data: any;
    taskSubmitted: EventEmitter<boolean>;
}
