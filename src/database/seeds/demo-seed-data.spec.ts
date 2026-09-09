import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserRole } from '../../modules/users/entities/user.entity';
import { seedDemoData } from './demo-seed-data';

jest.mock('bcrypt');

interface FakeRow {
  id: string;
  [key: string]: unknown;
}

function createFakeRepository(keyField: string, seedExisting: FakeRow[] = []) {
  const rows: FakeRow[] = [...seedExisting];
  let nextId = seedExisting.length + 1;

  return {
    rows,
    exists: jest.fn((options: { where: Record<string, unknown> }) => {
      const value = options.where[keyField];
      return Promise.resolve(rows.some((row) => row[keyField] === value));
    }),
    create: jest.fn((data: Record<string, unknown>) => ({ ...data })),
    save: jest.fn((entity: Record<string, unknown>) => {
      const row: FakeRow = { id: `id-${nextId++}`, ...entity };
      rows.push(row);
      return Promise.resolve(row);
    }),
    find: jest.fn(() => Promise.resolve(rows)),
  };
}

describe('seedDemoData', () => {
  beforeEach(() => {
    jest.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
  });

  it('inserts 3 categories, 3 users and 16 products on an empty database', async () => {
    const categoryRepo = createFakeRepository('slug');
    const userRepo = createFakeRepository('email');
    const productRepo = createFakeRepository('sku');
    const dataSource = {
      getRepository: jest.fn((entity: { name: string }) => {
        if (entity.name === 'Category') return categoryRepo;
        if (entity.name === 'User') return userRepo;
        return productRepo;
      }),
    } as unknown as DataSource;

    const result = await seedDemoData(dataSource);

    expect(result).toEqual({
      categoriesCreated: 3,
      usersCreated: 3,
      productsCreated: 16,
    });
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(
      userRepo.rows.filter((row) => row.role === UserRole.ADMIN),
    ).toHaveLength(1);
    expect(
      productRepo.rows.every((row) => typeof row.categoryId === 'string'),
    ).toBe(true);
  });

  it('is idempotent: a second run against already-seeded rows creates nothing new', async () => {
    const existingCategories: FakeRow[] = [
      { id: 'cat-1', slug: 'dien-thoai', name: 'Điện thoại' },
      { id: 'cat-2', slug: 'laptop', name: 'Laptop' },
      { id: 'cat-3', slug: 'phu-kien', name: 'Phụ kiện' },
    ];
    const categoryRepo = createFakeRepository('slug', existingCategories);
    const userRepo = createFakeRepository('email', [
      { id: 'u-1', email: 'admin@mini-shop.example.com' },
      { id: 'u-2', email: 'customer1@mini-shop.example.com' },
      { id: 'u-3', email: 'customer2@mini-shop.example.com' },
    ]);
    const existingSkus = [
      'DT-001',
      'DT-002',
      'DT-003',
      'DT-004',
      'DT-005',
      'DT-006',
      'LT-001',
      'LT-002',
      'LT-003',
      'LT-004',
      'LT-005',
      'PK-001',
      'PK-002',
      'PK-003',
      'PK-004',
      'PK-005',
    ];
    const productRepo = createFakeRepository(
      'sku',
      existingSkus.map((sku, index) => ({ id: `p-${index}`, sku })),
    );
    const dataSource = {
      getRepository: jest.fn((entity: { name: string }) => {
        if (entity.name === 'Category') return categoryRepo;
        if (entity.name === 'User') return userRepo;
        return productRepo;
      }),
    } as unknown as DataSource;

    const result = await seedDemoData(dataSource);

    expect(result).toEqual({
      categoriesCreated: 0,
      usersCreated: 0,
      productsCreated: 0,
    });
    expect(categoryRepo.save).not.toHaveBeenCalled();
    expect(userRepo.save).not.toHaveBeenCalled();
    expect(productRepo.save).not.toHaveBeenCalled();
  });
});
