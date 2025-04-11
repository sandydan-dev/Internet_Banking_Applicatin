# Internet Banking Application

This is a Node.js application that provides an internet banking platform for customers to manage their accounts, perform transactions, and access various banking services. The application is built using Express.js, a popular web application framework for Node.js, and utilizes various libraries and services to handle authentication, routing, and database operations.

## Features

- User registration and authentication
- Account creation and management
- Fund transfer between accounts
- Transaction history
- Email notifications for important events
- Role-based access control (Admin, Employee, Customer)

## Getting Started

To set up and run the application locally, follow these steps:

1. Clone the repository:
git clone https://github.com/your-username/internet-banking-application.git


2. Install dependencies:
npm install


4. Access the application in your browser:
http://localhost:4002



## Routes

### Account Opening

- POST `/api/v1/account_open/create_account` - Create a new account
- GET `/api/v1/account_open/get_all_accounts` - Get all account details

### Bank Account

- POST `/api/v1/bank_account/create_bank_account` - Create a new bank account
- GET `/api/v1/bank_account/get_all_active_accounts` - Get all active bank accounts
- GET `/api/v1/bank_account/get_all_pending_accounts` - Get all pending bank accounts
- GET `/api/v1/bank_account/get_all_pending_forms` - Get all pending account open forms
- PATCH `/api/v1/bank_account/freeze_account/:id` - Freeze a bank account
- PATCH `/api/v1/bank_account/defreeze_account/:id` - Defreeze a bank account
- GET `/api/v1/bank_account/get_all_freeze_accounts` - Get all frozen bank accounts

### Customer Profile

- POST `/api/v1/customer_profile/create_profile` - Create a new customer profile
- PUT `/api/v1/customer_profile/update_profile/:id` - Update a customer profile
- GET `/api/v1/customer_profile/get_all_profile` - Get all customer profiles (Admin and Employee only)
- DELETE `/api/v1/customer_profile/delete_profile/:id` - Delete a customer profile (Admin and Employee only)

### Card Transactions

- POST `/api/v1/card_transaction/activate_card/:accountNumber` - Activate a card for a specific account
- GET `/api/v1/card_transaction/card_details` - Get all card details
- PATCH `/api/v1/card_transaction/card_block` - Block a card
- GET `/api/v1/card_transaction/block/blocked` - Get all blocked cards
- POST `/api/v1/card_transaction/card_to_card` - Transfer money from one card to another
- POST `/api/v1/card_transaction/card_to_account` - Transfer money from a card to an account
- POST `/api/v1/card_transaction/account_to_card` - Transfer money from an account to a card

### Transactions

- POST `/api/v1/transaction/deposit` - Deposit money into an account
- POST `/api/v1/transaction/transfer_money` - Transfer money between accounts

## Deployment

| Platform | URL |
| --- | --- |
| Render | `https://internet-banking-application.onrender.com/` |

## Built With

| Technology | Description |
| --- | --- |
| Node.js | The runtime environment for executing JavaScript code |
| Express.js | A popular web application framework for Node.js |
| MongoDB | A NoSQL database for storing and managing data |
| bcryptjs | A library for hashing passwords |
| jsonwebtoken | A library for generating and verifying JSON Web Tokens |
| nodemailer | A library for sending emails |

## License

This project is licensed under the ISC License - see the [LICENSE](https://github.com/your-username/internet-banking-application/blob/main/LICENSE) file for details.