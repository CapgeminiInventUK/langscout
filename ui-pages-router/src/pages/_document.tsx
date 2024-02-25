import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ThemeProvider } from '@/components/theme-provider';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head/>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem>
            <Main/>
            <NextScript/>
          </ThemeProvider>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
