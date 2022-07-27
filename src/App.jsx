import React from 'react';
import './App.css';
import BarChart from './components/BarChart';
import { mockData } from './mockData';


function App() {
  return (
    <div className="App">
      <BarChart data={mockData}/>
    </div>
  );
}

export default App;
