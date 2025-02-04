import React, { useState, useRef, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core"
import { open } from '@tauri-apps/plugin-dialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Camels() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(()=>{
    console.log("selectedModel", selectedModel)
  }, [selectedModel])

  useEffect(() => {
    console.log("messages", messages);
    scrollToBottom();
  }, [messages]);

  const handleModelSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'GGUF Model',
          directory: false,
          extensions: ['gguf']
        }]
      });

      if (selected && typeof selected === 'string') {
        console.log('Selected file path:', selected);
        setSelectedModel(selected);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedModel) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const pathParts = selectedModel.split(/[\/\\]/);
      const filename = pathParts.pop() || '';
      const directory = pathParts.join('/');

      console.log("directory", directory);
      console.log("filename", filename);

      const prompts = messages.map(message => message.content);
      prompts.push(input);

      await invoke('run_gguf_locally', {
        prompts,
        modelDirectory: directory,
        modelFilename: filename
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + error }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up event listener for LLM responses
  const setupEventListener = async () => {
    try {
      // Set up new listener
      return await (window as any).__TAURI__.event.listen('llm-response', 
        (event: { payload: string }) => {
          setMessages(prev => {
            if (!event.payload) return prev;
            console.log("event.payload", event.payload);
            const lastMessage = prev[prev.length - 1];
            
            // Create new message if last one wasn't from assistant
            if (!lastMessage || lastMessage.role !== 'assistant') {
              return [...prev, { role: 'assistant', content: event.payload }];
            }
            
            // Otherwise append to last message
            return prev.map((msg, index) => 
              index === prev.length - 1 
                ? { ...msg, content: msg.content + event.payload }
                : msg
            );
          });
        }
      );
    } catch (err) {
      console.error('Error setting up event listener:', err);
    }
  };

  // Set up listener on mount and clean up on unmount
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    
    const setup = async () => {
      unlisten = await setupEventListener();
    };

    setup();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-none p-4">
      <div className="mb-4">
        <button
          type="button"
          onClick={handleModelSelect}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          Choose Model File (GGUF)
        </button>
        {selectedModel && (
          <div className="text-sm text-gray-500 mt-2">
            Selected model: {selectedModel.split(/[\/\\]/).pop()}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[80%] px-4 py-2 rounded-lg bg-white text-gray-900 shadow-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isLoading || !selectedModel}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
