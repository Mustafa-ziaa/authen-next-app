
// model Wallet {
//   id String @id @default(cuid())
//   name String
//   balance Float
//   currency String @default("IQD")
//   userId String @map("user_id")
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
'use client'
import { useState } from "react"
import z from "zod"
import { addWallet, addWalletType, getMyWallet } from "../actions/wallet.action"




export default function addWalletPage (){

    const [name, setName] = useState('')
    const [balance, setBalance] = useState(0)
    const [currency, setCurrency] = useState('')   

    const addWalletHundller = async () =>{
        const wallerData: addWalletType = {
            name,
            balance,
            currency
        }

       const response =  await addWallet(wallerData)
       console.log(response)
    }

    const getMyWallets = async () =>{
        const myWallets = await getMyWallet()
        console.log(myWallets)
    }
    
    
     
    return (
        <div className="w-full h-screen bg-black">
            <div className="flex justify-center items-center m-auto">
                <form action={() => addWalletHundller()}>
                <div>
                    <label htmlFor="name">Enter name</label>
                    <input type="text" id="name" name="name" 
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="balance">Enter balance</label>
                    <input type="number" id="balance" name="balance" 
                        value={balance}
                        onChange={(e)=> setBalance(Number(e.target.value))}
                    />
                </div>
                <div>
                    <select name="currency" id="currency"
                        value={currency}
                        onChange={(e)=> setCurrency(e.target.value)}
                    >
                        <option value="IQD">IQD</option>
                        <option value="USD">USD</option>
                    </select> 
                </div>
                <div>
                    <button type="submit">submit</button>   
                </div>         
            </form>
            <button onClick={()=> getMyWallets()} className="px-4 py-2 bg-blue-400 text-white rounded-lg m-auto cursor-pointer hover:bg-blue-800 transition-all duration-300">
                get my wallets
            </button>
            </div>
        </div>
    )
}