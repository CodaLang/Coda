import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin"
import ReactRenderPlugin from "rete-react-render-plugin";
import DockPlugin from "rete-dock-plugin";
import NumComponent from "./Components/NumComponent";
import MouseClickSignal from "./Components/Signals/MouseClickSignalComponent";
import TapComponent from "./Components/TapComponent";
import AddComponent from "./Components/AddComponent";
import PlayNoteComponent from "./Components/PlayNoteComponent";
import IntervalSignal from "./Components/Signals/IntervalSignalComponent";
import WaveSignal from "./Components/Signals/WaveSignalComponent";
import { streams } from "../App";

const options = () => ({
	container: document.querySelector('.dock'),
	itemClass: 'item',
	plugins: [ReactRenderPlugin],
});

const Editor = async () => {
	const container = document.querySelector("#rete");
	console.log(container);
	const editor = new Rete.NodeEditor("coda@0.1.0", container);

	editor.use(ConnectionPlugin);
	editor.use(ReactRenderPlugin);
	editor.use(DockPlugin, options());

	const engine = new Rete.Engine("coda@0.1.0");

	const components = [
		new NumComponent(),
		new MouseClickSignal(),
		new TapComponent(streams.ConsoleStream),
		new AddComponent(),
		new PlayNoteComponent(),
		new IntervalSignal(),
		new WaveSignal(),
		new PlayNoteComponent(),
	];

	components.forEach((c) => {
		editor.register(c);
		engine.register(c);
	});

	const node1 = await components[0].createNode({num: 1});
	node1.position = [80, 200];

	editor.addNode(node1);

	editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
		await engine.abort();
		await engine.process(editor.toJSON());
	})

}

export default Editor;