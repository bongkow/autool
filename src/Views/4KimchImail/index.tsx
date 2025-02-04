import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core'; // For calling Tauri backend commands

const EmailClient: React.FC = () => {
  const {
    emailHeaders,
    loading,
    error,
    emailDetails,
    fetchEmailsPop,
    handleEmailClick,
    setEmailDetails,
  } = useEmailClient();

  return (
    <div className="EmailClientContainer h-[calc(100vh-32px)] flex flex-col p-3 w-full mx-auto font-sans">
      <div className="EmailToolbar flex-none flex items-center gap-4 mb-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search emails..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>

        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5 text-sm" onClick={fetchEmailsPop}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && <div className="ErrorMessage flex-none text-red-500 mb-4">{error}</div>}

      <div className="EmailViewContainer flex flex-row flex-1 min-h-0 gap-4">
        {/* Left side - Email list */}
        <div className="EmailListContainer w-2/5 flex flex-col">
          {!loading && !emailHeaders.length && (
            <p className="EmptyInboxMessage flex-none text-gray-500">Your inbox is empty! 🎉</p>
          )}

          {loading && (
            <p className="LoadingMessage flex-none text-gray-500">Loading emails... Hang tight! 🕒</p>
          )}

          <div className="EmailListScroller flex-1 overflow-y-auto h-1/2">
            <div className="EmailList flex flex-col gap-2">
              {emailHeaders.map((emailHeader, index) => (
                <div
                  key={index}
                  className="EmailListItem p-2 bg-gray-100 border rounded shadow-sm cursor-pointer hover:bg-gray-200"
                  onClick={() => handleEmailClick(emailHeader.messageId)}
                >
                  <h2 className="EmailSubject font-medium truncate text-sm">{emailHeader.subject}</h2>
                  <div className="EmailMetadata flex gap-2 text-xs text-gray-700">
                    <span className="EmailDate">{new Date(emailHeader.date).toLocaleString()}</span>
                    <span className="EmailSender">From: {emailHeader.from}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Email details */}
        <div className="EmailDetailContainer w-3/5 flex flex-col">
          {emailDetails ? (
            <div className="EmailDetailContent flex-1 p-4 bg-white border rounded shadow-lg overflow-y-auto">
              <h2 className="EmailDetailHeader text-xl font-bold">Email Details</h2>
              <p className="EmailDetailBody mt-2 text-gray-700">{emailDetails}</p>
              <button
                className="CloseButton mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setEmailDetails(null)}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="EmailDetailPlaceholder flex-1 flex items-center justify-center text-gray-500">
              Select an email to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailClient;


/**
 * Custom hook responsible for fetching, storing, and handling emails.
 * ------------------------------------------------------------------
 * Explanation:
 * 1. useEmailClient keeps track of emails, loading state, and any error messages.
 * 2. fetchEmails calls the Tauri backend command 'fetch_emails' and updates state with the response.
 * 3. handleEmailClick sets the currently selected email details to show in the UI.
 * 4. By separating logic into a hook, we keep our UI component clean.
 */
const openDB = () => import('idb').then(module => module.openDB);
type EmailHeader = {
  messageId: string;
  from: string;
  date: string;
  subject: string;
  attachments: {
    filename: string[];
    hasAttachments: boolean;
  }[];
  uid: string;
  timestamp: number;
  isRead: boolean;
}
    
const DB_NAME = 'kimchi_mail';
const DB_VERSION = 1;
const DB_STORE_NAME = 'emails';

export async function getLatestTimestamp(): Promise<number | null> {
  const db = await (await openDB())(DB_NAME, DB_VERSION);
  const tx = db.transaction(DB_STORE_NAME, 'readonly');
  const store = tx.objectStore(DB_STORE_NAME);
  
  // Open a cursor sorted by timestamp in descending order (to get the latest)
  const cursor = await store.index('timestamp').openCursor(null, 'prev');
  
  return cursor ? (cursor.value.timestamp as number) : null;
}

/**
 * saveEmail
 * @param emails 
 */

export async function saveEmailHeadersIDB(emails: EmailHeader[]): Promise<void> {
  const openDBModule = await openDB();
  
  // Create database if it doesn't exist
  const db = await openDBModule(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the store if it doesn't exist
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        const store = db.createObjectStore(DB_STORE_NAME, {
          keyPath: 'uid',
          autoIncrement: true
        });
        // Create an index on the timestamp field
        store.createIndex('timestamp', 'timestamp');
      }
    }
  });

  const tx = db.transaction(DB_STORE_NAME, 'readwrite');
  const store = tx.objectStore(DB_STORE_NAME);
  
  // Use Promise.all to handle multiple put operations in parallel
  await Promise.all(
    emails.map(email => store.put(email))
  );
}

/**
 * getStoredUIDs
 * @returns 
 */
async function getStoredUIDs(): Promise<string[]> {
  const db = await (await openDB())(DB_NAME, DB_VERSION);
  const tx = db.transaction(DB_STORE_NAME, 'readonly');
  const store = tx.objectStore(DB_STORE_NAME);

  const emails = await store.getAll();
  return emails.map((email: any) => email.uid);
}



const useEmailClient = () => {
  const [emailHeaders, setEmailHeaders] = useState<EmailHeader[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailDetails, setEmailDetails] = useState<string | null>(null);
  
  // Fetch emails from the backend
  const fetchEmailsPop = async () => {
    setLoading(true);
    setError(null);
    try {
      const emailHeaders = await invoke<string[]>('fetch_emails_pop', {
        server: 'mail.liancg.com', 
        port: 995,
        username: 'skim@liancg.com', // Changed from email to username to match backend
        password: 'Kore@0330!!',
        howmany: 20,
      });
      
      // Note: The backend currently returns void, not string[]
      // We need to update the backend to return email data before we can set emails
      const emailHeadersJson = emailHeaders.map(header => JSON.parse(header));
      console.log('Response from backend:', emailHeadersJson);
      await saveEmailHeadersIDB(emailHeadersJson);
      setEmailHeaders(emailHeadersJson); // Temporarily set empty array since backend doesn't return data yet
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Failed to fetch emails. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Show email details when an email is clicked
  const handleEmailClick = (email: string) => {
    setEmailDetails(email);
  };

  // Initial email fetch
  useEffect(() => {
    console.log('inital email fetch');
    getStoredUIDs().then(uids => {
      //console.log('Stored UIDs:', uids);
      return uids;
    }).then((uids:string[])=>{
      console.log('UIDs:', uids);

    });
    fetchEmailsPop()
    
  }, []);

  return {
    emailHeaders,
    loading,
    error,
    emailDetails,
    fetchEmailsPop,
    handleEmailClick,
    setEmailDetails,
  };
}

