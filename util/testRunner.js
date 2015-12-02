
var startTests = function(test_dict) {
    for(test in test_dict) { //for each of the 18 families in the controls 
        it('test'+test,test_dict[test]);
    }
};

var test_dict = require('../index.js').test_dict
startTests(test_dict);
