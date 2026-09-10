import { UserRole } from '../../../common/enums/user-role.enum';

export interface SeedResult {
  categoriesCreated: number;
  usersCreated: number;
  productsCreated: number;
}

export interface CategorySeed {
  slug: string;
  name: string;
}

export interface UserSeed {
  email: string;
  username: string;
  role: UserRole;
}

export interface ProductSeed {
  sku: string;
  name: string;
  description: string;
  categorySlug: string;
  priceVnd: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
}
