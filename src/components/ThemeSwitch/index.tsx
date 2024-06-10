import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
//Importing icon
import { HiSun, HiMoon } from "react-icons/hi";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function switchTheme(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    theme === "dark" ? setTheme("light") : setTheme("dark");
  }

  return (
    <button
      className="rounded-full p-1.5 bg-gray-300 dark:bg-gray-500"
      title="Switch Theme"
      onClick={switchTheme}
    >
      <div className="rounded-full p-2 shadow-lg bg-gray-800 dark:bg-gray-200">
        {resolvedTheme === "dark" ? (
          <HiMoon className="h-5 w-5 text-black" />
        ) : (
          <HiSun className="h-5 w-5 text-white" />
        )}
      </div>
    </button>
  );
}
