 
import React, { useState, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";

const TaskRow = ({ task, onAction, onEdit, onReminder }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const alarmSound = new Audio("https://www.soundjay.com/button/beep-07.mp3");

    const updateCountdown = () => {
      const now = new Date();
      const dueDateTime = new Date(task.dueDateTime);
      const diffInMs = dueDateTime - now;

      if (diffInMs <= 0) {
        setTimeLeft(
          `Due! (Was due on ${format(dueDateTime, "yyyy-MM-dd HH:mm")})`
        );
      } else {
        setTimeLeft(
          formatDistanceToNow(dueDateTime, { addSuffix: true }) +
          ` (${format(dueDateTime, "yyyy-MM-dd HH:mm")})`
        );
      }

      // Trigger alarm 5 minutes before due time
      if (diffInMs <= 5 * 60 * 1000 && diffInMs > 4 * 60 * 1000) {
        alarmSound.play();
      }
    };

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [task.dueDateTime]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg mb-2">
      <div>
        <h3 className="font-bold">{task.name}</h3>
        <p className="text-sm">{timeLeft}</p>
      </div>
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded ${
            task.completed
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 animate-pulse hover:bg-blue-600"
          }`}
          disabled={task.completed}
          onClick={() => onAction(task.id, "complete")}
        >
          Mark Complete
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          onClick={() => onReminder(task)}
        >
          Edit Reminder
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          onClick={() => onEdit(task.id)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          onClick={() => onAction(task.id, "delete")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", dueDate: "", dueTime: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.name || !newTask.dueDate || !newTask.dueTime) return;

    if (isEditing) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                name: newTask.name,
                dueDateTime: new Date(
                  `${newTask.dueDate}T${newTask.dueTime}`
                ).getTime(),
              }
            : task
        )
      );
      setIsEditing(false);
      setEditingTaskId(null);
    } else {
      setTasks([
        ...tasks,
        {
          ...newTask,
          id: Date.now(),
          completed: false,
          dueDateTime: new Date(
            `${newTask.dueDate}T${newTask.dueTime}`
          ).getTime(),
        },
      ]);
    }
    setNewTask({ name: "", dueDate: "", dueTime: "" });
  };

  const handleAction = (id, action) => {
    if (action === "delete") {
      setTasks(tasks.filter((task) => task.id !== id));
    } else if (action === "complete") {
      const completedAt = new Date();
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: true, completedAt } : task
        )
      );
    }
  };

  const handleEdit = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setNewTask({
      name: taskToEdit.name,
      dueDate: new Date(taskToEdit.dueDateTime).toISOString().split("T")[0],
      dueTime: new Date(taskToEdit.dueDateTime).toISOString().split("T")[1]
        .slice(0, 5),
    });
    setIsEditing(true);
    setEditingTaskId(id);
  };

  const handleReminder = (task) => {
    const newTime = prompt(
      "Enter new due time (YYYY-MM-DDTHH:mm):",
      `${new Date(task.dueDateTime).toISOString().slice(0, 16)}`
    );

    if (newTime) {
      setTasks(
        tasks.map((t) =>
          t.id === task.id
            ? { ...t, dueDateTime: new Date(newTime).getTime() }
            : t
        )
      );
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task Name"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          type="date"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <input
          type="time"
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          value={newTask.dueTime}
          onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
        />
        <button
          onClick={handleAddTask}
          className={`${
            isEditing
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } px-4 py-2 rounded`}
        >
          {isEditing ? "Save Changes" : "Add Task"}
        </button>
      </div>

      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onAction={handleAction}
          onEdit={handleEdit}
          onReminder={handleReminder}
        />
      ))}
    </div>
  );
};

export default TaskManager;

