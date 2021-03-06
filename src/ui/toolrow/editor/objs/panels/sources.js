//Copyright 2018-2019 Timothy Boie

import React, { Component } from 'react';
import { observer } from "mobx-react";
import { store } from '../../../../../data/store.js';
import { UIEditorHeader, UICustomRangeControl, UIWaveTypeControl, UINoiseTypeControl } from './template.js';


export const UIOscillator = observer(class UIOscillator extends Component {
  render() {
    this.obj = store.sources.oscillators.find(o => o.id === this.props.objId);

    return (
      <div className='divToolRowEditorContainer'>
        <UIEditorHeader obj={this.obj} editorNum={this.props.editorNum} type={this.props.type} />
        <UIWaveTypeControl obj={this.obj} editorNum={this.props.editorNum} propName={"type"}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'detune'} min={-100} max={100} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'phase'} min={0} max={360} mode={'range'} step={1} density={1} numType={'integer'} signal={false}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='volume' min={-100} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
      </div>
    )
  }
})

export const UIAMOscillator = observer(class UIAMOscillator extends Component {
  render() {
    this.obj = store.sources.amoscillators.find(o => o.id === this.props.objId);

    return (
      <div className='divToolRowEditorContainer'>
        <UIEditorHeader obj={this.obj} editorNum={this.props.editorNum} type={this.props.type} />
        <UIWaveTypeControl obj={this.obj} editorNum={this.props.editorNum} propName={"type"}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'detune'} min={-100} max={100} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'phase'} min={0} max={360} mode={'range'} step={1} density={1} numType={'integer'} signal={false}/>
        <UIWaveTypeControl obj={this.obj} editorNum={this.props.editorNum} propName={"modulationType"}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='harmonicity' min={0} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='volume' min={-100} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
      </div>
    )
  }
})

export const UIFMOscillator = observer(class UIFMOscillator extends Component {
  render() {
    this.obj = store.sources.fmoscillators.find(o => o.id === this.props.objId);

    return (
      <div className='divToolRowEditorContainer'>
        <UIEditorHeader obj={this.obj} editorNum={this.props.editorNum} type={this.props.type} />
        <UIWaveTypeControl obj={this.obj} editorNum={this.props.editorNum} propName={"type"}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'detune'} min={-100} max={100} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'phase'} min={0} max={360} mode={'range'} step={1} density={1} numType={'integer'} signal={false}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='modulationIndex' min={0} max={100} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UIWaveTypeControl obj={this.obj} editorNum={this.props.editorNum} propName={"modulationType"}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='harmonicity' min={0} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='volume' min={-100} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
      </div>
    )
  }
})

export const UIFatOscillator = observer(class UIFatOscillator extends Component {
  render() {
    this.obj = store.sources.fatoscillators.find(o => o.id === this.props.objId);

    return (
      <div className='divToolRowEditorContainer'>
        <UIEditorHeader obj={this.obj} editorNum={this.props.editorNum} type={this.props.type} />
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'detune'} min={-100} max={100} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'phase'} min={0} max={360} mode={'range'} step={1} density={1} numType={'integer'} signal={false}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'spread'} min={0} max={360} mode={'range'} step={1} density={1} numType={'integer'} signal={false}/>
        { /*} rapid firing breaks this
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'count'} min={1} max={10} mode={'steps'} step={1} density={10} numType={'integer'} signal={false}/>
*/ }
        <UIWaveTypeControl obj={this.obj} editorNum={this.props.editorNum} propName={"type"}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='volume' min={-100} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
      </div>
    )
  }
})

export const UIPWMOscillator = observer(class UIPWMOscillator extends Component {
  render() {
    this.obj = store.sources.pwmoscillators.find(o => o.id === this.props.objId);

    return (
      <div className='divToolRowEditorContainer'>
        <UIEditorHeader obj={this.obj} editorNum={this.props.editorNum} type={this.props.type} />
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'detune'} min={-100} max={100} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'phase'} min={0} max={360} mode={'range'} step={1} density={1} numType={'integer'} signal={false}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'modulationFrequency'} min={0} max={1000} mode={'range'} step={1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='volume' min={-100} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
      </div>
    )
  }
})

export const UIPulseOscillator = observer(class UIPulseOscillator extends Component {
  render() {
    this.obj = store.sources.pulseoscillators.find(o => o.id === this.props.objId);

    return (
      <div className='divToolRowEditorContainer'>
        <UIEditorHeader obj={this.obj} editorNum={this.props.editorNum} type={this.props.type} />
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'detune'} min={-100} max={100} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'phase'} min={0} max={360} mode={'range'} step={1} density={1} numType={'integer'} signal={false}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'width'} min={0} max={1} mode={'range'} step={0.01} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='volume' min={-100} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
      </div>
    )
  }
})

export const UINoise = observer(class UINoise extends Component {
  render() {
    this.obj = store.sources.noises.find(o => o.id === this.props.objId);

    return (
      <div className='divToolRowEditorContainer'>
        <UIEditorHeader obj={this.obj} editorNum={this.props.editorNum} type={this.props.type} />
        <UINoiseTypeControl obj={this.obj} editorNum={this.props.editorNum} propName={"type"}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName={'playbackRate'} min={0} max={100} mode={'range'} step={0.01} density={1} numType={'float'} signal={true}/>
        <UICustomRangeControl obj={this.obj} editorNum={this.props.editorNum} propName='volume' min={-100} max={10} mode={'range'} step={0.1} density={1} numType={'float'} signal={true}/>
      </div>
    )
  }
})




