import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { NoteBlock, schema } from "./customs/schema";
import { filterSuggestionItems,  insertOrUpdateBlock  } from "@blocknote/core";
import { RiAlertFill } from "react-icons/ri";
import { useNoteAppStateStore } from "../9StateStore/useNoteAppStateStore";
import { getInitialNoteContent } from "./functions/handleLocalstorage";
import { listAllNotesOnMenuForLink1 } from "./customs/inlines/links/listAllNotesOnMenu";



const Note = () => {
  let { selectedNoteId } = useNoteAppStateStore();
  // Creates a new editor instance.
  const editor = useCreateBlockNote({schema, trailingBlock:false, initialContent:getInitialNoteContent(selectedNoteId)},[]);
  const onBlocksChange = () => {
    let blocks:NoteBlock[] = editor.document;
    console.log('blocks', blocks)
    let titleBlock:NoteBlock|undefined= editor?.getBlock("Title");
    if(titleBlock===undefined){
      alert('No Title Block!!');
      return;
    }
    else if(selectedNoteId?.startsWith("#")){

    }
    else{
        let titleContent = titleBlock.content;
        if(titleContent===undefined) alert("titleContent is undefined!!");
        else{
          localStorage.setItem(selectedNoteId as string, JSON.stringify(blocks))
        }
    }
  }
  // Renders the editor instance using a React component.
  return (
      <BlockNoteView
        editor={editor} 
        sideMenu={false}
        slashMenu={false}
        onChange={onBlocksChange}
      >
        <SuggestionMenuController
                  triggerCharacter={"/"}
                  getItems={async (query:any) =>
                      // Gets all default slash menu items and `insertAlert` item.
                      filterSuggestionItems([insertTitle(editor), ...getDefaultReactSlashMenuItems(editor)] ,query)
                  }
        />
        <SuggestionMenuController
                  triggerCharacter={">"}
                  getItems={async (query) =>
                      // Gets all the notes to menu items
                      filterSuggestionItems(listAllNotesOnMenuForLink1(editor), query)
                  }
        />
      </BlockNoteView>

);
}

export default Note;

// Slash menu item to insert an Title block
const insertTitle = (editor: typeof schema.BlockNoteEditor) => ({
  title: "title",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "title",
    });
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Title",
  icon: <RiAlertFill />,
});