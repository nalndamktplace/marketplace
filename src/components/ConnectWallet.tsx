import { useState } from "react";
import { Card, Modal, Spin, Typography, message } from "antd";

import { useConnect, useDisconnect } from "wagmi";
import { LoadingOutlined } from "@ant-design/icons";
import { useWeb3React } from "../hooks/useWeb3React";
// import { useGetNativeCurrencyBalance } from "../hooks/useTokenBalance";
import Metamask from "../assets/SVG/Metamask";
import WalletConnect from "../assets/SVG/WalletConnect";
import LOGO from "./../assets/logo.svg";
import CustomButton from "./Button";
const WALLET_DATA = [
  {
    id: "metaMask",
    title: "Metamask",
    icon: <Metamask />,
  },
  {
    id: "walletConnect",
    title: "Wallet Connect",
    icon: <WalletConnect />,
  },
];

const ConnectWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { isConnected } = useWeb3React();
  const { connectors, connectAsync, isLoading, pendingConnector } =
    useConnect();
  const { disconnectAsync } = useDisconnect();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getWalletUsingId = (walletId: string) => {
    const value = WALLET_DATA.find((item) => item.id === walletId);
    return value ? value : null;
  };

  // const { balance, symbol } = useGetNativeCurrencyBalance();

  return (
    <>
      {contextHolder}

      {!isConnected ? (
        <CustomButton title="Connect Wallet" onClick={showModal} />
      ) : (
        <button
          className="bg-primary hover:bg-yellow-500 transition-all px-5 py-1.5 hover:drop-shadow-md font-semibold rounded-md"
          onClick={() => {
            disconnectAsync()
              .then(() => {
                messageApi.open({
                  type: "success",
                  content: "Wallet has disconnected",
                });
              })
              .catch((error) => {
                messageApi.open({
                  type: "error",
                  content: error.message,
                });
              });
          }}
        >
          {/* <span className="text-xs font-bold md:hidden">
            {formatNumber(Number(formatUnits(balance, 18))) + " " + symbol}
          </span>
          <div className="flex-col items-end hidden ml-1 text-xs md:flex">
            <span style={{ color: colorPrimary }} className="font-semibold">
              {account?.slice(0, 8) + "..."}
            </span>
            <span className="font-bold">
              {formatNumber(Number(formatUnits(balance, 18))) + " " + symbol}
            </span>
          </div> */}
          Disconnect
        </button>
      )}

      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        zIndex={10}
      >
        <h3 className="mb-3 text-2xl font-semibold text-center text-primary">
          Nalnda Marketplace
        </h3>
        <div className="grid grid-cols-2 gap-3 my-20">
          {connectors.map(
            (connector, index) =>
              getWalletUsingId(connector?.id)?.icon && (
                <div className="transition-all hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-2 ">
                  <Card
                    style={{
                      height: "100px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    hoverable
                    key={index}
                    onClick={() =>
                      connectAsync({ connector })
                        .then(() => {
                          handleCancel();
                          messageApi.open({
                            type: "success",
                            content: "Wallet connected successfully",
                          });
                        })
                        .catch((error) => {
                          messageApi.open({
                            type: "error",
                            content: error.cause.message,
                          });
                        })
                    }
                  >
                    {connector.id === pendingConnector?.id && isLoading ? (
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center ">
                        <div className="w-[32px]">
                          {getWalletUsingId(connector?.id)?.icon}
                        </div>
                        <Typography.Text strong style={{ fontSize: "12px" }}>
                          {connector?.name}
                        </Typography.Text>
                      </div>
                    )}
                  </Card>
                </div>
              )
          )}
        </div>
        <div className="flex flex-col mt-5">
          <img src={LOGO} className="h-12" alt="Nalnda" />
          <h3 className="mb-3 text-lg font-medium text-center text-black">
            NFT e-Book Marketplace
          </h3>
        </div>
      </Modal>
    </>
  );
};

export default ConnectWallet;
