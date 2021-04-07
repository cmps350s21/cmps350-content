let PaymentTypes = ['Cash', 'Bank Card', 'Credit Card', 'Cheque', 'Bank Deposit'];

export function getPendingPayments() {
    let payments = [];
    if (localStorage.getItem('payments'))
        payments = JSON.parse(localStorage.getItem('payments'));
    return payments;
}

export function setPendingPayments(payments) {
    localStorage.setItem('payments', JSON.stringify(payments));
}

export function addNewPayment(paymentUpdated, type, amount) {
    let payments = [];
    if (localStorage.getItem('payments'))
        payments = JSON.parse(localStorage.getItem('payments'));
    payments.forEach((payment) => {
        if (payment.id === paymentUpdated.id) {
            payment.pending = paymentUpdated.pending;
            payment.remaining = paymentUpdated.remaining;
        }
    });
    localStorage.setItem('payments', JSON.stringify(payments));
    payments = JSON.parse(localStorage.getItem('payment_bill'));
    payments.push({
        "id": payments.length + 1,
        "payment_id": paymentUpdated.id,
        "email": paymentUpdated.parent_email,
        "category": paymentUpdated.type,
        "student": paymentUpdated.student_name,
        "amount": amount,
        "remaining": paymentUpdated.remaining,
        "type": PaymentTypes[type - 1],
        "date": new Date()
    });
    localStorage.setItem('payment_bill', JSON.stringify(payments));
}

export function getPaymentHistory() {
    let paymentHistory = [];
    if (localStorage.getItem('payment_bill'))
        paymentHistory = JSON.parse(localStorage.getItem('payment_bill'));
    return paymentHistory;
}