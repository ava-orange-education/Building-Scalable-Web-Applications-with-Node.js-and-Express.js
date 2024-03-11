// Abstract class representing a Book
abstract class Book {
  protected title: string;
  protected author: string;
  protected price: number;

  constructor(title: string, author: string, price: number) {
    this.title = title;
    this.author = author;
    this.price = price;
  }

    // Abstract method to display book information
    abstract displayInfo(): void;
}

// Concrete class representing a PrintedBook, extending Book
class PrintedBook extends Book {
  private format: string;

  constructor(title: string, author: string, price: number, format: string) {
    super(title, author, price);
    this.format = format;
  }

  // Implementation of abstract method to display book information
  displayInfo(): void {
    console.log(`Title: ${this.title}`);
    console.log(`Author: ${this.author}`);
    console.log(`Price: $${this.price}`);
    console.log(`Format: ${this.format}`);
  }
}

// Create instances of books
const printedBook = new PrintedBook('The Great Gatsby', 'F. Scott Fitzgerald', 15.99, 'Hardcover');

// Display book information
printedBook.displayInfo();
