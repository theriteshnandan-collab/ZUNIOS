export default function BackgroundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* TITAN: The Void Background */}
            <div className="bg-void fixed inset-0 -z-50" />
            <div className="relative min-h-screen w-full">
                {children}
            </div>
        </>
    );
}
