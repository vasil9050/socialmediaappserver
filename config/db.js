import mysql from 'mysql2/promise'

export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password:"2sql2willy000",
    database:"social_media"
})