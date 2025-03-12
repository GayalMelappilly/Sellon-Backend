export const signUpUserQuery = `
        INSERT INTO users (first_name, last_name, email, password, phone_number, address, role, avatar, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
`

export const loginUserQuery = `
    SELECT * FROM user
    WHERE (username = $1 OR email = $1 OR phone_number = $1)
    AND password = $2;
`