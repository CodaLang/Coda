import { BehaviorSubject } from "rxjs";
import { TimelineStream } from "./timeline";

const Streams = {
	ConsoleStream : new BehaviorSubject(""),
	TimelineStream : TimelineStream,
}

export default Streams;