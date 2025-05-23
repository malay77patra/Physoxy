import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthorizedLayout() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login", { replace: true })
        } else if (isAuthenticated === true) {
            setChecked(true)
        }
    }, [isAuthenticated])

    if (!checked) return null

    return <Outlet />
}
