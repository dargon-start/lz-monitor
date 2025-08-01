import Router from '@/router/index.tsx'
import ThemeProvider from '@/theme/ThemeProvider'
function App() {
  return (
    <>
      <ThemeProvider>
        <Router></Router>
      </ThemeProvider>
    </>
  )
}

export default App
