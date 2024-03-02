#include <TFT_eSPI.h>
#include <SPI.h>
#include <ArduinoJson.h>

TFT_eSPI tft = TFT_eSPI();

int xyzPins[] = {13, 12, 14}; //x,y,z pins
void setup() {
  tft.init();
  tft.setRotation(1);
  Serial.begin(115200);
  //pinMode(xyzPins[2], INPUT_PULLUP); //z axis is a button.
  pinMode(12, INPUT_PULLUP);
  
}

void loop() {

  JsonDocument sensorVals;

  int bVal = digitalRead(12);
  int pVal = analogRead(13);
  int v = pVal / 16;
  if (v < 1) {
    v = 0;
  } else if (v > 255) {
    v = 255;
  }

  sensorVals["p"] = v;
  sensorVals["b"] = bVal;
  //Serial.printf("Button Val: %d\n", bVal);
  //int pValMod = pVal % 250;
  //tft.drawString(String(pVal), 10, 10, 4);
  //Serial.printf("P Value: %d\n", v);

  serializeJson(sensorVals, Serial);
  Serial.println();

  //int xVal = analogRead(xyzPins[0]);
  //int yVal = analogRead(xyzPins[1]);
  //int zVal = digitalRead(xyzPins[2]);
  //Serial.printf("X,Y,Z: %d,\t%d,\t%d\n", xVal, yVal, zVal);
  delay(1000);
}
