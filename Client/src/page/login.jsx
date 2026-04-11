import axios from 'axios'
import React from 'react'
import { useRef } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { useNavigate } from 'react-router-dom'


function Login() {

    const usernameRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()
    const handleLogin=async()=>{
     if(!usernameRef.current || usernameRef.current.value==""){
        return;
     }
     if(!passwordRef.current || passwordRef.current.value==""){
        return;
     }
     try{
      const response = await axios.post('http://localhost:8080/api/v1/auth/login',
        {
            "email":usernameRef.current.value,
            "password":passwordRef.current.value
        })
       
        const accessToken  = response.data.data.accessToken;
        localStorage.setItem("accessToken",accessToken)
         toast.success("Login Successfully !!")
         navigate("/")
         

     }
     catch(error){
        console.log("error",error)
        toast.error("User/Password invalid !!")

     }


    }
  return (
    <div>
        <Dialog>
  <DialogTrigger>
    <Button className="bg-[#00ffaab4] text-black}" variant="secondary">
      Share
    </Button>
  </DialogTrigger>
  <DialogContent className="flex justify-center items-center bg-[#00ffaab4] px-10">
    <DialogHeader>
      <DialogTitle>Login</DialogTitle>
      <DialogDescription>
        <Field>
          <FieldLabel>
            Email
          </FieldLabel>
          <Input ref={usernameRef} type="text" placeholder="Username" />
        </Field>
        <Field>
          <FieldLabel>
            Password
          </FieldLabel>
          <Input ref={passwordRef} type="password" placeholder="Password" />
        </Field>
        
        <Button onClick={()=>handleLogin()}>Submit</Button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
        </div>
  )
}

export default Login