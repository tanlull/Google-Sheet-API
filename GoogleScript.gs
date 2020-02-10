/*
google sheet
 https://docs.google.com/spreadsheets/d/1_JGGOYqwX3wQ8QtXs6iyxZ0HBOTu15wJtvhqWOtJxXo/edit?usp=sharing

GET: https://script.google.com/macros/s/AKfycbwolm39hrs0j3IT_snyMzmwY0Rcvl-AO4WYWXnCNLR4bg4b6Bdc/exec?queryText=2&lang=th

POST : https://script.google.com/macros/s/AKfycbwolm39hrs0j3IT_snyMzmwY0Rcvl-AO4WYWXnCNLR4bg4b6Bdc/exec
  {
  "queryResult": {
    "queryText": "1",
    "parameters": {
      "number": 1,
      "lang": "th"
    }
   }
  }
*/

var ss =SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheets()[0];

function doPost(request){ // JSON
  var data = JSON.parse(request.postData.contents)
  var userMsg = data.queryResult.queryText;
  var dispLang = data.queryResult.parameters.lang;
  return dialogFlow(userMsg,dispLang)
}


function doGet(request){ // ?queryText=1&lang=th
  var params = request.parameter;
  var userMsg =  params.queryText;
  var dispLang = params.lang;
  return dialogFlow(userMsg,dispLang)
}

function dialogFlow(userMsg,dispLang){
  var values = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
  
  //Switch Language th= 3 , en = 2
  if (dispLang=="th") resultColumn = 3
  else resultColumn = 2
  
  for(var i = 0;i<values.length; i++){
    if(values[i][0] == userMsg ){
      i=i+2;
      var Data = sheet.getRange(i,resultColumn).getValue();
      var result = {
        "fulfillmentMessages": [
          {
            "platform": "line",
            "type": 4,
            "payload" : {
              "line":  {
                "type": "text",
                "text": Data
              }
              
            }
          }
        ]
      }
      
      var replyJSON = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
      return replyJSON;
    }
  }
}