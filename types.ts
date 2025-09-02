
export interface EventOption {
    id: string;
    name: string;
}

export interface Participant {
    id: string;
    name: string;
    registrationNumber: string;
}

export type EventRegistrations = Record<string, string[]>;

export interface ParticipantErrors {
    name?: string;
    registrationNumber?: string;
    events?: string;
}

export interface Errors {
    teamName?: string;
    participants?: {
        [participantId: string]: ParticipantErrors;
    };
    eventRegistrations?: {
        [eventId: string]: string;
    };
}
