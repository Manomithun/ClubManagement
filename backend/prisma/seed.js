import "dotenv/config";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({});

async function main(){
    try{
        // Create a department first
        const department = await prisma.department.create({
            data: {
                name: "Computer Science"
            }
        });

        await prisma.user.create({
            data:{
                name:"Admin",
                email:"Admin@gmail.com",
                password: "$2b$10$J0YU30rR60uavhrxCoc6Fu8oJdYEXLyxQqubSSZ1fkOXA8qI8uV4u", // plain password for seed
                role: "SYSTEM_ADMIN",
                deptId: department.id
            }
        });
    }catch(err){
        console.log(err);
    }finally{
        prisma.$disconnect();
    }
}
main();