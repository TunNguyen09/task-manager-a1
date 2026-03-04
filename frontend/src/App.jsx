import { useState } from 'react'
import DisplayTasks from './Component/DisplayTasks';
import CheckTime from './Component/CheckTime'
import './App.css'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };
  
  return (
    <>
      <DisplayTasks refreshTrigger={refreshTrigger}/>

    </>
  )
}

export default App
