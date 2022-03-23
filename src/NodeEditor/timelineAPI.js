
import { filter, fromEvent, Subject } from "rxjs";


export const TimelineInputStream = new Subject();
export const TimelineOutputStream = new Subject();

const undo = [];
let redo = [];

TimelineInputStream.subscribe((event) => {
	redo = []; //new events are the newest in the timeline, there will be nothing to redo
	undo.push(event);
});


export const undoTimeline = () => {
	if (undo.length === 0) return;

	const present = undo.pop();
	redo.push(present);

	TimelineOutputStream.next(present);
	console.log("Timeline undone");
};

export const redoTimeline = () => {
	if (redo.length === 0) return;

	const present = redo.pop();
	undo.push(present);

	TimelineOutputStream.next(present);
	console.log("Timeline redone");
};

export const logTimeline = () => {
	console.log(undo);
	console.log(redo);
}


fromEvent(document, "keydown").subscribe(event => {
	if(event.key === "ArrowLeft"){
		undoTimeline();
	}
	else if (event.key === "ArrowRight"){
		redoTimeline();
	}
});

