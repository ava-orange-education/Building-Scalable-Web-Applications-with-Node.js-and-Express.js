class Car {
  public brand: string;

  constructor(brand: string) {
    this.brand = brand;
  }

  public startEngine() {
    console.log(`Starting the engine of ${this.brand} car.`);
  }
}

const myCar = new Car('Toyota');
console.log(myCar.brand); // Accessing public property
myCar.startEngine();
