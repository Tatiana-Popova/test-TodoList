import React from 'react';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="d-flex bg-light justify-content-center align-items-center" style={{height: "100vh"}}>
      <div className="d-flex flex-column">
      <h2 className="display-3 text-info">todos</h2> 
        <TaskList/>
      </div>
  </div> 
  )
}

export default App;
