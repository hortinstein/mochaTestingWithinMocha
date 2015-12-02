# How can I passing functions to test in a programatic invocation of Mocha.run()

I am writing a very specific wrapper around Mocha that enables a very specific API where you supply functions mapped to specific names of required tests.  

I am having the following issue getting the Mocha tests to recognize my function changes in my test files, which use mocha to test my mocha wrapper.

I know that this is a strange implementation, but it has been very effective...except in the limited case below.  More details on the project can be found here: https://github.com/hortinstein/NISTonomicon

I have stripped out much of the code to provide the following 3 snippets that can be used to replicate the issue (full code repo can be retrieved [here](https://github.com/hortinstein/mochaTestingWithinMocha)) in the following folder configuration.  
![Imgur](http://i.imgur.com/eUVtmVR.png)

The code I am testing is in index.js
```js
//index.js
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
```

The code responsible for running the tests passed to index is:
```js

var startTests = function(test_dict) {
    for(test in test_dict) { //for each of the 18 families in the controls 
        it('test'+test,test_dict[test]);
    }
};

var test_dict = require('../index.js').test_dict
startTests(test_dict);

```

and finally the code I am using to test this test wraper is

```js
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
```

Unfortunately this has not worked and produces the following result, showing that the line 92: ( ```test_dict['1'] = failing``` ) of ```test.js``` that attempts to change the function dictionary for the next iterations of tests does not work.  
```
$ npm test
```

![Imgur](http://i.imgur.com/MAeZWzs.png)

I have tried a various set of approaches including process.spawn (cound not figure out a clean way to serialize the functions from test.js), cache clearing (could not find the right module to do it or the right cache to clear), globals (set in index.js for the test dict) and a few other ways. I could really use some help!  Thank you!
