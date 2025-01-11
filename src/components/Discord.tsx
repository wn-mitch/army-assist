import React from 'react';
import { FaDiscord } from 'react-icons/fa';

const DiscordButton: React.FC = () => {
  return (
    <a
      href="https://discord.gg/hVVtGuybhw"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-indigo-600 text-white rounded p-2 font-bold hover:bg-indigo-800 flex items-center mx-4"
    >
      <FaDiscord className="h-6 w-6" />
    </a>
  );
};

export default DiscordButton;