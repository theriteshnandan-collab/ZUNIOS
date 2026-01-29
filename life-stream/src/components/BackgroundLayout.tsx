export default function BackgroundLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-aurora min-h-screen w-full relative">
            {/* 
        Brick 3: The Living Background
        Uses CSS-native gradients via .bg-aurora class in global.css 
        This is much lighter than the previous Canvas particle system.
        Legacy Phones: It will just render a smooth gradient.
      */}
            {children}
        </div>
    );
}
