export type Notification = {
  id: number;
  type: NotificationType;
  read: Date | null;
  content: any;
  plantId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
};

export const NotificationType: { [key: string]: string } = {
  WATER: 'WATER',
  FERTILIZER: 'FERTILIZER',
  COMMENT: 'COMMENT',
};
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];
