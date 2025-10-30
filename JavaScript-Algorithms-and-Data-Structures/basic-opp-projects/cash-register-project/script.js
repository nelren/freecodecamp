let price = 19.50;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const purchaseBtn = document.getElementById('purchase-btn');
const changeDue = document.getElementById('change-due');
const cash = document.getElementById('cash');

const calculateChange = (price, cash, cid) => {
    const currencyUnit = [
        ['PENNY', 0.01],
        ['NICKEL', 0.05],
        ['DIME', 0.1],
        ['QUARTER', 0.25],
        ['ONE', 1],
        ['FIVE', 5],
        ['TEN', 10],
        ['TWENTY', 20],
        ['ONE HUNDRED', 100]
    ];

    let change = cash - price;
    let totalCID = 0;
    
    // Calculate total cash in drawer
    for (let i = 0; i < cid.length; i++) {
        totalCID += cid[i][1];
    }
    totalCID = Math.round(totalCID * 100) / 100;

    // If change needed is greater than total cash in drawer
    if (change > totalCID) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    // If change needed equals total cash in drawer
    if (change === totalCID) {
        return { status: "CLOSED", change: cid.filter(item => item[1] > 0).reverse() };
    }

    // Calculate change to give
    let changeArray = [];
    for (let i = currencyUnit.length - 1; i >= 0; i--) {
        const currencyName = currencyUnit[i][0];
        const currencyValue = currencyUnit[i][1];
        console.log(currencyName, currencyValue);
        let currencyAmount = 0;
        
        // Find how much of this currency we have in drawer
        console.log("Searching for:", currencyName);
        for (let j = 0; j < cid.length; j++) {
            console.log('CID:', cid[j][0]);
            if (cid[j][0] === currencyName) {
                console.log('Found:', currencyName);
                currencyAmount = cid[j][1];
                console.log('currencyAmount:', currencyAmount);
                break;
            }
        }
        
        let currencyCount = 0;
        console.log('change:', change, 'currencyValue:', currencyValue, 'currencyAmount:', currencyAmount);
        while (change >= currencyValue && currencyAmount >= currencyValue) {
            change -= currencyValue;
            currencyAmount -= currencyValue;
            currencyCount += currencyValue;
            console.log('change after deduction:', change, 'currencyCount:', currencyCount, 'currencyAmount left:', currencyAmount);
            change = Math.round(change * 100) / 100;
        }
        
        if (currencyCount > 0) {
            changeArray.push([currencyName, currencyCount]);
            console.log('currencyCount added to changeArray:', currencyCount);
        }
    }

    // If we couldn't make exact change
    if (change > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    return { status: "OPEN", change: changeArray };
}

purchaseBtn.addEventListener('click', () => {
    const cashValue = parseFloat(cash.value);
    
    if (cashValue < price) {
        alert("Customer does not have enough money to purchase the item.");
    } else if (price === cashValue) {
        changeDue.textContent = "No change due - customer paid with exact cash";
    } else {
        const result = calculateChange(price, cashValue, cid);
        
        if (result.status === "INSUFFICIENT_FUNDS") {
            changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
        } else if (result.status === "CLOSED") {
            changeDue.textContent = "Status: CLOSED " + result.change.map(item => `${item[0]}: $${item[1]}`).join(" ");
        } else {
            changeDue.textContent = "Status: OPEN " + result.change.map(item => `${item[0]}: $${item[1]}`).join(" ");
        }
    }
});
