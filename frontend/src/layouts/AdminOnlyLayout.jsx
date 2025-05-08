import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AdminOnlyLayout() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate(-1, { replace: true })
        } else {
            setChecked(true)
        }
    }, [user])

    if (!checked) return null

    return <Outlet />
}