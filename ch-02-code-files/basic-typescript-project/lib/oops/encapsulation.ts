class BankAccountClass {

  private accountNumber: string;
  private balance: number;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited ${amount} into account ${this.accountNumber}. New balance: ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount > this.balance) {
      console.log('Insufficient funds.');
    } else {
      this.balance -= amount;
      console.log(`Withdrawn ${amount} from account ${this.accountNumber}. New balance: ${this.balance}`);
    }
  }

  getAccountInfo(): void {
    console.log(`Account Number: ${this.accountNumber}, Balance: ${this.balance}`);
  }
}

// Create an instance of the BankAccount class
const myAccount = new BankAccountClass('123456789', 1000);

// Accessing properties and methods using encapsulation
myAccount.deposit(500); // Deposited 500 into account 123456789. New balance: 1500
myAccount.withdraw(200); // Withdrawn 200 from account 123456789. New balance: 1300
myAccount.getAccountInfo(); // Account Number: 123456789, Balance: 1300

// Attempting to access private members directly (will result in TypeScript compilation error)
// console.log(myAccount.accountNumber); // Error: Property 'accountNumber' is private and only accessible within class 'BankAccount'.
// console.log(myAccount.balance); // Error: Property 'balance' is private and only accessible within class 'BankAccount'.
