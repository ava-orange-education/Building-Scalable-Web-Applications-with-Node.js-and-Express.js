export class Book {
  private _title: string;
  private _author: string;
  private _price: number;

  constructor(title: string, author: string, price: number) {
    this._title = title;
    this._author = author;
    this._price = price;
  }

  // Getter method for title
  get title(): string {
    return this._title;
  }

  // Setter method for title
  set title(value: string) {
    this._title = value;
  }

  // Getter method for author
  get author(): string {
    return this._author;
  }

  // Setter method for author
  set author(value: string) {
    this._author = value;
  }

  // Getter method for price
  get price(): number {
    return this._price;
  }

  // Setter method for price
  set price(value: number) {
    this._price = value;
  }

  displayInfo() {
    console.log(`Title: ${this.title}`);
    console.log(`Author: ${this.author}`);
    console.log(`Price: $${this.price}`);
  }
}

// Create an instance of the Book class
const myBook = new Book('The Great Gatsby', 'F. Scott Fitzgerald', 15.99);

// Use getter and setter methods to update book information
myBook.title = 'To Kill a Mockingbird';
myBook.author = 'Harper Lee';
myBook.price = 1200.99;

// Display updated book information
myBook.displayInfo();

