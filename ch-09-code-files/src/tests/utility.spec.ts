import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

import { describe, it } from 'mocha';
// Use Chai with Chai HTTP
const expect = chai.expect;
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            expect([1, 2, 3].indexOf(4)).to.equal(-1);
        });
    });
});
