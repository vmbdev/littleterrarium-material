export interface Photo {
  id: number
  images: any
  description: string | null
  public: boolean
  takenAt: Date
  hashId: number
  plantId: number
  ownerId: number
  createdAt: Date
  updatedAt: Date
  pictureFiles: File[]
}