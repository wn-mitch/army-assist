import React from "react";

const SettingsOption: React.FC<{
  label: string;
  id: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}> = ({ label, id, checked, onChange, className }) => (
  <label className={`relative flex gap-3 cursor-pointer ${className}`}>
    <div className="min-w-0 flex-1 text-sm/6">
      <span className="select-none">{label}</span>
    </div>
    <div className="flex h-6 shrink-0 items-center">
      <div className="group grid size-4 grid-cols-1">
        <input
          checked={checked}
          onChange={onChange}
          id={id}
          type="checkbox"
          className="col-start-1 row-start-1 appearance-none rounded border border-border bg-panel checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:border-border disabled:bg-panel disabled:checked:bg-panel forced-colors:appearance-auto dark:border-2"
        />
        <svg
          fill="none"
          viewBox="0 0 14 14"
          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-accent-foreground group-has-[:disabled]:stroke-text-dim"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-has-[:checked]:opacity-100"
          />
          <path
            d="M3 7H11"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-has-[:indeterminate]:opacity-100"
          />
        </svg>
      </div>
    </div>
  </label>
);

export default SettingsOption;