import "./App.css";
import AppsView from "./Views/0AppsView";

function App() {
  return (
    <main className="App flex flex-col justify-center items-center w-full h-full flex-grow">
      <div className="AppViewWrapper flex-1 w-full">
        <AppsView />
      </div>
    </main>
  );
}

export default App;