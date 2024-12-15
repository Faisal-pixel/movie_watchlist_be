# QUESTION:
so i forgot to set not null for some of my columns when i created the table, is there a way to update it

# ANSWER:
Yes, you can update your table to add the `NOT NULL` constraint to columns that were previously created without it. You can use the `ALTER TABLE` statement to modify the columns. Here's how you can do it:

### **Syntax**
```sql
ALTER TABLE table_name
ALTER COLUMN column_name SET NOT NULL;
```

### **Example**
Assuming you have the `movies` table and you want to set `description` and `release_date` to `NOT NULL`, here's the SQL:

```sql
ALTER TABLE movies
ALTER COLUMN description SET NOT NULL;

ALTER TABLE movies
ALTER COLUMN release_date SET NOT NULL;
```

You would repeat this for any column that should have the `NOT NULL` constraint.

### **Important Consideration**
- **Existing Null Values**: If any of the columns already have `NULL` values in some rows, the `ALTER TABLE` statement will fail. You would need to first update those rows to have non-null values or remove them before adding the `NOT NULL` constraint.

For example, if you want to set a default value to fill the existing `NULL` values, you can do it like this before adding `NOT NULL`:

```sql
UPDATE movies
SET description = 'Default Description'
WHERE description IS NULL;

UPDATE movies
SET release_date = '1900-01-01'
WHERE release_date IS NULL;
```

Then, you can add the `NOT NULL` constraint.


# QUESTION:
How do i change the name of a column in a table?

# ANSWER:

### **Rename a Column**

To rename a column, use the following syntax:

```sql
ALTER TABLE table_name
RENAME COLUMN old_column_name TO new_column_name;
```

### **Example:**
If you have a `users` table and want to rename the column `email_address` to `email`, you would use:

```sql
ALTER TABLE users
RENAME COLUMN email_address TO email;
```

This will rename the column without affecting the data in that column or the structure of the table.

---

### **Important Notes:**
- **No Data Loss**: Renaming a column won't delete or modify the data in the column.
- **Constraints & References**: If there are any foreign key references or indexes on the renamed column, those will still function, but it's always a good idea to double-check any related constraints or queries after renaming.

Let me know if you'd like more details or examples!


# QUESTION:
For a one to one relationship, how do you determine which table holds the foreign key

# ANSWER:

In a **one-to-one relationship**, deciding which table holds the foreign key can depend on a few factors, but generally, it comes down to the following principles:

### **1. The "Dependent" Table Holds the Foreign Key**
In most cases, the foreign key is placed in the table that represents the **dependent entity**—the one that is more likely to be optional or less essential to the core relationship.

### **2. Which Entity is "Owner" of the Relationship?**
- If one entity is the primary owner or has more importance in the relationship, the other table might hold the foreign key. This often depends on how you think about the relationship.
  
#### Example 1: **User and Contact Details (One-to-One Relationship)**

Let’s take the example of a **User** and their **Contact Details**.

- **User** is the primary entity.
- **Contact Details** are additional information, and each user can only have one set of contact details.

In this case, it’s logical for the `contact_details` table to hold the foreign key, as each set of contact details is tied to one user.

#### Schema Example:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE contact_details (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,   -- Foreign Key to users
    phone_number VARCHAR(15),
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Here, the `contact_details` table has the foreign key `user_id`, linking it to the `users` table. This makes sense because each contact detail entry is specific to one user, and the user's identity is more "essential" than the contact details.

---

#### Example 2: **User Profile and User (One-to-One Relationship)**

Let’s say you have a **User Profile** table, and you want a **one-to-one** relationship between a **User** and their **Profile**.

- **User** is likely to be the "primary" table, and the **Profile** is dependent on the user.

Here, it’s common to place the foreign key in the `user_profile` table, as the profile is tied to one user.

#### Schema Example:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_profile (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,   -- Foreign Key to users
    bio TEXT,
    profile_picture VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### **3. When to Place the Foreign Key in the "Other" Table**
In some cases, the table holding the foreign key might depend on factors like:

- **Optionality**: If one side of the relationship is optional, the foreign key is often placed in the table where the relationship is optional. For example, if a **Profile** can exist without a user (for some reason), the `user_id` foreign key would be placed in the `users` table.
  
- **Data Integrity**: Sometimes, if one table depends heavily on another and should not exist without it, the foreign key might be placed in the "dependent" table to ensure data integrity.

---

### **4. Summary of Deciding Which Table Holds the Foreign Key**
- The **dependent** table usually holds the foreign key.
- The table that is more **independent** (e.g., a `users` table) may not hold the foreign key, while the dependent table (e.g., `contact_details`, `user_profile`) does.
- You should also consider how you model the data logically in your system and what makes sense in terms of **data flow** and **data integrity**.

If you have specific use cases you'd like to dive into, let me know and I can provide more tailored examples!



# QUESTION:
What is Middleware in Next.js

# ANSWER:
Basically middlewares are checkpoints in the road of the user request to the server that hosts the pages. It basically intercepts the request
and allows use as developers to work on it. Middleware can:
1. Inspect the request (e.g., see if the user is logged in).
2. Modify the request (e.g., add or change information).
3. Redirect the user (e.g., send them to the login page if they aren’t allowed to access a route).

Middleware is used when you need to make decisions based on the request before the user gets to the page. For example:
<ul>
<li>Protecting routes: Only allow logged-in users to see certain pages.</li>
<li>Redirecting guests: Send users to the dashboard if they try to visit the login page but are already logged in.</li>
<li>Adding headers: Modify the request for security or debugging.</li>
<ul>

Why Use Middleware?
You use middleware to ensure your app behaves correctly and securely for every user:

<ul>
<li>Protect private pages (like /dashboard).</li>
<li>Improve user experience (e.g., auto-redirect logged-in users away from the login page).</li>
<li>Handle authentication in one place, instead of repeating code in every page.</li>
<ul>


# QUESTION:
Where do I get jwtSecret and jwtExpiresIn Values?

# ANSWER:
1. jwtSecret: This is a secret key used to digitally sign the JWT. It ensures the token is tamper-proof and can only be verified by the server that issued it.
You must define your own random, secure string as the jwtSecret. For security reasons, it’s best to store this key in an .env file (environment file) rather than hardcoding it into your code.
<strong>How to Generate a Secure Secret Key:</strong>
Using OpenSSL: You can generate a secure random string using the OpenSSL command-line tool. Run the following command in your terminal:
```bash
openssl rand -base64 32
```
This will output a random base64-encoded string that you can use as your jwtSecret. i.e D4OybH9mByRz94a+u6R7P+fqY/Nlt3pgov5Wz0HsOjY=

2. jwtExpiresIn: This is the time duration for which the JWT is valid. After this time, the token will expire and the user will need to log in again. You can set this value based on your application’s requirements. Common values are in seconds, minutes, or hours.
Common Expiration Times:
'1h' = 1 hour (often used for short-term tokens).
'24h' = 24 hours.
'7d' = 7 days (longer validity, often for refresh tokens).

# QUESTION: How to add a constraint after table creation in SQL?

# ANSWER:
If your table is already created, you can add constraints using ALTER TABLE.

Once the old constraint is removed, you can add a new one using ALTER TABLE ... ADD CONSTRAINT.

Syntax:

```sql
Copy code
ALTER TABLE table_name
ADD CONSTRAINT constraint_name constraint_type (column_name);
```

Examples:

<strong>Add NOT NULL:</strong>

```sql
ALTER TABLE users
ALTER COLUMN username SET NOT NULL;
```

<strong>Add UNIQUE:</strong>

``` sql
ALTER TABLE users
ADD CONSTRAINT unique_email UNIQUE (email);
```

Add CHECK:

```sql
ALTER TABLE users
ADD CONSTRAINT check_age CHECK (age >= 18);
```

# QUESTION: How To Remove A Costraint From A Table In SQL?

# ANSWER:

Removing a Constraint:
To remove a constraint, you need the constraint name.
You can identify and remove a specific constraint using the ALTER TABLE statement with the DROP CONSTRAINT clause.
Syntax:

```sql
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;
```
constraint_name is the name of the constraint to be removed.
You can find the constraint name by using the \d table_name command in psql or querying the pg_constraint system catalog.

Examples:

<strong>Drop a constraint:</strong>

```sql
ALTER TABLE users
DROP CONSTRAINT unique_email;
```

<strong>Drop NOT NULL:</strong>

```sql
ALTER TABLE users
ALTER COLUMN username DROP NOT NULL;
```

Constraints like NOT NULL and UNIQUE define how data is stored and validated. While they can't be directly "modified," you can always drop and recreate them with new conditions. Let me know if you need help working with specific constraints!

# QUESTION: 
What is Multer?

# ANSWER:
Multer is a middlware for nodejs. It helps handle file uploads like images, pdfs, etc through forms sent to your server. Multer works with the multipart/form-data content type, which is commonly used for forms that upload files.

The reaosn multer is used is because, files arent really sent as plain text instead  it comes in chunks of binary data. Multer makes it easy to handle this data, process the file, and save it to your desired location (your server or database).

1. To install multer:
```bash
npm install multer
```

2. Set up Multer in your project.
Multer requires basic configurations to decide:
<ul>
<li>Where to store the files</li>
<li>What to name the files</li>
<li>Which types of files to accept.</li>
</ul>
3. Use Multer in Routes:
It works as middleware in Express routes to handle file uploads.


# QUESTION: How to set up multer

# ANSWER:
Well since its a middleware we create it in the middlewares folder.

```ts
const multer = require('multer'); // Import Multer

// Define where uploaded files should go and what to name them
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 'destination' is the folder to save uploaded files
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // 'filename' determines the name of the uploaded file
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // Add a unique timestamp to avoid overwrites
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

```
<strong>cb</strong> in the code above stands for callback. It's a function that Multer calls when it's done processing the file. The first argument is an error (if any), and the second argument is the result. It is this way because it follows the <strong> Node.js convention for error-first callbacks</strong>

1. First Parameter (null):
  -  This represents the error, if there’s one.
  -  In this case, null means no errors occurred.
2. Second Parameter:
  -  This is the result of the operation.
  -  In the destination function, it’s the path where the file should be saved.
  -  In the filename function, it’s the name of the file.

Then create the route to upload files
    
```ts
    app.post('/upload', upload.single('profilePic'), (req, res) => {
    // Multer processes the file before this callback runs

    // Access the uploaded file details
    console.log(req.file);

    // Respond to the client
    res.send('File uploaded successfully!');
    });
```

Explanation of the Code:

1. upload.single('profilePic'):

   - This tells Multer to expect a single file upload with the field name profilePic.
   - profilePic matches the name attribute of the input field in your form.
2. req.file:
   - Contains details of the uploaded file, such as its name, size, type, and location.

# QUESTION: Key Multer Features to Explore

# ANSWER:
1. Multiple File Uploads: Handle multiple files by using upload.array('photos', 3) to accept up to 3 files.
```ts
app.post('/upload', upload.array('photos', 3), (req, res) => {
  // Access the uploaded files
  console.log(req.files);

  // Respond to the client
  res.send('Files uploaded successfully!');
});
```

2. File Validation: Restrict uploads to specific file types or sizes
```ts
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type'), false); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit
```

# QUESTION: How to setup Cloudinary for free cloud storage.

# ANSWER:

Cloudinary is a cloud-based image and video management service that offers storage, optimization, and delivery of media assets. It provides a free tier that allows you to store and manage a limited number of images and videos.

```ts
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures', // Folder in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed file types
  },
});

const upload = multer({ storage });

// Endpoint for uploading profile picture
app.post('/upload-profile', upload.single('profilePicture'), (req, res) => {
  res.json({ message: 'Profile picture uploaded!', fileUrl: req.file.path });
});
```
What happens here:
  -  Uploaded files are sent to Cloudinary and stored in the profile_pictures folder.
  -  The URL (e.g., https://res.cloudinary.com/<cloud-name>/image/upload/...) is returned and can be saved in your database

# QUESTION: How to add a new column to a table in SQL?

# ANSWER:
To add a new column to an existing table in SQL, you can use the ALTER TABLE statement with the ADD COLUMN clause.
```sql
ALTER TABLE table_name
ADD COLUMN column_name data_type [constraints];
```

# QUESTION: I tried to make two columns composite primary keys but with an id column also a primary key but it didn'work.

# ANSWER:

The error occurs because a table in PostgreSQL can only have one primary key constraint, and you're trying to define two (id as primary key and a composite primary key).

To fix this, remove the id column as a primary key and instead make the combination of watchlist_id and tmdb_movie_id the primary key. Here's the corrected table definition:

```sql
CREATE TABLE watchlist_movie (
    watchlist_id INTEGER REFERENCES watchlist(id),
    tmdb_movie_id INTEGER NOT NULL,
    added_at TIMESTAMP NOT NULL,
    PRIMARY KEY (watchlist_id, tmdb_movie_id)
);
```
<strong>Explanation:</strong>
1. The combination of watchlist_id and tmdb_movie_id is now the composite primary key, ensuring that a movie can only appear in a specific watchlist once
2. The id column is removed since it's redundant if you're using a composite key. Because now since we have two columns that can uniquely identify a row, we don't need an additional id column. Since they can only be the same once.

<strong>Key Takeaway:</strong>
- When using a composite primary key, you don't need a separate id column as the primary key.You can only define one primary key constraint on a table in PostgreSQL. Composite keys are a good choice when the uniqueness of a record is based on the combination of two or more columns.

# QUESTION: How do I generate the current date and time in SQL?

# ANSWER:
In SQL, you can use the CURRENT_TIMESTAMP function to generate the current date and time. This function returns the current date and time in the format YYYY-MM-DD HH:MM:SS.

Here's how you can use it to insert the current date and time into a column:

```sql
INSERT INTO table_name (column_name, created_at)
VALUES ('value', CURRENT_TIMESTAMP);
```

OR

To generate the current date and time for the added_at column, you can use the NOW() function in PostgreSQL, which returns the current timestamp.

Here's the corrected INSERT statement:

```sql
INSERT INTO watchlist_movie (watchlist_id, tmdb_movie_id, added_at)
VALUES (1, 12345, NOW());
```

If you frequently want the added_at column to default to the current timestamp, you can set a default value for the column in the table definition:

```sql
ALTER TABLE watchlist_movie 
ALTER COLUMN added_at SET DEFAULT NOW();
```
After setting this default, you can omit the added_at column in your INSERT statements, and PostgreSQL will automatically use the current timestamp:

```sql
INSERT INTO watchlist_movie (watchlist_id, tmdb_movie_id)
VALUES (1, 12345);
```

# QUESTION: How do I use WHERE clause with JOIN in SQL?

# ANSWER:
When using a JOIN in SQL, you can apply the WHERE clause to filter the rows based on conditions involving columns from the joined tables. The WHERE clause is used to specify the conditions that must be met for the rows to be included in the result set.
The correct order for a JOIN is before the WHERE clause, not after it. Here's the corrected query:

```sql
SELECT 
    wm.watchlist_id, 
    wm.tmdb_movie_id, 
    wm.added_at, 
    w.user_id, 
    w.created_at, 
    w.watchlist_name, 
    w.description
FROM 
    watchlist_movie wm
JOIN 
    watchlist w ON w.id = wm.watchlist_id
WHERE 
    w.user_id = 1;
```
<strong>Explanation:</strong>
1. JOIN Placement: The JOIN clause is placed before the WHERE clause, as required by SQL syntax.
2. Filtering with WHERE: The WHERE clause filters the rows based on the condition w.user_id = 1, ensuring that only rows where the user_id is 1 are included in the result set.
3. Table Aliases: Shortened table names with aliases (wm for watchlist_movie and w for watchlist) to make the query more concise and readable.
4. Column References: Ensure all column references are correctly qualified to avoid ambiguity (e.g., w.user_id instead of user_id).

This query retrieves all watchlist_movie rows that belong to the user with user_id = 1. The JOIN ensures that data from both the watchlist_movie and watchlist tables is combined based on the matching watchlist_id.

# QUESTION: 