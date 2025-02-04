import { useMessageSigning } from './useMessageSigning';

export default function SigningView() {
  const {
    message,
    setMessage,
    encryptionKey,
    setEncryptionKey,
    signature,
    isLoading,
    signMessage,
  } = useMessageSigning();

  return (
    <div className="h-[calc(100vh-32px)] flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Sign Message
        </h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="encryptionKey" 
              className="block text-sm font-medium text-gray-700"
            >
              Encryption Key
            </label>
            <input
              id="encryptionKey"
              type="password"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your encryption key..."
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-700"
            >
              Message to Sign
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter your message here..."
            />
          </div>

          <button
            onClick={signMessage}
            disabled={!message || !encryptionKey || isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium
              ${!message || !encryptionKey || isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isLoading ? 'Signing...' : 'Sign Message'}
          </button>

          {signature && (
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Signature
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg break-all font-mono text-sm">
                {signature}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}