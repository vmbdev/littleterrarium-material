import { Plant } from "./plant.model"

export interface Location {
  id: number
  name: string
  light: Light
  public: boolean
  ownerId: number
  createdAt: Date
  updatedAt: Date
  plants?: Plant[]
  _count?: {
    plants: number
  },
  pictureFile: File
  pictures?: any
}

export const Light: { [key: string]: string} = {
  FULLSUN: 'FULLSUN',
  PARTIALSUN: 'PARTIALSUN',
  SHADE: 'SHADE'
}
export type Light = (typeof Light)[keyof typeof Light]