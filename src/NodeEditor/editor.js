import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin"
import ReactRenderPlugin from "rete-react-render-plugin";
import DockPlugin from "rete-dock-plugin";
import ContextMenuPlugin, {Menu, Item, Search} from "rete-context-menu-plugin";
import NumComponent from "./Components/NumComponent";
import MouseClickSignal from "./Components/Signals/MouseClickSignalComponent";
import TapComponent from "./Components/TapComponent";
import AddComponent from "./Components/AddComponent";
import PlayNoteComponent from "./Components/PlayNoteComponent";
import IntervalSignal from "./Components/Signals/IntervalSignalComponent";
import WaveSignal from "./Components/Signals/WaveSignalComponent";
import OscillateNoteComponent from "./Components/OscillateNoteComponent";
import { streams } from "../App";
import StringComponent from "./Components/StringComponent";
import GreaterThan from "./Components/Operators/GreaterThan";
import { filter, fromEvent } from "rxjs";
import SynthesizerComponent from "./Components/SynthesizerComponent";
import AudioDestinationComponent from "./Components/AudioDestinationComponent";
import AudioFilterComponent from "./Components/AudioFilterComponent";
import * as Tone from "tone";

const options = () => ({
	container: document.querySelector('.dock'),
	itemClass: 'item',
	plugins: [ReactRenderPlugin],
});

const Editor = async () => {
	const container = document.querySelector("#rete");
	// console.log(container);
	const editor = new Rete.NodeEditor("coda@0.1.0", container);

	editor.use(ConnectionPlugin);
	editor.use(ReactRenderPlugin);
	editor.use(DockPlugin, options());
	editor.use(ContextMenuPlugin, {
		searchBar: false,
		nodeItems: {
			'Delete': true
		}
	})

	const engine = new Rete.Engine("coda@0.1.0");

	const components = [
		new NumComponent(),
		new StringComponent(),
		new MouseClickSignal(),
		new IntervalSignal(),
		new WaveSignal(),
		new PlayNoteComponent(),
		new OscillateNoteComponent(),
		new TapComponent(streams.ConsoleStream),
		new AddComponent(),
		new GreaterThan(),
		new AudioFilterComponent(),
		new SynthesizerComponent(),
		new AudioDestinationComponent(),
	];

	components.forEach((c) => {
		editor.register(c);
		engine.register(c);
	});

	// const node1 = await components[0].createNode({num: 1});
	// node1.position = [80, 200];

	// editor.addNode(node1);

	fromEvent(document, "keydown").subscribe(e => {
		if (e.ctrlKey && e.key === "s" && e.altKey){
			console.log("Loading quicksave");
			const editorJSON = JSON.parse(localStorage.getItem("quickSave"));
			editor.clear();
			editor.fromJSON(editorJSON);
			console.log(editorJSON);
		}
		else if (e.ctrlKey && e.key === "s"){
			e.preventDefault();
			console.log("Quick saving program");
			localStorage.setItem("quickSave", JSON.stringify(editor.toJSON()));
		}
	})

	let started = false;
	document.querySelector("button").addEventListener("click", async () => {
		if (!started){
			started = true
			await Tone.start();
			console.log("context started");
		}
	});


	editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
		await engine.abort();
		await engine.process(editor.toJSON());
	})

}

export default Editor;