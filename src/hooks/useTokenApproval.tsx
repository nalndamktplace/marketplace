import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useTokenInfo } from "./useTokenBalance";
import { formatUnits, parseUnits } from "viem";
import { useMemo } from "react";

const MAX_ALLOWANCE = BigInt(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
);

function useTokenApproval({
  ownerAddress,
  spenderAddress,
  tokenAddress,
  isUnlimitedAllowance,
  approvalAmount = 0,
}: any) {
  const { decimals } = useTokenInfo(tokenAddress);
  const { data: allowance, refetch } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [ownerAddress, spenderAddress],
  });

  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      spenderAddress,
      isUnlimitedAllowance
        ? MAX_ALLOWANCE
        : parseUnits(String(approvalAmount), decimals as number),
    ],
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    isLoading: isWriteApprove,
  } = useContractWrite(config);

  const { isLoading } = useWaitForTransaction({
    hash: writeContractResult ? writeContractResult.hash : undefined,
    onSuccess() {
      refetch();
    },
  });

  const formatted = useMemo(() => {
    try {
      return parseFloat(formatUnits(allowance as bigint, decimals as number));
    } catch (error) {
      return 0;
    }
  }, [allowance, decimals]);

  return {
    // isTokenApproved,
    isApproving: isWriteApprove || isLoading,
    formatted,
    allowance,
    decimals,
    refetch,
    approveAsync,
    // isApproving,
    // approveAsync,
  };
}

// const useTokenApproved = ({ ownerAddress, spenderAddress, tokenAddress }) => {
//   const { data: allowance, refetch } = useContractRead({
//     address: tokenAddress,
//     abi: erc20ABI,
//     functionName: "allowance",
//     args: [ownerAddress, spenderAddress],
//   });
//   const { config } = usePrepareContractWrite({
//     address: tokenAddress,
//     abi: erc20ABI,
//     functionName: "approve",
//     args: [spenderAddress, MAX_ALLOWANCE],
//   });
//   const { data: writeContractResult, writeAsync: approveAsync } =
//     useContractWrite(config);

//   const { isLoading: isApproving } = useWaitForTransaction({
//     hash: writeContractResult ? writeContractResult.hash : undefined,
//     onSuccess(data) {
//       refetch();
//     },
//   });

//   const isTokenApproved = allowance && allowance >= MAX_ALLOWANCE;
//   return { isTokenApproved, approveAsync };
// };
export default useTokenApproval;
