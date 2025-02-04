import { useKeyPairGeneration } from './useKeyPairGeneration';

const CreatingView = () => {
    const {
        encryptionKey,
        setEncryptionKey,
        keyPair,
        isLoading,
        error,
        generateKeyPair,
    } = useKeyPairGeneration();

    return (
        <div className='fixed top-8 left-0 w-full h-[calc(100vh-32px)] bg-white'>
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Generate Key Pair</h1>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="encryptionKey" className="block text-sm font-medium text-gray-700">
                            Encryption Key
                        </label>
                        <input
                            type="text"
                            id="encryptionKey"
                            value={encryptionKey}
                            onChange={(e) => setEncryptionKey(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter your encryption key"
                        />
                    </div>

                    <button
                        onClick={generateKeyPair}
                        disabled={isLoading || !encryptionKey}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${isLoading || !encryptionKey 
                                ? 'bg-indigo-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                    >
                        {isLoading ? 'Generating...' : 'Generate Key Pair'}
                    </button>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {keyPair && (
                        <div className="space-y-4">
                            <div className="rounded-md bg-gray-50 p-4">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <pre className="mt-2 text-sm text-gray-600 overflow-x-auto">
                                    {keyPair.address}
                                </pre>
                            </div>
                            <div className="rounded-md bg-gray-50 p-4">
                                <label className="block text-sm font-medium text-gray-700">Public Key</label>
                                <pre className="mt-2 text-sm text-gray-600 overflow-x-auto">
                                    {keyPair.publicKey}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatingView;

