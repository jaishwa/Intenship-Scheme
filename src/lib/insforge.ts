import { localDatabase, localStorage_storage, localFunctions } from './localDatabase';

export const insforge = {
  database: localDatabase,
  storage: localStorage_storage,
  functions: localFunctions,
  ai: {
    chat: {
      completions: {
        create: async (_options: any) => {
          return {
            choices: [
              {
                message: {
                  content: "A highly motivated student with strong skills in matching departments. Ready to start."
                }
              }
            ]
          };
        }
      }
    }
  }
};
