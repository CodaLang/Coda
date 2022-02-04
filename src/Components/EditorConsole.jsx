import { useEffect, useState } from "react";

const EditorConsole = (props) => {
	const [consoleText, setConsole] = useState("");

	useEffect(() => {
		const subscription = props.ConsoleStream.subscribe((newLog) => {
			setConsole(consoleText + "\n" + newLog);
		})
		return () => {
			subscription.unsubscribe();
		}
	}, []);

	return (
		<div className="absolute right-3 bottom-5 w-1/4 h-1/2 bg-gray-800 opacity-50 rounded-lg">
			<div className="break-words text-white px-3 my-2 font-mono">{consoleText}</div>
		</div>
	)
}

export default EditorConsole;