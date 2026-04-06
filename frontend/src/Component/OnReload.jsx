import { useEffect } from "react";

export default function OnReload(){
    useEffect(() => {
  const isReload = sessionStorage.getItem("was_reloaded");

  if (isReload) {
    const savedColor = localStorage.getItem('bg-color');
    if (savedColor) {
      document.documentElement.style.setProperty('--bg', savedColor);
    }
  } else {
    sessionStorage.setItem("was_reloaded", true);
  }
  }, []);
}
