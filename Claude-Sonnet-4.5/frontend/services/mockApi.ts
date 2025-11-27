import mockData from '../../mocks/mock_api.json';

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  startDate: string;
  manager: string;
}

export interface HandbookSection {
  id: string;
  title: string;
  content: string;
}

export interface Handbook {
  title: string;
  version: string;
  lastUpdated: string;
  sections: HandbookSection[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export const mockApi = {
  getProfile: async (): Promise<Profile> => {
    await delay(100);
    return mockData.profile;
  },

  getHandbook: async (): Promise<Handbook> => {
    await delay(150);
    return mockData.handbook;
  },

  getSteps: async (): Promise<Step[]> => {
    await delay(80);
    return mockData.steps;
  },

  submitOnboarding: async (_data: any): Promise<{ success: boolean; message: string }> => {
    await delay(200);
    return {
      success: true,
      message: 'Onboarding completed successfully!'
    };
  }
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
