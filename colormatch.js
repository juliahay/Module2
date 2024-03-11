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
        console.log("value: " + value)
        if (!value.includes('}') || !value.includes('{')) {
            continue;
        }
        
        let j = JSON.stringify(value);
        j = j.replaceAll("\\", "");
        j = j.slice(1, j.indexOf('}') + 1);
        console.log("J: " + j);
        let js = JSON.parse(j);

        //get json values
        let switchMode = js.sw;
        let mode = js.m;
        let colorValue = js.cv;
        let submit = js.s;

        //give hint if pushed, submit if held down
        if (submit == 0) {
          getHint(mode);

          hint.push(submit);
          if (hint.length > 4) {
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
          if (red < 60 && green < 60 && blue < 60) {
            document.body.style.color = "rgb(" + 255 + ", " + 255 + ", " + 255 + ")";
          } else {
            document.body.style.color = "rgb(" + 0 + ", " + 0 + ", " + 0 + ")";;
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

  function checkValues(js) {
    if (js.r == red && js.g == green && js.b == blue) {
      console.log("CORRECT");

    } else if ((js.r > red - 5 && js.r < red + 5) && (js.g > green - 5 && js.g < green + 5) && (js.b > blue - 5 && js.b < blue + 5)) {

            console.log("CLOSE ENOUGH");

    } else {
      console.log("WRONG");
    }
  }

  function getHint(mode) {
    if (mode == 0) {
      console.log("RED HINT: " + red);
    } else if (mode == 1) {
      console.log("GREEN HINT: " + green);
    } else if (mode == 2) {
      console.log("BLUE HINT: " + blue);
    }  
  }