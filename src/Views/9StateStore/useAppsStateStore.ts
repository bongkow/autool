import { create } from "zustand";

import { APPNAME } from "../0AppsView/Route";

interface AppState{
    apps:string[],
    setApps:(arg:string[])=>void,
    route:string[],
    setRoute:(arg:string[])=>void,
    selectedApp:string|undefined,
    setSelectedApp:(arg:string|undefined)=>void
}

export const useAppsStateStore = create<AppState>((set)=>({
    apps:["creating", "signing", "verifying"],
    setApps:(apps:string[])=>set(()=>({apps})),
    route:[APPNAME],
    setRoute:(route:string[])=>set(()=>({route})),
    selectedApp:undefined,
    setSelectedApp:(selectedApp:string|undefined)=>set(()=>({selectedApp})),
}))