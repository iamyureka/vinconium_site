'use client'

import { useEffect } from "react"
import { deleteCredentials } from "syasym/dist/client"

export default function Logout() {
    useEffect(() => {
        deleteCredentials()
    }, [])
    location.href = '/'
}