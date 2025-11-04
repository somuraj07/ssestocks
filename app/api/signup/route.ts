import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { addAbortListener } from "events";
import { NextResponse } from "next/server";



export async function POST(request:Request){
    try {
        const body = await request.json();
        const {name , email,password,role}= body;
        if(!name || !email || !password || !role){
            return NextResponse.json({message:"all fields required"},{status:400});

        }
        const existing = await prisma.user.findUnique({where:{email}});
        if(existing){
            return NextResponse.json({message:"already user exists"},{status:400
            })
        }
        const hashed = await bcrypt.hash(password ,10);
      const user = await prisma.user.create({
        data:{
            name,
            email,
            role,
            hashedPassword:hashed,
        },
      });
      return NextResponse.json({message:"user created succesfull"})

    } catch (error) {
      console.log(error);
      return NextResponse.json({message:"Internal server error in signup"},{status:500});  
    }
}