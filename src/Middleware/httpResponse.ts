import { Response } from 'express';

export class httpResponse {

  async sendResponse(r: Response, b: any, d: any = {}) {
    b.data = d;
    r.status(b.httpCode).json(b);
  }
}
