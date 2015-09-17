var vcard = require('../lib/vcard-json');

vcard.parseFile('./Apple Inc..vcf', function(err, data){
  if(err) console.log('oops:'+ err);
  else {
    console.log('should be good to go:\n'+ JSON.stringify(data));    
  }
});