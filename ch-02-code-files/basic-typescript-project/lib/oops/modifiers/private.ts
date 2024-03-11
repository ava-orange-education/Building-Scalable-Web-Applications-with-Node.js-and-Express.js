class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  public deposit(amount: number) {
    this.balance += amount;
  }

  public getBalance() {
    return this.balance; // Accessing private property
  }
}

const account = new BankAccount(1000);
console.log(account.getBalance()); // Accessing public method
account.deposit(500);              // Accessing public method
// console.log(account.balance);      // Error: Property 'balance' is private