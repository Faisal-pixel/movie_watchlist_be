import bcrypt from 'bcrypt';

// This function takes in a password and returns a hashed password
export const hashPasword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

// This function compares a password with a hashed password

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    // Takes in the password the user entered and the hashed password from the database
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}