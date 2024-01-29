export type Task = {
  plantId: number;
  picture?: string;
  plantName: string;
  waterNext: Date | string | null;
  fertNext: Date | string | null;
};
