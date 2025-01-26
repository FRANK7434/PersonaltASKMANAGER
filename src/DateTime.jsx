import React, { useState, useEffect } from "react";

const DateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-4 bg-gray-800 text-white rounded">
      <h3 className="text-lg font-semibold">Current Date and Time</h3>
      <p>{currentTime.toLocaleDateString()}</p>
      <p>{currentTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default DateTime;
