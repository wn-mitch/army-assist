import React from 'react';
import { FaPatreon } from 'react-icons/fa';

const PatreonButton: React.FC = () => {
  return (
    <a
      href="https://patreon.com/ListAssist"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-red-600 text-white rounded p-2 font-bold hover:bg-red-800 flex items-center mx-4"
    >
      <FaPatreon className="h-6 w-6 " />
    </a>
  );
};

export default PatreonButton;