/**
 * @file index.tsx
 * This component provides a UI for verifying Ethereum signatures.
 * It consumes the custom hook `useVerifySignature` which handles the logic 
 * of verification. The hook is imported from `useVerifySignature.ts`.
 *
 * The component includes:
 * 1. An app bar with 32px height.
 * 2. A form that allows the user to input address, message, and signature.
 * 3. A button to trigger signature verification.
 * 4. Display of the verification result.
 *
 * We use Tailwind CSS for styling the component.
 */
import { useVerifySignature } from './useVerifySignature'

export default function VerifyingView() {
  /**
   * Here we consume our custom hook 'useVerifySignature' for the signature verification logic.
   * The hook handles all business logic (such as checking validity, managing state, etc.).
   **/
  const {
    address,
    setAddress,
    message,
    setMessage,
    signature,
    setSignature,
    verificationResult,
    verify,
  } = useVerifySignature()

  return (
    /**
     * We use Tailwind CSS classes to style the various parts of our UI.
     * The top navigation bar is given a fixed height and background color,
     * while the container for the inputs and verification result is styled
     * with Tailwind utility classes.
     **/
    <div className="h-[calc(100vh-32px)] bg-gray-50">
      {/* Top navigation bar */}
      <nav className="h-8 bg-blue-600 flex items-center justify-center text-white">
        <span className="text-sm">Verifying Signature</span>
      </nav>

      {/* Main container with form inputs and result display */}
      <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 font-bold text-gray-800">
          Verify Ethereum Signature
        </h1>

        {/* Address Input Field */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x1234..."
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Message Input Field */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here"
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Signature Input Field */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Signature
        </label>
        <textarea
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Enter signature"
          className="mb-4 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button to trigger verification */}
        <button
          onClick={verify}
          className="mb-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Verify Signature
        </button>

        {/**
         * Conditionally render the verification result. The custom hook
         * sets `verificationResult` to a truthy value (e.g., 'Signature is valid')
         * when the signature is successfully verified. When that's the case,
         * we apply a greenish background and text. If it's invalid, display a different color.
         */}
        
        <div
            className={`p-2 text-center border rounded
              ${
                verificationResult === true
                  ? 'bg-green-100 text-green-800 border-green-400'
                  : 'bg-red-100 text-red-800 border-red-400'
              }
            `}
          >
            {verificationResult === true
              ? 'The signature is valid!'
              : 'The signature is invalid'}
        </div>
        
      </div>
    </div>
  )
}