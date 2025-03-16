export interface UserModel {
    first_name: string,
    last_name?: string,
    email: string,
    password: string,
    role: 'customer' | 'admin' | 'seller',
    address: string,
    avatar: string,
    status: 'active' | 'inactive'
}

// {
//     "first_name": "Absal",
//     "last_name": "Antu",
//     "email": "matta@gmail.com",
//     "password": "12345678",
//     "phone_number": "9188439124",
//     "role": "customer",
//     "address": "Koratty, Thrissur",
//     "avatar": "matta.png",
//     "status": "active"
// }