export default function BackgroundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="bg-aurora" />
            <div className="relative min-h-screen w-full">
                {children}
            </div>
        </>
    );
}
