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