import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';
import { SALT_ROUNDS } from '../../modules/users/constants/users.constants';
import { User } from '../../modules/users/entities/user.entity';
import { UserStatus } from '../../modules/users/enums/user-status.enum';
import type {
  CategorySeed,
  ProductSeed,
  SeedResult,
  UserSeed,
} from './interfaces/seed-data.interface';

const logger = new Logger('SeedDemoData');

/**
 * Mật khẩu demo dùng chung cho 3 tài khoản seed — không phải secret thật, chỉ để tự đăng nhập thử
 * trên môi trường local/test. Không dùng lại giá trị này ở môi trường có dữ liệu thật.
 */
export const DEMO_PASSWORD = 'Demo@12345';

const CATEGORY_SEEDS: CategorySeed[] = [
  { slug: 'dien-thoai', name: 'Điện thoại' },
  { slug: 'laptop', name: 'Laptop' },
  { slug: 'phu-kien', name: 'Phụ kiện' },
];

const USER_SEEDS: UserSeed[] = [
  {
    email: 'admin@mini-shop.example.com',
    username: 'admin',
    role: UserRole.ADMIN,
  },
  {
    email: 'customer1@mini-shop.example.com',
    username: 'customer1',
    role: UserRole.CUSTOMER,
  },
  {
    email: 'customer2@mini-shop.example.com',
    username: 'customer2',
    role: UserRole.CUSTOMER,
  },
];

// 16 sản phẩm (trong khoảng 12-20 theo SYS-03), cố ý có out-of-stock, stock=1 và archived (isActive=false).
const PRODUCT_SEEDS: ProductSeed[] = [
  {
    sku: 'DT-001',
    name: 'Điện thoại Aurora X1',
    description: 'Bản demo — điện thoại tầm trung.',
    categorySlug: 'dien-thoai',
    priceVnd: '5990000',
    stock: 25,
    isActive: true,
    isFeatured: true,
  },
  {
    sku: 'DT-002',
    name: 'Điện thoại Aurora X1 Pro',
    description: 'Bản demo — camera tốt hơn.',
    categorySlug: 'dien-thoai',
    priceVnd: '8990000',
    stock: 15,
    isActive: true,
    isFeatured: true,
  },
  {
    sku: 'DT-003',
    name: 'Điện thoại Nova Lite',
    description: 'Bản demo — giá rẻ.',
    categorySlug: 'dien-thoai',
    priceVnd: '3490000',
    stock: 40,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'DT-004',
    name: 'Điện thoại Nova Max',
    description: 'Bản demo — pin lớn, hết hàng.',
    categorySlug: 'dien-thoai',
    priceVnd: '6490000',
    stock: 0,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'DT-005',
    name: 'Điện thoại Orbit Mini',
    description: 'Bản demo — nhỏ gọn, sắp hết hàng.',
    categorySlug: 'dien-thoai',
    priceVnd: '4290000',
    stock: 1,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'DT-006',
    name: 'Điện thoại Orbit Classic',
    description: 'Bản demo — đã ngừng bán.',
    categorySlug: 'dien-thoai',
    priceVnd: '2990000',
    stock: 5,
    isActive: false,
    isFeatured: false,
  },
  {
    sku: 'LT-001',
    name: 'Laptop Zenith 14',
    description: 'Bản demo — mỏng nhẹ.',
    categorySlug: 'laptop',
    priceVnd: '18990000',
    stock: 10,
    isActive: true,
    isFeatured: true,
  },
  {
    sku: 'LT-002',
    name: 'Laptop Zenith 16 Pro',
    description: 'Bản demo — cấu hình cao.',
    categorySlug: 'laptop',
    priceVnd: '28990000',
    stock: 6,
    isActive: true,
    isFeatured: true,
  },
  {
    sku: 'LT-003',
    name: 'Laptop Vega Air',
    description: 'Bản demo — văn phòng.',
    categorySlug: 'laptop',
    priceVnd: '14990000',
    stock: 20,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'LT-004',
    name: 'Laptop Vega Gaming',
    description: 'Bản demo — chơi game.',
    categorySlug: 'laptop',
    priceVnd: '32990000',
    stock: 4,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'LT-005',
    name: 'Laptop Vega Student',
    description: 'Bản demo — đã ngừng bán.',
    categorySlug: 'laptop',
    priceVnd: '9990000',
    stock: 8,
    isActive: false,
    isFeatured: false,
  },
  {
    sku: 'PK-001',
    name: 'Tai nghe Bluetooth Buds',
    description: 'Bản demo — chống ồn.',
    categorySlug: 'phu-kien',
    priceVnd: '1290000',
    stock: 60,
    isActive: true,
    isFeatured: true,
  },
  {
    sku: 'PK-002',
    name: 'Sạc nhanh 65W',
    description: 'Bản demo — sạc nhanh đa thiết bị.',
    categorySlug: 'phu-kien',
    priceVnd: '590000',
    stock: 100,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'PK-003',
    name: 'Ốp lưng chống sốc',
    description: 'Bản demo — bảo vệ máy.',
    categorySlug: 'phu-kien',
    priceVnd: '190000',
    stock: 200,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'PK-004',
    name: 'Chuột không dây',
    description: 'Bản demo — công thái học, hết hàng.',
    categorySlug: 'phu-kien',
    priceVnd: '390000',
    stock: 0,
    isActive: true,
    isFeatured: false,
  },
  {
    sku: 'PK-005',
    name: 'Bàn phím cơ Compact',
    description: 'Bản demo — switch đỏ.',
    categorySlug: 'phu-kien',
    priceVnd: '1490000',
    stock: 12,
    isActive: true,
    isFeatured: false,
  },
];

async function findOrCreateCategory(
  repository: Repository<Category>,
  seed: CategorySeed,
): Promise<boolean> {
  const alreadyExists = await repository.exists({ where: { slug: seed.slug } });
  if (alreadyExists) {
    return false;
  }
  await repository.save(
    repository.create({ slug: seed.slug, name: seed.name }),
  );
  return true;
}

async function findOrCreateUser(
  repository: Repository<User>,
  seed: UserSeed,
  passwordHash: string,
): Promise<boolean> {
  const alreadyExists = await repository.exists({
    where: { email: seed.email },
  });
  if (alreadyExists) {
    return false;
  }
  await repository.save(
    repository.create({
      email: seed.email,
      username: seed.username,
      passwordHash,
      role: seed.role,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    }),
  );
  return true;
}

async function findOrCreateProduct(
  repository: Repository<Product>,
  seed: ProductSeed,
  categoryIdBySlug: ReadonlyMap<string, string>,
): Promise<boolean> {
  const alreadyExists = await repository.exists({ where: { sku: seed.sku } });
  if (alreadyExists) {
    return false;
  }
  const categoryId = categoryIdBySlug.get(seed.categorySlug);
  if (!categoryId) {
    throw new Error(
      `Không tìm thấy category slug "${seed.categorySlug}" cho product "${seed.sku}"`,
    );
  }
  await repository.save(
    repository.create({
      sku: seed.sku,
      name: seed.name,
      description: seed.description,
      categoryId,
      priceVnd: seed.priceVnd,
      stock: seed.stock,
      isActive: seed.isActive,
      isFeatured: seed.isFeatured,
      imageId: null,
    }),
  );
  return true;
}

function countCreated(results: boolean[]): number {
  return results.filter(Boolean).length;
}

/**
 * Idempotent theo thiết kế: mỗi bản ghi được kiểm tra tồn tại theo khóa tự nhiên (email/slug/sku)
 * trước, chỉ insert khi chưa có — không bao giờ update bản ghi đã có. Nhờ vậy chạy seed nhiều lần
 * không tạo trùng (SYS-03) và không ghi đè tồn kho/trạng thái đã thay đổi bởi đơn hàng thật phát
 * sinh sau lần seed đầu. Các bản ghi trong cùng một batch (category/user/product) độc lập với
 * nhau nên chạy song song bằng `Promise.all` thay vì tuần tự trong vòng lặp — chỉ có ràng buộc thứ
 * tự giữa hai batch (product cần category đã tồn tại để tra `categoryId`).
 */
export async function seedDemoData(
  dataSource: DataSource,
): Promise<SeedResult> {
  const categoryRepository = dataSource.getRepository(Category);
  const userRepository = dataSource.getRepository(User);
  const productRepository = dataSource.getRepository(Product);

  const categoriesCreated = countCreated(
    await Promise.all(
      CATEGORY_SEEDS.map((seed) =>
        findOrCreateCategory(categoryRepository, seed),
      ),
    ),
  );

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);
  const usersCreated = countCreated(
    await Promise.all(
      USER_SEEDS.map((seed) =>
        findOrCreateUser(userRepository, seed, passwordHash),
      ),
    ),
  );

  const categories = await categoryRepository.find();
  const categoryIdBySlug = new Map(
    categories.map((category) => [category.slug, category.id]),
  );

  const productsCreated = countCreated(
    await Promise.all(
      PRODUCT_SEEDS.map((seed) =>
        findOrCreateProduct(productRepository, seed, categoryIdBySlug),
      ),
    ),
  );

  logger.log(
    `${categoriesCreated} category, ${usersCreated} user, ${productsCreated} product mới được tạo. ` +
      `Mật khẩu demo (không phải secret thật): xem DEMO_PASSWORD trong demo-seed-data.ts.`,
  );

  return { categoriesCreated, usersCreated, productsCreated };
}
