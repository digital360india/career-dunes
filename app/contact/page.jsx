import React from 'react'
import { AboutPage } from "@/components/AboutPage";
import { ContactPage } from '@/components/ContactPage';
 meta: [
    { title: "Contact Career Dunes | Recruitment Support" },
    { name: "description", content: "Contact Career Dunes for overseas jobs, manpower requirements, candidate support and grievances." },
    { property: "og:title", content: "Contact Career Dunes | Recruitment Support" },
    { property: "og:description", content: "Contact Career Dunes for overseas jobs, manpower requirements, candidate support and grievances." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]

const page = () => {
  return (
    <ContactPage/>
  )
}

export default page