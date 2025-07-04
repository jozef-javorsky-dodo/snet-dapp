import React, { Fragment, useEffect, useState } from "react";
import { withStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import StyledButton from "../../../../../../common/StyledButton";
import { useStyles } from "./styles";
import NextAction from "./NextAction";
import { userProfileRoutes } from "../../../../../../UserProfile";
import { channelInfo as getChannelInfo } from "../../../../../../../Redux/reducers/UserReducer";
import PaymentPopup from "./PaymentPopup";
import { orderPayloadTypes, orderTypes } from "../../../../../../../utility/constants/PaymentConstants";
import { isEmpty } from "lodash";
import PaymentInfoCard from "../../PaymentInfoCard";
import AlertBox, { alertTypes } from "../../../../../../common/AlertBox";
import { userActions } from "../../../../../../../Redux/actionCreators";
import CircularProgress from "@material-ui/core/CircularProgress";
import { initPaypalSdk } from "../../../../../../../utility/sdk";

const transactionsStatus = {
  PENDING: "PENDING",
  FAILED: "FAILED",
};
const TransactionAlert = {
  PENDING: { type: alertTypes.WARNING, message: "Transaction Confirmed. Pending token allocation" },
  FAILED: { type: alertTypes.ERROR, message: "Transaction Failed. See history for more details" },
};

const GeneralAccountWallet = ({ classes, handleContinue }) => {
  const dispatch = useDispatch();
  const { orgId } = useParams();

  const group = useSelector((state) => state.serviceDetailsReducer.details.groupInfo);
  const inProgressOrderType = useSelector((state) => state.paymentReducer.paypalInProgress.orderType);
  const walletList = useSelector((state) => state.userReducer.walletList);
  const channelInfo = getChannelInfo(walletList);
  const progressTransaction = Object.keys(orderPayloadTypes).find(
    (key) => orderPayloadTypes[key] === inProgressOrderType
  );

  const [paymentPopupVisibile, setPaymentPopupVisibile] = useState(progressTransaction);
  const [alert, setAlert] = useState({});
  const [isLoadingChannelInfo, setLoadingChannelInfo] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_SANDBOX || !channelInfo?.walletaddress || !channelInfo?.id) {
      return;
    }
    initPaypalSdk(channelInfo.walletaddress, channelInfo.id);
  }, [channelInfo]);

  useEffect(() => {
    const checkTransactionsByStatus = (transactions, status) => {
      return transactions.some((txn) => txn.status === status);
    };

    walletList.forEach((wallet) => {
      if (isEmpty(wallet.transactions)) {
        return;
      }
      const walletTransactions = wallet.transactions;

      if (checkTransactionsByStatus(walletTransactions, transactionsStatus.PENDING)) {
        setAlert(TransactionAlert.PENDING);
        return;
      } else {
        setAlert({});
      }
    });
  }, [walletList]);

  useEffect(() => {
    const getWalletInfo = async () => {
      try {
        setLoadingChannelInfo(true);
        await dispatch(userActions.fetchWallet(orgId, group.groupId));
      } catch (error) {
        console.error("error: ", error);
      } finally {
        setLoadingChannelInfo(false);
      }
    };
    getWalletInfo();
  }, [dispatch, orgId, group.groupId]);

  const setCreateWalletType = () => {
    setPaymentPopupVisibile(orderTypes.CREATE_WALLET);
  };

  const channelBalance = channelInfo ? channelInfo.currentBalance : 0;
  return (
    <Fragment>
      <div className={classes.channelBalance}>
        <PaymentInfoCard
          show={!isEmpty(channelInfo)}
          title="Channel Balance"
          value={channelBalance}
          unit={process.env.REACT_APP_TOKEN_NAME}
        />
      </div>
      <div className={classes.btnsContainer}>
        <Link to={userProfileRoutes.TRANSACTIONS} target="_blank" className={classes.routerLink}>
          <StyledButton type="transparentBlueBorder" btnText="transaction history" />
        </Link>
        {isLoadingChannelInfo ? (
          <CircularProgress size="40px" />
        ) : (
          <NextAction
            channel={channelInfo}
            setShowCreateWalletPopup={setCreateWalletType}
            setShowLinkProvider={() => setPaymentPopupVisibile(orderTypes.CREATE_CHANNEL)}
            setShowTopUpWallet={() => setPaymentPopupVisibile(orderTypes.TOPUP_WALLET)}
            handleContinue={handleContinue}
          />
        )}
        <AlertBox {...alert} />
      </div>
      <PaymentPopup
        setCreateWalletType={setCreateWalletType}
        paymentModalType={paymentPopupVisibile}
        isVisible={Boolean(paymentPopupVisibile)}
        isPaypalInProgress={Boolean(progressTransaction)}
        handleClose={() => setPaymentPopupVisibile(false)}
      />
    </Fragment>
  );
};

export default withStyles(useStyles)(GeneralAccountWallet);
