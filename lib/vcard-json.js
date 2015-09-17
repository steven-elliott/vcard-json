var fs = require ('fs');
var EventEmitter = require("events").EventEmitter;

var ee = new EventEmitter();
var _ = require ('underscore');
var s = require("underscore.string");

var attributes = {};
attributes.fullname = "FN:";
attributes.email = "EMAIL;";
attributes.phone = "TEL;";
attributes.bday = "BDAY:";
attributes.note = "NOTE:";
attributes.addr = "ADR;";

function parseVcard(data) {
  var dataStr = data.toString("utf-8")
  var lines = s(dataStr).lines();
  
  var all_contacts = [];
  var contact;

  _.each(lines, function(lineContent) {

    if (s(lineContent).startsWith("BEGIN:VCARD")) {
      contact = {};
      contact.fullname = "empty";
      contact.bday = "";
      contact.note = "";
      
      contact.addr = [];
      contact.phone = [];
      contact.email = [];
    }

    if (s(lineContent).startsWith("END:VCARD")) {
      all_contacts.push(contact);
    }
    
    _.each(attributes, function(attribute){
      
      // each line can have a group prefix: [group "."] name *(";" param)
      // https://tools.ietf.org/html/rfc6350
      if (s(lineContent).contains(attribute)) {
        ee.emit("attributeMatched", attribute, lineContent, contact); 
      }
    });
        
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

function attributeMatched(attribute, line, contact) {
  
  switch (attribute) {
    case "FN:":
      contact.fullname = s(line.slice(3)).clean().value();
      break;
      
    case "EMAIL;":
      var email_obj = {};
      email_obj.value = s(line.substring(line.indexOf(":") + 1)).clean().value();
      email_obj.default = false;           
      if (s(line).contains("type=pref")) {
        email_obj.default = true;
      }
      contact.email.push(email_obj);      
      break;
      
    case "TEL;":
      var phone_obj = {};
      phone_obj.value = s(line.substring(line.indexOf(":") + 1)).clean().value();
      phone_obj.default = false;

      if (s(line).contains("type=pref")) {
        phone_obj.default = true;
      }

      contact.phone.push(phone_obj);
      break;
      
    case "BDAY:":
      contact.bday = s(line.slice(5)).clean().value();
      break;
    
    case "NOTE:":
      contact.note = s(line.slice(5)).clean().value();
      break;
      
    case "ADR;":
      var addr_obj = {};      
      addr_obj.default = s(line).contains("type=pref");
      
      var address = s(line.substring(line.indexOf(":;;") + 3)).clean().value();      
      var addressItems = address.split(";");
      var numItems = addressItems.length;
      addr_obj.street = numItems > 0? addressItems[0] : "";
      addr_obj.city = numItems > 1? addressItems[1] : "";
      addr_obj.state = numItems > 2? addressItems[2] : "";
      addr_obj.zip = numItems > 3? addressItems[3] : "";
      addr_obj.country = numItems > 4? addressItems[4] : "";
      
      contact.addr.push(addr_obj);
      break;
  }
}

ee.on("attributeMatched", attributeMatched);
exports.parseFile = parseFile;