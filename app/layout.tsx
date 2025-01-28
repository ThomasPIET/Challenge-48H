import {Inter} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.className}>
        <body>

        <div className="fixed h-screen w-64 z-50">
            <Sidebar children={undefined}/>
        </div>

        {children}
        </body>
        </html>
    );
}
