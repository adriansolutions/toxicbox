import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // LOAD YOUR EXACT SCRIPT
    const script = document.createElement("script");
    script.src = "/toxbox.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* YOUR EXACT HTML GOES HERE */}
      <div
        dangerouslySetInnerHTML={{
          __html: require("fs").readFileSync(
            process.cwd() + "/public/index.html",
            "utf8"
          ),
        }}
      />
    </>
  );
}
