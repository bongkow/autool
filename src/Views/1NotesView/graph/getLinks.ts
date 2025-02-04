import { NoteBlock } from "../customs/schema";
import { Link } from "./GraphView";

export const getLinksFromLocalstorage = ():Link[] => {
    let storageKeys = Object.keys(localStorage);
    let noteCoreIds:string[] = storageKeys.filter((key)=>key?.startsWith("note_"));
    let links = noteCoreIds.map((key)=>getLinksFromNoteCoreId(key)).filter((link)=>link.length>0);
    let linksFlat = links.flat().filter((link)=>localStorage.getItem(link.target) && localStorage.getItem(link.source)); 
    return linksFlat
}

const getLinksFromNoteCoreId = (noteCoreId:string):Link[] => {
    const blocks = localStorage.getItem(noteCoreId);
    if(blocks !== null){
        let blocksJson = JSON.parse(blocks);
        const contents = blocksJson.map((obj:NoteBlock)=>obj.content);
        const linkObjs = contents.flat().filter((obj:any)=>obj.type === "link1");
        const links = linkObjs.map((obj:any)=> {
            if(obj?.props?.link1){
                let link = {"source":noteCoreId, "target":obj.props.link1};
                return link
            }else undefined
        });
        return links
    }
    else{
        return []
    }
}