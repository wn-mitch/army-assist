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
          className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-gray-600 checked:bg-gray-600 indeterminate:border-gray-600 indeterminate:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto dark:checked:bg-gray-700 dark:border-2 dark:border-gray-200"
        />
        <svg
          fill="none"
          viewBox="0 0 14 14"
          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
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