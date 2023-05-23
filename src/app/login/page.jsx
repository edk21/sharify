'use client'

import { useState } from "react"
import classes from "./login.module.css"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const Login = () => {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password === "" || email === "") {
            toast.error("Please fill all the fields")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        try {
            const response = await signIn("credentials", { email, password, redirect: false })
            if (response?.error == null) {
                router.push("/")
            }else {
                toast.error("Error occured while login")
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

  return (
    <div className={classes.container}>
        <div className="flex items-center flex-col my-O mx-auto w-11/12">
            <h2 className="text-3xl text-slate-400 tracking-wide">LogIn</h2>
            <form onSubmit={handleSubmit} className="mt-8 w-3/12 p-6 border border-gray-400 rounded-lg flex flex-col items-center justify-center gap-4">
                <div className="mb-6">
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                        placeholder="name@exemple.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Your password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit
                </button>
                <h2 className="bg-transparent outline-none border-none text-center text-lg mt-7">Don&apos;t yet have an account? <br /> 
                    <Link href="/register" className="bg-transparent outline-none border-none text-center text-lg mt-7 text-gray-500 hover:text-black">
                        Register now.
                    </Link>
                </h2>
            </form>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Login
