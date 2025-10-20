// lib/sessions.js

const allSessions = Array.from({ length: 8 }, (_, index) => ({
  id: `session-${index + 1}`,
  name: "Find Balance & Clarity",
  thumbnail: "/image/Thumbnail.png", // Placeholder thumbnail
  time: "10:40 AM - 11:00 AM", // Based on the provided image
  therapist: "John Smith",
  status: "Active",
  location: "Downtown Medical Center, 123 Wellness Ave, City, State, 12345",
  perSessionFee: 50,
  therapyType: "Video Therapy",
  aboutTherapySession: "Connect with a licensed psychologist for a private and secure therapy session. Choose between text or video consultations and get the support you need—anytime, anywhere.",
  aboutDoctor: {
    name: "Dr. Sophia Bennett",
    description: "Dr. Sophia Bennett is a highly experienced gynecologist and obstetrician with over 15 years of expertise in women's reproductive health. She specializes in prenatal care, fertility treatments, and hormonal disorders. Dr. Bennett is known for her compassionate approach and dedication to helping women at all stages of life, from adolescence to menopause.",
    certificates: [
      "MD in Obstetrics & Gynecology - Harvard Medical School",
      "Board-Certified OB-GYN - American Board of Obstetrics and Gynecology",
      "Member of the American College of Obstetricians and Gynecologists (ACOG)",
      "Certified in Advanced Laparoscopic Surgery & Fertility Treatments"
    ]
  },
  availability: "Monday to Friday"
}));

export async function getSessionById(id) {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return allSessions.find(session => session.id === id) || null;
}

export async function getAllSessions() {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return allSessions;
}



export const addSession = async (newSession) => {
  await simulateDelay(300);
  const id = `SESS${(sessionsData.length + 1).toString().padStart(3, '0')}`;
  const sessionToAdd = { ...newSession, id, status: "Active", thumbnail: newSession.thumbnail || `https://placehold.co/40x40/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${newSession.name.substring(0,2).toUpperCase()}` };
  sessionsData.push(sessionToAdd);
  return sessionToAdd;
};

export const updateSession = async (updatedSession) => {
  await simulateDelay(300);
  const index = sessionsData.findIndex((s) => s.id === updatedSession.id);
  if (index !== -1) {
    sessionsData[index] = { ...sessionsData[index], ...updatedSession };
    return sessionsData[index];
  }
  return null; // Or throw an error
};

export const deleteSession = async (sessionId) => {
  await simulateDelay(300);
  const initialLength = sessionsData.length;
  sessionsData = sessionsData.filter((s) => s.id !== sessionId);
  return sessionsData.length < initialLength; // True if deleted, false otherwise
};

