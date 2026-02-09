import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { cors } from 'hono/cors'
import { SyasymServer } from "syasym";
import { EpKey } from "syasym/dist/types";
import { addUser, getUser, hasUser, updateSecurity } from "./database";

const { generateChallenge, verifyChallenge, verifyRequest } = SyasymServer

const app = new Hono();
const port = 4000;
//

app.use('*', cors({
  origin: 'http://localhost:3000',
  allowHeaders: ['Origin', 'Content-Type', 'Authorization', 'x-user-id', 'x-timestamp', 'x-signature'],
  allowMethods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
  credentials: false
}))

app.get("/", (c) => {
    return c.text("Hello from the authentication server!")
});


// Register

app.post("/signup", async (c) => {
    const { name, username, pubKey, epKey } = await c.req.json();

    if(!name || !username || !pubKey || !epKey){
        c.status(409)
        return c.json({ message: "Something wrong, I can feel it!" })
    }
    if(await hasUser(username)){
        c.status(409)
        return c.json({ message: "Username already exists!" })
    }

    const user = await addUser({
        username: username as string,
        pubKey: pubKey as string,
        epKey: epKey as EpKey,
        name: name as string,
        xp: 0,
        coin: 0
    })

    if(user) return c.json({ message: "User registered successfully!" });

    return c.json({ message: "Register failed, contact an admin. " });
});


// Get Challenge before login

app.get("/get-challenge", async (c) => {
    const { username } = c.req.query();

    const user = await getUser(username as string)

    if(user){
        const challenge = generateChallenge(user.username, user.pubKey, user.epKey)
        console.log('User get challenge: '+username, user.epKey)
        
        return c.json(challenge);
    }

    c.status(404)
    return c.json({ message: "User not found!" });
})


// Login

app.post("/signin", async (c) => {
    const { username, signature, newPubKey, newEpKey } = await c.req.json();

    if(!await hasUser(username)){
        c.status(404)
        return c.json({ message: "User not found!" });
    }

    const isValid = verifyChallenge(username, signature)
        
    if(!isValid){
        c.status(401)
        return c.json({ message: "Invalid signature!" });
    }

    updateSecurity(username, newPubKey, newEpKey)

    console.log("User logged in: "+username)

    return c.json({ message: "User logged in successfully!" });
})


// Request Test

app.post("/get-user", async (c) => {
    const username = await c.req.header('x-user-id')
    if(!username){
        c.status(404)
        return c.json({ message: 'Input Username Empty' })
    }

    const user = await getUser(username)
    if(!user){
        c.status(404)
        return c.json({ message: 'User Not Found' })
    }
    
    const valid = await verifyRequest(user.pubKey, {
        body: JSON.parse(await c.req.text() || '{}'),
        headers: c.req.header(),
        method: c.req.method,
        path: c.req.path
    })

    if(valid == 0){
        c.status(401)
        return c.json({ message: 'Request Expired' })
    }
    if(valid == 1){
        c.status(401)
        return c.json({ message: 'Invalid Signature' })
    }
    
    return c.json({ message: 'Request Accepted!', user: user})
    
})

//

serve({
    fetch: app.fetch,
    port: port
}, () => {
    console.log('Listening on', port)
})