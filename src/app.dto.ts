import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 'mini-shop-api' })
  service: string;

  @ApiProperty({ example: 'Mini Shop API is ready' })
  message: string;

  @ApiProperty({ example: '2026-09-09T03:00:00.000Z' })
  timestamp: string;
}
