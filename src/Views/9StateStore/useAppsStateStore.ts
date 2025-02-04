import { create } from "zustand";

interface AppState{
    apps:string[],
    setApps:(arg:string[])=>void,
    route:string[],
    setRoute:(arg:string[])=>void,
    selectedApp:string|undefined,
    setSelectedApp:(arg:string|undefined)=>void
}

export const useAppsStateStore = create<AppState>((set)=>({
    apps:["note", "wallets", "camels", "kimchimail"],
    setApps:(apps:string[])=>set(()=>({apps})),
    route:["bongkow"],
    setRoute:(route:string[])=>set(()=>({route})),
    selectedApp:undefined,
    setSelectedApp:(selectedApp:string|undefined)=>set(()=>({selectedApp})),
}))