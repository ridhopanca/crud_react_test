import React, { Suspense} from 'react'
import Routes from './Routes'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Box, CircularProgress } from '@mui/material'
const loading = (
  <Box className='flex h-screen justify-center items-center'>
    <CircularProgress />
  </Box>
)
function App() {
  return (
    <>
      <Toaster />
      <Suspense fallback={loading}>
        <RouterProvider router={Routes} />
      </Suspense>
    </>
  )
}

export default App
