process.env.NODE_ENV = 'unit_test';
var control_tester = require('../index.js');
var should = require('should')

var passing = function(done) {
    done()
}
var failing = function(done) {
    throw new Error("error");
}

var test_dict = {
    '1': passing,
    '2': passing
}
startTests = function() {
    it('should pass in 2 passing tests', function(done) {
        control_tester(test_dict, function(resultCount) {
            console.log(resultCount)
            resultCount.passing.should.equal(2)
            done()
        })
    });
    it('should pass in 1 passing tests and one failing', function(done) {
        test_dict['1'] = failing
        control_tester(test_dict, function(resultCount) {
            console.log(resultCount)
            resultCount.passing.should.equal(1)
            resultCount.failing.should.equal(1)
            done()
        })
    });
};
startTests();
