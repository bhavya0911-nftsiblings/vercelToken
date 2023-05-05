import '@rainbow-me/rainbowkit/styles.css'
import '../styles/global.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig, useAccount } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { CreateCollection } from '../components/_DataContext'
import { useRouter } from 'next/router'
import { Roboto_Mono } from 'next/font/google'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const roboto_mono = Roboto_Mono({ subsets: ['latin'] })

const { chains, provider } = configureChains(
  [goerli],
  [
    publicProvider(), alchemyProvider({ apiKey: process.env.ALCHEMY_ID })
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Token Wrapper',
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
});

export default function App({ Component, pageProps }) {

  const pageName = Component.name
  console.log(pageName)
  const visible = pageName === 'index' || pageName === 'faq' ? false : true;

  const router = useRouter()
  const { isConnected } = useAccount()

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} >
        <CreateCollection>
        <FontAwesomeIcon />
        <style jsx global>{`
          html {
            font-family: ${roboto_mono.style.fontFamily};
          }
        `}</style>
          <main>
            <span className='center circle'></span>
            <span className='top circle'></span>
            <span className='right circle'></span>
            <span className='bottom circle'></span>
            <span className='left circle'></span>
            <div>
              <nav>
                <ul>
                  <li onClick={() => (router.push('/'))}>
                    <h5>Home</h5>
                    {pageName === 'Index' && <span className='current'></span>}
                  </li>
                  <li onClick={() => (router.push('/migrate'))}>
                    <h5>Migrate</h5>
                    {pageName === 'Migrate' && <span className='current'></span>}
                  </li>
                  <li onClick={() => (router.push('/collection'))}>
                    <h5>Collection</h5>
                    {pageName === 'CollectionTab' && <span className='current'></span>}
                  </li>
                  <li onClick={() => (router.push('/faq'))}>
                    <h5>FAQ</h5>
                    {pageName === 'Faq' && <span className='current'></span>}
                  </li>
                </ul>
              </nav>
            </div>
            {visible && <div className='connectButton'>
              {isConnected && <ConnectButton showBalance={false} />}
            </div>}
            <div className='sideIcon'>
              <a href='https://twitter.com/Y4Si' target="_blank" rel="noopener noreferrer"><span className='icon twitter'></span></a>
              <a href='https://linktr.ee/Y4Si' target="_blank" rel="noopener noreferrer"><span className='icon linktree'></span></a>
              <a href='https://rarible.com/vvoyage/' target="_blank" rel="noopener noreferrer"><span className='icon rarible'></span></a>
            </div>
              <div className='container'>
                <Component {...pageProps} />
              </div>
          </main>
        </CreateCollection>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};