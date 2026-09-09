import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { envValidationSchema } from '../../config/env.validation';
import { buildDataSourceOptions } from '../../config/typeorm.config';
import { seedDemoData } from './demo-seed-data';

config();

const SUPPORTED_PROFILES = ['demo'];
const logger = new Logger('Seed');

function readProfileArg(): string | undefined {
  const arg = process.argv.find((value) => value.startsWith('--profile='));
  return arg?.split('=')[1];
}

/**
 * CLI script chạy ngoài Nest container (giống data-source.ts) — tự dotenv.config() và tự validate
 * Joi vì không có ConfigModule.forRoot() nào làm việc đó thay (mục 17.3 CODING_STANDARD.md).
 */
async function main(): Promise<void> {
  const profile = readProfileArg();
  if (!profile || !SUPPORTED_PROFILES.includes(profile)) {
    logger.error(
      `Thiếu hoặc sai --profile. Hỗ trợ: ${SUPPORTED_PROFILES.join(', ')}. Ví dụ: --profile=demo`,
    );
    process.exitCode = 1;
    return;
  }

  const { error } = envValidationSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    logger.error(`Cấu hình env không hợp lệ: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    logger.error('Không chạy seed demo trên môi trường production.');
    process.exitCode = 1;
    return;
  }

  const dataSource = new DataSource(
    buildDataSourceOptions(`${__dirname}/../..`),
  );

  try {
    await dataSource.initialize();
  } catch (connectError) {
    logger.error(
      'Không kết nối được database.',
      connectError instanceof Error ? connectError.stack : String(connectError),
    );
    process.exitCode = 1;
    return;
  }

  try {
    await seedDemoData(dataSource);
  } catch (seedError) {
    logger.error(
      'Seed thất bại.',
      seedError instanceof Error ? seedError.stack : String(seedError),
    );
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

void main();
