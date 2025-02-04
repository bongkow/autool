import { NoteCoreId, } from "../../9StateStore/useNoteAppStateStore";
import { NoteBlock } from "../customs/schema";

export const getAllNoteIdsFromLocalStorage = ():string[] => {
    return Object.keys(localStorage).filter((key:string)=>key.startsWith("note_"));
}

/**
 * Get NoteBlocks from localStorage. 
 * It searches by keys in localStorage.
 * It finds if there is any key that matches in CoreNoteId.
 * If it find one, it returns NoteBlocks 
 * else it returns titleBlock with temporary id. 
 */
export const getInitialNoteContent = (selectedNoteId:NoteCoreId):NoteBlock[] => {
    let keys = Object.keys(localStorage).filter((key)=>key===selectedNoteId);
    if(selectedNoteId?.startsWith("#")){
        return []
    }
    else if(keys.length===1){
      let key = keys[0];
      let contentString = localStorage.getItem(key)||"";
      let noteBlocks = (JSON.parse(contentString) as NoteBlock[]);
      return noteBlocks
    }else{
      const initialNoteContentsBlank:NoteBlock[] = [{
        id:'Title',
        type: "title",
        props:{
            textColor: 'default', textAlignment: 'left', type: 'success'
        },
        content: [{text:`temps(${selectedNoteId?.slice(-5)})`, type:"text", styles:{bold:true}}],
        children:[]
      }]
      return initialNoteContentsBlank
    }
}



