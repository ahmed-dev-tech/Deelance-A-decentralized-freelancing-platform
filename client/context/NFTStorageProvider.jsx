import React, { createContext } from "react";
import { NFTStorage } from "nft.storage";

export const NFTStorageContext = createContext();

const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;

const deployToNFTStorage = async (name, description, image) => {
  try {
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

    // call client.store, passing in the image & metadata
    const res = await nftstorage.store({
      image,
      name,
      description,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
function NFTStorageProvider({ children }) {
  const data = { deployToNFTStorage };
  return (
    <NFTStorageContext.Provider value={data}>
      {children}
    </NFTStorageContext.Provider>
  );
}

export default NFTStorageProvider;
