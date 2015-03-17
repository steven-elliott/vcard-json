var fs = require ('fs');
var _ = require ('underscore');
var s = require("underscore.string");

function parseVcard(data) {
  var dataStr = data.toString("utf-8")
  var lines = s(dataStr).lines();

  var all_contacts = [];
  var contact;

  _.each(lines, function(lineContent) {

    if (s(lineContent).startsWith("BEGIN:VCARD")) {
      contact = {};
      contact.fullname = "empty";

      contact.phone = [];
      contact.email = [];
    }

    if (s(lineContent).startsWith("END:VCARD")) {
      all_contacts.push(contact);
    }

    if (s(lineContent).startsWith("FN:")) {
      contact.fullname = s(lineContent.slice(3)).clean().value();
    }

    if (s(lineContent).startsWith("EMAIL;")) {
      var email_obj = {};
      email_obj.value = s(lineContent.substring(lineContent.indexOf(":") + 1)).clean().value();
      email_obj.default = false;
             
      if (s(lineContent).contains("type=pref")) {
        email_obj.default = true;
      }

      contact.email.push(email_obj);
    }

    if (s(lineContent).startsWith("TEL;")) {
      var phone_obj = {};
      phone_obj.value = s(lineContent.substring(lineContent.indexOf(":") + 1)).clean().value();
      phone_obj.default = false;

      if (s(lineContent).contains("type=pref")) {
        phone_obj.default = true;
      }

      contact.phone.push(phone_obj);
    }         
  }); // end _.each

  return all_contacts;     
}

function parseFile(pathToFile, callback) {  

  fs.readFile(pathToFile, function(err, data) {    
    if (err) {
      callback(err);
    }
    else { 
      var all_contacts = parseVcard(data);
      callback(null, all_contacts);
    }    
  }); // end fs.readFile  

}

exports.parseFile = parseFile;