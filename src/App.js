import './App.css';
import ProjectBar from './Components/ProjectBar';

function App() {
  return (
    <div className="App">
      <div id="layout">
        <ProjectBar/>
        <div id="rete" className="h-screen"/>
        <div className="dock"/>
      </div>
    </div>
  );
}

export default App;
