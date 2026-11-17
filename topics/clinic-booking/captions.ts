import type {CaptionCue} from '../../src/engine/types';

export const clinicBookingCaptions: Record<string, CaptionCue[]> = {
  intro: [
    {startFrame: 0, durationInFrames: 56, text: 'Let patients book through WhatsApp,'},
    {startFrame: 56, durationInFrames: 90, text: 'while your clinic manages appointments in one place.'},
  ],
  'start-chat': [
    {startFrame: 0, durationInFrames: 47, text: 'The patient messages the clinic'},
    {startFrame: 47, durationInFrames: 47, text: 'and taps Book Appointment.'},
  ],
  'verify-email': [
    {startFrame: 0, durationInFrames: 58, text: 'They share their name and email,'},
    {
      startFrame: 58,
      durationInFrames: 98,
      text: 'then enter the email verification code directly in the chat.',
    },
  ],
  'choose-slot': [
    {startFrame: 0, durationInFrames: 74, text: 'They choose an available date and time,'},
    {startFrame: 74, durationInFrames: 74, text: 'review the details, and confirm their booking.'},
  ],
  'booking-confirmed': [
    {startFrame: 0, durationInFrames: 82, text: 'Once saved, the appointment is confirmed on WhatsApp'},
    {startFrame: 82, durationInFrames: 62, text: 'and appears in the clinic’s agenda.'},
  ],
  'daily-agenda': [
    {startFrame: 0, durationInFrames: 87, text: 'Doctors and reception staff can view the day’s appointments'},
    {startFrame: 87, durationInFrames: 68, text: 'and book visits for patients who call.'},
  ],
  availability: [
    {startFrame: 0, durationInFrames: 76, text: 'The doctor controls working hours and breaks,'},
    {startFrame: 76, durationInFrames: 87, text: 'so patients see times they can actually book.'},
  ],
  cancellation: [
    {startFrame: 0, durationInFrames: 53, text: 'If an appointment is cancelled,'},
    {startFrame: 53, durationInFrames: 75, text: 'the patient receives an update on WhatsApp.'},
  ],
  outro: [
    {startFrame: 0, durationInFrames: 120, text: 'Maple Care Clinic. Easy booking for patients. Clear team schedule.'},
  ],
};
