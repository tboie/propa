/*********************************************************************
 This is an example for our nRF52 based Bluefruit LE modules

 Pick one up today in the adafruit shop!

 Adafruit invests time and resources providing this open source code,
 please support Adafruit and open-source hardware by purchasing
 products from Adafruit!

 MIT license, check LICENSE for more information
 All text above, and the splash screen below must be included in
 any redistribution


device button layout:

7, MCP 7, MCP 5, MCP6
11, 20, 8, 14
30, 28, 16, 15
27, 29, 12, 13

mcp 4
mcp 3
map 2
mcp 1
mcp 0

*********************************************************************/

#include <bluefruit.h>
#include <MIDI.h>

#include <Wire.h>
#include "Adafruit_MCP23008.h"
Adafruit_MCP23008 mcp;
//#include "Adafruit_MCP23017.h"
//Adafruit_MCP23017 mcp;

// BLE Service
BLEDis  bledis;  // device information
BLEBas  blebas;  // battery
BLEMidi blemidi; // midi

/* real time messages
using namespace midi;
MidiType midiStart = Start;
*/

byte TransportStart[6] = {0xf0, 0x7f, 0x7f, 0x6, 0x2, 0xf7};
byte TransportRecord[6] = {0xf0, 0x7f, 0x7f, 0x6, 0x28, 0xf7};

//A,B,C,D
byte groups[4] = {0x41, 0x42, 0x43, 0x44};
byte selectGroup[6] = {0xf0, 0x7f, 0x7f, 0x06, groups[0], 0xf7};
byte selectedGroup;

//BLE or serial
MIDI_CREATE_BLE_INSTANCE(blemidi);
//MIDI_CREATE_DEFAULT_INSTANCE();

//board
const int pins[] = {28, 29, 12, 13, 14, 8, 20, 16, 15, 7, 11, 30, 27};
int states1[] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
const int notes1[] = {69, 73, 74, 75, 67, 66, 65, 70, 71, 60, 64, 68, 72};

//mcp chip
const int pinsmcp[] = {0, 1, 2, 3, 4, 5, 6, 7};
int states2[] = {0, 0, 0, 0, 0, 0, 0, 0};
const int notes2[] = {0, 1, 2, 3, 4, 62, 63, 61};

//Potentiometer
class Potentiometer
{
  public:
  
  int pin;
  
  //Pot Smoothing
  const int numReadings = 10;
  int readings[10];      // the readings from the analog input
  int readIndex = 0;              // the index of the current reading
  int total = 0;                  // the running total
  int average = 0;                // the average
  int prevAverage = -1;           // prev average used for bounds padding

  Potentiometer(int pinId)
  {
    pin = pinId;
  }
 
  void Update()
  {
    
  }
};

Potentiometer pots[] = {Potentiometer(PIN_A0), Potentiometer(PIN_A1), Potentiometer(PIN_A2), Potentiometer(PIN_A3)};

void setup()
{
  Serial.begin(115200);
  while ( !Serial ) delay(10);   // for nrf52840 with native usb

  //analogReference(AR_INTERNAL);
  //analogReadResolution(14);
  //pinMode(btnPin, INPUT_PULLUP);

  for (int thisPin = 0; thisPin < 13; thisPin++) {
    pinMode(pins[thisPin], INPUT_PULLUP);
  }
  
  mcp.begin();      // use default address 0
  for (int thisPin = 0; thisPin < 8; thisPin++) {
    mcp.pinMode(pinsmcp[thisPin], INPUT);
    mcp.pullUp(pinsmcp[thisPin], HIGH);  // turn on a 100K pullup internally
  }

  for (int k=0; k < 4; k++){
    for (int thisReading = 0; thisReading < pots[k].numReadings; thisReading++) {
      pots[k].readings[thisReading] = 0;
    }
  }

  Serial.println("Adafruit Bluefruit52 MIDI over Bluetooth LE Example");
 
  // Config the peripheral connection with maximum bandwidth
  Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);
 
  Bluefruit.begin();
  Bluefruit.setName("Bluefruit52 MIDI");
  Bluefruit.setTxPower(4);
 
  // Setup the on board blue LED to be enabled on CONNECT
  Bluefruit.autoConnLed(true);
 
  // Configure and Start Device Information Service
  bledis.setManufacturer("Adafruit Industries");
  bledis.setModel("Bluefruit Feather52");
  bledis.begin();
 
  // Initialize MIDI, and listen to all MIDI channels, will also call blemidi service's begin()
  MIDI.begin(MIDI_CHANNEL_OMNI);
 
  // Attach the handleNoteOn function to the MIDI Library. It will
  // be called whenever the Bluefruit receives MIDI Note On messages.
  //MIDI.setHandleNoteOn(handleNoteOn);
 
  // Do the same for MIDI Note Off messages.
  //MIDI.setHandleNoteOff(handleNoteOff);

  // Start BLE Battery Service
  //blebas.begin();
  //blebas.write(100);
 
  // Set up and start advertising
  startAdv();
 
  // Start MIDI read loop
  //Scheduler.startLoop(midiRead);
}
 
void startAdv(void){
  Serial.print("START ADVERTISING");
  
  // Set General Discoverable Mode flag
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
 
  // Advertise TX Power
  Bluefruit.Advertising.addTxPower();
 
  // Advertise BLE MIDI Service
  Bluefruit.Advertising.addService(blemidi);
 
  // Secondary Scan Response packet (optional)
  Bluefruit.ScanResponse.addName();
 
  //Start Advertising
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds
}

void handleNoteOn(byte channel, byte pitch, byte velocity){
  // Log when a note is pressed.
  Serial.printf("Note on: channel = %d, pitch = %d, velocity - %d", channel, pitch, velocity);
  Serial.println();
}
 
void handleNoteOff(byte channel, byte pitch, byte velocity){
  // Log when a note is released.
  Serial.printf("Note off: channel = %d, pitch = %d, velocity - %d", channel, pitch, velocity);
  Serial.println();
}

void loop()
{

  //Serial.println(Bluefruit.connected());
  //Serial.println(blemidi.notifyEnabled());
  /*
  if (! Bluefruit.connected()) {
    return;
  }
  
  // Don't continue if the connected device isn't ready to receive messages.
  if (! blemidi.notifyEnabled()) {
    return;
  }
  */
  int note = 60;
  for (int thisPin = 0; thisPin < 13; thisPin++) {
    if(digitalRead(pins[thisPin]) == LOW){
      
      if(states1[thisPin] == 0){
        states1[thisPin] = 1;
        
        MIDI.sendNoteOn(notes1[thisPin], 127, 1);
        
        //Serial.print("ON");
        //Serial.println(pins[thisPin]);
      }
    }
    else{
      if(states1[thisPin] == 1){
        states1[thisPin] = 0;
        
        MIDI.sendNoteOff(notes1[thisPin], 0, 1);

        //Serial.print("OFF");
        //Serial.println(pins[thisPin]);
      }
    }
  }
  
  for (int thisPin = 0; thisPin < 8; thisPin++) {
    if(mcp.digitalRead(pinsmcp[thisPin]) == LOW){
      if(states2[thisPin] == 0){
        states2[thisPin] = 1;
        
        if(thisPin > 4){
          MIDI.sendNoteOn(notes2[thisPin], 127, 1);
        }
        else if(thisPin == 0 && states2[4] == 0){
          MIDI.sendSysEx(6, TransportStart);       
        }
        else if(thisPin == 1 && states2[4] == 0){
          MIDI.sendSysEx(6, TransportRecord);       
        }
        
        //Serial.print("MCP ON");
        //Serial.println(pinsmcp[thisPin]);
      }
      
      
      if(states2[4] == 1){
        if(thisPin == 3){
          if(selectedGroup != groups[0]){
            selectedGroup = groups[0];
            selectGroup[4] = groups[0];
            //Serial.println("pin A");
            MIDI.sendSysEx(6, selectGroup);
          }
        }
        else if(thisPin == 2){
          if(selectedGroup != groups[1]){
            selectedGroup = groups[1];
            selectGroup[4] = groups[1];
            //Serial.println("pin B");
            MIDI.sendSysEx(6, selectGroup);
          }
        }
        else if(thisPin == 1){
          if(selectedGroup != groups[2]){
            selectedGroup = groups[2];
            selectGroup[4] = groups[2];
            //Serial.println("pin C");
            MIDI.sendSysEx(6, selectGroup);
          }
        }
        else if(thisPin == 0){
          if(selectedGroup != groups[3]){
            selectedGroup = groups[3];
            selectGroup[4] = groups[3];
            //Serial.println("pin D");
            MIDI.sendSysEx(6, selectGroup);
          }
        }
      }
    }
    else{
      if(states2[thisPin] == 1){
        states2[thisPin] = 0;
        
        if(thisPin > 4){        
          MIDI.sendNoteOff(notes2[thisPin], 0, 1);
        }
        else if(thisPin < 4 && selectedGroup != 0){
          selectedGroup = 0;
        }
                
        //Serial.print("MCP OFF");
        //Serial.println(pinsmcp[thisPin]);
      }
    }
  }


  // potentiometers
  for(int k=0; k < 4; k++){
    // subtract the last reading:
    pots[k].total = pots[k].total - pots[k].readings[pots[k].readIndex];
    // read from the sensor:
    pots[k].readings[pots[k].readIndex] = analogRead(pots[k].pin);
    // add the reading to the total:
    pots[k].total = pots[k].total + pots[k].readings[pots[k].readIndex];
    // advance to the next position in the array:
    pots[k].readIndex = pots[k].readIndex + 1;
  
    // if we're at the end of the array...
    if (pots[k].readIndex >= pots[k].numReadings) {
      // ...wrap around to the beginning:
      pots[k].readIndex = 0;
    }
  
    // calculate the average:
    pots[k].average = pots[k].total / pots[k].numReadings;
  
    // create bounds padding for varying values
    if ((pots[k].average + 5) <= pots[k].prevAverage || (pots[k].average - 5) >= pots[k].prevAverage) {
      //Serial.println(pots[k].average);
      pots[k].prevAverage = pots[k].average;
      
      int mappedAvg = map(pots[k].average, 0, 940, 1, 127);
      //Serial.println(mappedAvg);
      
      //https://www.midi.org/specifications-old/item/table-3-control-change-messages-data-bytes-2
      MIDI.sendControlChange(k+1, mappedAvg, 1);
    }
  }

  
  delay(3);
}


void midiRead(){
  
  // Don't continue if we aren't connected.
  
  if (! Bluefruit.connected()) {
    return;
  }
 
  // Don't continue if the connected device isn't ready to receive messages.
  if (! blemidi.notifyEnabled()) {
    return;
  }
  
  // read any new MIDI messages
  MIDI.read();
}