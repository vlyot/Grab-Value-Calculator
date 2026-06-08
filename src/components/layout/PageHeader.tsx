export function PageHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Grab Value Calculator</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Score whether your Grab ride is worth it vs public transit
        </p>
      </div>
    </header>
  )
}
