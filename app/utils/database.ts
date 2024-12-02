import SQLite from 'react-native-sqlite-storage';

const database_name = "MoneyMover.db";
const database_version = "1.0";
const database_displayname = "SQLite Money Mover Database";
const database_size = 200000;

// Open the database and ensure that errors are handled
const db = SQLite.openDatabase(
  {
    name: "MoneyMover.db",
    location: 'default',
  },
  () => { console.log("Database opened successfully"); },
  (error: any) => { console.error("Error opening database: ", error); }
);

// Function to create the user_info table with a Promise
export const createUserInfoTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user_info (
          user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
          first_name TEXT, 
          last_name TEXT, 
          age INTEGER, 
          address TEXT, 
          phone TEXT,
          UNIQUE(user_id)
        );`,
        [],
        () => {
          console.log("User info table created successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error creating table: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to insert user info with a Promise
export const insertUserInfo = (firstName: string, lastName: string, age: number, address: string, phone: string): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO user_info (first_name, last_name, age, address, phone) 
         VALUES (?, ?, ?, ?, ?)`,
        [firstName, lastName, age, address, phone],
        (_, result) => {
          const userId = result.insertId;
          console.log("Inserted user with user_id:", userId);
          resolve(userId);
        },
        (_, error) => {
          console.error("Error inserting user: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to fetch all user information from the user_info table
export const fetchUserInfo = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM user_info;`, // SQL query to select all data from user_info table
        [],
        (tx, results) => {
          const userInfo: any[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            userInfo.push(results.rows.item(i)); // Push each row to the userInfo array
          }

          // Log the results to the console for debugging
          console.log("User Info:", userInfo);

          // Resolve the promise with the fetched user data
          resolve(userInfo);
        },
        (_, error) => {
          console.error("Error fetching user info: ", error.message);
          reject(error); // Reject the promise in case of error
        }
      );
    });
  });
};


// Function to create the user_login table with a Promise
export const createUserLoginTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user_login (
          user_id INTEGER PRIMARY KEY,              -- Linked to user_info table
          email TEXT NOT NULL UNIQUE,               -- Email must be unique
          password TEXT NOT NULL,                   -- Store hashed passwords
          FOREIGN KEY(user_id) REFERENCES user_info(user_id) ON DELETE CASCADE
        );`,
        [],
        () => {
          console.log("User login table created successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error creating user_login table:", error.message);
          reject(error);
        }
      );
    });
  });
};
// Function to insert user login details with a Promise
export const insertUserLogin = (userId: number, email: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO user_login (user_id, email, password) VALUES (?, ?, ?);`,
        [userId, email, password],
        () => {
          console.log(`User login inserted successfully for user_id: ${userId}`);
          resolve();
        },
        (_, error) => {
          console.error(`Error inserting user login for user_id: ${userId}`, error.message);
          reject(error);
        }
      );
    });
  });
};

export const createUserSubscriptionTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      // Drop the old table if it exists
      tx.executeSql(
        `DROP TABLE IF EXISTS user_subscription;`,
        [],
        () => {
          console.log("Dropped old user_subscription table.");
          // Create the new table
          tx.executeSql(
            `CREATE TABLE user_subscription (
               id INTEGER PRIMARY KEY AUTOINCREMENT, 
               user_id INTEGER, 
               plan_name TEXT, 
               amount INTEGER, 
               balance REAL DEFAULT 0, 
               transactions INTEGER DEFAULT 0, 
               is_active BOOLEAN, 
               purchase_date DATE, 
               claim_priority INTEGER, 
               last_updated DATE DEFAULT (datetime('now', 'localtime')), 
               FOREIGN KEY(user_id) REFERENCES user_info(user_id)
             );`,
            [],
            () => {
              console.log("User subscription table created successfully");
              resolve();
            },
            (_, error) => {
              console.error("Error creating user_subscription table: ", error.message);
              reject(error);
            }
          );
        },
        (_, error) => {
          console.error("Error dropping old user_subscription table: ", error.message);
          reject(error);
        }
      );
    });
  });
};


export const insertUserSubscription = (userId: number, planName: string, amount: number, isActive: boolean, purchaseDate: string, claimPriority: number, balance: number = 0, transactions: number = 0): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    console.log("DB Initialized, hello starting transaction...");

    db.transaction(tx => {
      console.log("Transaction started for user subscription");
      tx.executeSql(
        `INSERT INTO user_subscription (user_id, plan_name, amount, is_active, purchase_date, claim_priority, balance, transactions) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [userId, planName, amount, isActive, purchaseDate, claimPriority, balance, transactions],
        (_, result) => {
          console.log("User subscription inserted successfully with result:", result);
          resolve();
        },
        (_, error) => {
          console.error("Error inserting user subscription: ", error.message);
          reject(error);
        }
      );
      console.log("SQL executed"); // Add a log after calling executeSql
    }, error => {
      console.error("Transaction failed:", error.message); // This will catch transaction-level errors
      reject(error);
    }, () => {
      console.log("Transaction completed successfully");
    });
  });
};

export const fetchUserLogin = (email: string): Promise<{ email: string; password: string } | null> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT email, password FROM user_login WHERE email = ?;`,  // Query to fetch email and password
        [email],
        (_, results) => {
          if (results.rows.length > 0) {
            // Assuming there's only one record for each email
            const user = results.rows.item(0);
            resolve({
              email: user.email,
              password: user.password, // Return both email and password
            });
          } else {
            resolve(null); // Return null if no matching user found
          }
        },
        (_, error) => {
          console.error("Error fetching user login:", error.message);
          reject(error); // Reject if there's an error during query execution
        }
      );
    });
  });
};

// Function to update a user's subscription with a Promise
export const updateUserSubscription = (userId: number, planName: string, amount: number, isActive: boolean, purchaseDate: string, claimPriority: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE user_subscription 
        SET plan_name = ?, amount = ?, is_active = ?, purchase_date = ?, claim_priority = ? 
        WHERE user_id = ?;`,
        [planName, amount, isActive, purchaseDate, claimPriority, userId],
        () => {
          console.log("User subscription updated successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error updating user subscription: ", error.message);
          reject(error);
        }
      );
    });
  });
};

export const fetchUserSubscription = (userId: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error("Database not initialized");
      reject(new Error("Database not initialized"));
      return;
    }

    console.log(`Fetching subscription data for user ID: ${userId}`);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM user_subscription WHERE user_id = ?;`,
        [userId],
        (tx, results) => {
          const userSubscription = [];
          const numRows = results.rows.length;
          console.log(`Found ${numRows} subscription(s) for user ID: ${userId}`);

          for (let i = 0; i < numRows; i++) {
            userSubscription.push(results.rows.item(i));
            console.log(`User ${userId} subscription data:`, results.rows.item(i));
          }

          if (numRows === 0) {
            console.warn(`No subscription data found for user ID: ${userId}`);
          }

          resolve(userSubscription);
        },
        (_, error) => {
          console.error("Error fetching user subscription: ", error.message);
          reject(error);
        }
      );
    });
  });
};


// Function to reset user balances at the beginning of each month with a Promise
export const resetUserBalances = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE user_subscription 
         SET balance = amount, 
             transactions = 0, 
             last_updated = datetime('now', 'localtime')
         WHERE is_active = 1;`,
        [],
        () => {
          console.log("User balances reset to monthly contribution amounts successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error resetting user balances: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to fetch all active users from the database
export const fetchActiveUsers = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT user_id, balance, is_active FROM user_subscription WHERE is_active = 1;`, // Fetch only active users
        [],
        (tx, results) => {
          const activeUsers = [];
          for (let i = 0; i < results.rows.length; i++) {
            activeUsers.push(results.rows.item(i));
          }
          resolve(activeUsers); // Resolve with the list of active users
        },
        (_, error) => {
          console.error("Error fetching active users: ", error.message);
          reject(error); // Reject if there's an error fetching active users
        }
      );
    });
  });
};


// Function to create the claims_list table with a Promise
export const createClaimsListTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS claims_list (
          claim_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          claim_amount REAL NOT NULL,
          claim_date DATE NOT NULL DEFAULT (datetime('now', 'localtime')),
          status TEXT DEFAULT 'pending', 
          priority INTEGER NOT NULL, 
          FOREIGN KEY(user_id) REFERENCES user_info(user_id)
        );`,
        [],
        () => {
          console.log("Claims list table created successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error creating claims_list table: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to insert a claim with a Promise
export const insertClaim = (userId: number, claimAmount: number, priority: number, status: string = "pending"): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO claims_list (user_id, claim_amount, priority, status, claim_date) 
        VALUES (?, ?, ?, ?, datetime('now', 'localtime'));`,
        [userId, claimAmount, priority, status],
        () => {
          console.log("Claim inserted successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error inserting claim: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to update the status of a claim with a Promise
export const updateClaimStatus = (claimId: number, status: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE claims_list SET status = ? WHERE claim_id = ?;`,
        [status, claimId],
        () => {
          console.log("Claim status updated successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error updating claim status: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to fetch pending claims with a Promise
export const fetchPendingClaims = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM claims_list WHERE status = 'pending' ORDER BY priority ASC, claim_date ASC;`,
        [],
        (tx, results) => {
          const claims = [];
          for (let i = 0; i < results.rows.length; i++) {
            claims.push(results.rows.item(i));
          }
          resolve(claims);
        },
        (_, error) => {
          console.error("Error fetching pending claims: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to fetch claims by user_id with a Promise
export const fetchClaimsByUser = (userId: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM claims_list WHERE user_id = ?;`,
        [userId],
        (tx, results) => {
          const claims = [];
          for (let i = 0; i < results.rows.length; i++) {
            claims.push(results.rows.item(i));
          }
          resolve(claims);
        },
        (_, error) => {
          console.error("Error fetching claims by user: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to create the fundings table with a Promise
export const createFundingsTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS fundings (
          fund_id INTEGER PRIMARY KEY AUTOINCREMENT,
          shared_pool REAL DEFAULT 0, 
          user_pool REAL DEFAULT 0,
          operational_cost REAL DEFAULT 0
        );`,
        [],
        () => {
          console.log("Fundings table created successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error creating fundings table: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to insert initial funding data into the fundings table
export const insertFunding = (sharedPool: number, userPool: number, operationalCost: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO fundings (shared_pool, user_pool, operational_cost) 
        VALUES (?, ?, ?);`,
        [sharedPool, userPool, operationalCost],
        () => {
          console.log("Funding data inserted successfully");
          resolve(); // Resolve the promise after successful insertion
        },
        (_, error) => {
          console.error("Error inserting funding data: ", error.message);
          reject(error); // Reject the promise in case of error
        }
      );
    });
  });
};


// Function to fetch funding details with a Promise
export const fetchFundingDetails = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM fundings WHERE fund_id = 1;`,
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            console.error("Funding details not found");
            reject(new Error("Funding details not found"));
          }
        },
        (_, error) => {
          console.error("Error fetching funding details: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to update the shared pool amount with a Promise
export const updateSharedPool = (newSharedPool: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE fundings SET shared_pool = ? WHERE fund_id = 1;`,
        [newSharedPool],
        () => {
          console.log("Shared pool updated successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error updating shared pool: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to update fundings (shared pool, user pool, operational cost) with a Promise
export const updateFundings = (sharedPool: number, userPool: number, operationalCost: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE fundings 
         SET shared_pool = ?, user_pool = ?, operational_cost = ? 
         WHERE fund_id = 1;`,
        [sharedPool, userPool, operationalCost],
        () => {
          console.log("Fundings updated successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error updating fundings: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to execute a transaction with multiple queries with a Promise
export const executeTransaction = (queries: Array<{ sql: string; args: any[] }>): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(
      (tx) => {
        for (const query of queries) {
          tx.executeSql(
            query.sql,
            query.args,
            () => console.log("Transaction query executed successfully"),
            (_, error) => {
              console.error("Error in transaction query:", error.message);
              return true; // Rollback the transaction
            }
          );
        }
      },
      (error) => {
        console.error("Transaction failed. Rolling back:", error.message);
        reject(error);
      },
      () => {
        console.log("Transaction completed successfully");
        resolve();
      }
    );
  });
};

// Function to delete a user by user_id with a Promise
export const deleteUser = (userId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM user_info WHERE user_id = ?;`,
        [userId],
        () => {
          console.log("User deleted successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error deleting user: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to delete a user's subscription details with a Promise
export const deleteSubscription = (userId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM user_subscription WHERE user_id = ?;`,
        [userId],
        () => {
          console.log("User subscription deleted successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error deleting subscription: ", error.message);
          reject(error);
        }
      );
    });
  });
};


// Function to delete a claim by claim_id with a Promise
export const deleteClaim = (claimId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM claims_list WHERE claim_id = ?;`,
        [claimId],
        () => {
          console.log("Claim deleted successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error deleting claim: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to fetch aggregate data (total contributions, pending claims, approved claims) with a Promise
export const fetchAggregateData = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          (SELECT SUM(amount) FROM user_subscription WHERE is_active = 1) AS total_contributions,
          (SELECT SUM(claim_amount) FROM claims_list WHERE status = 'pending') AS total_pending_claims,
          (SELECT SUM(claim_amount) FROM claims_list WHERE status = 'approved') AS total_approved_claims;`,
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          }
        },
        (_, error) => {
          console.error("Error fetching aggregate data: ", error.message);
          reject(error);
        }
      );
    });
  });
};


export const createTransactionsTable = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    console.log('Starting transaction...');

    db.transaction(tx => {
      // Create transactions table with necessary columns
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          from_user_id INTEGER NOT NULL,
          to_user_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          transfer_accepted BOOLEAN DEFAULT FALSE,
          incoming_payment BOOLEAN DEFAULT FALSE,
          outgoing_payment BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
        [],
        () => {
          console.log("Transactions table created successfully with all columns.");
          resolve();
        },
        (_, error) => {
          console.error("Error creating transactions table: ", error.message);
          reject(error);
        }
      );
    });
  });
};


export const insertTransaction = (
  fromUserId: number, 
  toUserId: number, 
  amount: number, 
  transferAccepted: boolean = false, 
  incomingPayment: boolean = false, 
  outgoingPayment: boolean = false
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      // Insert a new transaction record
      tx.executeSql(
        `INSERT INTO transactions (
           from_user_id, 
           to_user_id, 
           amount, 
           transfer_accepted, 
           incoming_payment, 
           outgoing_payment
         ) VALUES (?, ?, ?, ?, ?, ?)`,
        [fromUserId, toUserId, amount, transferAccepted, incomingPayment, outgoingPayment],
        () => {
          console.log("Transaction inserted successfully");
          resolve();
        },
        (_, error) => {
          console.error("Error inserting transaction: ", error.message);
          reject(error);
        }
      );
    });
  });
};

export const fetchAllTransactions = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      // Fetch all transactions from the transactions table
      tx.executeSql(
        `SELECT * FROM transactions;`,
        [],
        (_, result) => {
          const transactions = result.rows.raw(); // Fetch all rows as an array
          resolve(transactions);
        },
        (_, error) => {
          console.error("Error fetching transactions: ", error.message);
          reject(error);
        }
      );
    });
  });
};


export const fetchTransactions = (userId: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      // Fetch transactions where the user is either the claimant or the payer
      tx.executeSql(
        `SELECT * FROM transactions 
         WHERE from_user_id = ? OR to_user_id = ?`,
        [userId, userId],
        (_, result) => {
          const transactions = result.rows.raw(); // Fetch all rows as an array
          resolve(transactions);
        },
        (_, error) => {
          console.error("Error fetching transactions: ", error.message);
          reject(error);
        }
      );
    });
  });
};

// Function to initialize all database tables with a Promise
export const initializeDatabase = async (): Promise<void> => {
  try {
    await createUserInfoTable();  // Create user_info table
    await createUserLoginTable();  // Create user_login table
    await createUserSubscriptionTable();  // Create user_subscription table
    await createClaimsListTable();  // Create claims_list table
    await createFundingsTable();  // Create fundings table
    await createTransactionsTable();  // Create transactions table
    

    console.log("All tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const populateDatabaseForSimulation = async () => {
  try {
    // Insert users into the user_info table
    const user1Id = await insertUserInfo("John", "Doe", 30, "123 Main St", "555-1234");
    const user2Id = await insertUserInfo("Jane", "Smith", 28, "456 Elm St", "555-5678");
    const user3Id = await insertUserInfo("Mike", "Johnson", 35, "789 Oak St", "555-9876");
    const user4Id = await insertUserInfo("Emily", "Davis", 40, "101 Pine St", "555-4567");
    const user5Id = await insertUserInfo("Chris", "Brown", 33, "202 Birch St", "555-7890");

    console.log("Moving on to inserting logins");

    // Insert login details for each user into the user_login table
    if (user1Id) await insertUserLogin(user1Id, "john.doe@example.com", "password123");
    if (user2Id) await insertUserLogin(user2Id, "jane.smith@example.com", "securepassword");
    if (user3Id) await insertUserLogin(user3Id, "mike.johnson@example.com", "mypassword");
    if (user4Id) await insertUserLogin(user4Id, "emily.davis@example.com", "password456");
    if (user5Id) await insertUserLogin(user5Id, "chris.brown@example.com", "adminpassword");

    console.log("moving on to inserting subscriptions");

    // Insert subscriptions for each user into the user_subscription table
    if (user1Id) await insertUserSubscription(user1Id, "Basic", 200, true, "2024-01-01", 3, 200, 0);
    if (user2Id) await insertUserSubscription(user2Id, "Premium", 300, true, "2024-01-01", 2, 300, 0);
    if (user3Id) await insertUserSubscription(user3Id, "Gold", 400, true, "2024-01-01", 1, 400, 0);
    if (user4Id) await insertUserSubscription(user4Id, "Basic", 200, true, "2024-01-01", 3, 200, 0);
    if (user5Id) await insertUserSubscription(user5Id, "Premium", 300, true, "2024-01-01", 2, 300, 0);

    console.log("moving on to inserting claims");
    // Insert claims for only some users into the claims_list table (not all users)
    if (user1Id) {
      await insertClaim(user1Id, 250, 3); // John submits a $250 claim
      console.log("Claim inserted for user_id:", user1Id);
    }
    if (user2Id) {
      await insertClaim(user2Id, 300, 2); // Jane submits a $300 claim
      console.log("Claim inserted for user_id:", user2Id);
    }

    console.log("moving on to inserting funding data");
    // Insert funding data into the fundings table
    await insertFunding(1000, 0, 0); // Initial shared pool = 1000, user pool = 0, operational cost = 0
    console.log("Funding data inserted");

    console.log("Database populated for simulation.");
  } catch (error) {
    console.error("Error populating the database:", error);
  }
};

export const clearDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }

    db.transaction(tx => {
      // Clear data from all relevant tables
      tx.executeSql(
        `DELETE FROM user_info;`,
        [],
        () => {
          console.log("Deleted all user info.");
          // Reset AUTO_INCREMENT for user_info table
          tx.executeSql(`UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='user_info';`, [], () => {
            console.log("Reset AUTO_INCREMENT for user_info.");

            tx.executeSql(`DELETE FROM user_subscription;`, [], () => {
              console.log("Deleted all user subscriptions.");
              // Reset AUTO_INCREMENT for user_subscription table
              tx.executeSql(`UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='user_subscription';`, [], () => {
                console.log("Reset AUTO_INCREMENT for user_subscription.");

                tx.executeSql(`DELETE FROM claims_list;`, [], () => {
                  console.log("Deleted all claims.");
                  // Reset AUTO_INCREMENT for claims_list table
                  tx.executeSql(`UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='claims_list';`, [], () => {
                    console.log("Reset AUTO_INCREMENT for claims_list.");

                    tx.executeSql(`DELETE FROM fundings;`, [], () => {
                      console.log("Deleted all funding data.");
                      // Reset AUTO_INCREMENT for fundings table
                      tx.executeSql(`UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='fundings';`, [], () => {
                        console.log("Reset AUTO_INCREMENT for fundings.");
                        resolve(); // Resolve when all data has been deleted and counters reset
                      });
                    });
                  });
                });
              });
            });
          });
        },
        (_, error) => {
          console.error("Error clearing database: ", error.message);
          reject(error); // Reject the promise in case of error
        }
      );
    });
  });
};


export default db;

