import bcrypt from "bcrypt";

const testUsers = [
    {username: "adminuser", email: "admin@example.com", passwordHash: bcrypt.hashSync("password123", 10), role: "admin"},
    {username: "manageruser", email: "manager@example.com", passwordHash: bcrypt.hashSync("password123", 10), role: "manager"},
    {username: "user_test", email: "user_test@example.com", passwordHash: bcrypt.hashSync("password123", 10), phone: "12350000000"}
]
export default testUsers