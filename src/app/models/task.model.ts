export type Task = {
  plantId: number;
  picture?: string | null;
  plantName: string;
  waterNext: Date | string | null;
  fertNext: Date | string | null;
};
