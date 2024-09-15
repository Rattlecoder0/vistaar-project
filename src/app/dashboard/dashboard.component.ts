import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Transaction {
  name: string;
  address: string;
  accounts: number[];
}

interface transactions {
  amount: number;
  date: Date;
  price: number;
  symbol: string;
  total: number;
  transaction_code: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  url: string = 'http://localhost:3000'
  customers: any[] = [];
  transactions: transactions[] = [];
  accountsIdBelow5k: Transaction[] = [];
  distinctProducts: any[] = [];
  below5k: boolean = false;
  p: number = 1;
  customerDataTable: any[] = [];  

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Fetch the list of customers from the API
    this.http.get(`${this.url}/customers`).subscribe((data: any) => {
      // filter active customers
      this.customers = data.filter((customer: { active: any; }) => customer.active);
      this.updatePaginatedData()
    });

    // get distinct products 
    this.http.get(`${this.url}/accounts/distinct-products`).subscribe({
      next: (data:any) => { 
        console.log(data)
        this.distinctProducts = data
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  viewTransactions(accountId: number) {
    this.transactions = []
    this.http.get(`${this.url}/transactions?account_id=${accountId}`).subscribe({
      next: (data: any) => {
        console.log('tran', data)
        data.forEach((e: any) => {
          e.transactions.forEach((t: any) => {
            this.transactions.push(t)
          });
        });
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  accountsBelow5k(event: any) {
    if (event.target.checked) {
      this.below5k = true
      this.http.get(`${this.url}/customer-accountId-b5k`).subscribe({
        next: (data: any) => {
          this.accountsIdBelow5k = data
          this.updatePaginatedData()
        }
      })
    }
    else {
      this.below5k = false
      this.updatePaginatedData()
      return
    }
  }

  updatePaginatedData() {
    if (this.below5k) {
      this.customerDataTable = this.accountsIdBelow5k;
    } else {
      this.customerDataTable = this.customers;
    }
  }
}
