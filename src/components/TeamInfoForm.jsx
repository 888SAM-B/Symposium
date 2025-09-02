import React from 'react';
import { MIN_TEAM_MEMBERS, MAX_TEAM_MEMBERS } from '../constants';

const TeamInfoForm = ({
  teamName,
  memberCount,
  onTeamNameChange,
  onMemberCountChange,
  error,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Name */}
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
            placeholder="e.g., The All-Stars"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
            required
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Member Count */}
        <div>
          <label
            htmlFor="memberCount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Number of Team Members
          </label>
          <select
            id="memberCount"
            value={memberCount}
            onChange={(e) => onMemberCountChange(parseInt(e.target.value, 10))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          >
            {Array.from(
              { length: MAX_TEAM_MEMBERS - MIN_TEAM_MEMBERS + 1 },
              (_, i) => MIN_TEAM_MEMBERS + i
            ).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'member' : 'members'}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoForm;
