let connected = false;
//when the user clicks anywhere on the page
document.addEventListener('click', async () => {
    // Prompt user to select any serial port.
    var port = await navigator.serial.requestPort();
    // be sure to set the baudRate to match the ESP32 code
    await port.open({ baudRate: 115200 });
  
    let decoder = new TextDecoderStream();
    inputDone = port.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable;
  
    reader = inputStream.getReader();
    readLoop();
  
  });
  
  let red = 0;
  let green = 0;
  let blue = 0;
  let continueSwitch = false;
  let hint = [];
  let hintOn = false;
  async function readLoop() {
    counterVal = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        console.log("closing connection")
        reader.releaseLock();
        break;
      }
      if (value) {
        console.log("value: " + value);
        if (!value.includes('}') || !value.includes('{')) {
            continue;
        }
        
        let j = JSON.stringify(value);
        j = j.replaceAll("\\", "");
        j = j.slice(1, j.indexOf('}') + 1);
        console.log("J: " + j);
        let js;

        try {
          js = JSON.parse(j);
        } catch (error) {
          console.log('Error parsing JSON:', error, js);
          continue;
        }
        

        if (connected == false) {
          removeDiv("opening");
          connected = true;
        }
        
        //get json values
        let switchMode = js.sw;
        let mode = js.m;
        let colorValue = js.cv;
        let submit = js.s;

        //give hint if pushed, submit if held down
        if (submit == 0) {
          if (hintOn == false) {
            getHint(mode);
          }
          

          hint.push(submit);
          if (hint.length > 4) {
            removeDiv("hint");
            checkValues(js);
            hint = [];
          }
          
        }

        //check if mode has switched and wait until it reaches last set value
        if (switchMode == 0 || continueSwitch == true) {
          //if mode was just switched
          let currentVal = 0;
          let color = "";
          if (mode == 0) {
            currentVal = red;
            color = "R";
          } else if (mode == 1) {
            currentVal = green;
            color = "G";
          } else if (mode == 2) {
            currentVal = blue;
            color = "B";
          }
          //create div that prints new color and current color value
          if (red < 130 && green < 130 && blue < 130) {
            document.getElementById("newMode").style.color = "rgb(" + 255 + ", " + 255 + ", " + 255 + ")";
          } else {
            document.getElementById("newMode").style.color = "rgb(" + 0 + ", " + 0 + ", " + 0 + ")";;
          }
          document.getElementById('newColor').innerHTML = color;
          document.getElementById('colorValue').innerHTML = currentVal;
          
          //wait until colorValue meets last set value
          if (colorValue >= currentVal + 3 || colorValue <= currentVal - 3) {
            console.log("waiting for colorValue to reach last set value");
            continueSwitch = true;
            continue;
          } else {
            //remove div
            document.getElementById('newColor').innerHTML = "";
            document.getElementById('colorValue').innerHTML = "";
            continueSwitch = false;
          }
        }

        //adjust color based on potentiometer value (after mode switch)
        if (!isNaN(colorValue) && !isNaN(mode)) {
          if (mode == 0) {
            red = colorValue;
          } else if (mode == 1) {
            green = colorValue;
          } else if (mode == 2) {
            blue = colorValue;
          }
          document.body.style.backgroundColor = 'rgb(' + red + ',  ' + green + ', ' + blue + ')';
        }

  
      }
    }
  };

  function checkValues(js) { //not working
    if (js.r == red && js.g == green && js.b == blue) {
      resultPopup("CORRECT!");

    } else if ((js.r > red - 10 && js.r < red + 10) && (js.g > green - 10 && js.g < green + 10) && (js.b > blue - 10 && js.b < blue + 10)) {
      resultPopup("CLOSE ENOUGH!");
    } else {
      resultPopup("INCORRECT!");
    }
  }

  const button = document.querySelector('btn');

  // Add an event listener to the button that listens for the click event
  button.addEventListener('click', function() {
    // Display the prompt when the button is clicked
    removeDiv("submit"); 
    console.log("Play Again Button Pushed");
  });

  function resultPopup(result) {
    let messageDiv = document.createElement('div');
    messageDiv.className = 'popup';
    messageDiv.id = 'submit';
    document.body.appendChild(messageDiv);

    let resultDiv = document.createElement('div');
    resultDiv.id = 'result';
    document.getElementById('submit').appendChild(resultDiv);

    let answerDiv = document.createElement('div');
    answerDiv.id = 'answer';
    document.getElementById('submit').appendChild(answerDiv);

    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'buttons';
    document.getElementById('submit').appendChild(buttonDiv);

    document.getElementById('result').innerHTML = result;
    document.getElementById('answer').innerHTML += "Your Answer: (" + red + ", " + green + ", " + blue + ")"
    document.getElementById('buttons').innerHTML = "<a href=\"index.html\"><button id=\"btn\">Play Again</button></a>"
  }

  function hintPopup(color) {
    let hintDiv = document.createElement('div');
    hintDiv.className = "popup";
    hintDiv.id = 'hint';
    document.body.appendChild(hintDiv);

    if (color == "RED") {
      document.getElementById('hint').innerHTML = "RED VALUE: " + red;
    } else if (color == "GREEN") {
      document.getElementById('hint').innerHTML = "GREEN VALUE: " + green;
    } else if (color == "BLUE") {
      document.getElementById('hint').innerHTML = "BLUE VALUE: " + blue;
    }

    document.getElementById('hint').innerHTML += "<br>You have " + (4 - hint.length - 1) + " hints left.";;
  }

  function getHint(mode) {
    if (mode == 0) {
      hintPopup("RED");
    } else if (mode == 1) {
      hintPopup("GREEN");
    } else if (mode == 2) {
      hintPopup("BLUE");
    }  
    //wait 3 seconds and remove hint
    setTimeout(() => {removeDiv("hint"); hintOn = false;}, 2000);
    
  }

  function removeDiv(divType) {
    if (divType == "hint") {
      document.getElementById('hint').remove();
    } else if (divType == "submit") {
      document.getElementById('submit').remove();
    } else if (divType == "opening") {
      document.getElementById('opening').remove();
    }
    
  }