import React from 'react';
import { MORNING_EVENTS, EVENING_EVENTS } from '../constants';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const allEvents = [...MORNING_EVENTS, ...EVENING_EVENTS];

const getEventName = (eventId) => {
  if (!eventId) return 'N/A';
  return allEvents.find((e) => e.id === eventId)?.name || 'Unknown Event';
};

const SubmissionSummary = ({ teamName, participants, teamMotto, eventRegistrations }) => {
  const participantEventsMap = {};
  participants.forEach((p) => {
    participantEventsMap[p.id] = { morning: null, evening: null };
  });

  const morningEventIds = new Set(MORNING_EVENTS.map((e) => e.id));
  for (const eventId in eventRegistrations) {
    const isMorning = morningEventIds.has(eventId);
    eventRegistrations[eventId].forEach((pId) => {
      if (participantEventsMap[pId]) {
        if (isMorning) {
          participantEventsMap[pId].morning = getEventName(eventId);
        } else {
          participantEventsMap[pId].evening = getEventName(eventId);
        }
      }
    });
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 text-center">
      <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-3xl font-extrabold text-gray-900">Registration Successful!</h2>
      <p className="mt-2 text-lg text-gray-600">Your team is ready to compete. Good luck!</p>

      <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700">Team: {teamName}</h3>
        {teamMotto ? (
          <p className="mt-2 text-md text-gray-800 italic">
            <strong>Team Motto:</strong> "{teamMotto}"
          </p>
        ) : (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
            <span className="text-gray-600">Generating your unique team motto...</span>
          </div>
        )}
      </div>

      <div className="mt-6 text-left">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Participant Roster:</h4>
        <div className="space-y-4">
          {participants.map((p, index) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <p className="font-semibold text-gray-900">
                {index + 1}. {p.name}{' '}
                <span className="font-normal text-gray-500">
                  ({p.registrationNumber})
                </span>
              </p>
              <div className="mt-2 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <strong>Morning Event:</strong>{' '}
                  {participantEventsMap[p.id]?.morning || 'N/A'}
                </div>
                <div>
                  <strong>Evening Event:</strong>{' '}
                  {participantEventsMap[p.id]?.evening || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;
