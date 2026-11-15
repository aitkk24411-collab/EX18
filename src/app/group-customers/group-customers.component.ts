import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ICustomerGroup } from '../models/customer';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-group-customers',
  standalone: true,
  templateUrl: './group-customers.component.html',
  styleUrl: './group-customers.component.css'
})
export class GroupCustomersComponent implements OnInit {
  private readonly service = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);
  readonly groups = signal<ICustomerGroup[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void { this.loadCustomers(); }

  loadCustomers(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.getCustomers().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: groups => this.groups.set(groups),
      error: (error: Error) => this.errorMessage.set(error.message)
    });
  }
}
