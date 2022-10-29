/* eslint-disable jsx-a11y/no-distracting-elements */
import React from "react";
import { useDispatch } from "react-redux";
import { showModal, SHOW_FEEDBACK_MODAL } from "../../../store/actions/modal";
import FeedbackModal from "../../modal/Feedback/FeedbackModal";

import Footer from "../../nav/Footer/Footer";
import Header from "../../nav/Header/Header";

const Page = ({
  fluid,
  containerClass,
  noPadding,
  showRibbion,
  noFooter,
  children,
}) => {
  const dispatch = useDispatch();

  const getClasses = () => {
    let classes = ["page__wrapper"];
    if (fluid) classes.push("page__wrapper--fluid");
    if (containerClass) classes.push(containerClass);
    return classes.join(" ");
  };

  const onFeedback = () => {
    dispatch(showModal(SHOW_FEEDBACK_MODAL));
  };


  return (
    <div className="page">
      <Header showRibbion={showRibbion} noPadding={noPadding} />
      <div className={getClasses()}>{children}</div>
      <div className="page__feedback" onClick={onFeedback}>
        <div className="page__feedback__label">FEEDBACK</div>
      </div>
      <div style={{position: 'fixed', bottom: 0, left: 0, height:'4rem',  width: '100%', backgroundColor: '#fff', zIndex: 700, paddingBottom:'0.5rem'}}>
        <marquee  direction="right" height="100px">
			<div style={{display:'flex'}} >
				<p style={{padding:"8px"}}>Titles Listed: 35 </p>
				<p style={{padding:"8px"}}>Copies Sold: 997 </p>
				<p style={{padding:"8px"}}>Hours Read Time: 480 </p>
				<p style={{padding:"8px"}}>Active Users: 3,262 </p>
        
		 </div>
        </marquee>
      </div>
      {noFooter ? null : <Footer />}
      <FeedbackModal />
    </div>
  );
};

export default Page;
