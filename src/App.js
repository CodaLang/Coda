import './App.css';
import ProjectBar from './Components/ProjectBar';
import EditorConsole from  "./Components/EditorConsole";
import { BehaviorSubject } from 'rxjs';
import { TimelineStream } from './NodeEditor/timeline';
import TimelineBar from './Components/TimelineBar';

export const streams = {
	ConsoleStream : new BehaviorSubject(""),
	TimelineStream : TimelineStream,
}

function App() {
  return (
    <div className="App">
      <div id="layout">
        <ProjectBar/>
        <div id="rete" className="h-screen"/>
        <EditorConsole ConsoleStream={streams.ConsoleStream}/>
        <div className="dock"/>
      </div>
    </div>
  );
}

export default App;
