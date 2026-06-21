import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/toxbox.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="app-root"></div>
    </>
  );
}
