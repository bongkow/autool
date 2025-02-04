import { useNoteAppStateStore } from "../../../9StateStore/useNoteAppStateStore"

interface Iprop {
    onClose:any,
    rightClickedNode:any,
    setRightClickedNode:(arg:Node|undefined)=>void
}


const MenuOnRightClickOnNode = ({ onClose, rightClickedNode, setRightClickedNode}:Iprop)=>{
    // let { delNote, allNoteIds, liveNoteIds, hoveredNodeId  } = useVaultStore();
    let {delNote, liveNoteIds, setRefreshGraph, refreshGraph} = useNoteAppStateStore()
    const handleDeleteNote = () => {
        delNote(liveNoteIds, rightClickedNode.id );
        setRefreshGraph(refreshGraph)
        setRightClickedNode(undefined)
        onClose()

        // let nodeId = rightClickedNode.id;
        // localStorage.removeItem(nodeId);
        //addNote(tempNoteName, liveNoteIds, currentVaultName)
        // if(!hoveredNodeId) onClose();
        // else{
        //   delNote(allNoteIds, liveNoteIds, hoveredNodeId);
        //   onClose()
        // }
    }
    
    return(
        <div className="flex flex-col space-y-1">
          <button 
            onClick={handleDeleteNote} 
            className="flex items-center justify-center w-full px-2 py-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
              {`delete ${rightClickedNode?.name||"ggg"} `} 
          </button>
        </div>
    )
}

export default MenuOnRightClickOnNode