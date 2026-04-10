import io from 'socket.io-client';
import { useEffect } from 'react';

const socket = io.connect("http://localhost:8080");
export default function Socket() {
  useEffect(() => {
    socket.on("set_mode_cl", (color) => {
      document.documentElement.style.setProperty('--bg', color);
      localStorage.setItem("bg-color", color);
    });

    return () => {
      socket.off("set_mode_cl");
    }
  }, []);

  const setMode = (color) => {
    localStorage.setItem("bg-color", color);
    socket.emit("set_mode", color);
  };

  return (
    <div>
      <button className='mode' onClick={() => setMode("#0b1220")}>🌙</button>
      <button className='mode' onClick={() => setMode("#2e4472")}>☀️</button>
    </div>
  );
}
