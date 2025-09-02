
import type { EventOption } from './types';

export const MIN_TEAM_MEMBERS = 1;
export const MAX_TEAM_MEMBERS = 10;
export const PARTICIPANTS_PER_EVENT_LIMIT = 2;

export const MORNING_EVENTS: EventOption[] = [
    { id: 'm1', name: '100m Sprint' },
    { id: 'm2', name: 'Long Jump' },
    { id: 'm3', name: 'Archery' },
    { id: 'm4', name: 'Swimming (50m Freestyle)' },
];

export const EVENING_EVENTS: EventOption[] = [
    { id: 'e1', name: '3-on-3 Basketball' },
    { id: 'e2', name: 'Chess Tournament' },
    { id: 'e3', name: 'Relay Race (4x100m)' },
    { id: 'e4', name: 'Tug of War' },
];
