import React from "react";
import DateTime from "./DateTime";
import TaskManager from "./TaskManager";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>
      <DateTime />
      <TaskManager />
    </div>
  );
};

export default App;
