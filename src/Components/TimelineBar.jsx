
import { useLayoutEffect, useState } from "react";
import Streams from "../NodeEditor/streams";
import { Timeline } from "../NodeEditor/timeline";

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

const TimelineBar = (props) => {
	const [timelineState, setTimelineState] = useState(Timeline.initialState);

	// useLayoutEffect(() => {
	// 	Timeline.subscribe(setTimelineState);
	// 	Timeline.init();
	// }, [])

	return (
		<div className="flex flex-row min-h-[10%] bg-slate-600 w-max">
			{/* {timelineState.events.map(event => (
				<div>event.name</div>
			))} */}
		</div>
	)
}

export default TimelineBar;