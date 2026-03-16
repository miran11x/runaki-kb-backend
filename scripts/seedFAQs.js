const pool = require('../db');
const bcrypt = require('bcryptjs');

const faqs = [
  {
    category: `Billing Complaints`,
    subcategory: `Zero bill`,
    question_en: `Why is the bill that I have received zero?`,
    answer_en: `This means that you do not  have available readings in this period, you will receive a bill once this is resolved. No action is needed, please be patient.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Bill not received`,
    question_en: `I have not received a physical bill, what should I do?`,
    answer_en: `"Agent asks how long has it been since the customer has not received a physical bill?
<3 months: Please be patient, a collector will visit you
>3 months: Agent notes down customer details and marks ticket as pending, assigns to 'Collector team' on Freshdesk; ticket is pending; tell the customer to be patient and that we will investigate. 'Collector team' investigates and adds investigation result comments on the ticket, agent calls back customer and marks ticket as resolved.

In Both cases: for Erbil, Duhok, Suli, Zakho, Raparin, Halabja, Zakho batifia.
Agent shoul advice the cutomers to use E-psule to know how much they need to pay, also for payment Cusotmers in those locations can pay via E-psule as an easy and secure platform.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Wrong tariff applied`,
    question_en: `Complaint about receiving Runaki tariffs while living in non-Runaki area`,
    answer_en: `Agent checks the customer area on CRM
- Customer in 24/7 area?
1) YES - agent clarifies with customer that he is in a Runaki '24/7' area

2) NO - agent opens ticket and assigns to CRM & KYC team with notes; ticket is pending; tell the customer to be patient and that we will investigate. Once CRM & KYC teams investigate and add notes to the ticket, agent calls back customer and markes ticket as resolved`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Wrong tariff applied`,
    question_en: `Complaint about being billed on wrong segment`,
    answer_en: `"Agents review customer segment on CRM and explains the tariffs per segment as follows:
'If residential:
•      0 KWH - 400 KWH: 72 IQD/KWH
•      401 KWH - 800 KWH: 108 IQD/KWH
•      801 KWH - 1200 KWH: 175 IQD/KWH
•      1201 KWH - 1600 KWH: 265 IQD/KWH
•      1601 KWH + : 350 IQD/KWH
If commercial: the tariff is set at 185 IQD/KWH
If industrial or state: the tariff is set at 160 IQD/KWH
If agriculture: the tariff is set at 60 IQD/KWH'

In case the customer argues that the segment is incorrect, agent tells the customer to please visit the Commercial Office and bring with him a proof of his segment (old bill for example)`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `High bill/ High debt`,
    question_en: `Why is my electricity consumption so high? I haven't used that much electricity.`,
    answer_en: `Customer complaints about high bill amount; agent checks on CRM and clarifies the consumption and/or the billing cycle.
Agent uses billing calculator tool to check if a ticket needs to be raised.

STEPS
1) Fill-in information: Agent inserts following information in the billing calculator extracted from CRM (input in yellow highlighted cells in Billing Calculator)
  (i) Account Number,   (ii) Cycle ID,   (iii) Segment,   (iv) Switch Date,   (v) True Reading Date,   (vi) Reading Date,  (vii) Consumption,  (viii) Additional discount (if applicable)

2) Check the ""FINAL RESOLUTION"" table 
- If billing calculator marks ""YES, the ticket should be raised"" -  Agent opens a ticket and assigns to  Billing Team, copying the ""Ticket Description"" generated in the Billing Calculator on FreshDesk ticket; agent tells the customer that we will investigate with the billing department and they will call him back. Once billing team adds comments on the investigation,  agent calls back  the customer and marks ticket as resolved.

- If billing calculator marks ""NO, ticket should not be raised"" - inform  customer that the bill is correct and that the smart meter is accurately measuring the household electricity consumption. Please be mindful of high-usage appliances like ACs, water pumps, water heaters, washing machines, and dryers, and try using them only when needed. This could help reduce your overall consumption

For more details, Agents can consult Details (1), Details (2) and Details (3) in the billing calculator
- Details (1): Highlights if the customer is already flagged for re-billing
-->If  the customer consumption has been marked as anomlaous for the cycles outlined in the billing calculator. These bills are already flagged ro be rebilled as ""0 consumption"". No ticket to be raised as this is being already addressed by the Billing Team

- Details (2): Highlights if the consumption is suspicously high
--> If the output of the calculator is ""OK"", it means that the customer's 30-days consumption is in line with historical patterns. No ticket to be raised
--> if the output of the calculator is ""High Consumption"", it means that the customer 30-days consumption is higher than historical patterns. Ticket to be raised (will be already flagged in the FINAL RESOLUTION table)

- Details (3): Highlights ig the bill calculation is correct
--> If the output of the calculator is ""OK"" or ""Small Difference"" or ""Bill  lower than estimation"", it means that the bill calculation is correct. No ticket to be raised
--> if the output of the calculator is ""Discount Missing""  or ""Wrong Calculation"". Ticket to be raised (will be already flagged in the FINAL RESOLUTION table)`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `High bill/ High debt`,
    question_en: `Why is the debt on the bill so high?`,
    answer_en: `Agnet checks on CRM if customer has an installment plan.
1) YES  customer has installment plan - agent explains that instalment plan amount is added to debt. If customer is not satisfied, the agent opens a ticket and assigns to Billing Team with notes. Once billing team adds comments on the investigation,  agent calls back  the customer and marks ticket as resolved.

2) NO customer does not have installment plan - agent checks if the customer has received their monthly bill:

- If customer has received monthly bills - agent explains that previous bill amount is added to the debt. If customer is not satisfied, the agent opens a ticket and assigns to Billing Team with notes.  Once billing team adds comments on the investigation,  agent calls back  the customer and marks ticket as resolved.

- If cusotmer has not received monthly bills - agent opens a ticket and assigns to Billing Team with notes.  Once billing team adds comments on the investigation,  agent calls back  the customer and marks ticket as resolved.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Other billing complaints`,
    question_en: `Customer complains about any other billing related topic (cannot be categorized)`,
    answer_en: `Agent notes down the relevant information, marks ticket as pending--> Coordinators should assign ticket to either Billing Team or collector team depending on the issue type`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `What is a "Maqtu3" charge?`,
    answer_en: `A Maqtu3 is an adjustment charge applied to customers to recover electricity that was used but not previously billed correctly.

There are two types:

• Gap Maqtu3 (Gap Forecasting Maqtu3):
- Applied when there was a billing gap (no bills issued for a period)
- Consumption for the gap is forecasted using smart meter data or historical consumption

• Underreporting Maqtu3:
- Applied when past consumption was underreported, usually due to mechanical meter tampering or malfunction
- Identified by comparing new smart meter consumption to historical mechanical meter billed consumption

A customer may receive one or both types.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `Why are these charges being applied now?`,
    answer_en: `Because the customer's mechanical meter has been replaced with a smart meter, allowing accurate measurement of real consumption.

Smart meters make it possible to:
• Estimate unbilled periods (gap forecasting)
• Detect historical underreporting
• Apply conservative and fair adjustments`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `How is the Maqtu3 calculated (high level)?`,
    answer_en: `Agents should explain the logic, not the formulas:

• Smart meter consumption (for at least 30 days) is used as a proxy
• The smart meter consumption is adjusted for:
- Seasonality
- 24/7 electricity switch date
• The adjusted consumption is used to fill a gap in billing history (last billing date to the date of meter replacement)
• For underreporting: the adjusted smart meter consumption is compared to the historical mechanical meter consumption billed across the full period where the meter underreported
• Underreporting is only applied to CT customers who clearly underreported
• Maqtu3 never covers a period earlier than January 2023
• Consumption before the customer's 24/7 switch date is billed on legacy tariffs and any applicable discount is applied
• This approach is intentionally conservative.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `Why can the Maqtu3 amount be very large?`,
    answer_en: `Because it may include:
• Long billing gaps (months or years)
• Underreported consumption
• Or both combined

This is recovery of past usage — not a penalty.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `Is this a fine or punishment?`,
    answer_en: `No.

This is billing for electricity that was already consumed but not paid for due to:
• Missing readings
• Meter issues
• Underreporting
• Meter tampering

It is not a penalty — it is a recovery of actual past consumption.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `How do agents use the customer list?`,
    answer_en: `Each agent has a file showing:
• Customer details
• Phase (CT or non-CT)
• Smart meter ID
• Gap Maqtu3 details (period, consumption, amount)
• Underreporting Maqtu3 details (period, consumption, amount)
• Total Maqtu3 amount
• A sample SMS that will be sent to KYC-ed customers

⚠️ Agents must always check the phase (CT / non-CT) before explaining appeal rights.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `What if the customer did not receive an SMS or letter?`,
    answer_en: `Possible reasons:
• Customer is not KYC-ed and cannot receive an SMS
• SMS delivery failure
• Printed letter was not distributed by the collector
• In these cases the customer will only see a charge added to their legacy debt

Correct agent response:
"We do our best to communicate proactively to customers, via SMS or letters, but when a customer is not KYC-ed communication is not always possible. The official notification is the amount shown on your bill. I can explain the details now."`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `What are the appeal rules? (VERY IMPORTANT)`,
    answer_en: `GENERAL RULE (all customers):
• Gap Maqtu3 (gap forecasting) is NOT appealable
• Customers must pay the Gap Maqtu3

NON-CT CUSTOMERS (Domestic, Commercial, etc.):
• ❌ No appeals allowed for Gap Maqtu3
• ✅ All Maqtu3 amounts are:
- Added to legacy debt
- No disconnection will occur because of Maqtu3
- To be paid through future instalments
• Agent script: "This amount will be added to your legacy debt and will not cause disconnection. It will be settled through instalments."

CT CUSTOMERS (Phase = CT):
• ❌ Gap Maqtu3 cannot be contested
• ✅ Only Underreporting Maqtu3 is appealable (only if Underreporting Maqtu3 > 0)
• ⚠️ If the full amount is not paid, the customer risks disconnection`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `How does the appeal process work? (CT customers only)`,
    answer_en: `Step 1: Customer visits a commercial office
Step 2: Customer submits:
• ID
• Company registration
• Tax filings
Step 3: Customer pays a 1,000,000 IQD investigation deposit
Step 4: Case is reviewed

Outcome:
• If the estimation is wrong → deposit is refunded
• If the estimation is confirmed → deposit is kept and added to the balance`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `Why is there a 1,000,000 IQD deposit for appeals?`,
    answer_en: `The deposit serves two purposes:
• To cover investigation costs
• To prevent non-serious or frivolous appeals

It is fully refundable if the customer's appeal is found to be correct.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `Can Call Center agents open appeals?`,
    answer_en: `No.

Call Center agents are responsible for:
• Explaining the charge
• Explaining eligibility for appeals
• Directing CT customers to the commercial office

Agents cannot open or process appeals themselves.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `What is the special case for contesting the entire Maqtu3? (ALL segments)`,
    answer_en: `For all customers (CT and non-CT):

The ONLY case where the full Maqtu3 (gap + underreporting) can be contested is if:
• The customer provides strong proof that the new smart meter does not belong to them, OR
• The meter is not physically connected to their premises

⚠️ This must be handled in a commercial office — not over the phone.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `What if the customer says: "This is unfair / too high / impossible"?`,
    answer_en: `Agent response:
"I understand this is a large amount. This covers past electricity usage that was not billed correctly. Gap Maqtu3 is not appealable, but if you are a CT customer and believe the underreporting amount is incorrect, you may submit an appeal."`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `What must agents NEVER say?`,
    answer_en: `Agents must NEVER say:
❌ "This is a penalty"
❌ "Everyone can appeal"
❌ "You will be disconnected"
❌ "We guessed your consumption"
❌ "Pay first, then complain"`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Billing Complaints`,
    subcategory: `Maqtu3`,
    question_en: `When should agents escalate a case?`,
    answer_en: `Escalate the case if:
• Meter ownership is disputed
• CRM data mismatch
• Customer claims the meter is not connected to their premises
• Legal threats are made

FINAL REMINDERS:
• Gap Maqtu3 = no appeal
• Underreporting Maqtu3 = appeal only for CT customers
• Non-CT customers are protected from disconnection
• Everything must align with the customer file`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `General Complaints`,
    subcategory: `Outage (cutoff)`,
    question_en: `I don’t have electricity (Runaki customer), what should I do?`,
    answer_en: `Agent first asks about the duration of the cutoff
<1h: please be patient, potentially its just a meter trip; reduce your consumption and wait for the meter to re-connect 
>1h: Agent proceeds with the following questions
Agent asks is the cutoff affecting the full neighbourhood or only the customer?
1) Full Neighbourhood 
-Agent should ask about the area and check from the list provided if this is a planned cutoff
1.a) Planned cutoff (affecting full neighbourhood)
Agent informs the customer that this is a planned cutoff and asks them to be patient, electricity will be restored shortly
Agent marks ticket as General Complaint--> Outage (cutoff)--> Planned Outage and resolves ticket
1.b) Unplanned cutoff (affecting full neighbourhood)
Agent provides the customer with the maintenance unit number of that area
Agent marks ticket as General Complaint-->Outage (cutoff)--> Unplanned Outage and assigns ticket to maintenance team 
2) Cutomer-spectific issue (affecting only the customer)
Agent should firsy check from dunning list (later this will be CRM) if customer is dunned:
YES) Please proceed with paying your outstanding debt at the nearest CO, your electricity will be re-connected in max 24h
Agent marks ticket as General Complaint-->Outage (cutoff)--> Non-payment
In case customer claims that they have paid more than 24h hours ago, agent marks ticket as pending and should be assigned to collectors team (dunning)
NO) Agent should ask customer if they have smart meter
-Customer has SM: Agent provides customer with maintenance unit number of the area 
Agent marks ticket as General Complaint-->Outage (cutoff)--> SM issue and resolves ticket
-Customer has mechanical meter (or is unsure): Agent provides customer with maintenance unit number of the area 
Agent marks ticket as General Complaint-->Outage (cutoff)--> Other and resolves ticket

In case the customer claims that they have called the maintenance number multiple times and there is no support; Agent should open ticket and mark it as Maintenance--> Cutoff--> SM issue or Other and mark it as pending--> to be assigned to maintnance team (for them to escalate)

If customer claims that the maintenance unit visited them but could not resolve the issue: agent opens new ticket Maintenance--> Cutoff--> SM issue or Other and adds relevant information (Meter ID) or any other information (e.g., block ID, account number) for ticket to be assigned to 'investigations taskforce'               (New process for kani & nawroz) 15th march`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `General Complaints`,
    subcategory: `Outage (cutoff)`,
    question_en: `I have an issue with the smart meter?`,
    answer_en: `Agent asks why do they think its an issue with the meter?
A) Because I don’t have electricity --> Follow the process for cutoff
B) Because I have a high bill/high consumption --> Follow process for billing complaint`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `General Complaints`,
    subcategory: `SMS not received`,
    question_en: `Why didn’t I receive the message`,
    answer_en: `"Agent first asks if the customer completed the KYC process:

No → Agent informs the customer to complete the KYC process
(MESSAGE NOT RECEIVED – NOT KYCed)
➝ Resolve the ticket

Yes → Agent asks when the customer completed the KYC process:

< 1 month → Agent informs the customer to be patient, as the KYC is still under validation
(MESSAGE NOT RECEIVED – NOT KYCed)
➝ Resolve the ticket

> 1 month → Agent checks the customer phone number on the new KYC platform


KYC Validated:
No issue from the KYC team. The customer should be advised to be patient and wait.
➝ Resolve the ticket
(MESSAGE NOT RECEIVED- NO READINGS) 

KYC Flagged:
KYC is still under process. The customer should be advised to be patient and wait.
➝ Resolve the ticket
(MESSAGE NOT RECEIVED – NOT KYCed)

KYC Not Started:
KYC is still under process. The customer should be advised to be patient and wait.
➝ Resolve the ticket
(MESSAGE NOT RECEIVED – NOT KYCed)

KYC Not Submitted:
KYC is under validation process. The customer should be advised to be patient and wait.
➝ Resolve the ticket
(MESSAGE NOT RECEIVED – NOT KYCed)

KYC Rejected:
The customer needs to re-submit the KYC.
(MESSAGE NOT RECEIVED – NOT KYCed)
➝ Resolve the ticket

Pending Mechanical Meter Update:
The customer submitted mechanical meter details instead of the bill.
The customer needs to re-submit the KYC.
(MESSAGE NOT RECEIVED – NOT KYCed)
➝ Resolve the ticket

Phone number not found on the platform:
It appears the customer has not completed KYC using this phone number.
The customer needs to re-submit the KYC.
(MESSAGE NOT RECEIVED – NOT KYCed)
➝ Resolve the ticket"`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `General Complaints`,
    subcategory: `Block Comms`,
    question_en: `I don’t want to receive any messages`,
    answer_en: `Why do you not want to receive messages?
-Agent writes down the information (phone number, name etc) and marks as 'block comms'`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `General Complaints`,
    subcategory: `Fraud`,
    question_en: `I would like to report a fraud case`,
    answer_en: `Agent notes down relevant information and resolves ticket`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `General Complaints`,
    subcategory: `USSD Code`,
    question_en: `The USSD code is not working`,
    answer_en: `Agent asks what message is displayed when customer is trying to access information:
1) ‘Please register through Runak.gov.krd’ OR ‘Register yourself or wait until your registration is validated'
Agent asks customer if they have completed KYC process:
No: agent informs customer to complete KYC
Yes: agent re-confirms that customer is using the same phone number that they used to complete KYC and then asks about timing of KYC completion:
<1 month: Agent responds that the KYC is likely still being validated and that the customer should check in the upcoming week
>1 month: Agent checks customer phone number in file shared by KYC team ‘post QA KYC’
Status: Flagged: Agent responds that customer should have received a ‘rejected’ SMS and needs to re-submit KYC 
Status: Validated: Agent responds that customer is successfully KYCed, but currently does not have available readings/bill and should try again in the next week
Phone number is not on the list: Agent marks ticket as pending and assigns ticket to KYC team on Freshdesk (validation should not take so long potential issue needs to be investigated by KYC team)

2) ‘Message not available’ 
Agent responds that customer does not have available readings/bill in this period and should try again in the upcoming week`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `General Complaints`,
    subcategory: `Private Generators`,
    question_en: `Any complaint related to private generators (e.g., the provider is requesting payment even after switch to 24/7)`,
    answer_en: `Agent notes down relevant information and marks ticket as pending to be assigned to private generator team on Freshdesk`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Smart Meter - Installation Request`,
    question_en: `I have a mechanical meter and I want to switch to a smart, what should I do?`,
    answer_en: `Agent should ask customer if they are in a Runaki area?
(a) if no: agent to inform customer to wait for the project to be rolled out to their area
(b) If yes: agent to collect necessary information: customer name, number, block ID, mechanical meter ID and assign the ticket to the smart meter team (Smart Meter--> Installation Request)`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Smart Meter - Linking`,
    question_en: `I received a leaflet for smart meter linking but I was not home when the technician came, what should I do?`,
    answer_en: `Agent to collect necessary information: unique leaflet number, customer name, number, block ID, location, leaflet (4 digits) and ask the customer for 2 possible timings when he/she is available for the technician to visit and assign the ticket to the smart meter team`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Data amendment`,
    question_en: `I would like to amend my KYC data`,
    answer_en: `Please re-submit KYC form online (through the QR link) if it’s a matter of phone number change. If you need to amend other types of data e.g., details on blue bill please visit the nearest CO.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Disconnection - Temporary`,
    question_en: `I want to disconnect my electricity for a specific period`,
    answer_en: `For this service we would kindly ask you to visit your nearest commercial office, where they can assist you further. Please note that only the owner of the house or a third party with a power of attorney can make the request at the commercial office`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Disconnection - Move out`,
    question_en: `I want a permanent disconnection and unlink the meter from my account.`,
    answer_en: `For this service we would kindly ask you to visit your nearest commercial office, where they can assist you further. Please note that only the owner of the house or a third party with a power of attorney can make the request at the commercial office. Personal identification (National ID, passport, etc.) and Title deed (Tapo) are required`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Collections - Instalment contract`,
    question_en: `I want to pay my debt in instalments`,
    answer_en: `You can create an instalment plan only for your pre-24/7 debt, after your receive all the necessary approvals. Please visit your nearest commercial office wherethey can assist you`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Collections - Debt clearance`,
    question_en: `I want to clear my debt`,
    answer_en: `Please visit the CO:
- Clearance is only available for Move-out, change of holder, and replying to MOMT letters.
- Clearance is not always possible because each customer has a specific reading and billing schedule. If the customer visits the commercial office before their new bill is ready in the system, clearance won’t be available.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Account management - Move in`,
    question_en: `I want to move in (create new account, connect electricity, etc.)`,
    answer_en: `The house owner or a third party with a power of attorney can visit the commercial office to start the process. Personal identification (National ID, passport, etc.) and Title deed (Tapo) are required`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Service Requests`,
    subcategory: `Account management - Change holder`,
    question_en: `I want to change the name of the holder of the contract`,
    answer_en: `The previous house owner or a third party with a power of attorney should visit the commercial office to start the process. Personal identification (National ID, passport, etc.) and Title deed (Tapo) are required`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `When will the project start in our area? (Non-24hrs elec. Residents)`,
    answer_en: `Thank you for your interest. To be notified when you will be part of Runaki, please register yourself through the KYC process, and once your area is switched to Runaki, you will receive a message informing you of the matter.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Will there be any disruptions in the electricity supply / maintenance activities during the pilot phase?`,
    answer_en: `While we strive to provide continuous and stable electricity, there may be occasional disruptions during the pilot phase as we fine-tune the infrastructure and address any unforeseen challenges. However, our team will be readily available to address any issues that may arise and minimize any inconvenience caused. Plus, private generators will stay on stand-by to provide the necessary electricity should any shortage or outage occur.
Also, you can register yourself through the KYC process to be notified about planned cutoffs.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Why are we now providing 24/7 electricity?`,
    answer_en: `We have made significant progress in increasing our electricity generation capacity, allowing us to consider providing continuous electricity to the entire KRI. However, in order to deliver this service effectively, we need to work on the physical infrastructure in neighbourhoods and understand the concerns and impact on the people. The pilot phase will help us identify any technical requirements and assess how people will adapt to having continuous electricity provided by the government.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Will there be any limits on the consumption of electricity?`,
    answer_en: `There will be no restrictions on electricity consumption. Your charges will be based on your usage, which will be accurately recorded by smart meters. Please note that the new tariff model is designed to reward low electricity consumers: the less you consume, the less you will pay.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Why am I being moved from a prepaid to a postpaid plan?`,
    answer_en: `This change is part of a broader operational upgrade to improve service quality and billing accuracy.
You were selected because your area now receives 24/7 electricity.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Can I choose to stay on prepaid?`,
    answer_en: `No. The transition is mandatory as part of the customer migration strategy. Returning to prepaid is
not currently an option.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `How will I be charged (moving from Pre-paid to Post-paid)?`,
    answer_en: `You will receive a monthly bill based on your meter readings and calculated using the 24/7 postpaid tariff.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `What happens to the remaining balance on my prepaid meter?`,
    answer_en: `Any remaining prepaid credit will be deducted from your first postpaid bill.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Will I keep my current meter? (moving from Pre-paid to Post-paid)?`,
    answer_en: `Yes, unless the meter was faulty — in which case it will be replaced.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Will I get a new account number? (moving from Pre-paid to Post-paid)`,
    answer_en: `No. Your existing account number remains the same and will appear on your new postpaid bill.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Rollout`,
    question_en: `Will pre-paid customers receive a discount?`,
    answer_en: `No. You were switched to a postpaid plan outside of the active discount period for your area and therefore are not eligible for postpaid discounts at this time.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `What is smart meter tampering?`,
    answer_en: `Smart meter tampering means when someone interferes with their smart meter to alter or reduce the amount of electricity consumption recorded. This is illegal and is considered theft of electrcity.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `What are the consequences of tampering 
with my smart meter?`,
    answer_en: `If tampering is detected:
a) Service disconnection: Your electricity supply may be immediately disconnected
b) Financial penalties: You may be subject to fines or billed for unmetered electricity
c) Legal action: Tampering is a criminal offense, and you may face prosecution
d) Reinstallation fees: You will need to cover the costs of reinstalling the meter and inspection charges`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `Why do you want to replace all meters with smart meters?`,
    answer_en: `We need to install smart meters as they provide accurate readings for households, ensuring that you only pay for the electricity you consume. Additionally, smart meters provide real-time data, allowing us to keep you updated on your consumption and expected bill at the end of the month.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `What is the difference between single-phase and three-phase systems?`,
    answer_en: `3-phase meter is made to handle the higher electricity demands. To begin the process of switching please visit the commercial office.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `Is the installation smart meters free of charge?`,
    answer_en: `Citizens should never be charged for the installation of smart meters.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `Is the maintenance of smart meters free of charge?`,
    answer_en: `All maintenance, troubleshooting, or replacements under warranty are also free of charge.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `Can I ask the team installing my smart meter to relocate it based on my personal preferences?`,
    answer_en: `Smart meter vendors should not accept personal service requests for changes such as relocating a meter for convenience or aesthetics.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Smart meter`,
    question_en: `Can I pay the team installing my smart meter to get personalized services?`,
    answer_en: `Field staff, both SM companies and MoEL employees, must not accept tips (dast7aq) under any circumstances.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Private generators`,
    question_en: `What will happen to the existing private generators?`,
    answer_en: `The government will closely work hand in hand with the Private Generators on a transition plan as customers are gradually switched onto 24/7 national grid electricity. In some areas, Private Generators may serve as a temporary fall-back in case of brief intermittent outages.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Private generators`,
    question_en: `How will the private generators owner be compensated?`,
    answer_en: `The government works closely with Private Generator owners on a transition plan as customers are gradually switched onto 24/7 national grid electricity`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Private generators`,
    question_en: `Are we still going to pay an extra bill to the private generators?`,
    answer_en: `No. Once your area has been switched to 24/7 electricity as part of Runaki, you will only need to pay 1 electricity bill going forward for the national grid supply. You will not pay a separate PG bill anymore.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Private generators`,
    question_en: `How will I know when to stop paying for my PG?`,
    answer_en: `You should stop paying the PG from the time your neighbourhood is switched to 24/7 electricity. We will inform those who have KYC'ed of this date.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Runaki Project - Private generators`,
    question_en: `The private generator has requested money, even though we are now on 24/7 national grid electricity. What should I do?`,
    answer_en: `The Private Generator has the right to request payment for the period up until you are switched to 24/7 national grid electricity, if you had contracted electricity supply from the Private Generator. If however, you believe the Private Generator has either requested payment or has charged you already for the period after you were switched to Runaki 24/7 electricity, then please let us know the following:

- City
- Neighbourhood
- Unit block ID
- Customer phone number
- Private Generator name and phone number
- If the Private Generator already collected money or only requested for money
- The period for which the Private Generator requested money (e.g., the month of March 2025), and how much`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I have no electricity bill. How can I KYC?`,
    answer_en: `Options in order of preference:

- If the customer knows their electricity account number: Submit a digital electricity bill by visiting the psula website (https://elc.pay.krd/Pswla/Bill) and entering your electricity account number (which you may get from your owner or you might have if you are the owner) to access a digital bill and take a photo for upload
- If the customer does not know their electricity account number but still has a mechanical meter in their home (even if this is not active anymore): submit a clear photo of your mechanical meter which clearly displays all the information on it (please note: this is relevant even if a customer has a smart meter installed)
- If the customer does not know their electricity account number and does not have a mechanical meter in their home anymore: visit the Commercial Office (please provide the customer with the address of the Commercial Office) and provide them with your block ID to obtain a physical electricity bill. The Commercial Office may send a technician to your unit for inspection before generating a physical bill.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `My electricity bill is not recent – is this OK?`,
    answer_en: `Recency of the bill will help minimize instances of an outdated owner’s details on it; as such, we recommend that you use the most recent bill which you have in your possession.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `My electricity bill is not in my name – is this OK?`,
    answer_en: `Yes this is OK – regardless of if you are not the owner or if an outdated owner’s name is on the bill – please continue to submit your bill as long as you live in the property and it has your property’s block ID on it`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `Which types of ID are acceptable?`,
    answer_en: `If you do not hold any of the National ID, Civil ID, or Residential ID – then please proceed to upload either your Surat Qait or refugee document. Other types of ID are not accepted.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I was not in my house when the KYC agent passed, how can I fill in the KYC survey?`,
    answer_en: `KYC agents do not fill in your information. Instead, you will need to do it yourself by scanning the QR code on the leaflet distributed to your home. Alternatively if you need support, you can visit us in our dedicated KYC location which is displayed on the leaflet where our agents will be available to assist you.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I didn’t receive a leaflet with a QR code on it – what do I do?`,
    answer_en: `- If we are actively preparing to switch your neighbourhood to 24/7 electricity: our leaflet agents may not have covered your property yet – please wait until they do
- If we have already switched your neighbourhood to 24/7 electricity: you can scan the QR code on leaflets from any of your neighbours, or visit government departments where there is a poster displayed with the QR code on it. Alternatively, you can visit our dedicated KYC location where one of our agents will be able to assist you
- If we have not yet started preparing your neighbourhood for the switch to 24/7 electricity: please wait until we do`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `What do I need to bring with me when showing up at the dedicated KYC location?`,
    answer_en: `You will need to bring with you your ID (either ones of National ID, Civil ID, Residential ID, or – if none of the previous in your possession – Surat Qait or refugee document), and either your electricity bill or a clear photo of your mechanical meter`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `What are the opening hours of the KYC locations?`,
    answer_en: `8.30am to 2.30pm on working days between Sunday and Thursday`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `How long will I need to remain at the dedicated KYC location?`,
    answer_en: `Processing the form only takes several minutes. There may be a small queue of customers in front of you but we do not anticipate this to to take long.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `Are dedicated KYC locations open on public holidays?`,
    answer_en: `No – we only work on official working days between Sunday and Thursday. For Erbil: Municipality Directorates 1-6 are not (we only work on official working days between Sunday and Thursday); some Qi Card locations in Erbil city may be.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `How do I know that I have successfully completed the KYC process?`,
    answer_en: `The validation process can last up to 1 month; If your form contains errors: we will send you a SMS to resumbit otherwise you can assume that the KYC process was successful and you should start receiving monthly bill SMS.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I received a message that I should resubmit, what should I do?`,
    answer_en: `The customer should resubmit the KYC using the exact same process they had used to KYC the first time by scanning the QR code. The customer should pay careful attention to the reason they have been requested to re-submit so that the KYC gets validated.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `My unit is residential, as stated on the bill ('RESIDENTIAL'), but it is being used as a business office (house/flat used for commercial purposes). Which segment should I select for the KYC process?`,
    answer_en: `For these cases, you need to select 'Commercial' from the drop-down menu and submit the information as commercial.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I am a tenant in the unit, not the owner, do I need to do KYC?`,
    answer_en: `You should KYC as the current occupant of the property and end-consumer of its electricity, regardless of whether you are a tenant or an owner. We will send you communication regarding your consumption patterns and project updates, for which you as the tenant should be the recipient, rather than the owner who will not get affected.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I own a commercial unit that currently lacks a business name and is not in use. Do I still need to complete the KYC process for it?`,
    answer_en: `Yes, that's fine. You can complete the KYC process for it and use the owner's name instead of the business name.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `Am I eligible for discounts even if I don’t KYC?`,
    answer_en: `Yes, but we recommend you to KYC .This will allow you to be closely informed of important communication such as monthly bill, outages etc.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `Do all cellular networks receive the messages and through which platform ?`,
    answer_en: `Messages will only be sent to local cellular carriers (Zain, Asiacell & Korek) and will be received either via WhatsApp, SMS or Viber. Please ensure you register your KYC with a local Iraqi number.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I have a building with many units and I am the owner - who should KYC?`,
    answer_en: `The occupants of the units within the building who are the end-consumers of the electricity should KYC (regardless of whether they are the tenant)`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `What are the KYC locations, and opening hours?`,
    answer_en: `For Duhok: 
For assistance with completing the KYC form, customers can visit agents at any of the following locations that are most convenient to them:
- Mame Alan school
- Zozik school
- Municipality directorate Rozh-Ava 
- Municipality directorate Rozh-Halat
Sunday-Thursday 08.30-14.30

For Erbil:
For assistance with completing the KYC form, customers can visit agents at any of the following locations that are most convenient to them:
- Municipal Directorates 1 - 6;
- Ainkawa Municipality; or 
- Qi Card stores
Sunday-Thursday 08.30-14.30

For Suli: 
For assistance with completing the KYC form, customers can visit agents at any of the following locations that are most convenient to them:
- Malkandi Basic school
- Sulaymaniyah High School for Girls
- Municipality directorate Rozh-Awa 
- Municipality directorate Rozh-Halat
Sunday-Thursday 08.30-14.30

For Halabja: 
For assistance with completing the KYC form, customers can visit agents at any of the following locations that are most convenient to them:
- Commercial Office, Karez. 
From 
Sunday-Thursday from 8:00 AM to 02:00 PM

For Soran: 
For assistance with completing the KYC form, customers can visit agents at any of the following locations that are most convenient to them:
- Commercial Office, Nawroz near Dilman Bank 
Sunday-Thursday from 8:00 AM to 2:00 PM 

For Zakho:
For assistance with completing the KYC form, customers can visit agents at any of the following locations that are most convenient to them:
- Commercial Office, near Zakho Court 
Sunday-Thursday from 8:00 AM to 2:00 PM 

For Chamchamal:
For assistance with completing the KYC form, customers can visit agents at any of the following locations that are most convenient to them:
- Commercial Office, Nawroz near Dilman Bank 
Sunday-Thursday from 8:30 AM to 2:30 PM`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `What is the cost for completing the KYC if I visit the dedicated locations listed on the leaflets?`,
    answer_en: `KYC is free of charge and involves no costs if you do it yourself or visit any of the locations shown on the leaflet`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `How do I scan a QR code?`,
    answer_en: `Open your phone’s camera and wait for a pop-up notification and tap the notification to open the link.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I am unable to submit the KYC using the QR code, what do I do (QR Code is not working)`,
    answer_en: `Ensure your phone’s camera settings allow QR code scanning, that you have internet connection or try using another mobile phone. If the customers still has issues please ask him to visit the MDs or Qi nearest Qi card shop and plea record the issue as a ticket`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I am unable to submit the KYC using the QR code, what do I do (error message when trying to upload images)`,
    answer_en: `Please visit the MDs or nearest Qi card shop for assistance and record issue as a ticket`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `KYC`,
    question_en: `I am unable to submit the KYC using the QR code, what do I do (error when trying to submit the form)`,
    answer_en: `Please visit the MDs or nearest Qi card shop for assistance and record issue as a ticket`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billling Inquiries - Bill amount`,
    question_en: `How can I see my latest bill?`,
    answer_en: `For the customers who submit their KYC information:
1) The government will send regular bill updates to keep you informed
2) You can use the USSD option: simply dial *1992# from your phone and follow the menu to check your bill/consumption
If you have not KYCed you should wait for a to visit you to receive your latest bill, or alternatively you can visit the CO
TARGET (when agents have access to CRM customer folder): Agent opens customer folder and inputs account number, goes to 'bill' panel and reads latest bill amount`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Bill Amount`,
    question_en: `I received a bill but the billing date that I have is before the date I was switched to 24/7, how was my bill calculated?`,
    answer_en: `Agent asks: Could you please confirm your area, the date your switched to 24/7 and the start date of your bill?
Once the customer responds, the agent should explain:
1) From the previous billing date up until your 24/7 switch date, your charges were based on the old tariff model
2) From the switch date onwards, your charges were calculated using the new tariff model`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Bill Amount`,
    question_en: `Why does my bill amount (IQD) not the same as the online calculator?`,
    answer_en: `If the bill (either physical or SMS) does not match the calculator:
1. Outdated Bill: The calculator uses the new Runaki tariffs (implemented in May). If the customers bill covers a period before the new tariff structure implementation date, the Pilot Runaki rates apply

2. 24/7 switch date in the billing cycle: The calculator uses the new Runaki tariffs (implemented in May). If the billing cycle began before the switch to 24/7. Consumption before the 24/7 start date will be charged using the old tariff, while consumption after that date will follow the new tariff

3. Discount application: The calculator doesnt include discount considerations. A 50% discount will be applied during the first 30 days following the switch, and a 25% discount will be applied during the second 30 days causing discrepancies in billing amounts.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Bill Amount`,
    question_en: `Have I received a credit repayment from having overpaid under pilot Runaki tariffs?`,
    answer_en: `If you had been billed under Runaki from before the new tariffs were announced, any extra amount you paid will be repayed to you; 
If you KYC, then we will separately update you on any credits we repay you`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Bill Amount`,
    question_en: `How can I read the bill?`,
    answer_en: `Now shown on the bill (Erbil, Suli and Duhok)
1. Legacy or Old Debt: all the debt that you acquired by not paying bills regularly before the switch to 24/7
2. Runaki Debt: All the debt that you acquired by not paying bills regularly for the period after you switched to 24/7
3. Current Month Bill: the amount that you need to pay for the latest month
4. Total Runaki: The sum of Runaki debt and current month bill
5. Tarrif calculation breakdown: displaying the kWh consumption (on the left) and the tariff applied to this range (on the right)

For Suli & Duhok:
Discount Amount: the bill format in Suli and Duhok also shows the discounts that have been applied (e.g., for Residential 50% in the first month, 25% in the second month and 15% in the third month)`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing inquries - Bill amount`,
    question_en: `The bill s won't take my monthly bill unless if I pay my outstanding debt, what to do?`,
    answer_en: `1. In non-pilot areas, s must collect the full amount (old debt + monthly bill)
2. In Runaki areas, s can collect:
- Full Runaki debt
OR
- Nothing
If a customer says the isn’t taking only the monthly bill, explain that a can only take full Runaki`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Tariff`,
    question_en: `How was the tariff designed and what happens if there is surplus that will be generated from this project?`,
    answer_en: `The new tariff was designed based on a study of customers consumption patterns and spending on government electricity and private generators. It encourages responsible usage, ensuring that most consumers who manage their consumption will not pay more than they do today — while gaining access to reliable, 24/7 government electricity

It's unlikely there will be any surplus - however the tariffs will help close a large deficit in the public budget which will enable the govt to (1) afford providing 24/7 (2) be used to provide additional public services`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Tariff`,
    question_en: `What is the new tariff structure?`,
    answer_en: `If residential:
• 0 KWH - 400 KWH: 72 IQD/KWH
• 401 KWH - 800 KWH: 108 IQD/KWH
• 801 KWH - 1200 KWH: 175 IQD/KWH
• 1201 KWH - 1600 KWH: 265 IQD/KWH
• 1601 KWH + : 350 IQD/KWH
If commercial: the tariff is set at 185 IQD/KWH
If industrial or state: the tariff is set at 160 IQD/KWH
If agriculture: the tariff is set at 60 IQD/KWH'`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Tariff`,
    question_en: `How did you come up with the consumption ranges?`,
    answer_en: `The consumption ranges were developed through a comprehensive study of customers electricity usage patterns, designed to reflect the needs of different types of consumers while encouraging and rewarding responsible energy use. These ranges were tested in pilot areas and have proven successful in supporting fair billing and promoting efficient consumption.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Tariff`,
    question_en: `Can I switch to the prepaid model?`,
    answer_en: `Although the prepaid model has its advantages, the Runaki project is based on the postpaid KWH model, which is fairer and more accurate. With the postpaid model, you'll only pay for the actual amount of energy you consume. This will help you identify areas where you can reduce your energy consumption and lower your bill.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Tariff`,
    question_en: `How much should I expect to pay by the end of month?`,
    answer_en: `'If residential:
• Low consumers: 200 KWH - 600 KWH: 15K IQD - 50K IQD
• Mid consumers: 600 KWH - 800 KWH: 50K IQD - 70K IQD
• High consumers: 800 KWH - 1200 KWH: 70K IQD - 140K IQD
• Very high consumers: 1200+ KWH: 140K IQD+
For customer segments other than residential, the bill will be calculated using: segment's price per KWH * Consumption during the billing cycle in KWH (in line with their current spend on PG and govt grid)'`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Bill Amount`,
    question_en: `Why is the billing cycle not 30 days or why did the billing cycle change this month?`,
    answer_en: `You receive your bill based on a billing cycle, which is the period of time your bill covers. This cycle does not always start at the beginning of the month and end at the end of the month—it depends on when the bills are processed and sent out and when we managed to get a reading for your smart meter. So, your bill might cover different dates each month and it may cover in some cases 30 while in other cases less (e.g. 25 days) or more (e.g. 35, 40, 50 days, etc.)`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Tariff`,
    question_en: `Have the new Runaki tariffs been applied to my bill? (specifically, May bill)`,
    answer_en: `Yes – from May onward, the new Runaki tariffs are applied for the part of the bill under Runaki (after the customer was switched to 24/7); 
The part of the bill from before the customer joined Runaki are based on pre-Runaki tariffs`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing inquries - Payment location`,
    question_en: `I was not home when the visited my house what should I do?`,
    answer_en: `Please proceed by paying at the commercial office (CO) as you are still responsible for settling your dues even the bill is not received, especially if you have received the SMS.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing inquries - Payment location`,
    question_en: `How can I pay my bills, I have a business? (Commercial)`,
    answer_en: `Residential and small commercial customers can pay through s or at commercial offices. But large commercial, agricultural, and government customers can only pay at commercial offices because they pay larger amounts, and s can't carry that much cash.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing inquries - Discount`,
    question_en: `What are the discounts?`,
    answer_en: `Only residential customers are eligible for discounts during their first 90 days of 24/7 consumption applied as such: 50% on the first 30 days, 25% on the next 30 days, 15% on the next 30 days`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Discount`,
    question_en: `Do businesses get 50% off?`,
    answer_en: `Unfortunately not, at least not for now, but we are constantly looking for ways we can give more discounts in the future`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Billing Inquiries - Discount`,
    question_en: `Customer is moved new to the area and completes the KYC process now, for example, the area is already switched to 24/7, will they receive a 50% discount?`,
    answer_en: `Unfortunately not, the first discount is at 50% on the first 30 days after the area switches to 24/7 and the second discount is at 25% on the next 30 days after. If you moved-in for example 30 days after the zone switched to 24/7 you have missed the 50% discount but you will still get the 25% discount for your next 30 days. But if you moved in the zone 60 days after the switch to 24/7 you would have missed both, the 50% and 25% discounts`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `Why are you disconnecting customers for non-payment now?`,
    answer_en: `The new 24/7 electricity program ensures that customers enjoy reliable and uninterrupted service, but timely bill payments are essential to sustain it. Hence, customers with unpaid dues will stop having access to this service. This will also help you avoid debt accumulation going forward.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `Are you enforcing across 24/7 areas or only in ours? Why?`,
    answer_en: `[Pilot]: This initiative is part of a pilot, and it aims to start in areas that are mature in terms of 24/7 electricity provision. Once proven successful, the same rules will be applied in other Runaki areas

[Rollout]: Yes, this is meant to be enforced in all Runaki areas. However, to ensure a smooth implementation of the new rules, activation across areas will happen gradually. Please note that it is your repsonsibility not to accumulate debt even If your area is not yet activated because any bill as of the public announcement will be considered in dunning.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `What happens if I don’t pay my bill?`,
    answer_en: `If a bill is not paid, you will start/continue accumulating debt which will increase the risk of supply disruption. You will receive reminders of overdue payments then warnings about the imminence of supply disruption up until the actual disconnection of your electricity supply.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `How can I make a payment?`,
    answer_en: `[Before disconnection] : Payments can be made at the commercial office or to a when they visit. However, if a has already passed and you did not pay, it is encouraged to pay at CO and not wait until the next visit
[After or close to disconnection] : You can visit the commercial office to settle your dues. To ease the process for customers we made sure that a cashier stays available at the CO after hours until 8pm. This should allow enough time to avoid staying disconnected until the next day`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `What do I have to do now to avoid disconnection?`,
    answer_en: `Please go to the CO to pay your expired debt`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `Will I receive a warning before disconnection?`,
    answer_en: `Yes. If you haven’t paid your bill, you will receive reminders via SMS, phone from call centre and s informing you of the amount to settle and the payment deadline to avoid disconnection. Additionally, s will leave a sticker at your door as a remider if you are not available.
Please note that if we have to send a , this means that you have not done your KYC. To receive SMS reminders and reduce the risk of not receiving reminders before disconnection, please make sure you do yoour KYC.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `What if I can’t afford to pay the entire bill at once?`,
    answer_en: `We understand there could be financial challenges. However, enjoying continuous 24/7 electricity, which replaces both previous electricity service and private generators, requires commitment to settle dues on time either at the commercial office or to a when they visit. Going forward, we strongly advise you to adjust old consumption habits avoiding excessive and unnecessary consumption. If interested, we could share consumption tips with you to help limit your bill.
It is important to note that KRG decided not to consider bills before the public announcement as part of dunning which allows you a fresh start.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `I am disconnected but I haven’t received a bill, what to do?`,
    answer_en: `Agent should clarify with customer if they have received a SMS about disconnection:
SMS received: Please note that the counter starts from the moment the SMS is received. We encourage you not to wait until the physical bill is delivered and instead, visit the commercial office to settle your dues as soon as you receive your SMS. To ease the process for customers we made sure that a cashier stays available at the CO after hours until 8pm. This should allow enough time to avoid staying disconnected until the next day.

SMS not received: Our team will investigate the cause but in the meantime, You can visit the commercial office to settle your dues. To ease the process for customers we made sure that a cashier stays available at the CO after hours until 8pm. This should allow enough time to avoid staying disconnected until the next day.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `How soon will my electricity be restored if I pay after disconnection?`,
    answer_en: `If payment for all outstanding debt is made in full, service will be restored within 24 hours`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `Nobody from MOEL informed me about the disconnection and now I do not have Electricity`,
    answer_en: `All customers receive multiple reminders from MOEL before disconnection through SMS, calls from the Runaki call centre or visits from s informing of the imminence of disconnection. Can you please provide me your registered telephone number? [The agent uses the phone number in the calculator to check if customer has been KYCed] 
If customer has been contacted: You can visit the commercial office to settle your dues as soon as you receive your SMS. To ease the process for customers we made sure that a cashier stays available at the CO after hours until 8pm. This should allow enough time to avoid staying disconnected until the next day.
If customer has not been contacted: We will escalate the matter to the relevant team to resolve the issue. However, disconnection will happen again if payments are not settled.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `Can I still be dunned even if I did not KYC?`,
    answer_en: `Yes, you can still be dunned, KYC-ing only means that you will receive frequent notifications. If you do not KYC we will still send a to notify you if you have been dunned.We highly recommend that you KYC so that you can stay informed.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Process`,
    question_en: `Are the disconnections applied to Runaki or non-Runaki areas?`,
    answer_en: `Runaki areas only`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Amount/Date`,
    question_en: `How much should I pay to avoid disconnection?`,
    answer_en: `CURRENT: Agent checks the file shared and provides the customer with the amount. Alternatively, the customer can visit theCO to inquire about outstanding payment
TARGET (when agents have access to CRM): Agent opens CRM customer folder, inserts the account number and goes to 'expired debt panel' and reads the exact amount that the customer needs to pay`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Dunning - Dunning Amount/Date`,
    question_en: `I received an SMS that I will be disconnected; by when do I need to pay to avoid disconnection?`,
    answer_en: `CURRENT: Agent informs that customer should vist the commercial office as soon as possible to make the payment
TARGET (when agents have access to CRM): Agent opens CRM customer folder, inserts account number and checks expired debt panel and provides information to customer`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `What is e-Psûle?`,
    answer_en: `e-Psûle is the Kurdistan Regional Government’s official digital payments platform. It enables citizens and businesses to view and pay bills securely and conveniently through multiple digital channels.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `Who oversees the e-Psûle platform?`,
    answer_en: `e-Psûle is developed by the Kurdistan Regional Government and officially approved by the Central Bank of Iraq (CBI).`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `Which types of bills can I pay through e-Psûle?`,
    answer_en: `You can pay bills issued by e-Psûle's biller partners such as the Ministry of Electricity.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `What types of electricity payments are supported?`,
    answer_en: `You can pay 2 MOEL services:
Current outstanding balance, which represents your post Runaki dues
Legacy debt, which represents your pre-Runaki dues`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `Which payment channels are available?`,
    answer_en: `You can pay your bills via:
e-Psûle's wallet partners: FastPay, AsiaPay, and NassWallet
e-Psûle's bank partners: FIB, Cihan, and NBI
All channels are officially approved by the Central Bank of Iraq. Additional channels will be added in the future.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `How do I make a payment?`,
    answer_en: `You can make a payment in 5 easy steps:
1- Select the biller you want to pay
2- Select the service you want to pay
3- Enter your unique account / bill number
4- Confirm and authorize the transaction
5- View and save your digital receipt`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `Can I pay on behalf of others?`,
    answer_en: `You can make payments against any account / bill number, including payments on behalf of others.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `Are there extra fees?`,
    answer_en: `No extra fees apply when you pay via e-Psûle.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `Does e-Psûle make automatic deductions?`,
    answer_en: `No automatic withdrawals are made from your account. Payments are processed only with your prior consent and authorization.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `Can I pay partially or installements?`,
    answer_en: `Only the pre-Runaki dues (legacy debt) can be paid partially, if the customer doesn’t have an existing installment plan. In case of an installment plan the monthy amount from the legancy debt is automatically added to the 'post Runaki dues'. 

The post Runaki dues needs to be paid in full.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `E-psule`,
    question_en: `what is the Partners of E-psule call center?`,
    answer_en: `FIB / 066 220 6977
FastPay / 066 231 0000
Nasswallet / 6662
Cihan Bank / 066 211 5700
AsiaPay / 6766.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `USSD`,
    question_en: `How do I use the USSD service?`,
    answer_en: `Simply dial *1992# from your phone operated by Korek and Asiacell. Follow the menu to check your bill or consumption.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `USSD`,
    question_en: `Do I need to pay for the service?`,
    answer_en: `No, there is no extra cost for using the USSD service.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `USSD`,
    question_en: `Can I see my old bill/consumption?`,
    answer_en: `The USSD service displays your most recent consumption and bill. To access the detailed history you can try the following options:
1) Refer to old bills (either physicall/SMS)
2) Visit the Commercial office to check the history of your bills and consumption`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `USSD`,
    question_en: `How often is the data refreshed?`,
    answer_en: `Bills are updated once a month, and consumption data is refreshed every week. If you’re not seeing changes yet, please check again after the next update cycle.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `USSD`,
    question_en: `I can only see two of my properties. What about the others?`,
    answer_en: `The USSD service currently shows up to two units linked to your KYC details. For additional properties, please continue referring to your physical bills.
You can also go to the Commercial office to check the latest update on all of your block IDs`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Other`,
    question_en: `How can I install solar panels and integrate this with the Runaki project system?`,
    answer_en: `The customer should go to the Commercial Office to register his/her system based on regulations and follow the process, where Net Metering will be offered after the system is registered.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Other`,
    question_en: `I have solar energy with an excess capacity of 40 or amperes (or even a company providing more ampers). How can I contribute this surplus to the government’s electricity network?`,
    answer_en: `The customer must first go to DG to get the necessary approvals of giving electricity to governments then they have to visit the commercial office to change their tariffs to solar.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Other`,
    question_en: `Will my smart meter reset to zero or reverse when connected to a solar system?`,
    answer_en: `No. Smart Meters have export and import reading cells separately. The Net Metering equation is (Import - Export = Bill).`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Other`,
    question_en: `If my solar panels generate surplus electricity, am I eligible for compensation from the Ministry of Electricity, KRG?`,
    answer_en: `The compensation is in credit, not cash. You will pay less because the equation is (Import - Export = Bill). And if, in a month for example, you exported to the grid more than you imported, you will not pay anything that month, and the leftover kWh will be calculated in the next month as well.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Other`,
    question_en: `I have 40 amps from my system can I give the 40 for the government`,
    answer_en: `Yes, you can. When you have solar energy registered, the Ministry of Electricity will waive the limit on Smart Meters, and you will be able to import and export without limitation. (For Runaki areas, the limit has already been waived.)`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Other`,
    question_en: `If a company calls saying they would be interested in participating in the program as a solar energy provider`,
    answer_en: `We have a list of companies who we may reach out to eventually, but for now, you can record their names and contact details so we can add them to our list. However, no promise shall be given on timing.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Inquiries`,
    subcategory: `Other`,
    question_en: `Can I have both solar and runaki merged?`,
    answer_en: `Yes, you can. And you will still be able to export electricity to the grid and get the benefit of Net Metering, even if you have an on-grid system, which means you only have panels and inverters without batteries.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `Outstanding After Payment - Zero`,
    question_en: `Customer paid and e-Psûle shows 0 IQD — problem?`,
    answer_en: `No. This is correct.

If the outstanding Runaki amount shows 0 IQD after payment, there is no issue.
Ask the customer to refresh the app to confirm.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `Outstanding Amount Still Showing`,
    question_en: `Customer paid but e-Psûle still shows a non-zero amount`,
    answer_en: `Check the following:

1. Did the customer really complete the payment?
2. Did they receive a payment confirmation or receipt?
3. Does the payment appear in their transaction history?

If all fine — check:
• Are they viewing "Outstanding" or "Legacy" by mistake?
• Did they enter the correct account number?

If still unresolved:
→ Check CRM for how long payments take to reflect.
→ Tell the customer to call back after that time.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `Payment Processing`,
    question_en: `The bank / wallet shows "processing" — what does this mean?`,
    answer_en: `The payment is still being processed. The customer does not need to worry yet.

Ask them to wait until the payment is completed and reflected in e-Psûle.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `Partial Payments - Legacy Debt`,
    question_en: `If I pay part of my legacy debt, which bill gets cleared?`,
    answer_en: `Partial payments clear the newest bill first.

Example:
Legacy debt = 20,000 IQD
(15,000 IQD older bill + 5,000 IQD newer bill)

If the customer pays 5,000 IQD → the newest 5,000 IQD bill is cleared.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `General Info`,
    question_en: `What is e-Psûle and how do customers use it?`,
    answer_en: `e-Psûle is the official Runaki payment application. Customers can:
• View their current outstanding balance
• View their billing history
• Pay their electricity bills securely online

Available in: Erbil, Duhok, Sulaymaniyah, Zakho, Raparin, Halabja, Zakho Batifia.

Always advise customers in these cities to use e-Psûle.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `Outstanding vs Legacy`,
    question_en: `Difference between "Outstanding" and "Legacy" in e-Psûle?`,
    answer_en: `Outstanding: Current amount owed for recent billing cycles.

Legacy: Older accumulated debt from previous billing periods that has not been paid.

Make sure the customer is reading the correct field. Both may need to be cleared.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Feedback & Others`,
    subcategory: `Others`,
    question_en: `If the agent is asked a question that is not available in the FAQs`,
    answer_en: `If the question is not known, the agent should document the question and say the following:
"Thank you for your question. We will check internally and get back to you as soon as possible. Could you please provide your contact information so we can follow up with you?"
The agent should run this question by his supervisor and try to get a response ASAP.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Feedback & Others`,
    subcategory: `General Feedback`,
    question_en: `How can I provide feedback or report any issues during the pilot phase?`,
    answer_en: `We highly encourage you to provide feedback and report any issues you may encounter during the pilot phase. We will establish a dedicated channel for communication, such as a helpline or an online portal, where you can reach out to us. Your feedback will be invaluable in helping us improve the system and address any concerns promptly.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Feedback & Others`,
    subcategory: `Others`,
    question_en: `If the agent is asked a question that is not available in the FAQs`,
    answer_en: `If the question is not known, the agent should document the question and say the following:
"Thank you for your question. We will check internally and get back to you as soon as possible. Could you please provide your contact information so we can follow up with you?"
The agent should run this question by his supervisor and try to get a response ASAP.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `Feedback & Others`,
    subcategory: `General Feedback`,
    question_en: `How can I provide feedback or report any issues during the pilot phase?`,
    answer_en: `We highly encourage you to provide feedback and report any issues you may encounter during the pilot phase. We will establish a dedicated channel for communication, such as a helpline or an online portal, where you can reach out to us. Your feedback will be invaluable in helping us improve the system and address any concerns promptly.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `e-Psûle Outstanding Runaki Amount After Payment`,
    question_en: `The customer says they paid, and e-Psûle now shows 0 IQD. Is there a problem?`,
    answer_en: `No. If the outstanding Runaki amount is 0 IQD after payment, there is no issue. Ask the customer to refresh the app to confirm.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `e-Psûle Outstanding Runaki Amount After Payment`,
    question_en: `The customer says they paid, but e-Psûle still shows a non-zero amount. What should I check first?`,
    answer_en: `• Ask if they really completed the payment.
• Did they receive a payment confirmation message or receipt?
• Does the payment appear in their billing or transaction history?`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `e-Psûle Outstanding Runaki Amount After Payment`,
    question_en: `What if the customer says they paid, but the amount still appears?`,
    answer_en: `Check if they are looking at the correct field:
• Are they viewing "Outstanding" or "Legacy" by mistake?
• Did they enter the correct account number when paying?`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `e-Psûle Outstanding Runaki Amount After Payment`,
    question_en: `What if everything looks correct but e-Psûle still shows a non-zero amount?`,
    answer_en: `• Check in the CRM system to confirm how long payments take to appear in the system.
• Inform the customer to call back after that time if the amount is still not updated.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `e-Psûle Outstanding Runaki Amount After Payment`,
    question_en: `The bank or wallet shows "processing." What does this mean?`,
    answer_en: `• The payment is still being processed.
• The customer does not need to worry yet.
• Ask them to wait until the payment is completed and reflected in e-Psûle.`,
    question_ku: ``,
    answer_ku: ``,
  },
  {
    category: `New Updates`,
    subcategory: `Application of Partial Payments to Legacy Debt`,
    question_en: `If I decide to pay part of my legacy debt, will it subtract from my latest accrued debt?`,
    answer_en: `Yes. For example if your legacy debt is 20,000 IQD and consists of two bills:
• 15,000 IQD (older bill)
• 5,000 IQD (newer bill)

If you pay 5,000 IQD → it will erase the newest 5,000 IQD bill (which is part of the legacy debt).

⚡ Partial payments always clear the newest bill first.`,
    question_ku: ``,
    answer_ku: ``,
  },
];

async function seedFAQs() {
  try {
    // Get or create system user
    let adminRes = await pool.query(`SELECT id FROM users WHERE email = 'admin@runaki.com'`);
    if (adminRes.rows.length === 0) {
      const hash = await bcrypt.hash('Admin@2026', 10);
      adminRes = await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES ('Admin','admin@runaki.com',$1,'admin') RETURNING id`,
        [hash]
      );
    }
    const adminId = adminRes.rows[0].id;

    // Clear existing FAQs
    await pool.query('DELETE FROM faqs');
    console.log('Cleared existing FAQs');

    // Insert all FAQs
    let count = 0;
    for (const faq of faqs) {
      await pool.query(
        `INSERT INTO faqs (category, subcategory, question_en, answer_en, question_ku, answer_ku, is_published, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,true,$7)`,
        [faq.category, faq.subcategory || null, faq.question_en, faq.answer_en,
         faq.question_ku || null, faq.answer_ku || null, adminId]
      );
      count++;
    }

    console.log(`✅ Seeded ${count} FAQs successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedFAQs();