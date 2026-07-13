"use server"
import { auth } from "@/auth";
import z, { number, string } from "zod";
import { prisma } from "@/app/utilities/prisma";

const addWalletSchema = z.object({
    name: z.string().min(3,"wallet name at less 3 dgit"),
    balance: z.number(),
    currency: z.string()  
})

export type  addWalletType = {
    name: string,
    balance: number,
    currency: string 
}

export async function addWallet(data: addWalletType){
    const seestion = await auth()
    if (!seestion || !seestion.user || !seestion.user.id) {
        return {success: false, message: "unAuthorized! please sign in"}
    }    
    const validation = addWalletSchema.safeParse(data)
    if (validation.error) {
       const message =  validation.error.issues.map((issue)=> issue.message).join(" and ")
       return {success: false, message}
    }

    const wallet = {
        name: data.name,
        balance: data.balance,
        currency: data.currency,
        userId : seestion.user.id
    }

    const newWallet = await prisma.wallet.create({data:wallet})

    return {success: true, message: "wallet is added succsessfully!", newWallet}

}


export async function getMyWallet() {
    const seestion = await auth()
    if (!seestion || !seestion.user || !seestion.user.id) {
        return {success: false, message: "unAuthorized! please sign in"}
    }   

    const userId = seestion.user.id
    const wallets = await prisma.wallet.findMany({where: {userId}})
    if (wallets.length <= 0) {
        return {success: false, message: "empty, click add to create new wallet"}
    }

    return {success: true, message: "geted succsessfully!", wallets}
}

export async function getWalletById(id:string) {
    const seestion = await auth()
    if (!seestion || !seestion.user || !seestion.user.id) {
        return {success: false, message: "unAuthorized! please sign in"}
    }   

    const userId = seestion.user.id
    const wallet = await prisma.wallet.findFirst({where: {userId, id}})
    return {success: true, message: "geted succsessfully!", wallet}
}