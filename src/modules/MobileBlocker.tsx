import { useEffect, useState } from "react";

export const MobileBlocker = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsVisible(true);
      } else setIsVisible(false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed z-[1000] w-screen h-screen backdrop-blur-lg text-lg text-content-accent px-10 grid place-items-center text-center font-medium">
      Char typer is currently not available on screens narrower then 640px
    </div>
  );
};
