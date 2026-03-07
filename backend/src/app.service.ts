import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      name: 'AutoContent Engine API',
      version: '0.1.0',
    };
  }
}
