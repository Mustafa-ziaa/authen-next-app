// model Transection {
//   id String @id @default(cuid())
//   amount Float
//   descrption String?
//   type String
//   userId String @map("user_id")
//   walletId String @map("wallet_id")
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

"use server"
import { auth } from "@/auth";
import z from "zod";
import { prisma } from "@/app/utilities/prisma";

const addTransectiontSchema = z.object({
    amount: z.number(),
    descrption: z.string(),
    type: z.string()  ,
    userId: z.string()
})

export type  addTransectiontType = {
    amount: number,
    descrption: string,
    type: string  ,
    userId: string,
    walletId: string
}

export async function addTransection(data: addTransectiontType){
    try {
        const seestion = await auth()
    if (!seestion || !seestion.user || !seestion.user.id) {
        return {success: false, message: "unAuthorized! please sign in"}
    }    
    const validation = addTransectiontSchema.safeParse(data)
    if (validation.error) {
       const message =  validation.error.issues.map((issue)=> issue.message).join(" and ")
       return {success: false, message}
    }
    const userId = seestion.user.id
    const walletId = data.walletId

    const transection = {
        amount: data.amount,
        descrption: data.descrption,
        type:   data.type,
        userId: userId,
        walletId: data.walletId
    }

    const currentWallet = await prisma.wallet.findFirst({where: {userId,id:walletId}})
    if (!currentWallet || !currentWallet.balance) {
        return {success: false, message: "wallet is not exits"}
    }

    var newBalance = 0

    if (transection.type === "EXPENSE") {
        const currentAmount = currentWallet.balance;
         newBalance = Number(currentAmount) - Number(data.amount)
        if (Number(transection.amount) > Number(currentAmount)) {
            return {success: false, message:"transection invilde, wallet insufficient!"}
        }
    }else{
        const currentAmount = currentWallet.balance;
        newBalance = Number(currentAmount) + Number(data.amount);
    }

    const currentWalletUpdated = await prisma.wallet.update({
            where:{
                id: currentWallet.id,
                userId
            },
            data:{
                balance:newBalance
            }
        })

    const newTransection = await prisma.transection.create({data:transection})

    return {success: true, message: "transection succsessfully!", newTransection}
    } catch (error) {
        throw error
        return {success: false, message: "somthing went wrong!",}
    }

}


export async function getWalletTransection(walletId:string) {
    const seestion = await auth()
    if (!seestion || !seestion.user || !seestion.user.id) {
        return {success: false, message: "unAuthorized! please sign in"}
    }  
    
    if (!walletId) {
        return {success: false, message: "wallet is not exist"}
    }

    const userId = seestion.user.id
    const transections = await prisma.transection.findMany({where: {userId,walletId}})
    if (transections.length <= 0) {
        return {success: false, message: "empty, click add to create new transection"}
    }

    return {success: true, message: "geted succsessfully!", transections}
}

export async function getAllTransection() {
    const seestion = await auth()
    if (!seestion || !seestion.user || !seestion.user.id) {
        return {success: false, message: "unAuthorized! please sign in"}
    }  

    const userId = seestion.user.id
    const transections = await prisma.transection.findMany({where: {userId}})
    if (transections.length <= 0) {
        return {success: false, message: "empty, click add to create new transection"}
    }

    return {success: true, message: "geted succsessfully!", transections}
}