// Define an interface for a Printable item
interface IPrintable {
    print(): void;
}

// Implement the Printable interface for a Book class
class Books implements IPrintable {
  constructor(private title: string, private author: string) { }

  // Implement the print method from the Printable interface
  print(): void {
    console.log(`Title: ${this.title}`);
    console.log(`Author: ${this.author}`);
  }
}

// Implement the IPrintable interface for a Document class
class Documents implements IPrintable {
  constructor(private name: string) { }

  // Implement the print method from the Printable interface
  print(): void {
    console.log(`Document Name: ${this.name}`);
    console.log('This is a Printable document.');
  }
}

// Create instances of Book and Document
const book = new Books('The Great Gatsby', 'F. Scott Fitzgerald');
const doc = new Documents('Sample Document');

// Call the printItem function with different Printable items
book.print();
doc.print();