import { db } from "./db"

export async function getSizeById(sizeId: string) {
    const id = Number(sizeId)

    if(!id){
        return null
    }

    const size = await db.size.findUnique({
        where: {
            id
        }
    })
    
    return size
}