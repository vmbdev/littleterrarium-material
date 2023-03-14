import { Photo } from "./photo.model"
import { Plant } from "./plant.model"

export interface User {
  id: number
  username: string
  firstname: string | null
  lastname: string | null
  password: string
  avatar: any
  avatarFile: File
  preferences: any
  email: string
  bio: string | null
  role: Role
  public: boolean
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  locations?: Location[]
  plants?: Plant[]
  photos?: Photo[]
}

export const Role: { [key: string]: string } = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};
export type Role = (typeof Role)[keyof typeof Role]

export const UserStatus: { [key: string]: string } = {
  UNVERIFIED: 'UNVERIFIED',
  VERIFIED: 'VERIFIED',
  BANNED: 'BANNED'
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]