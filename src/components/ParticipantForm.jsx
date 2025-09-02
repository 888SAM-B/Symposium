import React from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

const ParticipantDetailsForm = ({
    participant,
    participantIndex,
    onChange,
    errors,
}) => {
    const handleChange = (field, value) => {
        onChange({ ...participant, [field]: value });
    };

    return (
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm relative">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
                Participant #{participantIndex + 1}
            </h3>
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor={`participant-name-${participant.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Full Name
                    </label>
                    <input
                        type="text"
                        id={`participant-name-${participant.id}`}
                        value={participant.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g., Jane Doe"
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                            errors?.name
                                ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        aria-invalid={!!errors?.name}
                        aria-describedby={
                            errors?.name ? `name-error-${participant.id}` : undefined
                        }
                    />
                    {errors?.name && (
                        <p
                            id={`name-error-${participant.id}`}
                            className="mt-2 text-sm text-red-600"
                        >
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        htmlFor={`participant-reg-${participant.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Registration Number
                    </label>
                    <input
                        type="text"
                        id={`participant-reg-${participant.id}`}
                        value={participant.registrationNumber}
                        onChange={(e) =>
                            handleChange('registrationNumber', e.target.value)
                        }
                        placeholder="e.g., A1234"
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                            errors?.registrationNumber
                                ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        aria-invalid={!!errors?.registrationNumber}
                        aria-describedby={
                            errors?.registrationNumber
                                ? `reg-error-${participant.id}`
                                : undefined
                        }
                    />
                    {errors?.registrationNumber && (
                        <p
                            id={`reg-error-${participant.id}`}
                            className="mt-2 text-sm text-red-600"
                        >
                            {errors.registrationNumber}
                        </p>
                    )}
                </div>
                {errors?.events && (
                    <div className="mt-2 text-sm text-red-600 flex items-start">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>{errors.events}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantDetailsForm;
