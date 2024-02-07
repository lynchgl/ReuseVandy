import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Todo from './components/Todo';
import MarketplaceListing from './components/Marketplace';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/todo" element={<Todo />} />
        <Route path="/marketplace" element={<MarketplaceListing />} />
      </Routes>
    </div>
  );
}

export default App;
