import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

import { describe, it } from 'mocha';
// Use Chai with Chai HTTP
const expect = chai.expect;
import { app } from '../common/utility.spec';
let authToken; // Declare a variable to store the authentication token

describe('Login API', () => {
    it('should return a success message when login is successful', (done) => {
        chai.request(app) // Replace 'app' with your Express app instance
            .post('/api/login')
            .send({ email: 'yamipanchal1993@gmail.com', password: 'Abc@123456' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status').equal('success');
                authToken = res.body.data.accessToken; // Save the authentication token
                done();
            });
    });

    it('should return an error message when login fails', (done) => {
        chai.request(app)
            .post('/api/login')
            .send({ email: 'yamipanchal1993@gmail.com', password: 'wrongpassword' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').equal('Password is not valid');
                done();
            });
    });
});

describe('GET List of Users', () => {
    it('should return array with status code 200', (done) => {
        chai.request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${authToken}`) // Pass the token in the headers
            .end((err, res) => {
                // console.log(res);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('data').to.be.an('array');
                done();
            });
    });
});

describe('ADD User', () => {
    it('should return with status code 201', (done) => {
        chai.request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`) // Pass the token in the headers
            .send({
                'fullname': 'Super Admin',
                'username': 'pms-admin1',
                'email': 'admin@pms1.com',
                'password': 'Admin@pms1',
                'role_id': 'eae0c0bc-65c6-4d4c-b025-d52af2a29f65'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should return with status code 409', (done) => {
        chai.request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${authToken}`) // Pass the token in the headers
            .send({
                'fullname': 'Super Admin',
                'username': 'pms-admin1',
                'email': 'admin@pms1.com',
                'password': 'Admin@pms1',
                'role_id': 'dbda47e4-f843-4263-a4d6-69ef80156f81'
            })
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.have.property('message').equal('Key (username)=(pms-admin1) already exists.');
                done();
            });
    });
});

describe('Delete User', () => {
    it('should return with status code 200', (done) => {
        chai.request(app)
            .delete('/api/users/6d33a810-27f6-4900-936d-dd30d7b4605f')
            .set('Authorization', `Bearer ${authToken}`) // Pass the token in the headers
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should return with status code 404', (done) => {
        chai.request(app)
            .delete('/api/users/0ddc59fe-a9ea-4060-9b39-5118fe13937d')
            .set('Authorization', `Bearer ${authToken}`) // Pass the token in the headers
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});


export { authToken };