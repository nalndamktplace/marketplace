import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Contracts from "../../../connections/contracts";
import { isUsable } from "../../../helpers/functions";
import { hideSpinner, showSpinner } from "../../../store/actions/spinner";

const ProtectedRoute = ({element}) => {
    const [account, setAccount] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAccount = async () => {
            dispatch(showSpinner());
            console.log("here");
            let address = await Contracts.Wallet.getWalletAddress() ;
            setAccount(address)
            dispatch(hideSpinner());
        };
        checkAccount();
    }, []);

    return <>{isUsable(account) && element }</>;
};

export default ProtectedRoute;
