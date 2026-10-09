import { JobsPage } from '@/components/JobsPage';
import { Suspense } from "react";
import React from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsPage />
    </Suspense>
  )
}

export default page