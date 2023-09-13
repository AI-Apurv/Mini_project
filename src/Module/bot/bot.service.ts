import { Injectable } from '@nestjs/common';
import { NlpManager,NerManager , NlpUtil } from 'node-nlp';
@Injectable()
export class NlpService {
  private manager = new NlpManager({ languages: ['en'] });
  constructor() {
    
    this.manager.addDocument('en', 'I want to change the address for delivery of my order.', 'faq.change-address');
    this.manager.addDocument('en', 'How can I modify or add an alternate number for the order delivery?', 'faq.modify-number');
    this.manager.addDocument('en', 'Can I get my orders delivered at a specific time?', 'faq.specific-time');
    this.manager.addDocument('en', 'Where can I get the delivery executive\'s contact details?', 'faq.delivery-contact');
    this.manager.addDocument('en', 'Can I get my order delivered faster?', 'faq.faster-delivery');
    this.manager.addDocument('en', 'How do I return my order on Flipkart?', 'faq.return-order');
    this.manager.addDocument('en', 'How do I place a request for order replacement?', 'faq.place-replacement-request');
    this.manager.addDocument('en', 'What is the Flipkart return policy for cash on delivery?', 'faq.cod-return-policy');
    this.manager.addDocument('en', 'Can I ask the delivery agent to reschedule the pickup date?', 'faq.reschedule-pickup');
    this.manager.addDocument('en', 'What if I miss my Flipkart order pickup?', 'faq.missed-pickup');
    this.manager.addDocument('en', 'How do I contact the seller?', 'faq.contact-seller');
    this.manager.addDocument('en', 'How do I know my order has been confirmed?', 'faq.order-confirmation');
    this.manager.addDocument('en', 'Hello', 'greet.hello');
    this.manager.addDocument('en', 'Hi', 'greet.hi');
    this.manager.addDocument('en', 'Hey', 'greet.hey');
    this.manager.addDocument('en', 'Good morning', 'greet.good-morning');
    this.manager.addDocument('en', 'Good afternoon', 'greet.good-afternoon');
    this.manager.addDocument('en', 'Good evening', 'greet.good-evening');
    this.manager.addDocument('en', 'How are you?', 'greet.how-are-you');
    this.manager.addDocument('en', 'What are the modes of refund available after cancellation?', 'faq.refund-modes');
    this.manager.addDocument('en', 'I have still not received the refund in my bank account.', 'faq.not-received-refund');
    this.manager.addDocument('en', 'Why does it take time for the refund amount to be credited when it was already processed by Flipkart?', 'faq.refund-processing-time');
    this.manager.addDocument('en', 'When are refunds given?', 'faq.when-refunds-given');
    this.manager.addDocument('en', 'How will I get my refund for returning an item I paid for with Cash on Delivery?', 'faq.cod-refund');
    this.manager.addDocument('en', 'Will I get a complete refund if the item is cancelled or returned if I have paid for the order using the \'Credit Card No Cost EMI\' payment option?', 'faq.emi-refund');
    this.manager.addDocument('en', "I see the 'Cancel' button but I can't click on it. Why?", 'faq.cannot-click-cancel-button');
    this.manager.addDocument('en', 'Can I modify/change the specification for the ordered product without cancelling it?', 'faq.modify-product-spec');
   
   
    this.manager.addAnswer('en', 'faq.cannot-click-cancel-button', 'A greyed-out and disabled \'Cancel\' button can mean any one of the following:\n\n1. The item has been delivered already OR\n2. The item is non-refundable (e.g., Gift Card)');
    this.manager.addAnswer('en', 'faq.modify-product-spec', 'No, once an order is placed, the specification of the product cannot be modified.');
    this.manager.addAnswer('en', 'faq.refund-modes', 'The different modes of refund available are:\n\nPayment mode: Cash on Delivery\n\n1. UPI (Amount less than Rs 1000) - Refund will be processed to the UPI account for which UPI ID has to be shared\n2. Gift Card (Amount less than Rs 10000) - Refund will be processed to Gift Card account\n3. Bank account (IMPS/NEFT) - Refund will be processed to the bank account for which bank details have to be shared\n\nPayment mode: Prepaid\n\n1. Back to source - Refund will be processed to the payment mode (Debit/Credit card, NEFT, UPI) used to pay for the order\n2. Gift Card (Amount less than Rs 10000) - Refund will be processed to the Gift Card account.');
    this.manager.addAnswer('en', 'faq.not-received-refund', 'If you have received a mail from us confirming your refund request, it means that the refund has been initiated. You can also contact your bank with the refund reference (ARN)/UTR number you would have received for an update on the status of your refund.');
    this.manager.addAnswer('en', 'faq.refund-processing-time', 'Once the refund has been processed, the bank takes some time to reverse your initial transaction and complete the refund. However, the refund amount can be seen in your account within the time frame provided to you. Please contact your bank with the refund reference/UTR number in case you don\'t see the refund amount in your account after the specified timeframe.');
    this.manager.addAnswer('en', 'faq.when-refunds-given', 'Refunds are given when:\n\n- Any prepaid order is cancelled and the amount paid is refunded automatically to the original source of payment\n- Products from select categories are returned under certain conditions. Check the seller\'s Returns Policy on the product page for more details');
    this.manager.addAnswer('en', 'faq.cod-refund', 'For your Cash on Delivery order, you will receive the refund in the form of NEFT. Please update your bank account details after you choose this option.');
    this.manager.addAnswer('en', 'faq.emi-refund', 'Yes, you will get a complete refund to the extent of the EMIs paid (if any) in case the order is cancelled or returned.\n\nHowever, banks may charge some cancellation/refund or pre-closure charges. Please check with your respective bank for their policy for cancellations, refunds, and pre-closures.\n\n*Orders for certain items cannot be cancelled after 24 hours of order placement or returned once delivered. Please check the seller\'s cancellations & returns policy on the product page for details.');
    this.manager.addAnswer('en', 'faq.change-address', 'The delivery address for your order can be changed depending on its status. Please check Orders > Order Details for the below:\n\nApproved/Processing: If this is your order status, then you can change the address through your Flipkart app.\nShipped: Only text change in your address will be possible. Pincode cannot be changed at this stage.\nDelivered: As the item would have already been delivered, the address change will not be possible.');
    this.manager.addAnswer('en', 'faq.modify-number', 'You can modify the existing delivery contact number or add an alternate one with these simple steps:\n\n- Go to Orders\n- Select the desired \'Order\'\n- Scroll down and go to shipping details tab and tap \'Edit\' (Pen) option next to the phone number');
    this.manager.addAnswer('en', 'faq.specific-time', 'Orders for a few items from certain categories like large appliances, furniture, and exercise & fitness categories can be delivered at specific time slots by the sellers\' partnered courier service providers: You can choose your preferred time slot from the list of available ones while placing your order. For other items, the seller\'s partnered courier service providers currently do not support delivery at a specific time due to their varying delivery schedules.');
    this.manager.addAnswer('en', 'greet.hello', 'Hello! How can I assist you today?');
    this.manager.addAnswer('en', 'greet.hi', 'Hi there! How can I help you?');
    this.manager.addAnswer('en', 'greet.hey', 'Hey! How can I assist you today?');
    this.manager.addAnswer('en', 'greet.good-morning', 'Good morning! How can I help you today?');
    this.manager.addAnswer('en', 'greet.good-afternoon', 'Good afternoon! How can I assist you today?');
    this.manager.addAnswer('en', 'greet.good-evening', 'Good evening! How can I help you today?');
    this.manager.addAnswer('en', 'greet.how-are-you', 'I am just a chatbot, but thanks for asking! How can I assist you today?') 
    this.manager.addAnswer('en', 'faq.delivery-contact', 'Once your order is ‘Out for delivery,’ you will get the delivery executive details by visiting the Orders section of your Flipkart account.')
    this.manager.addAnswer('en', 'faq.faster-delivery', 'No, the delivery date you see after the order confirmation is provided is based on factors like your address, the seller\'s address, and the time needed by couriers to process and ship your order. Due to these factors, they do not have the option to change the delivery date and have it reach you earlier. However, you can track your order and its movement easily from our app or website.');
    this.manager.addAnswer('en', 'faq.return-order', 'To return your order on Flipkart, place a return request in the Orders page. You will get an option to choose refund/replace/exchange as per our return policy.');
    this.manager.addAnswer('en', 'faq.place-replacement-request', 'To place a request for order replacement, place a return request in the Orders page. You will get an option to choose refund/replace/exchange as per our return policy.');
    this.manager.addAnswer('en', 'faq.cod-return-policy', 'In case of cash on delivery, you will have to provide a bank account number for the refund. For replacement/exchange, you will be given an alternate product for the returned product.');
    this.manager.addAnswer('en', 'faq.reschedule-pickup', 'Yes, you can schedule the pickup date based on your convenience.');
    this.manager.addAnswer('en', 'faq.missed-pickup', 'Do not worry, the delivery agent will try to pick up again on the next working day.');
    this.manager.addAnswer('en', 'faq.contact-seller', 'To contact a seller, please send a letter with the below address on the envelope and include the product page URL so it can be forwarded to the seller:\n\nTo,\n“Include Seller\'s name”\nSeller Mailbox: Contact Seller\nc/o Flipkart Internet Private Limited,\nBuildings Alyssa, Begonia & Clove,\nEmbassy Tech Village, Bengaluru 560103\nContact: 044-66904690');
    this.manager.addAnswer('en', 'faq.order-confirmation', 'Once your order has been logged and payment authorization has been received, the seller confirms receipt of the order and begins processing it.\nYou will receive an email containing the details of your order when the seller receives it and confirms the same. In this mail you will be provided with a unique Order ID (eg. OD01202130213), a listing of the item(s) you have ordered and the expected delivery time.\nYou will also be notified when the seller ships the item(s) to you. Shipping details will be provided with the respective tracking number(s).');

    this.manager.train();
  }

    async process(message: string) {
    const response = await this.manager.process('en', message);
    return response;
  }
}
