import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dash from './Dash';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dash/*" element={<Dash />} />
      </Routes>
    </div>
  );
}

export default App;
