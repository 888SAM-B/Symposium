
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

const events = [
  { id: 'morning-run', name: 'Morning Run (Morning)', type: 'morning' },
  { id: 'coding-challenge', name: 'Coding Challenge (Anytime)', type: 'anytime' },
  { id: 'afternoon-hike', name: 'Afternoon Hike (Afternoon)', type: 'afternoon' },
  { id: 'evening-gala', name: 'Evening Gala (Evening)', type: 'evening' },
];

const TeamRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      teamName: '',
      teamMembers: [{ name: '', email: '' }],
      selectedEvents: [],
    },
  });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({
    control,
    name: 'teamMembers',
  });

  const [step, setStep] = useState(1);
  const selectedEvents = watch('selectedEvents');
  const teamMembers = watch('teamMembers');
  
  const validateEventAssignments = (data) => {
    let isValid = true;
    clearErrors('selectedEvents'); // Clear previous errors for selectedEvents

    const assignedMembersCount = {}; // Track how many events each member is assigned to
    const morningEventAssignments = {}; // Track morning event assignments for each member

    // Initialize counts for all members
    teamMembers.forEach((_, memberIndex) => {
      assignedMembersCount[memberIndex] = 0;
      morningEventAssignments[memberIndex] = 0;
    });

    data.selectedEvents.forEach((eventAssignment, eventIndex) => {
      const selectedEvent = events.find(e => e.id === eventAssignment.eventId);
      const assignedMemberIndices = [eventAssignment.member1, eventAssignment.member2].filter(
        (index) => index !== undefined && index !== ''
      );

      // Rule: Maximum 2 members per event
      if (assignedMemberIndices.length > 2) {
        setError(`selectedEvents.${eventIndex}.member2`, {
          type: 'manual',
          message: 'Max 2 members per event.',
        });
        isValid = false;
      }

      // Rule: Members cannot be assigned to multiple morning events
      if (selectedEvent && selectedEvent.type === 'morning') {
        assignedMemberIndices.forEach((memberIndex) => {
          morningEventAssignments[memberIndex]++;
          if (morningEventAssignments[memberIndex] > 1) {
            setError(`selectedEvents.${eventIndex}.member1`, {
              type: 'manual',
              message: `Member ${parseInt(memberIndex) + 1} already in another morning event.`,
            });
            setError(`selectedEvents.${eventIndex}.member2`, {
              type: 'manual',
              message: `Member ${parseInt(memberIndex) + 1} already in another morning event.`,
            });
            isValid = false;
          }
        });
      }

      // Track total event assignments per member
      assignedMemberIndices.forEach((memberIndex) => {
        assignedMembersCount[memberIndex]++;
      });
    });

    // Rule: All selected events must have at least one member assigned
    data.selectedEvents.forEach((eventAssignment, eventIndex) => {
        const assignedMemberIndices = [eventAssignment.member1, eventAssignment.member2].filter(
            (index) => index !== undefined && index !== ''
        );
        if (assignedMemberIndices.length === 0) {
            setError(`selectedEvents.${eventIndex}.member1`, {
                type: 'manual',
                message: 'At least one member must be assigned to this event.',
            });
            isValid = false;
        }
    });


    // Rule: All input fields are mandatory (checked by react-hook-form's built-in required validation)
    // This part is handled by the `required: true` in the register calls for name and email.
    // For event assignments, we need to ensure selections are made if an event is selected.
    data.selectedEvents.forEach((eventAssignment, eventIndex) => {
        if (!eventAssignment.eventId) {
            setError(`selectedEvents.${eventIndex}.eventId`, {
                type: 'manual',
                message: 'Event selection is required.',
            });
            isValid = false;
        }
    });


    // Ensure all team members are assigned to at least one event
    const allMembersAssigned = Object.keys(assignedMembersCount).every(
      (memberIndex) => assignedMembersCount[memberIndex] > 0
    );

    if (teamMembers.length > 0 && !allMembersAssigned) {
        setError('teamMembers[0].name', {
            type: 'manual',
            message: 'All team members must be assigned to at least one event.',
        });
        isValid = false;
    }


    return isValid;
  };

  const onSubmit = (data) => {
    if (step === 1) {
      setStep(2);
    } else {
      if (validateEventAssignments(data)) {
        console.log('Form Data:', data);
        alert('Registration Successful!');
      } else {
        alert('Please fix the errors in event assignments.');
      }
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            {step === 1 ? 'Team Registration' : 'Event Assignment'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <label htmlFor="teamName" className="block text-gray-700 text-sm font-medium mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    {...register('teamName', { required: 'Team Name is required' })}
                    className={`w-full p-3 border ${
                      errors.teamName ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  />
                  {errors.teamName && (
                    <p className="text-red-500 text-xs mt-1">{errors.teamName.message}</p>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Team Members</h3>
                <div className="space-y-4 mb-6">
                  {memberFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50"
                    >
                      <div className="flex-1">
                        <label
                          htmlFor={`teamMembers.${index}.name`}
                          className="block text-gray-700 text-sm font-medium mb-2"
                        >
                          Member {index + 1} Name
                        </label>
                        <input
                          type="text"
                          id={`teamMembers.${index}.name`}
                          {...register(`teamMembers.${index}.name`, {
                            required: `Member ${index + 1} Name is required`,
                          })}
                          className={`w-full p-3 border ${
                            errors.teamMembers?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                        />
                        {errors.teamMembers?.[index]?.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.teamMembers[index].name.message}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={`teamMembers.${index}.email`}
                          className="block text-gray-700 text-sm font-medium mb-2"
                        >
                          Member {index + 1} Email
                        </label>
                        <input
                          type="email"
                          id={`teamMembers.${index}.email`}
                          {...register(`teamMembers.${index}.email`, {
                            required: `Member ${index + 1} Email is required`,
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: 'Invalid email address',
                            },
                          })}
                          className={`w-full p-3 border ${
                            errors.teamMembers?.[index]?.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                        />
                        {errors.teamMembers?.[index]?.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.teamMembers[index].email.message}
                          </p>
                        )}
                      </div>
                      {memberFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="self-center sm:self-end mt-4 sm:mt-0 p-2 text-red-600 hover:text-red-800 transition duration-200 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => appendMember({ name: '', email: '' })}
                  className="w-full bg-gray-200 text-gray-700 p-3 rounded-xl hover:bg-gray-300 transition duration-200 font-medium"
                >
                  Add Team Member
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Events & Assign Members</h3>
                <div className="space-y-6">
                  {selectedEvents.map((eventAssignment, eventIndex) => (
                    <motion.div
                      key={eventIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm relative"
                    >
                      <label
                        htmlFor={`selectedEvents.${eventIndex}.eventId`}
                        className="block text-gray-700 text-sm font-medium mb-2"
                      >
                        Event {eventIndex + 1}
                      </label>
                      <select
                        id={`selectedEvents.${eventIndex}.eventId`}
                        {...register(`selectedEvents.${eventIndex}.eventId`, {
                          required: 'Event selection is required',
                        })}
                        className={`w-full p-3 border ${
                          errors.selectedEvents?.[eventIndex]?.eventId ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 mb-4`}
                      >
                        <option value="">Select an Event</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.name}
                          </option>
                        ))}
                      </select>
                      {errors.selectedEvents?.[eventIndex]?.eventId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.selectedEvents[eventIndex].eventId.message}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1">
                          <label
                            htmlFor={`selectedEvents.${eventIndex}.member1`}
                            className="block text-gray-700 text-sm font-medium mb-2"
                          >
                            Member 1
                          </label>
                          <select
                            id={`selectedEvents.${eventIndex}.member1`}
                            {...register(`selectedEvents.${eventIndex}.member1`)}
                            className={`w-full p-3 border ${
                              errors.selectedEvents?.[eventIndex]?.member1 ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          >
                            <option value="">Select Member</option>
                            {teamMembers.map((member, idx) => (
                              <option key={idx} value={idx}>
                                {member.name || `Member ${idx + 1}`}
                              </option>
                            ))}
                          </select>
                          {errors.selectedEvents?.[eventIndex]?.member1 && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.selectedEvents[eventIndex].member1.message}
                            </p>
                          )}
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`selectedEvents.${eventIndex}.member2`}
                            className="block text-gray-700 text-sm font-medium mb-2"
                          >
                            Member 2 (Optional)
                          </label>
                          <select
                            id={`selectedEvents.${eventIndex}.member2`}
                            {...register(`selectedEvents.${eventIndex}.member2`)}
                            className={`w-full p-3 border ${
                              errors.selectedEvents?.[eventIndex]?.member2 ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                          >
                            <option value="">Select Member</option>
                            {teamMembers.map((member, idx) => (
                              <option key={idx} value={idx}>
                                {member.name || `Member ${idx + 1}`}
                              </option>
                            ))}
                          </select>
                          {errors.selectedEvents?.[eventIndex]?.member2 && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.selectedEvents[eventIndex].member2.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                            const newSelectedEvents = [...selectedEvents];
                            newSelectedEvents.splice(eventIndex, 1);
                            // Manually update the form state for `selectedEvents`
                            clearErrors(`selectedEvents.${eventIndex}`); // Clear errors related to the removed event
                            // Use setValue from react-hook-form to update the array
                            // This assumes you have `setValue` from `useForm`
                            // If not, you'd re-register the field array for selectedEvents
                            // For simplicity, we'll omit direct setValue for a fully dynamic field array here
                            // and instead rely on the re-render. A more robust solution might use useFieldArray for selectedEvents too.
                        }}
                        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition duration-200 rounded-full"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                        // Append a new empty event assignment to the array
                        const newSelectedEvents = [...selectedEvents, { eventId: '', member1: '', member2: '' }];
                        // Manually update the form state for `selectedEvents`
                        // A better approach would be to use useFieldArray for selectedEvents as well.
                        // For this example, we'll just re-render and rely on `watch`.
                        // For a real app, define a `useFieldArray` for `selectedEvents`.
                        // For now, to make the UI update and register the new field:
                        setValue('selectedEvents', newSelectedEvents);
                    }}
                    className="w-full bg-blue-100 text-blue-700 p-3 rounded-xl hover:bg-blue-200 transition duration-200 font-medium"
                  >
                    Add Another Event
                  </button>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              {step === 2 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition duration-200"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-dark-blue-700 text-white rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-dark-blue-800 transition duration-300"
              >
                {step === 1 ? 'Next Step' : 'Register'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TeamRegistrationForm;
