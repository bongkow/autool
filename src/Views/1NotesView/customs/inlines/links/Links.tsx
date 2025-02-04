import { createReactInlineContentSpec } from "@blocknote/react";
import { getNoteNameFromNoteCoreIdFromLocalstorage } from "../../../functions/handleNoteId";
import { useNoteAppStateStore } from "../../../../9StateStore/useNoteAppStateStore";

// The References inline content.
export const Link1 = createReactInlineContentSpec(
  {
    type: "link1",
    content: "styled",
    propSchema: {
      link1: {
        default:"Unknown"
      },
      isCrossed:{
        default:false
      }
    },
  },
  {
    render: (props) => (
      <CustomInlineComponentForLink1 props={props}/>
    ),
  }
);

const CustomInlineComponentForLink1 = ({props}:any) => {
  let {setSelectedNoteId, liveNoteIds, setLiveNoteIds} = useNoteAppStateStore();
  const onClick = () => {
    let isCrossed = props.inlineContent.props.isCrossed
    let theNoteId = props.inlineContent.props.link1
    if(!isCrossed){
      if(liveNoteIds.includes(theNoteId)){
        
      }else{
        const liveNoteIdsCopy = JSON.parse(JSON.stringify(liveNoteIds))
        let newLiveNoteIds = [liveNoteIdsCopy[0], theNoteId, ...liveNoteIdsCopy.slice(1, liveNoteIdsCopy.length)];
        setLiveNoteIds(newLiveNoteIds);
      }
      setSelectedNoteId(theNoteId)
    }
  }
  return(
    <a onClick={onClick} className={`text-red-300 italic cursor-pointer ${props.inlineContent.props.isCrossed===true&&"line-through"}`}>
        {getNoteNameFromNoteCoreIdFromLocalstorage(props.inlineContent.props.link1)}
    </a>
  )
}