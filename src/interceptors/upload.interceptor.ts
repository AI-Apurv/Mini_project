import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import { multerStorage } from './multer-config';
import { response } from 'express';
@Injectable()
export class UploadInterceptor implements NestInterceptor {
  private upload: multer.Multer;

  constructor() {
    this.upload = multer({ storage: multerStorage });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();
    return new Observable(observer => {
      this.upload.single('image')(request, null, async err => {
        if (err) {
          console.error('Error uploading file:', err);
          observer.error(err);
        } else {
          observer.next(request.file);
          observer.complete();

        }
        next.handle().subscribe(response => {
          observer.next(response);
          observer.complete();
        })

      });
    })
  }
}
