import { deleteCredentials, generateChallenge, signRequest, solveChallenge } from "syasym/dist/client"
import { ActiveChallenge, EpKey } from "syasym/dist/types"

const HOSTNAME = process.env.HOSTNAME || 'http://localhost:4000'

export interface User{
    name: string
    username: string
    coin: number
    xp: number
}

export const emptyUser: User = {
    name: 'Guest',
    username: 'guest',
    coin: 0,
    xp: 0
}

export const getUsername = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('username') || localStorage.getItem('username');
  }
  return null;
};   

export async function getUserStats(username: string): Promise<User>{
    try{
        console.log(username)

        if(!username){
            return emptyUser
        }

        const headers = await signRequest('POST', '/get-user')
        if(!headers){
            deleteCredentials()
            location.reload()
            return emptyUser
        }

        const res = await fetch(HOSTNAME+'/get-user', {
            method: 'POST',
            headers: headers
        })
        const data = await res.json() as {
            message: string,
            user: User
        }

        console.log(data)
        if(data.message == 'User Not Found'){
            deleteCredentials()
            return emptyUser
        }
        else if(!data.user){
            return emptyUser
        }

        return data.user
    }
    catch(err){
        return emptyUser
    }
}

export async function signin(username: string, password: string, remember: boolean){
    try{
        const res = await fetch(HOSTNAME+'/get-challenge?username='+username)
        const data = await res.json() as {
            pubKey?: string
            epKey?: EpKey
            message?: string
        }
        console.log(data)

        if(data.pubKey && data.epKey){
            const challenge = await solveChallenge(username, data.message, data.pubKey, data.epKey, password, remember)
            if(!challenge) return { message: 'invalid password' }
            else{
                const res2 = await fetch(HOSTNAME+'/signin', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        message: data.message,
                        signature: challenge.signature,
                        newPubKey: challenge.newChallenge.pubKey,
                        newEpKey: challenge.newChallenge.epKey
                    })
                })
                const data2 = await res2.json() as { message: string }

                console.log(data2)

                return data2
            }      
        }
        else return data
    }
    catch(err){
        return { message: 'null' }
    }
}

export async function signup(username: string, name: string, password: string) {
    try{
        const challenge = await generateChallenge(username, password)
        const res = await fetch(HOSTNAME+'/signup', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                name: name,
                username: username,
                pubKey: challenge.pubKey,
                epKey: challenge.epKey
            })
        })
        const data = await res.json() as ActiveChallenge

        return data
    }
    catch(err){
        return { username: null, message: 'null' }
    }
}