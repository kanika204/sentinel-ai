// frontend/src/services/EmergencyService.js

let currentEmergency = null;

const EmergencyService = {

  setEmergency(data) {
    currentEmergency = data;
  },

  getEmergency() {
    return currentEmergency;
  },

  updateEmergency(updates) {
    if (currentEmergency) {
      currentEmergency = {
        ...currentEmergency,
        ...updates,
      };
    }
  },

  clearEmergency() {
    currentEmergency = null;
  },

};

export default EmergencyService;