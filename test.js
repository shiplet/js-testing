var data = require('./data');
var test = require('./spec/test.spec');

// describe('Test parseTemplate', function(){
//     it('should return false', function(){
// 	var a = test.parseTemplate(data, 4);
// 	expect(a).toBe(true);
//     });
// });


var a = test.parseTemplate(data, 4);
console.log(JSON.stringify(a, null, 2));
