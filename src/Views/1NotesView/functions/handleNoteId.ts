import { NoteCoreId, NoteId } from "../../9StateStore/useNoteAppStateStore";
import { NoteBlock } from "../customs/schema";

export const getAppName = (noteId:NoteId):string => {
    if(noteId===undefined) return ""
    else return noteId.split("_")[0]
}

export const getNoteEpoch = (noteId:NoteId):string => {
    if(noteId===undefined) return ""
    else return noteId.split('_')[1];
}

export const getNoteName = (noteId:NoteId):string => {
    if(noteId===undefined) return ""
    else return noteId.split('_')[2];
}

export const isGraphView = (noteId:NoteCoreId):boolean => {
    if(noteId===undefined) return false
    else if(noteId?.startsWith('#') && noteId.endsWith('1')){
        return true
    }else return false
}

export const getCoreNoteId = (noteId:NoteId):string => {
    if(noteId===undefined) return ""
    else return getAppName(noteId)+"_"+getNoteEpoch(noteId);
}
export const getNoteNameFromBlocks = (blocks:NoteBlock[]) => {
    let titleBlock = blocks[0];
    let contents = titleBlock?.content;
    let titleText = (contents as {text:string, styles:any, type:"text"}[])[0].text;
    return titleText
}
export const getNoteNameFromNoteCoreIdFromLocalstorage = (noteCoreId:NoteCoreId|string):string|undefined => {
    let noteBlocks = localStorage.getItem(noteCoreId as string);
    try{
        if(noteBlocks === null) {
            throw "No block is found!";
        }else{
            let blocks:NoteBlock[]|undefined= JSON.parse(noteBlocks);
            if(blocks){
                    let titleBlock = blocks[0];
                    let contents = titleBlock?.content;
                    let titleText = (contents as {text:string, styles:any, type:"text"}[])[0].text;
                    return titleText
            }else{
                throw "no block title!";
            } 
        }
    }catch(e){
        console.error(e);
        if(noteCoreId) localStorage.removeItem(noteCoreId);
        return undefined
    }
    
    
}