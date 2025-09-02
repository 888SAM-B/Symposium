
import { useState, useEffect, useCallback } from 'react';
import type { Participant, Errors, EventRegistrations } from '../types';
import { PARTICIPANTS_PER_EVENT_LIMIT, MORNING_EVENTS } from '../constants';

export const useFormValidation = (
    teamName: string,
    participants: Participant[],
    eventRegistrations: EventRegistrations
) => {
    const [errors, setErrors] = useState<Errors>({});

    const validate = useCallback(() => {
        const newErrors: Errors = { participants: {}, eventRegistrations: {} };

        // 1. Validate Team Name
        if (!teamName.trim()) {
            newErrors.teamName = 'Team name is required.';
        }

        const participantNames = new Set<string>();
        const registrationNumbers = new Set<string>();
        const participantEventCounts: Record<string, { morning: number; evening: number }> = {};

        // 2. Validate Participants
        participants.forEach(p => {
            if (!p.id) return;
            const participantErrors: { name?: string; registrationNumber?: string } = {};
            participantEventCounts[p.id] = { morning: 0, evening: 0 };

            // Name validation
            if (!p.name.trim()) {
                participantErrors.name = 'Participant name is required.';
            } else if (participantNames.has(p.name.trim().toLowerCase())) {
                participantErrors.name = 'Participant names must be unique.';
            } else {
                participantNames.add(p.name.trim().toLowerCase());
            }

            // Registration number validation
            if (!p.registrationNumber.trim()) {
                participantErrors.registrationNumber = 'Registration number is required.';
            } else if (registrationNumbers.has(p.registrationNumber.trim().toLowerCase())) {
                participantErrors.registrationNumber = 'Registration numbers must be unique.';
            } else {
                registrationNumbers.add(p.registrationNumber.trim().toLowerCase());
            }

            if (Object.keys(participantErrors).length > 0) {
                if (!newErrors.participants) newErrors.participants = {};
                newErrors.participants[p.id] = participantErrors;
            }
        });

        const morningEventIds = new Set(MORNING_EVENTS.map(e => e.id));

        // 3. Validate Event Registrations and Tally Participant Event Counts
        for (const eventId in eventRegistrations) {
            const participantIds = eventRegistrations[eventId];
            
            // Check for duplicate participants within the same event
            if (new Set(participantIds).size !== participantIds.length) {
                 if (!newErrors.eventRegistrations) newErrors.eventRegistrations = {};
                 newErrors.eventRegistrations[eventId] = 'A participant cannot be selected twice for the same event.';
            }

            // Check event capacity
            if (participantIds.length > PARTICIPANTS_PER_EVENT_LIMIT) {
                if (!newErrors.eventRegistrations) newErrors.eventRegistrations = {};
                newErrors.eventRegistrations[eventId] = `This event has too many participants (max ${PARTICIPANTS_PER_EVENT_LIMIT}).`;
            }

            // Tally counts for each participant
            const isMorning = morningEventIds.has(eventId);
            participantIds.forEach(pId => {
                if (participantEventCounts[pId]) {
                    if (isMorning) {
                        participantEventCounts[pId].morning++;
                    } else {
                        participantEventCounts[pId].evening++;
                    }
                }
            });
        }

        // 4. Check participant event limits
        for (const pId in participantEventCounts) {
            const counts = participantEventCounts[pId];
            if (counts.morning > 1 || counts.evening > 1) {
                if (!newErrors.participants) newErrors.participants = {};
                if (!newErrors.participants[pId]) newErrors.participants[pId] = {};
                newErrors.participants[pId]!.events = 'Cannot join more than one morning and one evening event.';
            }
        }
        
        setErrors(newErrors);

        return (
            Object.keys(newErrors.teamName || {}).length === 0 &&
            Object.keys(newErrors.participants || {}).length === 0 &&
            Object.keys(newErrors.eventRegistrations || {}).length === 0
        );

    }, [teamName, participants, eventRegistrations]);

    useEffect(() => {
        // This effect will re-validate the form whenever the data changes,
        // providing real-time feedback to the user.
        validate();
    }, [validate]);

    // The validate function is returned to be used for the final submission check.
    return { errors, validateForm: validate };
};
