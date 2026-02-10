/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready



document.addEventListener('deviceready', function() {
    printlog('Running cordova-' + cordova.platformId + '@' + cordova.version);
    printlog("Device ready, Bluetooth plugin available:", bluetoothSerial);
    // Scan for devices
    bluetoothSerial.list(function(devices) {
        var dev_list =  document.getElementById('dev_list')
        var _option = `<option disabled selected>Select Device</option>`
        devices.forEach(function(device) {
            printlog("Device detected:", device.name+":"+device.id);
            _option = _option+ `<option value=`+device.id+`>`+device.name+" : "+device.id+`</option>`
        });
        dev_list.innerHTML = _option
    }, function(error) {
        printlog("Error listing devices:", error);
        // console.error("Error listing devices:", error);
    });


});

function showData(value) {
    document.getElementById("output").innerText = "Data: " + value;
}

function connect_device(dev_id){
    printlog("connecting to :"+ dev_id)
    bluetoothSerial.connect("dev_id", function() {
        printlog("Connected successfully : "+ dev_id);
        listen_to_data(process_data)
    }, function(error) {
        printlog("Connection failed:", error);
        // console.error("Connection failed:", error);
    });

}

function process_data(data){
    create_chart(data);
}

function send_data(data){
    bluetoothSerial.write(data, function() {
        printlog("Data sent successfully");
    }, function(error) {
        printlog("Send failed:", error);
        // console.error("Send failed:", error);
    });

}

 function get_data(func){
    bluetoothSerial.read(function(data) {
        printlog("Received:", data);
        func(data)
    }, function(error) {
        printlog("Read failed:", error);
        // console.error("Read failed:", error);
    });
 }

 function listen_to_data(func){
    printlog("Listening......")
    bluetoothSerial.subscribe("\n", function(data) {
        printlog("Incoming data:", data);
        func(data)
    }, function(error) {
        printlog("Subscription failed:", error);
        // console.error("Subscription failed:", error);
    });

 }

 function printlog(...data){
    console.log(...data)
    document.getElementById('logs').innerHTML = "<span class='x-tiny'>"+gettime()+" "+ getdate()+" - "+data[0] + " : " +data[1] + "</span><br>"+document.getElementById('logs').innerHTML
 }

 function getdate(){
    const today = new Date();

    // Uses the browser's default locale and format (e.g., "2/11/2026" in en-US)
    const localDateString = today.toLocaleDateString();
    console.log(localDateString);

    // Specify options for a consistent format (e.g., "02/11/2026")
    const formattedDate = today.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formattedDate

 }

 function gettime(){
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { timeStyle: 'short' });
    return timeString

 }