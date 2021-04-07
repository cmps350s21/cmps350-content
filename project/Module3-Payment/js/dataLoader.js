
//Payment Structure: https://www.mesqatar.org/admission/fee-structure

const initData = async () => {
    let users = await fetchData('./data/users.json');
    let busService = await fetchData('./data/busService.json');
    let payment_bill = await fetchData('./data/payment_bill.json');
    let payments = await fetchData('./data/payments.json');

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('payments', JSON.stringify(payments));
    localStorage.setItem('bus', JSON.stringify(busService));
    localStorage.setItem('payment_bill', JSON.stringify(payment_bill));
};

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

export default initData;