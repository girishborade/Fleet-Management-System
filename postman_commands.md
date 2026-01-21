# Postman / cURL Commands for Fleet Management System

You can run these commands directly in your terminal or import them into Postman.
**To import into Postman:**
1. Open Postman.
2. Click **Import** (top left).
3. Switch to the **Raw text** tab.
4. Paste the cURL command.
5. Click **Import**.

---

## 1. Airport Controller

### Get Hub by Airport Code
```bash
curl --location 'http://localhost:8080/api/v1/airport?airportCode=JFK'
```

---

## 2. Booking Controller

### Store Booking Dates
*Note: This endpoint accepts parameters via query string or form-data.*
```bash
curl --location --request POST 'http://localhost:8080/booking/storeDates?start_date=2023-11-01%2010:00&end_date=2023-11-05%2010:00&cust_id=1'
```

---

## 3. Car Controller

### Get Cars by Hub Address
```bash
curl --location 'http://localhost:8080/api/v1/cars?hubAddress=123%20Main%20St'
```

---

## 4. City Controller

### Get Cities by State ID
```bash
curl --location 'http://localhost:8080/city/1'
```

---

## 5. Customer Controller

### Add Customer
```bash
curl --location 'http://localhost:8080/addCustomer' \
--header 'Content-Type: application/json' \
--data '{
    "firstName": "John",
    "lastName": "Doe",
    "addressLine1": "123 Maple Dr",
    "addressLine2": "Apt 4B",
    "email": "johndoe@example.com",
    "city": "New York",
    "pincode": "10001",
    "phoneNumber": "555-0100",
    "mobileNumber": "555-0101",
    "creditCardType": "VISA",
    "creditCardNumber": "4111111111111111",
    "drivingLicenseNumber": "DL12345678",
    "idpNumber": "IDP987654",
    "issuedByDL": "NY DMV",
    "validThroughDL": "2028-05-20",
    "passportNumber": "A12345678",
    "passportValidThrough": "2030-01-01",
    "passportIssuedBy": "US Dept of State",
    "passportValidFrom": "2020-01-01",
    "passportIssueDate": "2020-01-01",
    "dateOfBirth": "1985-08-15"
}'
```

---

## 6. Customer Exists Controller

### Create Booking (Check Exists)
```bash
curl --location 'http://localhost:8080/createBooking' \
--header 'Content-Type: application/json' \
--data '{
    "cust_name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "555-0100",
    "bookcar": "Toyota Camry",
    "address_1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pin": "10001"
}'
```

---

## 7. Get Car Details From Booking Controller

### Get Car Details by Booking
```bash
curl --location 'http://localhost:8080/getCarByBookingDetails' \
--header 'Content-Type: application/json' \
--data '{
    "bookcar": "Toyota Camry"
}'
```

---

## 8. Hub Controller

### Get Hub by City and State
```bash
curl --location 'http://localhost:8080/api/v1/hub?stateName=New%20York&cityName=New%20York'
```

---

## 9. State Controller

### Get All States
```bash
curl --location 'http://localhost:8080/State'
```

---

## 10. Test Controller

### Home Page
```bash
curl --location 'http://localhost:8080/home'
```

### About Page
```bash
curl --location 'http://localhost:8080/about'
```

---

## 11. User Controller

### Register User
```bash
curl --location 'http://localhost:8080/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "testuser",
    "password": "password123",
    "email": "testuser@example.com"
}'
```

### Login User
```bash
curl --location 'http://localhost:8080/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "testuser",
    "password": "password123"
}'
```
