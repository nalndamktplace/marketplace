import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";
import Ribbon from "../components/Ribbon";
import { DEFAULT_CHAIN_ID } from "../constant/constant";
import { useSwitchNetwork } from "wagmi";
import useActiveChainId from "../hooks/useActiveChainId";

function MainLayout() {
  const { pathname } = useLocation();
  const { chainId } = useActiveChainId();
  const {  switchNetwork } =
    useSwitchNetwork();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    if (switchNetwork && DEFAULT_CHAIN_ID != chainId) {
      switchNetwork(DEFAULT_CHAIN_ID);
    }
  }, [chainId, switchNetwork]);
  return (
    <div>
      <Header />
      <Ribbon />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;
