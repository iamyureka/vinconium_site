import { Pool } from 'pg'
import { LRUCache } from 'lru-cache'
import { EpKey } from 'syasym/dist/types'

interface User{
    username: string
    pubKey: string
    epKey: EpKey
    name: string
    xp: number
    coin: number
}

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING || 'http://postgres:postgres@localhost/vinconium'
})

const usersCache = new LRUCache({
    max: 2000, // Simpan maksimal 5000 user aktif di RAM
    ttl: 1000 * 60 * 60, // Key valid selama 1 jam di RAM
});

export async function getUsers(): Promise<User[] | null>{
    try{
        const res = await pool.query('SELECT * FROM users')
        return res.rows
    }
    catch(err){
        return null
    }
}

export async function hasUser(username: string): Promise<boolean> {
    if(usersCache.has(username)){
        return true
    }

    try{
        const res = await pool.query('SELECT 1 FROM users WHERE username = $1', [username])
        return res.rows[0] !== undefined
    }
    catch(err){
        return false
    }
}

export async function getUser(username: string): Promise<User | null> {
    if(usersCache.has(username)){
        return usersCache.get(username) as User
    }

    try{
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username])
        usersCache.set(username, res.rows[0])
        return res.rows[0]
    }
    catch(err){
        return null
    }
}

export async function addUser(user: User): Promise<User | null> {
    const query = 'INSERT INTO users (username, "pubKey", "epKey", name, xp, coin) values ($1, $2, $3, $4, $5, $6) RETURNING *'
    const values = [user.username, user.pubKey, JSON.stringify(user.epKey), user.name, user.xp, user.coin]
    try{
        const res = await pool.query(query, values)
        usersCache.set(user.username, res.rows[0])

        return res.rows[0]
    }
    catch(err){
        return null
    }
}

export async function updateSecurity(username: string, pubKey: string, epKey: EpKey): Promise<User | null> {
    const query = 'UPDATE users SET "pubKey" = $2, "epKey" = $3 WHERE username = $1 RETURNING *'
    const values = [username, pubKey, JSON.stringify(epKey)]
    try{
        const res = await pool.query(query, values)
        usersCache.set(username, res.rows[0])

        return res.rows[0]
    }
    catch(err){
        return null
    }
}
