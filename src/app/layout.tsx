import Spacer from '@/component/Spacer';
import { Container } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from './StoreProvider';
import LoginNavBar from './component/LoginNavBar';
import "./globals.css";
import LoadingScreen from '@/component/LoadingScreen';
import GeneralPurposeDialog from '@/component/dialogs/GeneralPurposeDialog';
import DialogInit from '@/component/DialogInit';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Body from '@/component/Body';

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
                <body
                    className={inter.className + " " + "gradient-background"}
                    style={{ margin: 0 }}
                >
                    <StoreProvider>
                        <Body>
                            <LoadingScreen />
                            <LoginNavBar />
                            <DialogInit />
                            <div style={{
                                height: "calc(100vh - 40px)",
                                overflowY: "auto",
                            }}>
                                <Container>
                                    <Spacer />
                                    {children}
                                </Container>
                            </div>
                        </Body>
                    </StoreProvider>
                </body>
            </AppRouterCacheProvider>
        </html>
    );
}
