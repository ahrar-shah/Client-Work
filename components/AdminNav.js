import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AdminNav() {
  const router = useRouter()
  const doLogout = async () => {
    // clear cookie (call API to clear it)
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
  }

  return (
    <nav style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <Link href="/admin"><a>Dashboard</a></Link>
      <Link href="/"><a>Site</a></Link>
      <button onClick={doLogout}>Logout</button>
    </nav>
  )
}
