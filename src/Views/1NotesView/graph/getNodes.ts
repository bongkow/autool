import { NoteCoreId } from "../../9StateStore/useNoteAppStateStore";
import { getBlockTitleTypeFromId } from "../functions/getTitleType";
import { getNoteNameFromNoteCoreIdFromLocalstorage } from "../functions/handleNoteId";
import {Node} from "./GraphView";

export const getNodesFromLocalStorage = ():Node[]|undefined => {
    try{
        let storageKeys = Object.keys(localStorage) as NoteCoreId[];
        let noteCoreIds:NoteCoreId[] = storageKeys.filter((key)=>key?.startsWith("note_"));
        let names:(string | undefined)[] = (noteCoreIds as NoteCoreId[]).map((key:NoteCoreId)=> getNoteNameFromNoteCoreIdFromLocalstorage(key));
        let types:(string | undefined)[] = (noteCoreIds as NoteCoreId[]).map((key:NoteCoreId)=> getBlockTitleTypeFromId(key as string));
        let nodes:Node[] = [];

        if(names.includes(undefined)){
            alert('note name includes undefined!!');
            return [];
        }else if(noteCoreIds.length !== names.length){
            alert("keys and names length do not match!!");
            return [];
        }else{
            let len = noteCoreIds.length;
            for(let step = 0; step<len; step++){
                nodes.push({id:noteCoreIds[step], name:(names[step] as string), type:types[step]})
            }
        }
        return nodes
    }catch(e){
        console.error("Error in getNodesFromLocalStorage", JSON.stringify(e))
        return undefined
    }
    
}