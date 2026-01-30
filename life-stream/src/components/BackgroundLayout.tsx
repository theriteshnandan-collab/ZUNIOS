export default function BackgroundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Brick W9: Hide Aurora in Sidebar Mode */}
            <div className="bg-aurora hidden sm:block" />
            <div className="relative min-h-screen w-full">
                {children}
            </div>
        </>
    );
}
