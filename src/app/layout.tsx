import Spacer from '@/component/Spacer';
import { Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from './StoreProvider';
import LoginNavBar from './component/LoginNavBar';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Timesheet Management",
    description: "Initiated for FF14 Time Arragement",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <body className={inter.className} style={{ margin: 0 }}>
                    <StoreProvider>
                        <LoginNavBar />
                        <Container style={{
                            height: "calc(100vh - 56px)",
                            overflowY: "auto",
                        }}>
                            <Spacer />
                            {children}
                        </Container>
                    </StoreProvider>
                </body>
            </AppRouterCacheProvider>
        </html>
    );
}
