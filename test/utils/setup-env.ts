import { config } from 'dotenv';
import { join } from 'path';

// override mặc định là false: chỉ điền biến còn thiếu trong process.env, không đè giá trị CI đã set ở job level.
// Nếu override:true, DB_PORT/REDIS_PORT/MAIL_PORT của .env.test (cổng docker-compose local) sẽ ghi đè cổng chuẩn
// mà CI (.github/workflows/ci.yml) đã set, khiến AppModule bootstrap kết nối sai cổng và e2e fail trên CI thật.
config({ path: join(__dirname, '../../.env.test') });
