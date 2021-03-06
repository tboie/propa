import React from 'react';

import { ToolSampleEditor } from "./sample/sample.js";
import { ToolRecord } from "./record/record.js";
import { ToolObjEditor } from "./objs/objs.js";

export const ToolEditor = props => {
  let type;
  
  if(props.objId){
    if(props.objId.split("_")[0] === "player" || props.objId.split("_")[0] === "sample"){
      type = <ToolSampleEditor store={props.store} 
                  file={props.file} 
                  tracks={props.tracks} 
                  objId={props.objId} 
                  selectedTrack={props.store.ui.selectedTrack} 
                  winWidth={props.store.ui.windowWidth}
                  selectedToolbar={props.store.ui.selectedToolbar} 
                  selectedGroup={props.store.ui.selectedGroup}
                  editorNum={props.editorNum}
                />
    }
    else if(props.objId.split("_")[0] === "record"){
      type = <ToolRecord store={props.store} objId={props.objId} editorNum={props.editorNum}/>
    }
    else{
      type = <ToolObjEditor objId={props.objId} editorNum={props.editorNum}/>
    }
  }
  else{
    type = <div style={{width:'100%', height:'100%', display:'table'}}>
              <div className='labelCenter'>No Object Selected</div>
            </div>
  }

  return(
      <div id={"divToolEditor" + props.editorNum} className="divToolRowPanelContainer">
        {type}
      </div>
    )
}