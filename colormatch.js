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
        console.log("Value: %s\n", value);
        console.log(typeof(value));
        if (!value.includes('}') || !value.includes('{')) {
            continue;
        }
        console.log("passed");
        let j = JSON.stringify(value);
        let js = JSON.parse(j);



        console.log("j: ", js);
        //console.log("poten: ", parseInt(js.p));
        parsedVal = parseInt(value);
        if (!isNaN(parsedVal)) {
          //console.log("parsedVal: " + parsedVal);
          counterVal += parseInt(value)/100.0;
          redVal = (1+Math.sin(counterVal)) * (255/2);
          document.body.style.backgroundColor = 'rgb(' + redVal + ',  60, 50)';
        }
  
      }
    }
  };