var assert = require("assert");
var Calculate =  require('../index.js')

describe('Calculate', () => {
  describe('.factorial', () => {
    it('if the output of 5! is equal to 120', () => {
      const expected = 120;
      const result = Calculate.factorial(5);
      assert.equal(result, expected);
    });

    it('if the output of 3! is equal to 6', () => {
      const expected = 6;
      const result = Calculate.factorial(3);
      assert.equal(result, expected);
    });

    it('if the output is 0! is equal to 1', () => {
      const expected = 1;
      const result = Calculate.factorial(0);
      assert.equal(result, expected);  
    });
  });
});