import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { GroupCustomersComponent } from './app/group-customers/group-customers.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: 'customers', component: GroupCustomersComponent },
      { path: '**', redirectTo: 'customers' }
    ])
  ]
}).catch(error => console.error(error));
