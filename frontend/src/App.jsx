import React, { useState, useEffect } from 'react';
import Manager from './routes/Manager';
import Navbar from './component/Navbar';
import Signin from './component/Signin';
import { UserAuth } from "./context/AuthContext";

import { Link } from "react-router-dom";

function App() {
  const { user } = UserAuth();

  return (
    <div className='bg'>
        <Signin/>
        
    </div>
  );
}

export default App;
