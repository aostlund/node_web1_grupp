const should = require('chai').should();
const session = require('supertest-session');
const app = require('../app');
const Cars = require('../models/car_admin');

describe('Cars', () => {
    let api = null;
    let carId = null;

    beforeEach(() => api = session(app));

    // Raderar skapad bil om delete testet skulle mislyckas
    after(() => {
        Cars.remove({ _id: carId }, (err, result) => {
            if (err) console.log(err)
        })
    })

    it('should create a car and return it', done => {
        api.post('/cars/')
            .send({
                typ: 'Volvo',
                automat: true,
                rail: false,
                price: 2000,
                seats: 4
            })
            .end((err, res) => {
                if (err) console.log(err);
                else {
                    res.body.typ.should.equal('Volvo');
                    carId = res.body._id;
                    done();
                }
            })
    })
    it('should get the specified car', done => {
        api.get(`/cars/${carId}`)
            .end((err, res) => {
                if (err) console.log(err);
                else {
                    res.body._id.should.equal(carId);
                    done();
                }
            })
    })
    it('should update a car and return the updated version', done => {
        api.patch(`/cars/${carId}`)
            .send({
                price: 3000,
                seats: 5
            })
            .end((err, res) => {
                if (err) console.log(err);
                else {
                    res.body.price.should.equal(3000);
                    res.body.seats.should.equal(5);
                    done();
                }
            })
    })
    it('should delete a car and return a success message', done => {
        api.delete(`/cars/${carId}`)
            .end((err, res) => {
                if (err) console.log(err);
                else {
                    res.body.message.should.include('success');
                    done();
                }
            })
    })
});