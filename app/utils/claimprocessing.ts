type User = {
    id: number;
    balance: number;
    claims: number;
    transactions: number;
  };
  
  function distributeClaims(users: User[], sharedFund: { value: number }) {
   // let totalMoneyInSystem = users.reduce((sum, user) => sum + user.balance, sharedFund.value);
  
    // Step 1: Self-payment of claims
    users.forEach((claimant) => {
      if (claimant.claims > 0) {
        const selfPayment = Math.min(claimant.balance, claimant.claims);
        claimant.balance -= selfPayment;
        claimant.claims -= selfPayment;
        console.log(`User ${claimant.id} pays $${selfPayment.toFixed(2)} towards their own claim.`);
      }
    });
  
    // Step 2: Pay remaining claims using other users' balances
    users.forEach((claimant) => {
      if (claimant.claims > 0) {
        let toPay = claimant.claims;
  
        for (const payer of users) {
          if (payer.id !== claimant.id && payer.claims === 0 && payer.balance > 0) {
            while (toPay > 0 && payer.balance > 0) {
              const payment = Math.min(payer.balance, toPay);
              payer.balance -= payment;
              toPay -= payment;
              claimant.claims -= payment;
              payer.transactions++;
              console.log(`User ${payer.id} pays $${payment.toFixed(2)} to User ${claimant.id}.`);
  
              if (payer.transactions === 2) break;
            }
          }
          if (toPay <= 0) break;
        }
      }
    });
  
    // Step 3: Cover remaining claims using the shared fund
users.forEach((claimant) => {
    if (claimant.claims > 0) {
      let remainingClaim = claimant.claims;
  
      if (remainingClaim > 0 && sharedFund.value > 0) {
        if (sharedFund.value < remainingClaim) {
          // If using the shared fund would deplete it, pay only 50% of the claim
          const fromFund = sharedFund.value * 0.5; // Only pay 50% of the remaining claim
          sharedFund.value -= fromFund;
          claimant.claims -= fromFund;
          remainingClaim -= fromFund;
  
          console.log(
            `Shared fund pays $${fromFund.toFixed(2)} to User ${claimant.id}.`
          );
  
          // Inform user about the remaining amount
          console.log(
            `User ${claimant.id} must pay the remaining $${remainingClaim.toFixed(
              2
            )} using their own balance.`
          );
        } else {
          // If the shared fund can cover the remaining claim
          const fromFund = Math.min(remainingClaim, sharedFund.value);
          sharedFund.value -= fromFund;
          claimant.claims -= fromFund;
          remainingClaim -= fromFund;
  
          console.log(
            `Shared fund pays $${fromFund.toFixed(2)} to User ${claimant.id}.`
          );
        }
  
        if (remainingClaim > 0) {
          console.log(
            `User ${claimant.id} still has $${remainingClaim.toFixed(
              2
            )} in unpaid claims.`
          );
        }
      }
    }
  });
  
    // Step 4: Move remaining balances to the shared fund
    users.forEach((user) => {
      if (user.balance > 0) {
        sharedFund.value += user.balance;
        console.log(`User ${user.id} sends $${user.balance.toFixed(2)} to the shared fund.`);
        user.balance = 0;
        user.transactions++;
      }
    });
  
    // Step 5: Deduct 20% operational cost at the end of the month
    const operationalCost = Math.round(sharedFund.value * 0.2 * 100) / 100;
    sharedFund.value -= operationalCost;
    console.log(`Operational cost of $${operationalCost.toFixed(2)} deducted from the shared fund.`);
  }
  
  function resetForNextMonth(users: User[]) {
    users.forEach((user) => {
      user.claims = 0;
      user.transactions = 0;
    });
  }
  
  export function simulateClaimsProcess() {
    const numUsers = 5;
    const monthlyContribution = 200.0;
    const sharedFund = { value: 1000.0 };
    const users: User[] = Array.from({ length: numUsers }, (_, i) => ({
      id: i,
      balance: 0,
      claims: 0,
      transactions: 0,
    }));
  
    const totalMonths = 30;
    for (let month = 1; month <= totalMonths; month++) {
      console.log(`\n=================================\nStart month ${month}`);
  
      // Monthly claims
      users.forEach((user) => {
        if (Math.random() < 0.5) { // 50% chance of submitting a claim
          user.claims = Math.floor(Math.random() * 300) + 200;
          console.log(`User ${user.id} submitted a claim of $${user.claims.toFixed(2)}`);
        }
        user.balance += monthlyContribution;
      });
  
      // Run the algorithm
      distributeClaims(users, sharedFund);
  
      // Print out users' balances
      console.log(`\nEnd of month ${month} summary:`);
      users.forEach((user) => {
        console.log(
          `User ${user.id}: balance = $${user.balance.toFixed(2)}, claims remaining = $${user.claims.toFixed(2)}, transactions = ${user.transactions}`
        );
      });
      console.log(`Shared fund: $${sharedFund.value.toFixed(2)}`);
  
      // Reset for the next month
      resetForNextMonth(users);
    }
  }