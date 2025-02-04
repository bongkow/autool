import { lazy, Suspense, useEffect, useMemo, useState, useTransition } from "react";
import { GraphViewId, useNoteAppStateStore } from "../9StateStore/useNoteAppStateStore"
import Note from "./Note";
import Tabs from "./Tabs";
const GraphView = lazy(() => import('./graph/GraphView'));

const NotesView = () => {
    let {selectedNoteId, setSelectedNoteId, liveNoteIds} = useNoteAppStateStore();
    const [isPending, startTransition] = useTransition();

    const [currentView, setCurrentView] = useState(() => 
        selectedNoteId === GraphViewId ? 'graph' : 'note'
    );

    useEffect(()=>{
        localStorage.setItem(GraphViewId, JSON.stringify({type:'special_note', name:"GraphView"}));
        setSelectedNoteId(GraphViewId);
    }, [])

    useEffect(() => {
        console.log('selectedNoteId', selectedNoteId)
        startTransition(() => {
            setCurrentView(selectedNoteId === GraphViewId ? 'graph' : 'note')
        })
    }, [selectedNoteId]);

    return(
        <div className='NotesView fixed top-8 left-0 flex-1 h-full w-full flex flex-col justify-start bg-white'>
            <div className="h-8 flex-0"> {/* Fixed height for tabs */}
                {useMemo(()=><Tabs />, [selectedNoteId, liveNoteIds])}
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                {isPending ? (
                    <div>Transitioning...</div>
                ) : (
                    <div className="GraphViewOrNote flex-1 border-2 overflow-auto">
                    {currentView === 'graph' ? 
                        <GraphView /> : 
                        <Note />
                    }</div>    
                )}
            </Suspense>
        </div>
    )
}

export default NotesView;

