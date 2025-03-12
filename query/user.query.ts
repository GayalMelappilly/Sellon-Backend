// signup User Query
export const signUpUserQuery = `
        INSERT INTO users (first_name, last_name, email, password, phone_number, address, role, avatar, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
`

// Login user query
export const loginUserQuery = `
    SELECT * FROM users
    WHERE (email = $1 OR phone_number = $1)
`

export const getAllUsersQuery = `
    SELECT * FROM users
`

// Update user query
export const updateUserProfileQuery = `
    UPDATE users
    SET first_name = $1, last_name = $2, email = $3, address = $4, role = $5, avatar = $6
    WHERE id = $7;
`