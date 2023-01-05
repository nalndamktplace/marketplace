import React, { useEffect } from 'react'
import Page from '../../components/hoc/Page/Page'
import GaTracker from '../../trackers/ga-tracker'

const RefundPolicyPage = () => {

	useEffect(() => {
		GaTracker('page_view_privacy')
	}, [])

	return (
		<Page showRibbion={false}>
			<h1>Return and Refund Policy</h1>
			<p>Last updated: December 19, 2022</p>
			<p>Thank you for shopping at Nalnda.</p>
			<p>If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns.</p>
			<p>The following terms are applicable for any products that You purchased with Us.</p>

			<h1>Interpretation and Definitions</h1>
			<h2>Interpretation</h2>
			<p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

			<h2>Definitions</h2>
			<p>For the purposes of this Return and Refund Policy:</p>
			<ul>
				<li><b>Company</b> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Buttercubes Private Limited, some address.</li>
				<li><b>Goods</b> refer to the items offered for sale on the Service.</li>
				<li><b>Orders</b> mean a request by You to purchase Goods from Us.</li>
				<li><b>Service</b> refers to the Website.</li>
				<li><b>Website</b> refers to Nalnda, accessible from https://nalnda.com</li>
				<li><b>You</b> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
			</ul>

			<h1>Your Order Cancellation Rights</h1>
			<p>You are entitled to cancel Your Order within 7 days without giving any reason for doing so.</p>
			<p>The deadline for cancelling an Order is 7 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.</p>
			<p>In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform us of your decision by:</p>
			<ul>
				<li>By email: contact@nalnda.com</li>
			</ul>
			<p>We will reimburse You no later than 14 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.</p>

			<h1>Conditions for Returns</h1>
			<p>In order for the Goods to be eligible for a return, please make sure that:</p>
			<ul>
				<li>The Goods were purchased in the last 7 days</li>
				<li>The Goods are in the original packaging</li>
			</ul>
			<p>The following Goods cannot be returned:</p>
			<ul>
				<li>The supply of Goods made to Your specifications or clearly personalized.</li>
				<li>The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.</li>
				<li>The supply of Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.</li>
				<li>The supply of Goods which are, after delivery, according to their nature, inseparably mixed with other items.</li>
			</ul>


			<h2>Information we collect</h2>
			<p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
			<p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
			<p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>

			<h2>How we use your information</h2>
			<p>We use the information we collect in various ways, including to:</p>
			<ul>
			<li>Provide, operate, and maintain our website</li>
			<li>Improve, personalize, and expand our website</li>
			<li>Understand and analyze how you use our website</li>
			<li>Develop new products, services, features, and functionality</li>
			<li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
			<li>Send you emails</li>
			<li>Find and prevent fraud</li>
			</ul>
			<p>We reserve the right to refuse returns of any merchandise that does not meet the above return conditions in our sole discretion.</p>
			<p>Only regular priced Goods may be refunded. Unfortunately, Goods on sale cannot be refunded. This exclusion may not apply to You if it is not permitted by applicable law.</p>

			<h1>Returning Goods</h1>
			<p>You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods at the following address:</p>
			<p>some address</p>
			<p>We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.</p>

			<h1>Gifts</h1>
			<p>If the Goods were marked as a gift when purchased and then shipped directly to you, You'll receive a gift credit for the value of your return. Once the returned product is received, a gift certificate will be mailed to You.</p>
			<p>If the Goods weren't marked as a gift when purchased, or the gift giver had the Order shipped to themselves to give it to You later, We will send the refund to the gift giver.</p>

			<h2>Contact Us</h2>
			<p>If you have any questions about our Returns and Refunds Policy, please contact us:</p>
			<ul>
				<li>By email: contact@nalnda.com</li>
			</ul>
		</Page>
	)
}

export default RefundPolicyPage