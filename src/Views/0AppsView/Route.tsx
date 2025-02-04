import { useEffect, useState } from "react";
import { useAppsStateStore } from "../9StateStore/useAppsStateStore"
import { getVersion } from '@tauri-apps/api/app';

export const APPNAME = "autool";

const Route = () => {
    const { route } = useAppsStateStore();
    const [version, setVersion] = useState<string>("")
    useEffect(()=>{
      getVersion().then((version)=>{
        setVersion(version)
      });
    }, [])
    return(
        <>
            {route.map((name:string, index:number)=>{
              return(
                  (name===APPNAME)?
                  <RouteButton key={`${name}_v${version}`} name={`${name}_${version}`} index={index}/>:
                  <RouteButton key={name} name={name} index={index}/>
              )
              })}
        </>
    )
}

const RouteButton = ({name, index}:{name:string, index:number}) => {
    const { setSelectedApp, setRoute} = useAppsStateStore();

    const onClick = () => {
      switch (index) {
        case 0 : 
          setSelectedApp(undefined);
          setRoute([APPNAME])
          break;
        
        default :
          break;
      }
    }
    return(
      <button 
        onClick={onClick} 
        className="text-xs inline-block text-center h-full m-auto px-3 text-[0.5rem] font-medium leading-none"
        >
          {name}
      </button>
    )
}

export default Route;