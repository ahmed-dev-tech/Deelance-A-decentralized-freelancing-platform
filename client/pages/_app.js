import "../styles/globals.css";
import "../styles/extraStyles.css";
import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from "@chakra-ui/react";
import ContractProvider from "../context/ContractProvider";
import FirebaseProvider from "../context/FirebaseProvider";
import NFTStorageProvider from "../context/NFTStorageProvider";
import UtilitiesProvider from "../context/UtilitiesProvider";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
    >
      <ChakraProvider resetCSS>
        <UtilitiesProvider>
          <FirebaseProvider>
            <ContractProvider>
              <NFTStorageProvider>
                <Component {...pageProps} />
              </NFTStorageProvider>
            </ContractProvider>
          </FirebaseProvider>
        </UtilitiesProvider>
      </ChakraProvider>
    </MoralisProvider>
  );
}

export default MyApp;
