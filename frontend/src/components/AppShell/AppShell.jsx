export function AppShell({ children }) {
    return (
        <div className="app-main-wrapper">
            <div className="background-overlay">
                <div className="app-container">
                    <h1 className="casino-title-luxe">V-Casino</h1>
                    {children}
                </div>
            </div>
        </div>
    )
}
