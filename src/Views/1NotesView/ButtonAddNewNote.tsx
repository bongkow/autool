import { useAppsStateStore } from "../9StateStore/useAppsStateStore";
import { useNoteAppStateStore } from "../9StateStore/useNoteAppStateStore";
import Tooltip from "./Tooltip";

const ButtonAddNewNote = () => {
    let {selectedApp} = useAppsStateStore();
    let {addNote, liveNoteIds } = useNoteAppStateStore();
    const onClick = () => addNote(liveNoteIds, selectedApp);
    return(
        <Tooltip text='add a new note' position='bottom'>
            <button
                className={`h-full w-50 p-1 text-blue-600 hover:text-blue-800 focus:outline-none flex flex-col justify-center rounded-none`}
                onClick={onClick}
            >
                <img src="./plus.svg" alt="plus" width={35} height={35} />
            </button>
        </Tooltip>
    )
}

export default ButtonAddNewNote;