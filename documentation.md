# BACKEND DEVELOPMENT

# To install typescript for the backend
1. <b>Install TypeScript and Required Packages</b>
```bash
npm install typescript ts-node @types/node --save-dev
```
- typescript: TypeScript compiler.
- ts-node: Allows you to run TypeScript files directly in development without compiling them.
- @types/node: Type definitions for Node.js.

2. <b>Initialize TypeScript Configuration</b>
```bash
npx tsc --init
```
3. <b>Update TypeScript Configuration</b>
- Open the tsconfig.json file and update the following properties:
```json
{
  "compilerOptions": {
    "target": "ES6",                           // JavaScript version to output
    "module": "commonjs",                      // Module system for Node.js
    "strict": true,                            // Enable all strict type-checking options
    "esModuleInterop": true,                   // Makes importing modules easier
    "outDir": "./dist",                        // Output directory for compiled files
    "rootDir": "./src",                        // Input directory for source files
    "resolveJsonModule": true,                 // Allow importing JSON files
    "skipLibCheck": true                       // Skip checking type definitions
  },
  "include": ["src/**/*"],                     // Include all files in the src folder
  "exclude": ["node_modules", "dist"]          // Exclude unnecessary files
}

```

# Folder Structure for the Backend
my-backend/
│
|── node-modules/         # Node.js modules
├── src/                  # Contains most of my code. Basically the source code
│   ├── index.ts          # Entry point for your backend. The starting point for the application
│   ├── routes/           # Optional folder for routes. A folder containing all the different route/endpoint.
│   ├── Config/           # Optional folder for configuration files. Stores the configuration files.
│   ├── db/               # Optional folder for database files. Database COnfiguration
│   └── middleware/       # Optional folder for middleware files. Middleware functions
|   └── utils/            # Optional folder for utility files. These will contain utility functions
│
├── tsconfig.json         # TypeScript configuration file
├── package.json          # Node.js configuration file
└── package-lock.json     # Node.js configuration file

# Installing Express for ts
```bash
npm install express @types/express
```

# Using typescript with nodemon
1. <b>Update the "main" field</b> in the package.json file. ```json"main": "src/index.ts"```
2. <b>Add a dev script in pacjage.json</b>
```json
"scripts": {
  "dev": "nodemon src/index.ts"
}
```
3. <b> Create nodemon.json and configure</b>
```json
{
    "exec": "ts-node ./src/index.ts",
    "ext": "ts,js,json",            
    "ignore": ["dist/*"],
    "watch": ["src"]
}
```
4. In the package.json file, remove "type": "module" and ensure you are using the correct setup for ES module compatibility with TypeScript.Add "module": "NodeNext" in tsconfig.json file.

## Explain the folder structure
1. config/ folder: This folder is used to store configurations like connecting to the database or setting up environment variables.
<b>Example:</b>
<ol>
<li>A file here might handle connecting to PostgreSQL or reading .env variables.</li>
</ol>

2. db/ folder: This folder is used to store database-related files. For example defining queries or models.
<b>Example:</b>
A file here could define how you add, update, or fetch data from you posgresql tables.

3. middlewares/ folder: This folder is used to store middleware functions. Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. They are like checkpoints between a request and the actual logic of the backend app. Middleware checks or modifies a request before it reaches the main code.
<b>Example:</b> An Authentication middleware to verify a JWT before letting a user access protected routes

4. routes/ folder: This folder is used to store route files. Route files contain the endpoints of your application. They tell the backend app what to do when someone visits /api/users or /api/movies, etc.
<b>Example:</b> A user.ts file here could handle requests like "Get a user by ID" or "Register a new user."

5. utils/ folder: This folder is used to store utility functions. Utility functions are functions that are used across the application. They are like helper functions that can be used in multiple places.
<b>Example:</b> A file here could contain a function that generates a random string or a function that sends an email. A file here might containt a function to hash passwords using bcrypt.

## Errors faced in the backend
1. Could not find a declaration file for module 'jsonwebtoken'. There was no type declaration for jsonwebtoken. This was fixed by installing the type declaration file for jsonwebtoken.
```bash
npm install --save-dev @types/jsonwebtoken
```

2. Could not find a declaration file for module 'bcrypt'. There was no type declaration for bcrypt. This was fixed by installing the type declaration file for bcrypt.
```bash
npm install --save-dev @types/bcrypt
```


# NOTES
### OPTIONAL PARAMETERS:
So i learnt that it is possible to make parameters optional. If i dont make them optional, ti doesnt even get to the express validator but if i do make it optional, it gets to the express validator and then i can check if the parameter is undefined or not. So i can make a parameter optional by adding a question mark after the parameter name.