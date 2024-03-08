#include <TFT_eSPI.h>
#include <SPI.h>
#include <ArduinoJson.h>
#include <stdio.h>
#include <string.h>

TFT_eSPI tft = TFT_eSPI();

int xyzPins[] = {2, 15, 13, 12}; //x,y,z pins
void setup() {
  tft.init();
  tft.setRotation(1);

  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_WHITE);
  Serial.begin(115200);
  
}

int rGoal = random(0, 256);
int gGoal = random(0, 256);
int bGoal = random(0, 256);

int reset = 1;
int submit = 1;

int switchMode = 1;
int mode = 0;

void loop() {

  JsonDocument sensorVals;

  //reset game
  pinMode(xyzPins[0], INPUT_PULLUP); 
  reset = digitalRead(xyzPins[0]); //2
  if (reset == 0) {
    //if reset == 0, change rGoal, gGoal, bGoal values
    rGoal = random(0, 256);
    gGoal = random(0, 256);
    bGoal = random(0, 256);
    tft.fillScreen(TFT_BLACK);
  }

  //switchMode value (0 = change mode, 1 = stay mode)
  //changing mode
  pinMode(xyzPins[1], INPUT_PULLUP); 
  switchMode = digitalRead(xyzPins[1]); //15
  sensorVals["switch"] = switchMode;
  if (switchMode == 0) {
    if (mode == 0) {
      mode = 1;
    } else if (mode == 1) {
      mode = 2;
    } else if (mode == 2) {
      mode = 0;
    }
    tft.fillScreen(TFT_BLACK);
  }

  //Printing and sending GOAL R, G, B values
  sensorVals["rG"] = rGoal;
  sensorVals["gG"] = gGoal;
  sensorVals["bG"] = bGoal;
  tft.drawString("(" + String(rGoal) + ", " + String(gGoal) + ", " + String(bGoal) + ")", 30, 50, 4);

  
  //mode: 0 == red, 1 == green, 2 == blue
  //changing color controlled
  sensorVals["mode"] = mode;
  if (mode == 0) {
      tft.drawString("R", 100, 90, 4);
  } else if (mode == 1) {
      tft.drawString("G", 100, 90, 4);
  } else if (mode == 2) {
      tft.drawString("B", 100, 90, 4);
  }

  //Submit value (0 == submit, 1 == resting state)
  pinMode(xyzPins[2], INPUT_PULLUP); 
  submit = digitalRead(xyzPins[2]); //13
  sensorVals["s"] = submit;

  //Changing color value
  pinMode(xyzPins[3], INPUT_PULLUP);
  int pVal = analogRead(xyzPins[3]); //12
  int v = pVal / 16;
  if (v < 1) {
    v = 0;
  } else if (v > 255) {
    v = 255;
  }
  sensorVals["colorVal"] = v;
  
  
  //sensorVals["b"] = bVal;

  
  serializeJson(sensorVals, Serial);
  Serial.println();
  
  delay(1000);

  //Serial.printf("Button Val: %d\n", bVal);
  //tft.drawString(String(pVal), 10, 10, 4);
  //Serial.printf("P Value: %d\n", v);
  //int xVal = analogRead(xyzPins[0]);
  //int yVal = analogRead(xyzPins[1]);
  //int zVal = digitalRead(xyzPins[2]);
  //Serial.printf("X,Y,Z: %d,\t%d,\t%d\n", xVal, yVal, zVal);
 
}
