var vcard = require('../lib/vcard-json');

vcard.parseVcardFile('./some-contact.vcf', function(err, data){
  
  if(err) console.log('oops:'+ err);
  else {
    console.log('Async parseVcardFile is good to go:\n'+ JSON.stringify(data)); 
  }
});

vcard.parseVcardFile('./gmail-vcard3.vcf', function(err, data) {
  if(err) console.log('oops:'+ err);
  else {
    console.log('Async parseVcardFile with gmail v3 contact is good to go:\n'+ JSON.stringify(data)); 
  }
})

var vcardString = 'BEGIN:VCARD\n'+
  'VERSION:3.0\n'+
  'PRODID:-//Apple Inc.//Mac OS X 10.10.2//EN\n'+
  'N:Smith;John;;;\n'+
  'FN:John Smith\n'+
  'EMAIL;type=INTERNET;type=HOME;type=pref:john.home@smith.com\n'+
  'EMAIL;type=INTERNET;type=WORK:john.work@smith.com\n'+
  'TEL;type=CELL;type=VOICE;type=pref:(805) 222-3434\n'+
  'TEL;type=IPHONE;type=CELL;type=VOICE:(805) 222-1212\n'+
  'ADR;type=HOME;type=pref:;;123 Main Street;Los Angeles;CA;91310;US\n'+
  'ADR;type=WORK:;;123 Work Street;Fullerton;CA;91311;US\n'+
  'NOTE:these are some notes listed here\n'+
  'BDAY:1980-11-30\n'+
  'UID:504069dc-9db0-4d5c-8b43-8afec70e7248\n'+
  'X-ABUID:DC1F48C5-78B3-495F-83B7-9A51A9976553:ABPerson\n'+
  'END:VCARD';

vcard.parseVcardString(vcardString, function(err, data){
  
    if(err) console.log('oops:'+ err);
    else {
      console.log('Async parseVcardString is good to go:\n'+ JSON.stringify(data)); 
    }
  
});

var result = vcard.parseVcardStringSync(vcardString);
console.log('Sync parseVcardString is good to go:\n'+ JSON.stringify(result)); 