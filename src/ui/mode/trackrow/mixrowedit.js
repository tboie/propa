import React, { Component } from 'react';
import { observer } from "mobx-react";
import * as Tone from "tone";
import { MixMeters } from './mixrow.js';
import { mapVal } from '../../utils.js';


export const MixRowViewEdit = observer(class MixRowViewEdit extends Component{
    player;
    panvol;
    bPressed;
  
    componentDidMount(){
      this.applyTransformOffset();
    }
    
    componentWillUnmount(){}

    componentDidUpdate(prevProps){
      if(prevProps.viewLength !== this.props.viewLength){
        this.applyTransformOffset();
      }
    }

    applyTransformOffset = () => {
      if(this.props.store.ui.viewMode !== 'edit' || (this.props.store.ui.viewMode === 'edit' && this.props.store.ui.views.edit.mode !== 'bar')){
        let gridContainer = document.getElementById('gridContainer');
        if(gridContainer){
          let transformX = gridContainer.getAttribute('data-x') * -1;
          document.getElementById('trackrowmixedit_' + this.props.track.id).style.transform = 'translateX(' + transformX + 'px)';
        }
      }
    }

    backButton = (e) => {
      this.props.store.ui.selectNote(undefined);
    }
  
    selectMixButton = (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      this.props.track.mixRow.setEditSelection(e.target.id.split('_')[1]);
    }
  
    changeSlider = (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      if(this.props.selection === "Vel"){
        if(this.props.track.type === 'audio')
          this.props.note.setVelocity(mapVal(parseFloat(e.target.value), 0, 1, -40, 0));
        else
          this.props.note.setVelocity(parseFloat(e.target.value));
      }
      else if(this.props.selection === "Prb"){
        this.props.note.setProbability(parseFloat(e.target.value));
      }
      else if(this.props.selection === "Dur"){
        if(this.props.track.type === "audio"){
          this.props.note.setDuration(parseFloat(e.target.value));
        }
        else{
          let noteDelta = Tone.Time(this.props.note.getPattern.getLength) - Tone.Time(this.props.note.time);
          let notation = Tone.Time(noteDelta * parseFloat(e.target.value)).toBarsBeatsSixteenths();
          let offsetTime = this.props.note.offset * Tone.Time(this.props.note.getPattern.resolution);
  
          if(Tone.Time(notation) - Tone.Time(offsetTime) > 0){
            this.props.note.setDuration(notation);
          }
        }
      }
      else if(this.props.selection === "Dly"){
        let offsetTime = this.props.note.offset * Tone.Time(this.props.note.getPattern.resolution);
  
        if(Tone.Time(this.props.note.duration) > Tone.Time(offsetTime)){
          this.props.note.setOffset(parseFloat(e.target.value));
        }
      }
  
      let btn = document.getElementById("btnMixNote_" + this.props.selection);
  
      if(this.bPressed)
        btn.innerHTML = Math.round(parseFloat(e.target.value) * 100);
      else
        btn.innerHTML = this.props.selection;
    }
  
    onPressDown = (e) => {
      e.stopPropagation();
  
      this.bPressed = true;
      let btn = document.getElementById("btnMixNote_" + this.props.selection);
      btn.innerHTML = Math.round(parseFloat(e.target.value) * 100);
    }
  
    onPressUp = (e) => {
      e.stopPropagation();
  
      this.bPressed = false;
      let btn = document.getElementById("btnMixNote_" + this.props.selection);
      btn.innerHTML = this.props.selection
    }
  
    getSlider = () => {
      let eleSlider = null;
  
      //TODO: 1 slider, change attributes on selection
      switch (this.props.selection) {
        case "Vel":
          let val = this.props.note.velocity;
          
          if(this.props.track.type === "audio")
            val = mapVal(val, -40, 0, 0, 1);

          eleSlider = <input type="range" min="0" max="1" value={val} className="trackMixSlider" step="0.01" id={"velSlider" + this.props.trackId} 
                          onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>;
          break;
        case "Prb":
          eleSlider = <input type="range" min="0" max="1" value={this.props.note.probability} className="trackMixSlider" step="0.01" id={"velSlider" + this.props.trackId} 
                            onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>;
          break;
        /*
        case "Hum":
          eleSlider = <input type="range" min="0" max="1" value={this.props.note.humanize} className="trackMixSlider" step="0.01" id={"velSlider" + this.props.trackId} 
                            onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>;
          break;
        */
        case "Dur":
          if(this.props.track.type === "audio")
            eleSlider = <input type="range" min="0.01" max="1" value={this.props.note.duration} className="trackMixSlider" step="0.01" id={"velSlider" + this.props.trackId} 
                            onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>;
          else{
            let patternLen = Tone.Time(this.props.note.getPattern.getLength).toBarsBeatsSixteenths();
            let noteDelta = Tone.Time(patternLen) - Tone.Time(this.props.note.time);
            let stepLen = (1 / (Tone.Time(noteDelta) / Tone.Time("64n"))).toFixed(6);
            let currVal = (Tone.Time(this.props.note.duration) / Tone.Time(noteDelta)).toFixed(6);
            eleSlider = <input type="range" min={stepLen} value={currVal} max="1.001" className="trackMixSlider" step={stepLen} id={"velSlider" + this.props.trackId} 
                            onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>;
          }
          break;
        case "Dly":
          eleSlider = <input type="range" min="0" max="0.99" value={this.props.note.offset} className="trackMixSlider" step="0.01" id={"velSlider" + this.props.trackId} 
                            onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>;
          break;
        case "Spd":
          eleSlider = <input disabled={true} type="range" min="0.01" max="3" value={1} className="trackMixSlider" step="0.01" id={"velSlider" + this.props.trackId} 
                            onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>
          break;
        default:
          eleSlider = null;
          break;
        /*
        default:
          eleSlider = <input type="range" min="-40" max="10" value={0} className="trackMixSlider" step="0.05" id={"velSlider" + this.props.trackId} 
                            onChange={this.changeSlider} onInput={this.changeSlider} onMouseDown={this.onPressDown} onMouseUp={this.onPressUp} onTouchStart={this.onPressDown} onTouchEnd={this.onPressUp}/>;
        */
        }
  
      return eleSlider;
    }
  
    render(){
      let cssTopGap = '';
      if(this.props.store.ui.viewMode === 'button' || (this.props.store.ui.viewMode === 'edit' && this.props.store.ui.views.edit.mode === 'graph')){
        cssTopGap = ' mixrowTopGap';
      }
        
      return (
        <div className={"track-rowmix" + cssTopGap} id={'trackrowmixedit_' + this.props.track.id} style={{width: + this.props.store.ui.windowWidth}}>
          <div id="divMixRowBtnContainer" className="track-rowmix-left">
            <button id="btnMixBack" className="btn-mix" onClick={this.backButton}>{'<'}</button>
            <button id="btnMixNote_Dur" className={this.props.selection === "Dur" ? "btn-mix btnSelected" : "btn-mix"} onClick={this.selectMixButton}>Dur</button>
            <button id="btnMixNote_Vel" className={this.props.selection === "Vel" ? "btn-mix btnSelected" : "btn-mix"} onClick={this.selectMixButton}>Vel</button>
            <button id="btnMixNote_Dly" className={this.props.selection === "Dly" ? "btn-mix btnSelected" : "btn-mix"} onClick={this.selectMixButton}>Dly</button>
            <button id="btnMixNote_Prb" className={this.props.selection === "Prb" ? "btn-mix btnSelected" : "btn-mix"} onClick={this.selectMixButton}>Prb</button>
            { /* <button id="btnMixNote_Spd" className="btn-mix" disabled={true} onClick={this.selectMixButton}>Spd</button> */ }
          </div>
          <div className="track-rowmix-right">
            <MixMeters track={this.props.track}/>
            <div style={{marginLeft:'10px', marginRight:'10px'}}>
              { this.getSlider() }
            </div>
          </div>
        </div>
      )
    }
  })
  