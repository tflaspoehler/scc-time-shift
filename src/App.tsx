import Upload from './components/upload';

function App() {

return (
    <>
        <header className="bg-cyan-600 py-4 px-8 flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold">SCC Time Shift</h1>
            <div className="flex items-center">
                {/* Add any additional header elements here */}
            </div>
        </header>
        <div className="card">
            <Upload />
        </div>
    </>
)
}

export default App
