Easily and smartly convert vcard file(s) to a JSON object for [node](http://nodejs.org).

```js
var vcard = require('vcard-json');

vcard.parseVcardFile('some-contact.vcf', function(err, data){
  if(err) console.log('oops:'+ err);
  else {
    console.log('should be good to go:\n'+ JSON.stringify(data));    
  }
});
```

## Installation

```bash
$ npm install vcard-json
```