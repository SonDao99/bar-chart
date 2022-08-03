import React from 'react';
import './App.css';
import BarChart from './components/BarChart';
import { mockData } from './mockData';
import { mockData2 } from './mockData2';

function App() {
  return (
    <div className="App">
      <BarChart data={mockData}/>
    </div>
  );
}

export default App;
