import Spacer from '@/component/Spacer';
import { Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from './StoreProvider';
import LoginNavBar from './component/LoginNavBar';
import "./globals.css";
import LoadingScreen from '@/component/LoadingScreen';
import WarningDialog from '@/component/dialogs/WarningDialog';
import DialogInit from '@/component/DialogInit';

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
                        <LoadingScreen />
                        <LoginNavBar />
                        <DialogInit />
                        <div style={{
                            height: "calc(100vh - 56px)",
                            overflowY: "auto",
                        }}>
                            <Container>
                                <Spacer />
                                {children}
                            </Container>
                        </div>

                    </StoreProvider>
                </body>
            </AppRouterCacheProvider>
        </html>
    );
}
