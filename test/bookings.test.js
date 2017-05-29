const should = require('chai').should();
const session = require('supertest-session');
const app = require('../app');
const randomstring = require('randomstring');
const Bookings = require('../models/booking');
const Cars = require('../models/car_admin');
const Users = require('../models/user');

describe('Bookings', () => {
    let user = null;
    let car = null;
    let bookingId = null;
    const api = session(app);

    //Skapar användare och bil att använda i testerna
    before(() => {
        user = new Users({
            username: randomstring.generate(),
            password: randomstring.generate(),
            firstname: 'Test',
            lastname: 'User',
            email: 'test@test.nu'
        });
        user.save((err) => {
            if (err) console.log(err);
        });
        car = new Cars({
            typ: 'volvo',
            automat: true,
            rail: true,
            price: 1000,
            seats: 4
        });
        car.save((err) => {
            if (err) console.log(err);
        });
    });

    //Raderar användare och bil som skapades för test
    after(() => {
        user.remove((err) => {
            if (err) console.log(err);
        });
        car.remove((err) => {
            if (err) console.log(err);
        });
    });

    it('should book a car and return the booking and add booking to car', done => {
        api.post('/bookings')
            .send({
                car_id: car._id,
                user_id: user._id,
                date_from: Date.now(),
                date_to: Date.now()
            })
            .end((err, res) => {
                if (err) done(err)
                else {
                    res.body.user_id.toString().should.equal(user._id.toString());
                    bookingId = res.body._id;
                    Cars.findById(car._id, (err, data) => {
                        if (err) done(err)
                        else {
                            data.booked.should.include(bookingId);
                            done();
                        }
                    })
                }
            })
    })
    it('should delete the booking and return success', done => {
        api.delete(`/bookings/${bookingId}`)
            .end((err, res) => {
                if (err) done(err)
                else {
                    res.body.message.should.include('success');
                    done();
                }
            })
    });
})