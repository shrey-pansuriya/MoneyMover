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

export const createUserInfoTable = () => {
  if (!db) {
    console.error("Database not initialized");
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
        console.log("User info table created successfully with user_id"); 
      },
      (tx, error) => { 
        console.error("Error creating table: ", error.message); 
      }
    );
  });
};

// Ensure insertUserInfo is exported
export const insertUserInfo = (firstName: string, lastName: string, age: number, address: string, phone: string, callback: (userId: number | null) => void) => {
  if (!db) {
    console.error("Database not initialized");
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

        // Call the callback function with the userId (number)
        callback(userId);
      },
      (tx, error) => { 
        console.error("Error inserting user: ", error.message);
        
        // Pass null if there's an error (to indicate failure)
        callback(null);
      }
    );
  });
};

// Function to create the user_subscription table
export const createUserSubscriptionTable = () => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS user_subscription (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id INTEGER,
        plan_name TEXT, 
        amount INTEGER, 
        is_active BOOLEAN, 
        purchase_date DATE,
        claim_priority INTEGER,
        FOREIGN KEY(user_id) REFERENCES user_info(id)
      );`,
      [],
      () => { console.log("user_subscription Table created successfully"); },
      (tx, error) => { 
        console.error("Error creating user_subscription table: ", error.message); 
      }
    );
  });
};

// Function to insert a user's subscription details
export const insertUserSubscription = (userId: number, planName: string, amount: number, isActive: boolean, purchaseDate: string, claimPriority: number) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO user_subscription (user_id, plan_name, amount, is_active, purchase_date, claim_priority) 
      VALUES (?, ?, ?, ?, ?, ?);`,
      [userId, planName, amount, isActive, purchaseDate, claimPriority],
      () => {
        console.log("User subscription inserted successfully");
      },
      (tx, error) => {
        console.error("Error inserting user subscription: ", error.message);
      }
    );
  });
};

// Function to update a user's subscription details
export const updateUserSubscription = (userId: number, planName: string, amount: number, isActive: boolean, purchaseDate: string, claimPriority: number) => {
  if (!db) {
    console.error("Database not initialized");
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
      },
      (tx, error) => {
        console.error("Error updating user subscription: ", error.message);
      }
    );
  });
};

// Function to fetch subscription details for a user
export const fetchUserSubscription = (userId: number, callback: (data: any) => void) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM user_subscription WHERE user_id = ?;`,
      [userId],
      (tx, results) => {
        const userSubscription = [];
        for (let i = 0; i < results.rows.length; i++) {
          userSubscription.push(results.rows.item(i));
        }
        callback(userSubscription);
      },
      (tx, error) => {
        console.error("Error fetching user subscription: ", error.message);
      }
    );
  });
};

export const initializeDatabase = async () => {
  try {
    createUserInfoTable(); // These functions do not return Promises, so no need for `await`
    createUserSubscriptionTable();
    console.log("All tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default db;
