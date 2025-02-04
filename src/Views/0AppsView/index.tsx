import { useTransition, lazy, Suspense, useEffect } from "react"
import { useAppsStateStore } from "../9StateStore/useAppsStateStore"
import Route from "./Route"
import Camels from "../3Camels"
import Kimmail from "../4KimchImail"
//import { invoke } from "@tauri-apps/api/core"



const NotesView = lazy(() => import("../1NotesView"))
const WalletsView = lazy(() => import("../2Wallets"))

export type Position = { x: number; y: number }

export default function AppsView() {
  const { apps, selectedApp, setSelectedApp, setRoute, route } = useAppsStateStore()
  const [isPending, startTransition] = useTransition();
  useEffect(()=>{
    //invoke("run_gguf_locally1").then((res)=>console.log(res));
  }, [])

  
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      <div className="Route flex-none w-full flex-row justify-start items-center m-0 p-0 bg-white h-8">
        <Route />
      </div>
      <div className="flex-1 overflow-hidden text-md w-full border-2 p-2">
        {selectedApp === undefined ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {apps.map((app: string) => (
              <AppButton
                key={app}
                appName={app}
                onClick={() => {
                  startTransition(() => {
                    setSelectedApp(app);
                    let newRoute = [...route, app];
                    setRoute(newRoute);
                  })
                }}
                isPending={isPending}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white transition-all duration-300 ease-in-out h-full flex flex-col">
            <Suspense fallback={<LoadingSpinner />}>
              {selectedApp === 'note' ? (
                <NotesView />
              ) : selectedApp === 'wallets' ? (
                <WalletsView />
              ) : selectedApp === 'camels' ? (
                <Camels />
              ) : selectedApp === 'kimchimail' ? (
                <Kimmail />
              ) :
                <div className="text-center text-gray-600">App Not Found</div>
              }
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}


const AppButton = ({
  appName,
  onClick,
  isPending,
}: {
  appName: string
  onClick: () => void
  isPending: boolean
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={`
        w-full aspect-square rounded-xl shadow-sm transition-all duration-300 ease-in-out
        flex flex-col justify-center items-center
        text-sm font-medium p-2
        ${
          isPending
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-800 hover:bg-blue-500 hover:text-white hover:shadow-md'
        }
      `}
    >
      {appName}
    </button>
  )
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)