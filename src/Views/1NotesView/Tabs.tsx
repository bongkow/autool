import { useEffect } from "react";
import { NoteCoreId, useNoteAppStateStore } from "../9StateStore/useNoteAppStateStore";
import ButtonAddNewNote from "./ButtonAddNewNote";
import { removeElementAtIndex } from "./functions/handleArray";
import { getNoteNameFromNoteCoreIdFromLocalstorage, isGraphView } from "./functions/handleNoteId";


    

const Tabs = () => {
    let {
        liveNoteIds,
        setLiveNoteIds,
        setSelectedNoteId,
        selectedNoteId,
    } = useNoteAppStateStore();

    useEffect(()=>{
        console.log('liveNoteIds', liveNoteIds)
    }, [selectedNoteId])
    return(
        <ul className="Tabs flex-0 w-full LiveNotes flex bg-white text-black h-8">
            {liveNoteIds.map((noteCoreId:NoteCoreId) => (
                <li key={noteCoreId} 
                    className={`Tab border-r-2 mr-0 flex flex-row justify-center items-center h-8 max-h-8 ${isGraphView(noteCoreId)?"w-[125px]":"w-[200px]"}`}
                >
                    <button
                        id={noteCoreId}
                        className={`max-h-8 w-full p-1 focus:outline-none flex flex-col justify-center rounded-none ${
                            noteCoreId === selectedNoteId ? 'text-wrap bg-black text-white' :'bg-white text-black'
                        }`}
                        onClick={() => {
                            try{
                                if(noteCoreId !== selectedNoteId){
                                    setSelectedNoteId(noteCoreId);
                                }
                            }catch(e){
                                console.log('e', e)
                            }
                            
                        }}
                        >
                            {isGraphView(noteCoreId)?"GraphView":getNoteNameFromNoteCoreIdFromLocalstorage(noteCoreId)}
                        </button>
                        {
                            !isGraphView(noteCoreId) && 
                            <button 
                                className={`XButton max-h-8 p-1 text-white focus:outline-none flex flex-col justify-center rounded-none text-wrap ${noteCoreId===selectedNoteId?'bg-black text-white':'bg-white text-black'} hover:font-bold`}
                                onClick={()=>{
                                    let index = liveNoteIds.findIndex((id:NoteCoreId)=>id===noteCoreId);
                                    if(index>0 && index<liveNoteIds.length){
                                        let newLiveNoteIds = removeElementAtIndex(liveNoteIds, index);
                                        setLiveNoteIds(newLiveNoteIds);
                                        let newCurrentNoteId = newLiveNoteIds[index-1];
                                        setSelectedNoteId(newCurrentNoteId)
                                    }else{
                                        alert('error in index. code notes100')
                                    }
                                }
                            }>
                                x
                            </button>
                        }
                        
                    </li>
                ))}
                <li key="AddNewNote" className="AddNewNoteWrapper mr-1 flex flex-col justify-center w-[35px] h-[35px] max-h-6 max-w-6 rounded-none">
                    <ButtonAddNewNote />
                </li>
            </ul>
    )
}

export default Tabs;