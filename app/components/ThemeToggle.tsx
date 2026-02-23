"use client";

import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

const OPTIONS: Array<{
  value: "light" | "dark";
  label: string;
  icon: ReactNode;
}> = [
  {
    value: "light",
    label: "Tema claro",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 3v2.25M12 18.75V21M4.5 12H6.75M17.25 12h2.25M6.697 6.697l1.591 1.591M15.712 15.712l1.591 1.591M6.697 17.303l1.591-1.591M15.712 8.288l1.591-1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Tema escuro",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M21 12.79A9 9 0 1111.21 3c-.02.3-.03.61-.03.92A8.87 8.87 0 0021 12.79z"
        />
      </svg>
    ),
  },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const activeTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
      {OPTIONS.map((option) => {
        const isActive = option.value === activeTheme;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`rounded-md p-2 transition-colors ${
              isActive
                ? "bg-accent text-background"
                : "text-text-secondary hover:bg-surface-light hover:text-foreground"
            }`}
            aria-pressed={isActive}
            aria-label={option.label}
            title={option.label}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}
