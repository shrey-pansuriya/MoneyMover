import SQLite from 'react-native-sqlite-storage';

const database_name = "MoneyMover.db";
const database_version = "1.0";
const database_displayname = "SQLite Money Mover Database";
const database_size = 200000;

// Open the database and ensure that errors are handled
const db = SQLite.openDatabase(
  {
    name: database_name,
    location: 'default',
  },
  () => {
    console.log("Database opened successfully");
  },
  (error: any) => {
    console.error("Error opening database: ", error);
  }
);

// Function to create the user_info table
export const createTable = () => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS user_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        first_name TEXT, 
        last_name TEXT, 
        age INTEGER, 
        address TEXT, 
        phone TEXT
      );`,
      [],
      () => { console.log("Table created successfully"); },
      (tx, error) => { 
        console.error("Error creating table: ", error.message); 
      }
    );
  });
};

// Function to insert user info into the database
export const insertUserInfo = (firstName: string, lastName: string, age: number, address: string, phone: string) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO user_info (first_name, last_name, age, address, phone) VALUES (?, ?, ?, ?, ?);`,
      [firstName, lastName, age, address, phone],
      () => {
        console.log("User info inserted successfully");
      },
      (tx, error) => {
        console.error("Error inserting user info: ", error.message);
      }
    );
  });
};

// Function to fetch user info from the database
export const fetchUserInfo = (callback: (data: any) => void) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM user_info;`,
      [],
      (tx, results) => {
        const userInfo = [];
        for (let i = 0; i < results.rows.length; i++) {
          userInfo.push(results.rows.item(i));
        }
        callback(userInfo);
      },
      (tx, error) => {
        console.error("Error fetching user info: ", error.message);
      }
    );
  });
};

export default db;
