export default function AdminHome() {
    return (
        <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '60vh' }}>
            <h1>Admin</h1>
            <p>Manage users, artisan profiles, job requests and payments in the site administration.</p>
            <a className="btn btn-primary" href="/admin/" target="_blank" rel="noopener noreferrer">
                Open the admin site
            </a>
        </div>
    )
}