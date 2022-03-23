import { Subject } from "rxjs";

export const TimelineStream = new Subject();

export const INITIAL_STATE = {
	events: [],
	current: 0,
};

let state = INITIAL_STATE

export const Timeline = {
	init: () => TimelineStream.next(state),
	subscribe: setState => TimelineStream.subscribe(setState),
	update: event => {
		state = {
			...state,
			events: [...state.events, event],
			current: state.current + 1
		}
		TimelineStream.next(state);
	},
	clear: () => {
		state = INITIAL_STATE;
		TimelineStream.next(state);
	},
	initialState: INITIAL_STATE,
}

export const intializeTimeline = (timelineStream) => {
	timelineStream.next(state)
}


export const pushToTimeline = (timelineStream) => {

}