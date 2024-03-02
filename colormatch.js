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
        
        //console.log("poten: %d", js.p);
        let r = js.r;
        let g = js.g;
        let b = js.b;
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          console.log("red: " + r);
          //counterVal += parseInt(value)/100.0;
          document.body.style.backgroundColor = 'rgb(' + r + ',  ' + g + ', ' + b + ')';
        }

        let submit = js.s;
        console.log("submit: " + submit);
        if (submit == 0) {
          checkValues(js);
        }

  
      }
    }
  };

  function checkValues(js) {
    if (js.r == js.rG && js.g == js.gG && js.b == js.bG) {
      console.log("CORRECT");
    } else if ((js.r > js.rG - 10 && js.r < js.rG + 10) && (js.g > js.gG - 10 && js.g < js.gG + 10) && (js.b > js.bG - 10 && js.b < js.bG + 10)) {

            console.log("CLOSE ENOUGH");

    } else {
      console.log("WRONG");
    }
  }