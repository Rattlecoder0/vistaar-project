const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/dbdump');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
    res.send('Connected Successfully');
  });
  

// API Routes
const customer = require('./models/customers');
const account = require('./models/accounts');
const transaction = require('./models/transactions');

app.get('/customers', async (req, res) => {
    try {
        const customers = await customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/transactions', async (req, res) => {
    const accountId = req.query.account_id;
    try {
      let transactions;
      if (accountId) {
        transactions = await transaction.find({ account_id: accountId });
      } else {
        transactions = await transaction.find();
      }
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.get('/accounts', async (req, res) => {
    try {
        const accounts = await account.find();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/transactions/accounts-below-5000', async (req, res) => {
    try {
        const accountIds = await transaction.find({
            'transactions.amount': { $lt: 5000 }
        }).distinct('account_id');

        res.json(accountIds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/accounts/distinct-products', async (req, res) => {
    try {
        const distinctProducts = await account.distinct('products');
        res.json(distinctProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get customers with accounts that have at least one transaction below 5000
app.get('/customer-accountId-b5k', async (req, res) => {
    try {
      // Find account IDs with at least one transaction below 5000
      const accountIds = await transaction.find({
        'transactions.amount': { $lt: 5000 }
      }).distinct('account_id');
      
      // Find customers whose accounts include the above account IDs
      const customers = await customer.find({
        accounts: { $in: accountIds }  // Customers who have any of these account IDs
      }, 'name address accounts'); 
      
      // Filter customer accounts to only include those with the specified account IDs
      const filteredCustomers = customers.map(customer => {
        const filteredAccounts = customer.accounts.filter(account => accountIds.includes(account));
        return {
          name: customer.name,
          address: customer.address,
          accounts: filteredAccounts
        };
      });
      
      res.json(filteredCustomers);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});