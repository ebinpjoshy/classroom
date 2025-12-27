export type Assignment = {
  id: string;
  title: string;
  deadline: string;
  file?: {
    name: string;
    uri: string;
  };
};

export const assignments: Assignment[] = [];
