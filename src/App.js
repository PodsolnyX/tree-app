import './App.css';
import Tree from "./components/tree/tree";
import {DATA} from "./tree-data";

function App() {

    return (
        <div className="app-container">
            <Tree data={DATA}/>
        </div>
    );
}

export default App;
