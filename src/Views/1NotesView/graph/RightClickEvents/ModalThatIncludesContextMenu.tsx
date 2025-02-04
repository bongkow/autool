import React, { useEffect, useRef } from 'react'
import MenuOnRightClickOnNode from './MenuOnRightClickOnNode';
import { Node } from '../GraphView';

export interface ModalThatIncludesContextMenu {
  isOpen: boolean
  onClose: () => void,
  position: Position,
  rightClickedNode:any,
  setRightClickedNode:(arg:Node|undefined)=>void
}

export default function ModalThatIncludesContextMenu({setRightClickedNode, rightClickedNode, isOpen, onClose, position}: any) {
  //let {hoveredNodeId} = useVaultStore();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const handleClick = () => {
      onClose()
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClick)
    }
  }, [onClose])

  return (
      <Modal isOpen={isOpen} position={position} onClose={onClose}>
        <MenuOnRightClickOnNode 
          onClose={onClose} 
          rightClickedNode={rightClickedNode} 
          setRightClickedNode={setRightClickedNode} 
        />
      </Modal>
  )
}


type Position = { x: number; y: number }

interface ContextMenuProps {
  isOpen: boolean
  position: Position
  onClose: () => void
}

const Modal: React.FC<ContextMenuProps & { children: React.ReactNode }> = ({ isOpen, position,children }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let { x, y } = position

      // Adjust horizontal position if needed
      if (x + rect.width > viewportWidth) {
        x = x - rect.width
      }

      // Adjust vertical position if needed
      if (y + rect.height > viewportHeight) {
        y = y - rect.height
      }

      modalRef.current.style.left = `${x}px`
      modalRef.current.style.top = `${y}px`
    }
  }, [isOpen, position])

  if (!isOpen) return null

  return (
    <div 
      ref={modalRef}
      className="ContextMenu fixed bg-white shadow-lg rounded-sm p-2 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}