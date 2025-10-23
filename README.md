<img width="1706" height="1014" alt="Screenshot 2025-10-22 at 11 03 32 PM" src="https://github.com/user-attachments/assets/c4593c68-4581-404b-8c9b-37c9ac878b89" />

<br>

# Valor
> A decentralized data network for real-time, local price information.

**[Live Website](https://valordata.vercel.app/)** | **[Video Demo](https://www.youtube.com/watch?v=uEj-pFivktc)**

---

Valor is a Worldcoin Mini App that empowers a global community to create a transparent, real-time price ledger for everyday goods. By turning any shopper into a trusted data provider, we are building a more efficient and equitable market for everyone, from individual consumers to national governments.

## The Problem
Local economies, especially in developing nations, often run on guesswork and unequal information. This creates asymmetric markets where:

* Consumers can't be sure if they are paying a fair price.
* Small vendors struggle to price their goods competitively without losing money.
* Governments and NGOs lack the high-frequency, granular data needed to track inflation accurately and respond to economic events effectively.

## The Solution
Valor solves this by creating a decentralized data network with a simple, powerful loop:

1.  **Contribute**: Anyone with a smartphone can anonymously submit the price of an item by taking a picture.
2.  **Verify**: Using Worldcoin's Proof of Personhood, we guarantee that every submission comes from a unique human, eliminating bots and data manipulation.
3.  **Earn**: Users are rewarded with our native token, `$VAL`, for every valid data point they contribute, creating a global micro-earning platform.
4.  **Empower**: The aggregated, real-time data is made available, creating a transparent public utility that benefits everyone.

## Key Features
🌍 **Global Price Ledger**: Crowdsource a real-time database of prices for any item, anywhere.
💰 **Micro-Earning Platform**: Earn `$VAL` tokens by contributing data during your daily shopping.
🔒 **Sybil-Resistant**: Built on Worldcoin's Proof of Personhood to ensure every data point is from a unique, verified human.
📊 **Alternative Data Market**: Creates a unique, high-value dataset for public sector actors, financial institutions, and NGOs.
📈 **Real-Time Inflation Tracking**: Provides an unprecedented ground-level view of economic trends, enabling faster and more effective policy responses.

## Technology Stack
* **Frontend**: Next.js 14 (App Router)
* **Authentication**: Worldcoin IDKit & NextAuth.js for session management.
* **UI**: Mini Apps UI Kit for compliance with the World App design system.
* **Token**: `$VAL` (ERC-20 token on a low-cost L2 like Optimism). (just a demo version exists currently)
* **Backend**: Smart contracts for data validation and token distribution.

## Getting Started
This project is a World App Mini App. To run a local instance for development, follow these steps.

#### 1. Clone the Repository
```bash
git clone [https://github.com/your-repo/valor.git](https://github.com/your-repo/valor.git)
cd valor
