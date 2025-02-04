import { lazy, Suspense, useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import { NoteCoreId, useNoteAppStateStore } from "../../9StateStore/useNoteAppStateStore";
import { getNodesFromLocalStorage } from "./getNodes";
import { getLinksFromLocalstorage } from "./getLinks";
import { useWindowResize } from "./useWindowSize";
import { getNoteNameFromNoteCoreIdFromLocalstorage } from "../functions/handleNoteId";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { useRightClick} from './RightClickEvents/useRightClick';
const ModalThatIncludesContextMenu = lazy(()=>import('./RightClickEvents/ModalThatIncludesContextMenu'))
export interface Node{
    id:NoteCoreId,
    name:string,
    val?:number,
    type?:string,
}

export interface Link{
    source:string,
    target:string
}

export interface GraphNodes{
    nodes:Node[],
    links?:Link[],
}

const GraphView = () => {
    let dimensions = useWindowResize();
    let {rightClickedNode, setRightClickedNode, handlContextMenuOnNode, position, isContextMenuOpen, onContextMenuClose, } = useRightClick()
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    let {setSelectedNoteId, liveNoteIds, setLiveNoteIds, refreshGraph} = useNoteAppStateStore();
    
    useEffect(()=>{
        console.log('GraphView newly rendered')
        let nodes = getNodesFromLocalStorage();
        let links = getLinksFromLocalstorage();
        console.log('nodes', nodes),
        console.log('links', links)
        if(nodes) setNodes(nodes);
        setLinks(links)
    }, [refreshGraph])

    const onNodeClick = (node:Node) => {
        const {id } = node;
        if(!liveNoteIds.includes(id)){
            const newLiveNoteIds = [...liveNoteIds, id];
            setLiveNoteIds(newLiveNoteIds);
        }
        setSelectedNoteId(id);
    }

    const handleNodeColors = (node:Node):string => {
        let type = node.type||""
        if(type==='success') return "green";
        else if(type==='warning') return "yellow";
        else if(type==="error") return "red";
        else if(type==="info") return "blue";
        else return "#000000"
    }
    
    return(
        <>
            <ForceGraph3D
                graphData={{nodes:nodes, links:links}}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.25}
                onNodeClick={onNodeClick}
                onNodeRightClick={handlContextMenuOnNode}
                width={dimensions.width}
                height={dimensions.height-81}
                nodeColor={handleNodeColors}
                nodeThreeObject={(node:any) => {
                    const nodeEl = document.createElement('div');
                    nodeEl.textContent = getNoteNameFromNoteCoreIdFromLocalstorage(node.id)||"";
                    nodeEl.style.color = "white";
                    nodeEl.className = 'node-label mt-0 text-sm bold';
                    return new CSS2DObject(nodeEl);
                  }}
                  extraRenderers={([new CSS2DRenderer()]) as any}
                  nodeThreeObjectExtend={true}
            />
            <Suspense fallback={<div>Loading...</div>}>
                <ModalThatIncludesContextMenu 
                    isOpen={isContextMenuOpen} 
                    onClose={onContextMenuClose}
                    position={position}
                    rightClickedNode={rightClickedNode}
                    setRightClickedNode={setRightClickedNode} 
                />
            </Suspense>
        </>
    )
};
export default GraphView;