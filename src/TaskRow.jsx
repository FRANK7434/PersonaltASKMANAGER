 
// import React, { useEffect } from "react";

// const TaskRow = ({ task, timeLeft, onAction, onEdit, onReminder }) => {
//   useEffect(() => {
//     if (timeLeft === "Due!" && !task.completed) {
//       const reminderSound = new Audio(
//         "https://www.soundjay.com/button/beep-07.mp3"
//       );
//       reminderSound.play();
//     }
//   }, [timeLeft, task.completed]);

//   return (
//     <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg mb-2">
//       <div>
//         <h3 className="font-bold">{task.name}</h3>
//         <p className="text-sm">{timeLeft}</p>
//       </div>
//       <div className="flex space-x-2">
//         <button
//           className={`px-4 py-2 rounded ${
//             task.completed || timeLeft !== "Due!"
//               ? "bg-gray-500 cursor-not-allowed"
//               : "bg-green-500 hover:bg-green-600"
//           }`}
//           disabled={task.completed || timeLeft !== "Due!"}
//           onClick={() => onAction(task.id, "complete")}
//         >
//           Mark Complete
//         </button>
//         <button
//           className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
//           onClick={() => onReminder(task)}
//         >
//           Reminder
//         </button>
//         <button
//           className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
//           onClick={() => onAction(task.id, "delete")}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskRow;
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
  
