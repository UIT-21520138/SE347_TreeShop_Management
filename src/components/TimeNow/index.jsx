import { useEffect, useState } from "react";
import moment from "moment";

function TimeNow({ className }) {
  const [dt, setDt] = useState(null); 

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date()); 
    }, 1000);

    return () => clearInterval(secTimer); 
  }, []);

  if (!dt) return null; 

  return (
    <div className={className || "py-1 text-sm sm:text-base md:text-lg"}>
      {moment(dt).format("HH:mm:ss DD/MM/YYYY")}
    </div>
  );
}

export default TimeNow;
