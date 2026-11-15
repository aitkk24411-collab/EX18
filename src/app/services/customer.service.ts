import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ICustomerGroup } from '../models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/data/customers.json';

  getCustomers(): Observable<ICustomerGroup[]> {
    return this.http.get<ICustomerGroup[]>(this.url).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        const detail = error.status === 0
          ? 'Không thể kết nối đến máy chủ.'
          : error.status >= 200 && error.status < 300
            ? 'Nội dung JSON không hợp lệ.'
            : `HTTP ${error.status}.`;
        return throwError(() => new Error(
          `Không tải được danh sách khách hàng. ${detail} Vui lòng kiểm tra customers.json và thử lại.`
        ));
      })
    );
  }
}
