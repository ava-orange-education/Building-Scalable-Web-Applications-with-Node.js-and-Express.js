import chai from 'chai';
const expect = chai.expect;

// Expect a value to be equal to another value
expect(5).to.equal(5);

// Expect an array to include a specific element
expect([1, 2, 3]).to.include(2);

// Expect a value to be a certain data type
expect('Hello').to.be.a('string');

// Expect an object to have a property
expect({ name: 'John' }).to.have.property('name');
