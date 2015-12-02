var Mocha = require('mocha');
var mocha = new Mocha();
if(process.env.NODE_ENV === 'unit_test') { //unit testing of this module requires specific modification to test
    module.exports = function(test_dict, callback) {
        mocha.addFile('./util/testRunner.js');
        module.exports.test_dict = test_dict
        defaultConsolelog = console.log
        console.log = function() {}
        var resultCount = {
            pending: 0,
            passing: 0,
            failing: 0
        }
        // Run the tests.
        mocha.run(function(failures) {
            console.log = defaultConsolelog;
            callback(resultCount);
        }).on('pass', function(test) {
            resultCount.passing++
        }).on('fail', function(test, err) {
            resultCount.failing++
        }).on('pending', function() {
            resultCount.pending++
        });;
    }
} else {
    module.exports = function(test_dict, callback) {
        module.exports.overlay = overlay
        // Run the tests.
        mocha.run(function(failures) {
            callback(failures);
        });
    }
}