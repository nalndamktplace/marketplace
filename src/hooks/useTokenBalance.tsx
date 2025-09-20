import { useMemo } from "react";
import { Address, useAccount, useBalance, useToken } from "wagmi";
import useActiveChainId from "./useActiveChainId";

function useTokenBalance() {
  return <div>useTokenBalance</div>;
}

function useGetNativeCurrencyBalance() {
  const { address: account } = useAccount();
  const { chainId } = useActiveChainId();
  const { status, refetch, data } = useBalance({
    chainId,
    address: account,
    watch: true,
    enabled: !!account,
  });

  return useMemo(() => {
    return {
      balance: data?.value ? BigInt(data.value) : BigInt(0),
      fetchStatus: status,
      refresh: refetch,
      symbol: data?.symbol ?? "",
    };
  }, [data, refetch, status]);
}

function useTokenInfo(address: Address) {
  const { chainId } = useActiveChainId();
  const { data, isError, isLoading, status, refetch, isSuccess } = useToken({
    address: address,
    chainId: chainId,
  });

  return useMemo(() => {
    return {
      name: data?.name,
      decimals: data?.decimals,
      symbol: data?.symbol,
      refetch,
      isError,
      isLoading,
      status,
      isSuccess,
    };
  }, [data, refetch, isError, isLoading, status, isSuccess]);
}

function useTokenBalanceInfo(tokenAddress: Address) {
  const { address: walletAddress } = useAccount();
  const { chainId } = useActiveChainId();

  const { data, isSuccess, status } = useBalance({
    address: walletAddress,
    chainId,
    token: tokenAddress,
    watch: true,
  });

  return useMemo(() => {
    return {
      formatted: data?.formatted ?? 0,
      decimals: data?.decimals ?? 18,
      symbol: data?.symbol ?? "",
      value: data?.value ?? 0,
      status,
      isSuccess,
    };
  }, [data, isSuccess, status]);
}

export default useTokenBalance;
export { useGetNativeCurrencyBalance, useTokenInfo, useTokenBalanceInfo };
