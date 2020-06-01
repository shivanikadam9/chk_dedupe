var http = require('http');
const fs = require('fs');
var path = require('path');
var multer  = require('multer');
var xlsx = require('xlsx');
var dedupe = require('dedupe');
const express = require('express');
var app = express();
var upload = multer({ dest: 'uploads/' })

/*serving the files on localhost port 8000*/
app.use(express.urlencoded())
console.log(__dirname);
app.use(express.static(__dirname ));
app.listen(8000,() => console.log("Server is running"));



app.post('/sub-form',upload.single('rfile'),(req,res) => {

   //comma separator for filters from which you want to check dedupe, and parse the data
   var filter = req.body.ftext;
   var filterArr = filter.split(',');

   /*Take input as excel file, convert it into json with the use of xlsx package*/
   var buf = xlsx.readFile(req.file.destination + req.file.filename);
   var wb = xlsx.utils.sheet_to_json(buf.Sheets[buf.SheetNames[0]],{header:1,raw:true});
   let data = JSON.parse(JSON.stringify(wb));
   var d1 = new Date();

   //check dedupe according to fields
   let rdata = dedupe(data, value => value[filterArr[0]],value => value[filterArr[1]],value => value[filterArr[2]]);
   var d2 = new Date();


    //time difference and no. of duplictes for dedupe
    var t = d2.getTime()-d1.getTime();
    var noDupli = data.length - rdata.length;

    //stringify rdata
    let data_new = JSON.stringify(rdata,null,2);

    res.send(data_new);
});
