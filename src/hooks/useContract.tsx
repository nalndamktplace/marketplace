import { useEffect, useMemo, useState } from "react";
import {
  UseContractWriteConfig,
  erc20ABI,
  erc721ABI,
  useAccount,
  useContractWrite,
  usePublicClient,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import {
  Abi,
  Address,
  DeployContractParameters,
  Hash,
  TransactionReceipt,
  getContract,
} from "viem";
import useProviderOrSigner from "./useProviderOrSigner";
import { useNotification } from "../context/NotificationContext";
import { USDC_ADDRESS } from "../constant/constant";

function useContract(address: Address, abi?: Abi) {
  const { signer, provider }: any = useProviderOrSigner();

  return useMemo(() => {
    if (!address || !abi) return null;
    try {
      return getContract({
        address,
        abi,
        publicClient: provider,
        walletClient: signer,
      });
    } catch (err) {
      console.error("Failed to get contract", err);
      return null;
    }
  }, [address, abi, provider, signer]);
}

const useUSDCContractRead = () => {
  const { provider } = useProviderOrSigner();
  const [data, setData] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await provider.readContract({
          address: USDC_ADDRESS,
          abi: erc20ABI,
          functionName: "decimals",
        });

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Error reading contract:", error);
      }
    };

    if (provider) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [provider]);

  return data;
};

const useUSDCContractAllowanceRead = (walletAddress: any, address: any) => {
  const { provider } = useProviderOrSigner();
  const [refetch, setRefetch] = useState(true);
  const [data, setData] = useState<any>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await provider.readContract({
          address: USDC_ADDRESS,
          abi: erc20ABI,
          functionName: "allowance",
          args: [walletAddress, address],
        });

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Error reading contract:", error);
      }
    };

    if (provider) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [provider, refetch]);

  const refetchUsdcAllowance = () => {
    setRefetch((e) => !e);
  };
  return { data, refetchUsdcAllowance };
};

//For Token
const useERC20 = (address: Address) => {
  return useContract(address, erc20ABI);
};

//For NFT
const useERC721 = (address: Address) => {
  return useContract(address, erc721ABI);
};

const useContractWriteWithWaitForTransaction = ({
  address,
  abi,
  functionName,
  args,
  value,
}: UseContractWriteConfig<any>) => {
  const publicClient = usePublicClient();
  const [isReceiptLoading, setReceiptLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<TransactionReceipt>();
  const { showNotification } = useNotification();
  const [isError, setIsError] = useState(false);
  const {
    data: writeData,
    isLoading: writeIsLoading,
    error: writeIsError,
    isSuccess: writeIsSuccess,
    write,
    writeAsync,
  }: any = useContractWrite({
    address,
    abi,
    functionName,
    args,
    value,
  });

  const {
    isLoading: waitForTransactionIsLoading,
    error: waitForTransactionIsError,
    isSuccess: isSuccessTransaction,
  }: any = useWaitForTransaction({
    hash: writeData?.hash,
  });

  const fetchReceipt = async () => {
    try {
      setReceiptLoading(true);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: writeData?.hash as `0x${string}`,
      });
      setReceiptData(receipt);
    } catch (error) {
      console.error("Error fetching receipt:", error);
    } finally {
      setReceiptLoading(false);
    }
  };

  useEffect(() => {
    if (writeIsSuccess && !waitForTransactionIsLoading) {
      // Contract write succeeded, and transaction is mined
      setIsError(false);
      fetchReceipt();
      showNotification(
        "success",
        "Transaction",
        "Transaction successfully executed."
      );
    } else if (writeIsError || waitForTransactionIsError) {
      // Error occurred during contract write or waiting for transaction
      setIsError(true);
      showNotification(
        "error",
        "Transaction failed",

        `${
          writeIsError
            ? (writeIsError?.shortMessage as any)
            : (waitForTransactionIsError?.shortMessage as any)
        }`
        // `${
        //   writeIsError
        //     ? (writeIsError?.message as any)?.shortMessage
        //     : (waitForTransactionIsError?.message as any)?.shortMessage
        // }`
      );
    }
  }, [
    writeIsSuccess,
    writeIsError,
    waitForTransactionIsLoading,
    waitForTransactionIsError,
    showNotification,
  ]);

  return {
    data: { ...writeData, receipt: receiptData },
    isLoading:
      writeIsLoading || waitForTransactionIsLoading || isReceiptLoading,
    isSuccess: writeIsSuccess && !isError,
    isSuccessTransaction: isSuccessTransaction,
    isError,
    write,
    writeAsync,
  };
};

const useContractDeployWithWaitForTransaction = () => {
  const { address: account } = useAccount();
  const [hash, setHash] = useState<Hash>();
  const publicClient = usePublicClient();
  const [hashLoading, setHashLoading] = useState<boolean>(false);
  const {
    data: walletClient,
    isLoading: deployIsLoading,
    error: deployIsError,
  }: any = useWalletClient();

  const deployContractAsync = async ({
    abi,
    args,
    bytecode,
  }: DeployContractParameters) => {
    try {
      setHashLoading(true);
      const hash = await walletClient?.deployContract({
        abi: abi,
        args: args,
        account: account,
        bytecode: bytecode,
      });

      setHash(hash);
      if (hash) {
        // Transaction hash is available, try to get the receipt
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });

        return {
          hash,
          receipt,
        };
      }
    } finally {
      setHashLoading(false);
    }
  };

  const {
    isLoading: waitForTransactionIsLoading,
    error: waitForTransactionIsError,
  }: any = useWaitForTransaction({
    hash: hash,
  });
  const { showNotification } = useNotification();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (hash && !waitForTransactionIsLoading && !deployIsLoading) {
      // Contract write succeeded, and transaction is mined
      // alert("sndjnfj");
      setIsError(false);
      showNotification(
        "success",
        "Transaction",
        "Transaction successfully executed."
      );
    } else if (deployIsError || waitForTransactionIsError) {
      // Error occurred during contract write or waiting for transaction
      setIsError(true);
      showNotification(
        "error",
        "Transaction failed",
        `${
          deployIsError
            ? (deployIsError?.cause as any)?.shortMessage
            : (waitForTransactionIsError?.message as any)?.shortMessage
        }`
      );
    }
  }, [
    deployIsError,
    waitForTransactionIsLoading,
    waitForTransactionIsError,
    showNotification,
  ]);

  return {
    data: hash,
    isLoading: deployIsLoading || waitForTransactionIsLoading || hashLoading,
    isSuccess: !isError,
    isError,
    deployContractAsync,
  };
};

export {
  useContract,
  useERC20,
  useUSDCContractRead,
  useERC721,
  useUSDCContractAllowanceRead,
  useContractWriteWithWaitForTransaction,
  useContractDeployWithWaitForTransaction,
};
