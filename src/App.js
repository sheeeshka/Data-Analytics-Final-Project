import logo from './logo.svg';
import './App.css';
import { LineGraph } from './charts/Line'
import { BarGraph } from './charts/Bar'
import { PieGraph } from './charts/Pie'
import { PolarAreaGraph } from './charts/PolarArea'
import { RadarGraph } from './charts/Radar'

function App() {
  return (
    <>
      <div className="App">
        Data Analytics Project
      </div>
      <LineGraph />
    </>
  );
}

export default App;
