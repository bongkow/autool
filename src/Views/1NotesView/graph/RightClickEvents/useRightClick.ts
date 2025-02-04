import { useState } from "react";


type Position = { x: number; y: number }
export const useRightClick = () => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [rightClickedNode, setRightClickedNode] = useState<any>(undefined)

  const onContextMenuClose = () => {
    setIsContextMenuOpen(false)
  }

  const handleContextMenu = (event:MouseEvent)=> {
    try{
      event.preventDefault()
      const newPosition = {x:event.clientX, y:event.clientY};
      setPosition(newPosition);
      setIsContextMenuOpen(true)
    }catch(e){
      console.log('event', event)
    }
  }

  const handlContextMenuOnNode =(node:any, event:MouseEvent) => {
    try{
      event.preventDefault(); 
      setRightClickedNode(node);
      const newPosition = {x:event.clientX, y:event.clientY};
      setPosition(newPosition);
      setIsContextMenuOpen(true)
    }catch(e){
      console.log('e in handlContextMenuOnNode',node, event)
    }
  }

  return {
    handleContextMenu, 
    position, 
    isContextMenuOpen, 
    onContextMenuClose, 
    handlContextMenuOnNode,
    rightClickedNode, 
    setRightClickedNode,
    setIsContextMenuOpen
  }
}