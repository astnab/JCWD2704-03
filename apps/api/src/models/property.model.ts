import { Category } from '@prisma/client';
import { TUser } from './user.model';

export type TProperty = {
  id: string;
  tenant_id: TUser;
  category: Category;
  pic: Buffer | null;
  desc: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updateAt: Date;
};