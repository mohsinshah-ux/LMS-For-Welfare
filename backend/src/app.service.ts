import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      status: 'ok',
      service: 'islamic-lms-backend',
      timestamp: new Date().toISOString()
    };
  }
}
