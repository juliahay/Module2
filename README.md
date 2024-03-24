# Module 2 - Interactive Devices
This code is for a game called Color Match. The goal of the game is to visualize the correct color as indicated by given RGB values. The game uses a game controller made out of a ESP32 TTGO T-Display, three buttons, and a potentiometer. With this device, the user adjusts the potentiometer for either red, green, or blue values to try and get the color of the screen to align with the RGB values given. The device used can give the user a hint, submit their answer, change which color the user is affecting, or reset the values for a new game. 

[IMG_9543.JPG]

## Materials
- ESP32 TTGO T-Display
- USB-C Cord
- x3 Buttons
- Potentiometer
- Wires

## How to Set Up the ESP32 TTGO T-Display
- Download the [Arduino IDE](https://www.arduino.cc/en/software)
- Connect the ESP32 with a USB-C Cable (Make sure the blue light on the board gets turned on. If it doesn't, try turing around how the USB-C Cable is plugged in)
- Under the `Boards Manager` tab, download the ESP32 board by expressif Systems (https://dl.espressif.com/dl/package_esp32_index.json)
- With the ESP32 plugged in, select the port connected to the device and assign it to the TTGO T1 board.
- Under `Tools`, set the `Upload Speed` to "115200" to avoid errors with uploading code to device.
- Under `Libraries`, download the "TFT_eSPI" library by Bodmer
- Find the folder on your CPU where Arduino libraries are stored and open the User_Setup_Select.h file in the TFT_eSPI library folder `Arduino/libraries/TFT_eSPI/User_Setup_Select.h`
  - Comment out the line `#include <User_Setup.h>`
  - Uncomment the line `#include <User_Setups/Setup25_TTGO_T_Display.h>`
- At this point, you should be able to upload the code onto your TTGO T-Display by simply pressing the `Upload` button.
  - This will upload the device's code to parse the sensor data provided by the ESP32.
- To create the device with the ESP32:
  - Solder headers onto the ESP32 so that you can connect wires to the device.
  - Attach the three buttons to pins 2, 15, and 13 using wires.
  - Attach the potentiometer to pin 12 using wires.
- To access the game:
  - open index.html
  - click on the page and select the port for your ESP32
    - If the "connect device to start game" message does not disappear, reload the page and try again.
  - From here the game should be operational!


## Further Documentation
To read the full blog post regarding this installation, visit [here]()
