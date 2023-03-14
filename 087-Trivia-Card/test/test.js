console.log = function() {};
const assert = require('chai').assert;
const fs = require('fs');
const Structured = require('structured');

const code = fs.readFileSync('js/main.js', 'utf8');

describe('', function () {
  it('', function() {
    // Match for method call
    let structureMethod= function() {
      $('.first-image').hide();
    };
    let isMatchSelector = Structured.match(code, structureMethod);
    assert.isOk(isMatchSelector, 'Append .hide() to your selected image.');
    
  });
});