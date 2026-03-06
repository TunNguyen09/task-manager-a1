import { useState } from 'react'
import AddTask from './Component/AddTask';
import './App.css'

function AddApp() {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };
  
  return (
    <>
      <AddTask />

    </>
  )
}

export default AddApp