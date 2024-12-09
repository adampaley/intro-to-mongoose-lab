// import
const prompt = require('prompt-sync')()
const mongoose = require("mongoose")
const Customer = require('./models/customer')
require('dotenv').config()

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// Utility functon to exit at any time
const checkQuit = (param) => {
    if (param.toLowerCase() === "quit") {
        process.exit()
    }
}

// Utility function to check for valid input
const validateInput = (name, age) => {
    if (!name || isNaN(age) || Number(age) <= 0) {
        console.log("Invalid input. Name must be entered and age should be a number greater than 0.")
        return false
    }
    return true
}

const initializeApp = () => {
    const userInterface = prompt(`Welcome to the CRM

        What would you like to do?
        
          1. Create a customer
          2. View all customers
          3. Update a customer
          4. Delete a customer
          5. quit
        
        Number of action to run:`).toLowerCase()

    console.log(`# user inputs ${userInterface}`)
    switch (userInterface) {
        case "quit":
            checkQuit(userInterface)
            break
        case "1":
            createCustomer()
            break
        case "2":
            viewAllCustomers()
            break
        case "3":
            updateCustomer()
            break
        case "4":
            deleteCustomer()
            break
        case "5":
            checkQuit("quit")
            break
        default: 
            console.log("Valid option not selected. Exiting application.")
            checkQuit("quit")
    }
}

const createCustomer = async () => {
    const name = prompt(`What is the name of the customer?`)
    const age = Number(prompt(`What is the age of the customer?`))

    if(!validateInput(name, age)) {
        return createCustomer()
    }

    console.log(`Customer Details:
        {
        name: ${name},
        age: ${age}
        }
        `)
    
    const confirm = prompt(`Verify customer data: Y/N??`).toUpperCase()
    console.log(`Confirm: ${confirm}`)

    if (confirm === "Y") {
        try {
            const createdCustomer = await Customer.create({name: name, age: age})
            console.log("Created Customer:", createdCustomer)
        } catch(err) {
            console.log(err)
        } 
    } else {
        console.log("No customer created.")
    }
    return initializeApp()
}

const viewAllCustomers = async () => {
    try { 
        const allCustomers = await Customer.find()
        console.log("All Customers:", allCustomers)
    } catch (err) {
        console.log(err)
    }
    return initializeApp()
}

const updateCustomer = async () => {
    try { 
        const allCustomers = await Customer.find()
        console.log("All customers: ", allCustomers)

        const id = prompt("Copy and paste the id of the customer you would like to update here: ")
        const customer = await Customer.findById(id)
        
        if(!customer) {
            console.log("Customer not found. Please check id and try again.")
            return updateCustomer()
        }

        const name = prompt("What is the customer's new name? ")
        const age = Number(prompt("What is the customer's age? "))

        if(!validateInput(name, age)) {
            return updateCustomer()
        }

        console.log(`Updated customer information: 
            {
            id: ${id},
            name: ${name},
            age: ${age}
            }
            `)

        const confirm = prompt(`Verify customer data: Y/N??`).toUpperCase()
        console.log(`Confirm: ${confirm}`)

        if (confirm === "Y") {
            try {
                const updatedCustomer = await Customer.findByIdAndUpdate(id, { name: name, age: age}, { new: true })
                console.log("Updated Customer: ", updatedCustomer)
                return initializeApp()
            } catch(err) {
                console.log(err)
            } 
        } else {
            console.log("No update made.")
            return updateCustomer()
        }

    } catch (err) {
        console.log(err)
    }
}

const deleteCustomer = async () => {
    try { 
        const allCustomers = await Customer.find()
        console.log("All customers: ", allCustomers)

        const id = prompt("Copy and paste the id of the customer you would like to delete here: ")
        const customer = await Customer.findById(id)
        
        if(!customer) {
            console.log("Customer not found. Please check id and try again.")
            return deleteCustomer()
        }
        console.log(`Customer information: 
            {
            id: ${customer._id},
            name: ${customer.name},
            age: ${customer.age}
            }
            `)

        const confirm = prompt(`Verify customer data: Y/N??`)
        console.log(`Confirm: ${confirm}`)

        if (confirm.toUpperCase() === "Y") {
            try {
                const deletedCustomer = await Customer.findByIdAndDelete(id)
                console.log("Deleted Customer: ", deletedCustomer)
                return initializeApp()
            } catch(err) {
                console.log(err)
            } 
        } else {
            console.log("No deletion made.")
            return deleteCustomer()
        }
        
    } catch (err) {
        console.log(err)
        return deleteCustomer()
    }
}

initializeApp()