import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import { StateProvider } from './context/GlobalState';

function App() {
  return (
    <div className="App">
      <StateProvider>
        <Dashboard />
      </StateProvider>
    </div>
  );
}

export default App;
