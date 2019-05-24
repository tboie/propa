import Tone from 'tone';
import { ToneObjs } from '../models/models.js';
import { store } from '../data/store.js';

let btDevice, btCharacteristic;
const serviceId = '03B80E5A-EDE8-4B33-A751-6CE34EC4C700'.toLowerCase();
const characteristicId = '7772E5DB-3868-4112-A1A9-F2669D106BF3'.toLowerCase();

/*   testing 
document.addEventListener('mousedown', async() => {
    if(!btDevice)
        await initBLE();
});
*/

export function initMidi(){
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
    } else {
        console.log('WebMIDI is not supported in this browser.');
    }
}

function onMIDISuccess(midiAccess) {
    console.log('WebMIDI enabled');
    for (let input of midiAccess.inputs.values())
        input.onmidimessage = getMIDIMessage;
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

function getMIDIMessage(message) {
    let command, val, velocity;

    if(message.data.length === 3){
        command = message.data[0];
        val = message.data[1];
        velocity = message.data[2];
    }
    else if(message.data.length === 6){
        command = "TransportChange";
    }

    switch (command) {
        case 176:
            changeRate(velocity);
            break;
        case 144:
            noteOn(val);
            break;
        case 128:
            noteOff(val);
            break;
        case "TransportChange":
            TransportChange(message);
            break;
        default:
            break;
    }
}

const TransportChange = (msg) => {
    let eleButton, action = msg.data[4];
    
    if(action === 2){
        eleButton = document.getElementById('btnTransportTogglePlay');
        if(eleButton){
            eleButton.click();
        }
    }
    else if(action === 40){
        eleButton = document.getElementById('btnTransportToggleRecord');
        if(eleButton){
            eleButton.click();
        }
    }
}

//map num range to new range
function mapVal (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const changeRate = (val) => {
    store.getTracksByGroup(store.ui.selectedGroup).forEach((track, idx) => {
        if(track.type === "audio"){
            let row = ToneObjs.instruments.find(i => i.track === track.id);
            if(row){
                let newVal = mapVal(val, 0, 127, 0, 2);
                row.obj.playbackRate = newVal;
            }
        }
    });
}

const noteOn = (note) => {
    let selectedTrack;
    store.getTracksByGroup(store.ui.selectedGroup).forEach((track, idx) => {
        if(note-60 === idx){
            if(track.type === "audio"){
                selectedTrack = track;
            }
        }
        else{
            if(track.type === "audio"){
                let row = ToneObjs.instruments.find(i => i.track === track.id);
                if(row){
                    if(row.obj){
                        if(row.obj.buffer.loaded){
                            row.obj.stop();
                        }
                    }
                }
            }
        }
    })

    if(selectedTrack){
        // button view gridbutton mouse down
        if(store.ui.viewMode === 'button' && store.ui.selectedGroup === selectedTrack.group){
            let eleButton = document.getElementById('divGridButton_' + selectedTrack.id);
            if(eleButton){
                if(document.createEvent){
                    eleButton.dispatchEvent(new PointerEvent("pointerdown", {
                        bubbles: true,
                    }));
                }
            }
        }
        // other views
        else{
            let row = ToneObjs.instruments.find(i => i.track === selectedTrack.id);
            if(row){
                if(row.obj){
                    if(row.obj.buffer.loaded){
                        row.obj.start();
                    }
                }
            }
        }
    }


    /*
    if(store.ui.selectedTrack){
        ToneObjs.instruments.filter(o => o.track === store.ui.selectedTrack.id).forEach(function(row){
            if(row.obj){
            let type = row.id.split('_')[0];

            if(type === 'metalsynth'){
                row.obj.frequency.setValueAtTime(Tone.Midi(note).toFrequency(), undefined, Math.random()*0.5 + 0.5);
                row.obj.triggerAttack(undefined, 1);
            }
            else if(type === 'noisesynth'){
                row.obj.triggerAttack();
            }
            else if(type === 'plucksynth' || type === 'membranesynth'){
                row.obj.triggerAttack(Tone.Midi(note).toFrequency());
            }
            else if(type !== 'player'){
                //row.obj.triggerAttack(notes.map(n => Note.freq(n)));
                row.obj.triggerAttack(Tone.Midi(note).toFrequency());
            }
            }
        });
    }
    */
}

const noteOff = (note) => {
    /*
    ToneObjs.instruments.filter(o => o.track === store.ui.selectedTrack.id).forEach(function(row){
        if(row.obj){
            let type = row.id.split('_')[0];

            if(type === "metalsynth" || type === "membranesynth" || type === "noisesynth"){
            row.obj.triggerRelease();
            }
            else if(type !== "player" && type !== "plucksynth"){
            row.obj.releaseAll();
            }
        }
    });
    */
}

/*******************************
 * BLE 
 *******************************/


export async function initBLE(){
    await requestDevice();
    await connectDeviceAndCacheCharacteristics();
}

async function requestDevice() {
    console.log('Requesting any Bluetooth Device...');
    btDevice = await navigator.bluetooth.requestDevice({
        filters: [{
                services: [serviceId]
            }]
        });
    btDevice.addEventListener('gattserverdisconnected', onDisconnected);
}


async function connectDeviceAndCacheCharacteristics() {
    if (btDevice.gatt.connected && btCharacteristic) {
      return;
    }
  
    try{
        console.log('Connecting to GATT Server...');
        const server = await btDevice.gatt.connect();
    
        console.log('Getting BLE MIDI Service...');
        const service = await server.getPrimaryService(serviceId);
    
        console.log('Getting BLE MIDI Characteristic...');
        btCharacteristic = await service.getCharacteristic(characteristicId);

        //this particular sequence turns notifications on for android chrome
        //this is not the standard, but it works.  maybe device code that's wrong
        //
        //notifications currently do not turn on for chrome on os x (only this computer?)
        //
        //note: make sure arduino scheduler for midi read is turned off along with 
        //handlers for noteon and noteoff
        btCharacteristic.addEventListener('characteristicvaluechanged', handleValueChange);
        
        try{
            await btCharacteristic.readValue();
        }
        catch(error){
            console.log(error);
        }

        console.log('Starting BLE MIDI Notifications...');
        await btCharacteristic.startNotifications();
        console.log('MIDI BLE Notifications started')
    }
    catch(error){
        console.log(error);
    }
}

async function onDisconnected() {
    console.log('> Bluetooth Device disconnected');
    try {
        await connectDeviceAndCacheCharacteristics()
    } catch(error) {
        console.log('Argh! ' + error);
    }
}

function handleValueChange(event) {
    console.log('handleValueChange')
    if(event.target.value){
        let action = event.target.value.getUint8(2);
        let note = event.target.value.getUint8(3);
        let velocity = event.target.value.getUint8(4);
        let msg = { data: [action, note, velocity]};

        getMIDIMessage(msg);
    }
}