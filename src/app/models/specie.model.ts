import { Plant } from "./plant.model"

export interface Specie {
  id: number
  family: string
  name: string
  commonName: string | null
  care: any
  createdAt: Date
  updatedAt: Date
  plants?: Plant[]
}