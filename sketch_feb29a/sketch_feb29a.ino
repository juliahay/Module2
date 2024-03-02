#include <TFT_eSPI.h>
#include <SPI.h>
#include <ArduinoJson.h>
#include <stdio.h>
#include <string.h>

TFT_eSPI tft = TFT_eSPI();

int xyzPins[] = {13, 12, 14}; //x,y,z pins
void setup() {
  tft.init();
  tft.setRotation(1);

  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_WHITE);
  Serial.begin(115200);
  //pinMode(xyzPins[2], INPUT_PULLUP); //z axis is a button.
  pinMode(12, INPUT_PULLUP);
  
}

int rGoal = random(0, 256);
int gGoal = random(0, 256);
int bGoal = random(0, 256);

int reset = 1;
int submit = 1;
int hint = 1;

int rUser = 0;
int gUser = 0;
int bUser = 0;

int bVal = 1;

void loop() {

  JsonDocument sensorVals;

  //GOAL R, G, B values
  //if reset == 0, change rGoal, gGoal, bGoal values
  //if reset == 0, reset rUser, gUser, bUser
  sensorVals["rG"] = rGoal;
  sensorVals["gG"] = gGoal;
  sensorVals["bG"] = bGoal;
  tft.drawString("(" + String(rGoal) + ", " + String(gGoal) + ", " + String(bGoal) + ")", 30, 50, 4);


  //Submit value (0 == submit, 1 == resting state)
  submit = digitalRead(12);
  sensorVals["s"] = submit;

  //Hint Value (0 == get hint, 1 == resting state)
  //sensorVals["h"] = hint;

  //Changing R value
  int pVal = analogRead(13);
  int v = pVal / 16;
  if (v < 1) {
    v = 0;
  } else if (v > 255) {
    v = 255;
  }
  rUser = v;
  sensorVals["r"] = rUser;

  //Changing G value
  pVal = analogRead(32);
  v = pVal / 16;
  if (v < 1) {
    v = 0;
  } else if (v > 255) {
    v = 255;
  }
  gUser = v;
  sensorVals["g"] = gUser;
  
  //Changing B value
  sensorVals["b"] = bUser;
  
  
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
