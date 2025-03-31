import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { MuiThemeProvider } from './theme-provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alison - Full Stack Assessment",
  description: "Full Stack Assessment for Alison",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MuiThemeProvider>
          <AppBar position="static" component="nav">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Alison Assessment
              </Typography>
              <Button color="inherit" href="/numbers">
                Numbers
              </Button>
              <Button color="inherit" href="/grades">
                Grades
              </Button>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 4 }}>
            {children}
          </Container>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
