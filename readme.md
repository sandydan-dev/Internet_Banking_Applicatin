
# 
Customer Profile Model
Purpose: Holds profile data created by users themselves during registration.

Fields:

userId: Automatically generated during user authentication (linked to the User Model).

fullName: Name provided by the user.

email: User's email address.

phoneNumber: Contact number.

address: Residential address.

profileStatus: Status of the profile (pendingApproval, approved, inactive).

createdAt: Timestamp for profile creation.

updatedAt: Last modification timestamp.

1. User Model
Purpose: Stores user details, managing authentication and identification.

Fields:

userId: Unique identifier for the user.

name: Full name of the user.

email: Email address.

password: Hashed password for security.

role: Defines roles like customer, admin, employee.

createdAt: Date of account creation.

phoneNumber: Contact details for communication.

address: Physical address for records.

2. Account Model
Purpose: Manages different types of bank accounts and balances.

Fields:

accountId: Unique identifier for the account.

userId: Links to the owner of the account.

accountType: Savings, Current, Fixed Deposit, etc.

balance: Current account balance.

currency: Currency of the account (e.g., INR, USD).

interestRate: Applicable interest rate (if relevant).

status: Account status (active, inactive).

createdAt: Date of account opening.

3. Transaction Model
Purpose: Logs all transactions made within the banking system.

Fields:

transactionId: Unique identifier for the transaction.

accountId: Reference to the account involved.

transactionType: Type (deposit, withdrawal, transfer).

amount: Amount of the transaction.

status: Transaction status (completed, pending, failed).

timestamp: Date and time of the transaction.

details: Additional information about the transaction (e.g., notes, reference).

4. Transfer Model
Purpose: Tracks money transfers between accounts.

Fields:

transferId: Unique identifier for the transfer.

fromAccountId: Sender's account.

toAccountId: Recipient's account.

amount: Amount transferred.

status: Transfer status (initiated, completed).

timestamp: Date and time of transfer.

notes: Additional transfer details (optional).

5. Payment Model
Purpose: Handles bill payments and external financial transactions.

Fields:

paymentId: Unique identifier for the payment.

accountId: Reference to the user’s account making the payment.

paymentType: Type of payment (bill payment, loan repayment).

amount: Payment amount.

status: Payment status (successful, failed).

vendor: Details of the vendor or payee.

dueDate: Payment due date for scheduled payments.

6. Loan Model
Purpose: Tracks loans applied for by customers.

Fields:

loanId: Unique identifier for the loan.

userId: Reference to the applicant.

amount: Loan amount requested.

interestRate: Applicable interest rate.

tenure: Duration for loan repayment.

status: Loan status (approved, pending, rejected).

installments: Breakdown of installment payments.

repaymentDueDate: Date for repayment deadlines.

7. Audit Log Model
Purpose: Logs critical actions for tracking and transparency (especially for admin operations).

Fields:

logId: Unique identifier for the log.

userId: Reference to the user performing the action.

action: Description of the action (e.g., "Deposited money").

timestamp: Date and time of the action.

affectedAccountId: Accounts impacted by the action.

remarks: Notes or comments about the action.

8. Card Management Model (Optional)
Purpose: Manages debit/credit card details.

Fields:

cardId: Unique identifier for the card.

userId: Links to the cardholder.

cardType: Debit, Credit.

cardNumber: Encrypted card number.

expiryDate: Card expiration date.

cvv: Encrypted security code.

status: Active or blocked.

9. Notifications Model
Purpose: Sends alerts for transactions, updates, or account activities.

Fields:

notificationId: Unique identifier.

userId: Links to the recipient.

message: Notification message.

status: Status (read, unread).

timestamp: Time the notification was sent.

10. Admin Dashboard Analytics Model
Purpose: Stores data for analytics purposes (e.g., user activity, role distribution).

Fields:

analyticsId: Unique identifier.

metricName: Name of the metric (e.g., "Total Transactions").

metricValue: Value of the metric.

timestamp: Date and time of record.

breakdownByRole: Detailed data grouped by roles.

Interactions Between Models
Account Creation: User creates accounts, linking their userId with the Account Model.

Transaction Handling: Each deposit, withdrawal, or transfer interacts with the Transaction Model and updates the Account Model.

Fund Transfer: Transfer Model logs inter-account transfers and reflects changes in the Transaction Model.

Payments: Payment Model records payments and updates the Transaction Model.

Loan Management: Loan Model tracks loan statuses, with repayments logged as transactions.

Monitoring and Logs: Audit Log Model tracks critical actions performed by users or admins.