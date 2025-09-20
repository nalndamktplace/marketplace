import { useMemo } from "react";
import useActiveChainId from "./useActiveChainId";
import { usePublicClient, useWalletClient } from "wagmi";
import { DEFAULT_CHAIN_ID } from "../constant/constant";

function useProviderOrSigner() {
  const { chainId } = useActiveChainId();
  const { data: signer } = useWalletClient();
  const provider = usePublicClient({
    chainId: chainId ? chainId : DEFAULT_CHAIN_ID,
  });

  return useMemo(() => {
    return {
      provider,
      signer,
    };
  }, [provider, signer]);
}

export default useProviderOrSigner;
