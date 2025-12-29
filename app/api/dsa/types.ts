export type DsaQuestion = {
    id: number;
    title: string;
    description: string;
    examples: string[];
  };
  
  export type ContestResponse = {
    topic: string;
    total: number;
    questions: DsaQuestion[];
  };
  