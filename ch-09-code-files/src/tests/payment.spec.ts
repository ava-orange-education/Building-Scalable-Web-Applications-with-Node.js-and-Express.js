import { expect } from 'chai';
import { describe, it } from 'mocha';

class Payment {
    private amount: number;
    private method: string;

    constructor(amount: number, method: string) {
        this.amount = amount;
        this.method = method;
    }

    processPayment(): string {
        // Simulate payment processing
        return `Payment of ${this.amount} processed via ${this.method}`;
    }
}

describe('Payment', () => {
    let payment: Payment;

    // Before hook: This will run before the test suite
    before(() => {
        console.log('Setting up payment processing...');
        // Perform setup tasks, e.g., initialize payment gateway
        payment = new Payment(100, 'Credit Card');
    });

    // After hook: This will run after the test suite
    after(() => {
        console.log('Tearing down payment processing...');
        // Perform teardown tasks, e.g., close payment gateway connection
        payment = null!;
    });

    // Test case
    it('should process payment successfully', () => {
        // Act
        const result = payment.processPayment();

        // Assert
        expect(result).to.equal('Payment of 100 processed via Credit Card');
    });
});