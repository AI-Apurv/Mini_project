// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { multerStorage } from 'src/multer-config';
// import * as multer from 'multer';

// @Injectable()
// export class UploadInterceptor implements NestInterceptor {
//   private upload: multer.Multer;
  
//   constructor() {
//     this.upload = multer(multerStorage);
//   }

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     console.log('inside the upload interceptor')
    
//     const request = context.switchToHttp().getRequest();
//     return new Observable(observer => {
//       this.upload.single('image')(request, null, async err => {
//         if (err) {
//           observer.error(err);
//         } else {
//           observer.next(request.file);
//           observer.complete();
//           console.log("inside")
//         }
//       });
//     })
//   }
// }

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import { multerStorage } from './multer-config';
@Injectable()
export class UploadInterceptor implements NestInterceptor {
  private upload: multer.Multer;
  
  constructor() {
    this.upload = multer({ storage: multerStorage });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Inside the interceptor');
    
    const request = context.switchToHttp().getRequest();
    return new Observable(observer => {
      console.log('Interceptor executing...');
      this.upload.single('image')(request, null, async err => {
        if (err) {
          console.error('Error uploading file:', err);
          observer.error(err);
        } else {
          console.log('File upload successful');
          observer.next(request.file);
          observer.complete();
        }
        
      });
    })
  }
}
