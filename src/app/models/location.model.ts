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
  _count?: any
  pictureFile: File
  pictures?: any
}

export const Light: { [key: string]: any } = {
  FULLSUN: {
    desc: 'Full sun',
    verbose: 'Sun shines over the whole day',
  },
  PARTIALSUN: {
    desc: 'Partial sun',
    verbose: 'Sun is here for a few hours each day',
  },
  SHADE: {
    desc: 'Shade',
    verbose: 'Sun is not allowed here',
  },
}
export type Light = (typeof Light)[keyof typeof Light];