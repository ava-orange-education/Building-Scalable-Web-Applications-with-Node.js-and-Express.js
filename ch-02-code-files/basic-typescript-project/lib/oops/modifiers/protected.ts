class MyBook {
  // Public properties
  public title: string;
  public author: string;
  protected price: number; // Protected property

  constructor(title: string, author: string, price: number) {
    this.title = title;
    this.author = author;
    this.price = price;
  }
}

class EBook extends MyBook {
  private format: string;

  constructor(title: string, author: string, price: number, format: string) {
    super(title, author, price);
    this.format = format;
  }

  public displayInfo() {
    console.log(`Price: ${this.price}`);
  }
}

// Create an instance of the Book class
const myBook = new MyBook('The Great Gatsby', 'F. Scott Fitzgerald', 15.99);

// console.log(myBook.price); // Error: Property 'price' is protected and only accessible within the class and its subclasses


// Create an instance of the EBook class
const myEBook = new EBook('The Great Gatsby', 'F. Scott Fitzgerald', 15.99, 'PDF');

// Accessing public properties and method of EBook
myEBook.displayInfo(); // Accessible