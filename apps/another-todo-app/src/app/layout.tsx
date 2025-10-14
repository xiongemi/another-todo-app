import './global.css';
import NavBar from './NavBar';
import Theme from './theme-client';
import StoreProvider from './store-provider';

export const metadata = {
  title: 'Another TODO App',
  description: 'Use voice to record your todo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Theme>
            <NavBar />
            {children}
          </Theme>
        </StoreProvider>
      </body>
    </html>
  );
}
