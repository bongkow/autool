
import { NoteBlock } from "../customs/schema";

export const getBlockTitleTypeFromNoteBlocks = (noteBlocks:NoteBlock[]) => {
    let titleBlock:NoteBlock = noteBlocks.filter((block)=>block.type==="title")[0];
    if(!titleBlock) return "none";
    else{
      return (titleBlock.props as any).type||"none";
    }
}

export const getBlockTitleTypeFromId = (id:string) => {
    let block = localStorage.getItem(id);
    if(block === null) return;
    let blockJson:NoteBlock[] = JSON.parse(block);
    let titleBlock:NoteBlock = blockJson.filter((block)=>block.type==="title")[0];
    if(!titleBlock) return "none";
    else{
      return (titleBlock.props as any).type||"none";
    }
}