import { Book } from './class';

export class EBook extends Book {
  private _format: string;

  constructor(title: string, author: string, price: number, format: string) {
    super(title, author, price);
    this._format = format;
  }

  // Override displayInfo method to include format
  displayInfo() {
    super.displayInfo(); // Call base class method
    console.log(`Format: ${this._format}`);
  }
}

// Create an instance of the EBook class
const myEBook = new EBook('The Great Gatsby', 'F. Scott Fitzgerald', 15.99, 'PDF');

// Display EBook information
myEBook.displayInfo();