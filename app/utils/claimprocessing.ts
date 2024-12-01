import { fetchPendingClaims, fetchUserSubscription, fetchFundingDetails, fetchActiveUsers } from "app/utils/database"; // Add necessary imports for database queries

type User = {
    id: number;
    balance: number;
    claims: number;
    transactions: number;
  };
  
  // Distribute claims based on the logic provided
  function distributeClaims(users: User[], sharedFund: { value: number }) {
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
  
            console.log(`Shared fund pays $${fromFund.toFixed(2)} to User ${claimant.id}.`);
  
            // Inform user about the remaining amount
            console.log(`User ${claimant.id} must pay the remaining $${remainingClaim.toFixed(2)} using their own balance.`);
          } else {
            // If the shared fund can cover the remaining claim
            const fromFund = Math.min(remainingClaim, sharedFund.value);
            sharedFund.value -= fromFund;
            claimant.claims -= fromFund;
            remainingClaim -= fromFund;
  
            console.log(`Shared fund pays $${fromFund.toFixed(2)} to User ${claimant.id}.`);
          }
  
          if (remainingClaim > 0) {
            console.log(`User ${claimant.id} still has $${remainingClaim.toFixed(2)} in unpaid claims.`);
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
  
  // Reset user claims and transactions for the next month
  function resetForNextMonth(users: User[]) {
    users.forEach((user) => {
      user.claims = 0;
      user.transactions = 0;
    });
  }

export async function simulateClaimsProcess() {
  const totalMonths = 1; // For testing, we'll simulate only one month
  console.log("Starting Claims Processor Simulation...");

  for (let month = 1; month <= totalMonths; month++) {
    console.log(`\n=================================\nStart month ${month}`);

    // Fetch the pending claims list to determine users who have submitted claims
    const claimsList = await fetchPendingClaims();
    console.log(`Fetched ${claimsList.length} pending claims.`);

    const usersInClaims: User[] = [];

    // Fetch user subscription details for users in the claims list
    for (const claim of claimsList) {
        console.log(`Fetching subscription for user ID: ${claim.user_id}`);
      
        try {
          const userSubscription = await fetchUserSubscription(claim.user_id);
      
          // Check if the subscription exists and handle accordingly
          if (userSubscription.length > 0) {
            const user = {
              id: claim.user_id,
              balance: userSubscription[0].balance, // Assuming subscription data has balance
              claims: claim.claim_amount,
              transactions: 0,
            };
      
            usersInClaims.push(user);
            console.log(`Added user ${user.id} to the claims list with balance $${user.balance.toFixed(2)} and claim amount $${user.claims.toFixed(2)}.`);
          } else {
            console.log(`No subscription data found for user ID: ${claim.user_id}`);
          }
        } catch (error) {
          console.error(`Error fetching subscription for user ID: ${claim.user_id}`, error);
        }
      }

    // Fetch the active users whose subscriptions are active (whose balance can be used to pay claims)
    const activeUsers: User[] = [];
    const allUsers = await fetchActiveUsers(); // Replace with your actual function for fetching active users
    console.log(`Fetched ${allUsers.length} active users.`);

    for (const user of allUsers) {
      if (user.is_active) {
        // Check if the user is already in the claims list, to avoid duplication
        const isUserInClaims = usersInClaims.some(claimant => claimant.id === user.user_id);

        if (!isUserInClaims) { // Only add users who are not in the claims list
          activeUsers.push({
            id: user.user_id,
            balance: user.balance,
            claims: 0, // This user doesn't have claims yet, they will be used for payment
            transactions: 0,
          });
          console.log(`Added active user ${user.user_id} to pay claims with balance $${user.balance.toFixed(2)}.`);
        }
      }
    }

    // Merge the active users with those in the claims list
    const allUsersForProcessing = [...usersInClaims, ...activeUsers];
    console.log(`Total users for processing: ${allUsersForProcessing.length} (claims and active users).`);

    // Fetch the funding details (shared pool, user pool, operational cost)
    const fundingDetails = await fetchFundingDetails();
    console.log("Fetched funding details:", fundingDetails);

    const sharedFund = {
      value: fundingDetails.shared_pool,
    };
    console.log(`Shared fund: $${sharedFund.value.toFixed(2)}`);

    // Run the claims distribution logic
    console.log("Running claims distribution logic...");
    distributeClaims(allUsersForProcessing, sharedFund);

    // Print out users' balances after distribution
    console.log(`\nEnd of month ${month} summary:`);
    allUsersForProcessing.forEach((user) => {
      console.log(
        `User ${user.id}: balance = $${user.balance.toFixed(2)}, claims remaining = $${user.claims.toFixed(2)}, transactions = ${user.transactions}`
      );
    });
    console.log(`Shared fund: $${sharedFund.value.toFixed(2)}`);

    // Reset for the next month
    console.log("Resetting data for the next month...");
    resetForNextMonth(allUsersForProcessing);
  }

  console.log("Claims Processor Simulation completed.");
}