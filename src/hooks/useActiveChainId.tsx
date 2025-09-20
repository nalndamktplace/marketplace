import { useMemo } from "react";
import { useNetwork } from "wagmi";
import { CHAINS_INFO, DEFAULT_CHAIN_ID } from "../constant/constant";

function useActiveChainId() {
  const { chain } = useNetwork();

  return useMemo(() => {
    return {
      chainId: chain?.id ? chain?.id : DEFAULT_CHAIN_ID,
      name: chain?.name ? chain?.name : "",
      symbol:
        chain?.nativeCurrency?.symbol ??
        CHAINS_INFO[DEFAULT_CHAIN_ID]?.CURRENCY_SYMBOL,
    };
  }, [chain]);
}

export default useActiveChainId;
