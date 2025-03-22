'use client';

import './globals.css';
import Footer from './sections/Footer/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
                <FooterWrapper />
            </body>
        </html>
    );
}

// Client component to conditionally render Footer
function FooterWrapper() {
    'use client';

    const pathname = usePathname();

    // Don't show Footer on any quiz routes
    if (pathname && pathname.startsWith('/quiz')) {
        return null;
    }

    return <Footer />;
}
