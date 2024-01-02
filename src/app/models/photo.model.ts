import { ImagePath } from "@services/image-path.service";

export interface Photo {
  id: number;
  images: ImagePath;
  description: string | null;
  public: boolean;
  takenAt: Date;
  hashId: number;
  plantId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  pictureFiles: File[];
}

export interface NavigationData {
  prev?: {
    id: number;
  };
  next?: {
    id: number;
  };
}
