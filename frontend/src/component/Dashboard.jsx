import React from 'react'
import { UserAuth } from '../context/AuthContext';

const Dashboard = () => {

    const {session,signOut}=UserAuth()
    const userId=session.user.id;
    console.log(userId);
    
  return (
    <div>
      <p>User id: ${userId}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
    
  )
}

export default Dashboard
