import { Subject } from "rxjs";

export const TimelineStream = new Subject();

export const INITIAL_STATE = {
	action: "INIT",
	history: [],
	undone: [],
	current: -1,
};

let state = INITIAL_STATE

export const Timeline = {
	init: () => TimelineStream.next(state),
	subscribe: setState => TimelineStream.subscribe(setState),

	// Add to history, remove redo futures.
	update: event => {
		state = {
			...state,
			action: event.action,
			history: [...state.history, event],
			undone: [],
			current: state.current + 1
		};
		TimelineStream.next(state);
	},

	currentEvent: () => {
		return state.history[state.current].action;
	},

	// Go back one in history, add to redo future, push to stream.
	undo: () => {
		const current = state.current;
		const last = state.history[current];

		// new state goes back in history by one, adds to the undone stack, and moves index back by one
		const newState = {
			...state,
			history: state.history.slice(0, current - 1), 
			undone: [...state.undone, last],
			current: state.current - 1,
		};

		state = newState;
		TimelineStream.next(state);
	},

	// Go forward in redo future, add to history
	redo: () => {
		const current = state.current;
		const last = state.history[current];

		const newState = {
			...state,
			history: [...state.history, last],
			undone: state.undone.slice(0, current - 1),
			current: state.current + 1,
		}
		state = newState;
		TimelineStream.next(state);
	},

	clear: () => {
		state = INITIAL_STATE;
		TimelineStream.next(state);
	},

	log: () => {
		console.log(state);
	},

	initialState: INITIAL_STATE,
}

export const intializeTimeline = (timelineStream) => {
	timelineStream.next(state)
}


export const pushToTimeline = (timelineStream) => {

}