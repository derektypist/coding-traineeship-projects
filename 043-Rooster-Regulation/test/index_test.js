const assert = require('assert');
const Rooster = require('../index');
describe('rooster', () => {
  describe('announcedawn', () => {
    it('returns a rooster call', () => {
      // Setup
      const expected = 'cock-a-doodle-doo!';

      // Exercise
      let actual = Rooster.announceDawn();

      // Verify
      assert.equal(actual, expected);
    });
  });
  describe('timeatdawn', () => {
    it('returns its argument as a string', () => {
      // Setup
      let expected = '15';

      // Exercise
      let actual = Rooster.timeAtDawn(15);


      // Verify
      assert.strictEqual(actual, expected);
    });

    it('throws an error if passed a number less than 0', () => {
      // Setup
      let input = -2;
      let expected = RangeError;

      
      // Verify
      assert.throws(() => {
        Rooster.timeAtDawn(input);
      }, expected);

    });

    it('throws an error if passed a number greater than 23', () => {
      // Setup
      let input = 29;
      let expected = RangeError;

      // Verify
      assert.throws(() => {
        Rooster.timeAtDawn(input);
      }, expected);
     
    });
  });
});