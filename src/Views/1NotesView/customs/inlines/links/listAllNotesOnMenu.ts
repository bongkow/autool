import { DefaultReactSuggestionItem } from "@blocknote/react";
import { schema } from "../../schema";
import { getNoteNameFromBlocks, getNoteNameFromNoteCoreIdFromLocalstorage } from "../../../functions/handleNoteId";
import { createTitleNoteBlock } from "../../../../9StateStore/useNoteAppStateStore";

  /**
   * when a user click > on note, 
   * this function lists all the possible notes to be linked by link1.
   * It does not show selectedNote's name because this app does not allow self-linking.
   * 
   * @param editor 
   * @returns DefaultReactSuggestionItem
   */
  export const listAllNotesOnMenuForLink1 = (
    editor: typeof schema.BlockNoteEditor
  ): DefaultReactSuggestionItem[] => {
    const blocks = editor.document;
    let currentNoteName = getNoteNameFromBlocks(blocks);
    const noteCoreIds = Object.keys(localStorage).filter((key:string)=>key.startsWith('note_'));
    const noteIds:string[] = [...noteCoreIds];
    const links = noteIds.map((link1)=>{
        let noteName = getNoteNameFromNoteCoreIdFromLocalstorage(link1)
        if(noteName && noteName !== currentNoteName) {
            return {
                title:noteName,
                onItemClick: () => {
                    editor.insertInlineContent([
                        "[[", 
                            {
                            type: "link1",
                            props: {
                                link1,
                                isCrossed:false,
                            }
                            },
                        "]]",
                    ]);
                }
            }
        }else{
            return undefined
        }
     }
    )
    let linkAddNewNote:DefaultReactSuggestionItem = {
        title:"AddNewNote",
        onItemClick:()=>{
            let noteEpoch:string = Date.now().toString();
            let newNoteId = `note_${noteEpoch}`
            localStorage.setItem(newNoteId,JSON.stringify(createTitleNoteBlock(`unnamed(${noteEpoch.slice(-5)})`)))
            editor.insertInlineContent([
                "[[", 
                    {
                    type: "link1",
                    props: {
                        link1:`note_${noteEpoch}`,
                        isCrossed:false,
                    }
                    },
                "]]",
            ]);;
        }
    }
    return [...links.filter((link)=>link!==undefined), linkAddNewNote]
;
};