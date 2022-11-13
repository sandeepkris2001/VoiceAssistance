// getting various elements from index.html
const machine = document.querySelector(".machine");
const turn_on = document.querySelector("#turn_on");
const time = document.querySelector("#time");

const display = document.querySelector(".display")
let paragraph = document.createElement('p')
display.appendChild(paragraph)

// whether the recognition is stopping on my command or automatically. stop checking
let stopingR = false;

// youtube window
let ytbWindow;

//declaring variables
let charge,chargeStatus, connectivity, currentTime
chargeStatus = "unplugged"

//onstart it will start to listen
window.onload = () => {
  // turn_on.play();
  turn_on.addEventListener("ended", () => {
    setTimeout(() => {
      // autoAssisstant();
      readOut("good to go now");
    }, 200);
  });


  // battery percentage
  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  //getting battery from pc
  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  //printing battery percentage output
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${
      (batteryObject.level * 100).toFixed(2)
    }%`;
    charge = batteryObject.level * 100
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${
        (batteryObject.level * 100).toFixed(2)
      }% Charging`;
      chargeStatus = "plugged in"
    }
  }

};

// date and time
let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

//12hr format
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    currentTime = strTime
    time.textContent = strTime
  }
  
  //replying the date
  formatAMPM(date)
  setInterval(() => {
    formatAMPM(date)
  }, 60000);

// auto starting assisstant

function autoAssisstant() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}

const lang = navigator.language;

      let datex = new Date();
      let dayNumber 	= date.getDate();
      let monthx 		= date.getMonth();

      let dayName 	= date.toLocaleString(lang, {weekday: 'long'});
      let monthName 	= date.toLocaleString(lang, {month: 'long'});
      let year 		= date.getFullYear();
// start assisstant with btn
document.querySelector("#start_btn").addEventListener("click", () => {
  recognition.start();
})

//stop assisstant with btn
document.querySelector("#stop_btn").addEventListener("click", () => {
  stopingR = true;
  recognition.stop();
})

// //email
// let emailId={
//   'ghost':'sandeepkghostoffi12@gmail.com',
//   'mentor1':'sandeepkris2001@gmail.com'
// }


if (localStorage.getItem("jarvis_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
}

// speech recognition

// speech lang
let speech_lang = "ta-IN"
if(localStorage.getItem("lang") === null){
  localStorage.setItem("lang", "en-US")
}

//speech recognition console
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = localStorage.getItem("lang")

//reading out the result
var synth = window.speechSynthesis;

//when start button is clicked assisstant starts
recognition.onstart = function () {
  console.log("voice recognition activated");
  readOut("speech recognition started")
  document.querySelector("#stop_btn").style.display = "flex"
};

// arr of window
let windowsB = []

//return the result
recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  //printing the user speech in console
  console.log(transcript);
  paragraph.textContent = transcript
    if(localStorage.getItem("lang") === "en-US"){
      
    //battery percentage
    if (transcript.includes("battery") || transcript.includes("charge percentage")) {
      readOut(`the current charge is ${charge} percentage`);
    }
    //battery status
    if (transcript.includes("charge status")) {
      readOut(`the current charging status is ${chargeStatus}`);
    }


    //Time
    if (transcript.includes("time")) {
      if(hrs>12){
        if(hrs==13 || hrs==14 || hrs==15 || hrs==16){
          readOut(`it's Afternoon. ${hrs-12} ${mins} PM`);
        }else if(hrs==17 || hrs==18 || hrs==19){
          readOut(`it's Evening. ${hrs-12} ${mins} PM`);
        }else if(hrs==20 || hrs==21 || hrs==22 || hrs == 23){
          readOut(`it's Night. ${hrs-12} ${mins} PM`);
        }
      }else if(hrs<12){
        if(hrs==1 || hrs==2){
          readOut(`it's Mid Night. ${hrs-12} ${mins} AM`);
        }else if(hrs==0){
          readOut(`it's Mid Night. ${hrs+12} ${mins} AM`);
        }
        else if(hrs>=3 && hrs<=11){
          readOut(`it's Morning. ${hrs} ${mins} AM`);
        }
      }else if(hrs==12){
        readOut(`it's Afternoon. ${hrs} ${mins} PM`);
      }
      }else if(transcript.includes(" day")) {
        readOut(`its ${dayName}`);
      }


    //Date
    if (transcript.includes("date")) {
      readOut(`its ${dayNumber}${monthName}${year}`);
    }
    
    //month
    if (transcript.includes("month")) {
      readOut(`its ${monthName}`);
    }
    //year
    if (transcript.includes("year")) {
      readOut(`its ${year}`);
    }



    //Lexi Information
    //Self Intro
    if (transcript.includes("tell about yourself") ||transcript.includes("introduce yourself")|| transcript.includes("who am i speaking with") ||transcript.includes("whom am i speaking with")|| transcript.includes("who are you") || transcript.includes("tell me about yourself") ) {
         readOut(
        "hi, i am Lexi, a voice assistant made for browsers using javascript. I can do some basic operations which can be done from a browser."
      );
    }
    //Name
    if (transcript.includes("your name")) {
      readOut("my name is Lexi, i'm a personal assistant developed for you");
    }
    if (transcript.includes("how are you")) {
      readOut("That's so kind. I'm good. what about you");
    }else if(transcript.includes("fine")){
      readOut("great")
    }
   //Welcome
    if (transcript.includes("hi,") || transcript.includes("hey,") || transcript.includes("hi.") || transcript.includes("hey.")) {
      readOut("hello there, what can i do for you");
    }
    //Availability check
    if (transcript.includes("are you there")) {
      readOut("yes. i am there. what can i do for you");
    }
    //Ok
    if (transcript.includes("ok")||transcript.includes("fine")) {
      readOut("that's good");
    }
    //thankyou
    if (transcript.includes("thank you")) {
      readOut("ur always welcome");
    }
    //bye
    if (transcript.includes("bye")) {
      readOut("Wonderful speaking to you. good to see you again");
      stopingR = true;

      recognition.stop();
    }
    


    
    //Web Browsing actionss
    //YouTube
    if (transcript.includes("open youtube")) {
      readOut("opening youtube ");
      let a = window.open("https://www.youtube.com/");
      windowsB.push(a)
    }
    //Spotify
    if(transcript.includes("open spotify") || transcript.includes("songs")) {
      readOut("opening spotify music app");
      let a = window.open("https://open.spotify.com/");
      windowsB.push(a)
    }
    //WhatsApp
    if (transcript.includes("open whatsapp")) {
      readOut("opening whatsapp "); 
      let a = window.open("https://web.whatsapp.com/");
      windowsB.push(a)
    }
    //Gmail
    if (transcript.includes("open gmail") || transcript.includes("open email")) {
      readOut("opening gmail ");
      let a = window.open("https://www.google.com/gmail/");
      windowsB.push(a)
    }
    //Google Drive
    if(transcript.includes("open google drive") || transcript.includes("open drive")){
      readOut("Opening google drive ");
      window.open("https://drive.google.com/drive/my-drive");
    }
    //searching results in google
    if (transcript.includes("search for")) {
      let input = transcript
      input = input.slice(0,-1);
      if(input.includes("youtube")){
          let b = input.indexOf("search for")
          input = input.split("")
          input.splice(0,b+10)
          input.shift()
          readOut(`Searching youtube for ${input.join("")}`)
          let a = window.open(`https://www.youtube.com/search?q=${input.join("")}`);
          windowsB.push(a)

      }
      else if(input.includes("spotify")){
        let b = input.indexOf("search for")
        input = input.split("")
        input.splice(0,b+10)
        input.shift()
        readOut(`Searching spotify for ${input.join("")}`)
        let a = window.open(`https://open.spotify.com/search/${input.join("")}`);
        windowsB.push(a)

    }else if(transcript.includes("mean by")){
      readOut("");
    }
      else{
        let b = input.indexOf("search for")
        input = input.split("")
        input.splice(0,b+10)
        input.shift()
        readOut(`here's your result for ${input.join("")}`)
        let a = window.open(`https://www.google.com/search?q=${input.join("")}`);
        windowsB.push(a)

      }
    }
    //play something in youtube or spotify
    if (transcript.includes("play")) {
      let input = transcript
      input = input.slice(0,-1);
      if(input.includes("youtube")){
        let b = input.indexOf("play")
        input = input.split("")
        input.splice(0,b+4)
        input.shift()
        readOut(`searching youtube for ${input.join("")} song`)
        let a = window.open(`https://www.youtube.com/search?q=${input.join("")}`);
        windowsB.push(a)

    }
    else if(input.includes("spotify")){
      let b = input.indexOf("play")
      input = input.split("")
      input.splice(0,b+4)
      input.shift()
      readOut(`searching spotify for ${input.join("")} song`)
      let a = window.open(`https://open.spotify.com/search/${input.join("")}`);
      windowsB.push(a)
    }

    }
    //Definition
    if (transcript.includes("mean by")) {
      let input = transcript
      input = input.slice(0,-1);
      let b = input.indexOf("mean by")
      input = input.split("")
      input.splice(0,b+7)
      input.shift()
      readOut(`here's your result for ${input.join("")}`)
      let a = window.open(`https://www.google.com/search?q=mean by ${input.join("")}`);
      windowsB.push(a);
    }

  
  
    //Dictionary
    if (transcript.includes("meaning for")) {
      let input = transcript
      input = input.slice(0,-1);
      let b = input.indexOf("meaning for")
      input = input.split("")
      input.splice(0,b+11)
      input.shift()
      readOut(`here's your result for ${input.join("")}`)
      let a = window.open(`https://www.dictionary.com/browse/${input.join("")}`);
      windowsB.push(a)
    }
    
    
    



    //Weather Forecast
    if (transcript.includes("temperature today") || transcript.includes("weather today")|| transcript.includes("what's it like outside")) {
         let weatherStatement = "";
      const success = (position) =>{
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude+" "+longitude)
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=e615b260dbc548fea621f7335b6e3741`;

    
        fetch(geoUrl).then(res => res.json()).then(data =>{

          mlocation = data.locality;
          const weatherCont = document.querySelector(".temp").querySelectorAll("*");
    
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${data.locality}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function () {
        if (this.status === 200) {
          let data = JSON.parse(this.responseText);
          weatherCont[0].textContent = `Location : ${data.name}`;
          weatherCont[1].textContent = `Country : ${data.sys.country}`;
          weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
          weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
          weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          weatherCont[5].textContent = `Original Temperature : ${ktc(
            data.main.temp
          )}`;
          weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
          weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
          weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
          readOut(weatherStatement = `the weather of ${data.name} is ${
            data.weather[0].description
          } and the temperature feels like ${ktc(data.main.feels_like)} degrees and the original temperature is ${ktc(
            data.main.temp)} degrees `);
        } else {
          weatherCont[0].textContent = "Weather Info Not Found";
        }
      };
    
      xhr.send();
   // convert kelvin to celcius
      function ktc(k) {
        k = k - 273.15;
        return k.toFixed(2);
      }
              });
            }
            navigator.geolocation.getCurrentPosition(success);
      }

    //Weather in specific place
    if(transcript.includes("temperature at my location") ||transcript.includes("temperature in my location")||transcript.includes("weather in my location") || transcript.includes("temperature here")|| transcript.includes("weather at my location") || transcript.includes("weather here")) {
      let weatherStatement = "";
   const success = (position) =>{
     const latitude = position.coords.latitude;
     const longitude = position.coords.longitude;
     console.log(latitude+" "+longitude)
     const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=e615b260dbc548fea621f7335b6e3741`;

 
     fetch(geoUrl).then(res => res.json()).then(data =>{

       mlocation = data.locality;
       const weatherCont = document.querySelector(".temp").querySelectorAll("*");
 
   let url = `https://api.openweathermap.org/data/2.5/weather?q=${data.localityInfo.administrative[2].name}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
   const xhr = new XMLHttpRequest();
   xhr.open("GET", url, true);
   xhr.onload = function () {
     if (this.status === 200) {
       let data = JSON.parse(this.responseText);
       weatherCont[0].textContent = `Location : ${data.name}`;
       weatherCont[1].textContent = `Country : ${data.sys.country}`;
       weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
       weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
       weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
       weatherCont[5].textContent = `Original Temperature : ${ktc(
         data.main.temp
       )}`;
       weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
       weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
       weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
       readOut(weatherStatement = `the weather of ${data.name} is ${
         data.weather[0].description
       } and the temperature feels like ${ktc(data.main.feels_like)} degrees and the original temperature is ${ktc(
         data.main.temp)} degrees `);
     } else {
       weatherCont[0].textContent = "Weather Info Not Found";
     }
   };
 
   xhr.send();
// convert kelvin to celcius
   function ktc(k) {
     k = k - 273.15;
     return k.toFixed(2);
   }
           });
         }
         navigator.geolocation.getCurrentPosition(success);
   }
   else if(transcript.includes("weather report at my location")) {
    const success = (position) =>{
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(latitude+" "+longitude)
      const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=e615b260dbc548fea621f7335b6e3741`;
  
      fetch(geoUrl).then(res => res.json()).then(data =>{
        clocation = data.locality;
        readOut(`opening the weather forecast report of ${clocation},${data.localityInfo.administrative[2].name}`);
    let a = window.open(`https://www.google.com/search?q=weather+in+${clocation}, ${data.localityInfo.administrative[2].name}`);
    windowsB.push(a)
      });
      
    }
    navigator.geolocation.getCurrentPosition(success);
  }
  else if (transcript.includes("weather report at")) {
    let input = transcript
  input = input.slice(0,-1);
  let b = input.indexOf("weather report at")
  input = input.split("")
  input.splice(0,b+17)
  input.shift()      
readOut(`opening the weather forecast report of ${input.join("")}`);
let a = window.open(`https://www.google.com/search?q=weather+in+${input.join("")}`);
windowsB.push(a)

  
  
  }
   //Location
    else if (transcript.includes("location") || transcript.includes("where am i")) {
      const success = (position) =>{
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log(latitude+" "+longitude)

        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=e615b260dbc548fea621f7335b6e3741`;
    
        fetch(geoUrl).then(res => res.json()).then(data =>{
        console.log(`${data.locality},${data.localityInfo.administrative[2].name},${data.principalSubdivision},${data.countryName}`);
        readOut(`right now you are in ${data.locality},${data.localityInfo.administrative[2].name},${data.principalSubdivision},${data.countryName}`);
        let a = window.open(`https://www.google.com/maps?&cp=${latitude}~${longitude}&lvl=11&v=2&sV=1&FORM=MIRE&qpvt=google+maps+${data.locality}+link`);
        windowsB.push(a);

        })

      }
    
      const error = () =>{
        console.log("Not available");
        readOut(`please click the allow button inorder to know your current Location`);

      }
      navigator.geolocation.getCurrentPosition(success,error);
    }
  else if (transcript.includes("temperature in")) {
        let input = transcript
      input = input.slice(0,-1);
      let b = input.indexOf("temperature in")
      input = input.split("")
      input.splice(0,b+14)
      input.shift()      
      let Turl = `https://api.openweathermap.org/data/2.5/weather?q=${input.join("")}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
      
        fetch(Turl).then(res => res.json()).then(data =>{
          readOut(`the weather of ${data.name} is ${data.weather[0].description} and the temperature feels like ${ktc(data.main.feels_like)} degrees and the original temperature is ${ktc(data.main.temp)} degrees`);
        // convert kelvin to celcius
        function ktc(k) {
           k = k - 273.15;
           return k.toFixed(2);
        }
     
        });
  
  }
  else if (transcript.includes("temperature at")) {
    let input = transcript
  input = input.slice(0,-1);
  let b = input.indexOf("temperature at")
  input = input.split("")
  input.splice(0,b+14)
  input.shift()      
  let Turl = `https://api.openweathermap.org/data/2.5/weather?q=${input.join("")}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  
    fetch(Turl).then(res => res.json()).then(data =>{
      readOut(`the weather of ${data.name} is ${data.weather[0].description} and the temperature feels like ${ktc(data.main.feels_like)} degrees and the original temperature is ${ktc(data.main.temp)} degrees`);
    // convert kelvin to celcius
    function ktc(k) {
       k = k - 273.15;
       return k.toFixed(2);
    }
 
    });
}
else if (transcript.includes("weather at")) {
  let input = transcript
input = input.slice(0,-1);
let b = input.indexOf("weather at")
input = input.split("")
input.splice(0,b+10)
input.shift()      
let Turl = `https://api.openweathermap.org/data/2.5/weather?q=${input.join("")}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;

  fetch(Turl).then(res => res.json()).then(data =>{
    readOut(`the weather of ${data.name} is ${data.weather[0].description} and the temperature feels like ${ktc(data.main.feels_like)} degrees and the original temperature is ${ktc(data.main.temp)} degrees`);
  // convert kelvin to celcius
  function ktc(k) {
     k = k - 273.15;
     return k.toFixed(2);
  }

  });
}
else if (transcript.includes("weather in")) {
  let input = transcript
input = input.slice(0,-1);
let b = input.indexOf("weather in")
input = input.split("")
input.splice(0,b+10)
input.shift()      
let Turl = `https://api.openweathermap.org/data/2.5/weather?q=${input.join("")}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;

  fetch(Turl).then(res => res.json()).then(data =>{
    readOut(`the weather of ${data.name} is ${data.weather[0].description} and the temperature feels like ${ktc(data.main.feels_like)} degrees and the original temperature is ${ktc(data.main.temp)} degrees`);
  // convert kelvin to celcius
  function ktc(k) {
     k = k - 273.15;
     return k.toFixed(2);
  }

  });

}
//email
if(transcript.includes("send an email")){
  

  let a = window.open("email.html")
  windowsB.push(a);

}
    
    
  
   
    //News
    if (transcript.includes("top headlines")) {
      readOut("These are today's headlines")
      getNews();
  }
  //news regarding specific topic
  if (transcript.includes("news regarding")) {
      // readOut("These are today's top headlines sir")
      let input = transcript
      let a = input.indexOf("regarding")
      input = input.split("")
      input.splice(0,a+9)
      input.shift()
      input.pop()
      readOut(`here's some headlines on ${input.join("")}`)
      getCategoryNews(input.join(""))
  
    }
  }    
  



     //stopping the assistant
     if (transcript.includes("shut down") || transcript.includes("pause") || transcript.includes("shutdown") ) {
      readOut("Ok. i will wait for some minute");
      stopingR = true;
      recognition.stop();
    }
  

    if(transcript.includes("language to tamil")){
      readOutTamil("இப்பொழுது நீங்கள் தமிழில் பேசலாம்")
      speech_lang = "ta-IN"
      localStorage.setItem("lang", "ta-IN")
      stopingR = true;
      recognition.stop();
      location.reload();
      recognition.start();

    }

    if(localStorage.getItem("lang") === "ta-IN"){

      if(transcript.includes("ஆங்கிலத்திற்கு")){
        readOut("language changed to english")
        speech_lang = "en-US"
        localStorage.setItem("lang", "en-US")
        stopingR = true;
        recognition.stop();
        location.reload();
      }
      if(transcript.includes("வணக்கம்")){
        readOutTamil("ஹலோ அன்பரே. நான் உங்களுக்கு என்ன செய்ய வேண்டும்")
      }
      if(transcript.includes("லோகேஷன்") || transcript.includes("இடம்") || transcript.includes("இருப்பிடம்") || transcript.includes("நான் எங்கே இருக்கிறேன்") || transcript.includes("நான் எங்கே இருக்கிறேன்")||transcript.includes("இடத்")){
        const success = (position) =>{
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude+" "+longitude)
    
          const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=e615b260dbc548fea621f7335b6e3741`;
      
          fetch(geoUrl).then(res => res.json()).then(data =>{
          console.log(`${data.locality},${data.localityInfo.administrative[2].name},${data.principalSubdivision},${data.countryName}`);
          readOutTamil(`நீங்கள் இப்பொழுது ${data.locality},${data.localityInfo.administrative[2].name},${data.principalSubdivision},${data.countryName} வில் உள்ளீர்கள்`);
          let a = window.open(`https://www.google.com/maps?&cp=${latitude}~${longitude}&lvl=11&v=2&sV=1&FORM=MIRE&qpvt=google+maps+${data.locality}+link`);
            windowsB.push(a);
          })
    
        }
      
        const error = () =>{
          console.log("Not available");
          readOutTamil(`நீங்கள் ஹலோ பட்டன் கிளிக் செய்தால் தான் இருப்பிடத்தை தெரிந்து கொள்ள முடியும்`);
    
        }
        navigator.geolocation.getCurrentPosition(success,error);      
      }
      if(transcript.includes("நேரம்")||transcript.includes("நேரமாகி")){
        if(hrs>12){
          if(hrs==13 || hrs==14 || hrs==15 || hrs==16){
            readOutTamil(`இப்பொழுது மதியம். ${hrs-12}மணி ${mins}நிமிடங்கள்`);
          }else if(hrs==17 || hrs==18 || hrs==19){
            readOutTamil(`இப்பொழுது மாலை. ${hrs-12}மணி ${mins}நிமிடங்கள்`);
          }else if(hrs==20 || hrs==21 || hrs==22 || hrs == 23){
            readOutTamil(`இப்பொழுது இரவு. ${hrs-12}மணி ${mins}நிமிடங்கள்`);
          }
        }else if(hrs<12){
          if(hrs==1 || hrs==2){
            readOutTamil(`இப்பொழுது நள்ளிரவு. ${hrs-12}மணி ${mins}நிமிடங்கள்`);
          }else if(hrs==0){
            readOutTamil(`இப்பொழுது நள்ளிரவு. ${hrs+12}மணி ${mins}நிமிடங்கள்`);
          }
          else if(hrs>=3 && hrs<=11){
            readOutTamil(`இப்பொழுது காலை. ${hrs}மணி ${mins}நிமிடங்கள்`);
          }
        }else if(hrs==12){
          readOutTamil(`இப்பொழுது பகல். ${hrs}மணி ${mins}நிமிடங்கள்`);
        }
      }
      if(transcript.includes("தேதி")){
        if(monthName=="January")
        readOutTamil(`இன்று ${dayNumber}"+"ஜனவரி மாதம்"+${year} ஆம் ஆண்டு`)
        else if(monthName=="February")
        readOutTamil(`இன்று ${dayNumber}"+"பிப்ரவரி மாதம்"+${year} ஆம் ஆண்டு`)
        else if(monthName=="March")
          readOutTamil(`இன்று ${dayNumber}"+"மார்ச் மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="April")
         readOutTamil(`இன்று ${dayNumber}"+"ஏப்ரல் மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="May")
         readOutTamil(`இன்று ${dayNumber}"+"மே மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="June")
         readOutTamil(`இன்று ${dayNumber}"+"ஜூன் மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="July")
         readOutTamil(`இன்று ${dayNumber}"+"ஜூலை மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="September")
         readOutTamil(`இன்று ${dayNumber}"+"செப்டெம்பர் மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="August")
         readOutTamil(`இன்று ${dayNumber}"+"ஆகஸ்ட் மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="October")
         readOutTamil(`இன்று ${dayNumber}"+"அக்டோபர் மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="November")
         readOutTamil(`இன்று ${dayNumber}"+"நவம்பர் மாதம்"+${year} ஆம் ஆண்டு`)
         else if(monthName=="December")
         readOutTamil(`இன்று ${dayNumber}"+"டிசம்பர் மாதம்"+${year} ஆம் ஆண்டு`)
        }
      if(transcript.includes("சரி") || transcript.includes("சிறப்பு")||transcript.includes("நன்று")){
        readOutTamil("நல்லது")
      }
      if(transcript.includes("உன்னுடைய பெயர்")|| transcript.includes("யார்") ){
        readOutTamil("என் பெயர் லெக்ஸி. நான் உங்களுக்காக உருவாக்கப்பட்ட ஒரு தனிப்பட்ட உதவியாளர்")
      }
      if(transcript.includes("அறிமுக") || transcript.includes("பற்றி சொல்")){
        readOutTamil("ஹாய், நான் லெக்ஸி. ஜாவாஸ்கிரிப்ட் பயன்படுத்தி உலாவிகளில் செய்யப்பட்ட ஒரு குரல் உதவியாளர். உலாவியிலிருந்து செய்யக்கூடிய சில அடிப்படை செயல்பாடுகளை என்னால் செய்ய முடியும்")
      }
      
    }
    //closing all opened tabs
    if (transcript.includes("close all tabs")) {
      readOut("closing all tabs")
      windowsB.forEach((e) => {
        e.close()
      })
    }
  }   

  
//stop the assisstant
recognition.onend = function () {
  if (stopingR === false) {
    setTimeout(() => {
      recognition.start();
    }, 500);
  } else if (stopingR === true) {
    recognition.stop();
  }
  console.log("voice deactivated");
  readOut("speech recognition stopped")
};



// speak out the messages
function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.volume = 1;
  speech.pitch=1;
  speech.lang= "en-US"
  speech.voice = window.speechSynthesis.getVoices()[31];
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
  
}
function readOutTamil(message) {
  
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.voice = window.speechSynthesis.getVoices()[92];
  speech.volume = 1;
  speech.pitch=1;
  speech.lang = "ta-IN"
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
}

function sendEmail(username,mess){
  Email.send({
    Host : "smtp.gmail.com",
    Username : "san.exxe12@gmail.com",
    Password : "S@a012345678910",
    To : username,
    From : "san.exxe12@gmail.com",
    Subject : 'Message!',
    Body : mess
}).then(
message => {
if(message=='OK'){
    readOut('Your mail has been sent successfully');
  }
  else{
    console.error (message);
    readOut('Sorry your mail not sent. Try again later')
  }
  }
);
}


// news setup

async function getNews(){
  var url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=20db7d8ce94f4773bd3958059424296a"
  var req = new Request(url)
  await fetch(req).then((response) => response.json()).then((data) => {
    console.log(data);
    let arrNews = data.articles
    arrNews.length = 5
    let a = []
    arrNews.forEach((e,index) => {
      a.push(index+1)
      a.push(".........")
      a.push(e.title)
      a.push(".........")

    });
    readOut(a)
  })
}

// category news

let yyyy,mm,dd

dd = date.getDate()
mm = date.getMonth()
yyyy = date.getFullYear()

async function getCategoryNews(category){
  var url =
    `https://newsapi.org/v2/everything?q=${category}&from=${yyyy}-${mm}-${dd}&sortBy=popularity&apiKey=20db7d8ce94f4773bd3958059424296a`;


    var req = new Request(url)

  await fetch(req).then((response) => response.json())
  .then((data) => {
    console.log(data);
    let arrNews = data.articles
    arrNews.length = 5
    let a = []
    arrNews.forEach((e,index) => {
      a.push(index+1)
      a.push(".........")
      a.push(e.title)
      a.push(".........")
    });
    readOut(a)
  })
}