import { create } from "zustand";
import { removeElementAtIndex } from "../1NotesView/functions/handleArray";

export type AppName = string;
export type NoteEpoch = string;
export type NoteName = string;

export type NoteId = `${AppName}_${NoteEpoch}_${NoteName}`|undefined;
export type NoteCoreId = `${AppName}_${NoteEpoch}`|undefined;

interface AppState{
    liveNoteIds:NoteCoreId[],
    setLiveNoteIds:(arg:NoteCoreId[])=>void,
    selectedNoteId:NoteCoreId|undefined,
    setSelectedNoteId:(arg:NoteCoreId)=>void
    addNote:(liveNoteIds:NoteCoreId[], selectedAppName:string|undefined)=>void,
    delNote:(liveNoteIds:NoteCoreId[], noteId:NoteCoreId)=>void,
    refreshGraph:number,
    setRefreshGraph:(arg:number)=>void
}

//specail notes
export const GraphViewId = "#note_1"; //special note1

export const useNoteAppStateStore = create<AppState>((set)=>({
    liveNoteIds:[GraphViewId],
    setLiveNoteIds:(liveNoteIds:NoteCoreId[])=>set(()=>({liveNoteIds})),
    selectedNoteId:GraphViewId,
    setSelectedNoteId:(selectedNoteId:NoteCoreId|undefined)=>set(()=>({selectedNoteId})),
    addNote:(liveNoteIds:NoteCoreId[], selectedAppName:string|undefined)=>{
        let noteIndex = liveNoteIds.length-1;
        ++noteIndex
        let noteEpoch:string = Date.now().toString();
        let newNoteId:NoteCoreId= `${selectedAppName}_${noteEpoch}`;
        let newNotesIds = [...liveNoteIds.slice(0,liveNoteIds.length), newNoteId];
        set(()=>({liveNoteIds:newNotesIds}));
        set(()=>({selectedNoteId:newNoteId}));
        localStorage.setItem(`${selectedAppName}_${noteEpoch}`,JSON.stringify(createTitleNoteBlock(`unnamed(${noteEpoch.slice(-5)})`)))
    },
    delNote:(liveNoteIds:NoteCoreId[], noteId:NoteCoreId)=>{
        let liveNoteIdsCopy:NoteCoreId[] = JSON.parse(JSON.stringify(liveNoteIds));
        let index1 = liveNoteIdsCopy.findIndex((id:NoteCoreId)=>id===noteId);
        if(index1>-1){
            let newliveNoteIds = removeElementAtIndex(liveNoteIdsCopy, index1);
            set(()=>({liveNoteIds:newliveNoteIds}))
        } 
        localStorage.removeItem(noteId as string);
    },
    refreshGraph:0,
    setRefreshGraph:(refreshGraph:number)=>set(()=>({refreshGraph:refreshGraph+1}))
}));


export const createTitleNoteBlock = (title:string) => {
    return [{
        id:'Title',
        type: "title",
        props:{
            textColor: 'default', textAlignment: 'left', type: 'success'
        },
        content: [{text:title, type:"text", styles:{bold:true}}],
        children:[]
    }]
}


