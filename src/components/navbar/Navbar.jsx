"use client"

import Link from "next/link"
import classes from "./Navbar.module.css"
import { useState } from "react"
import {AiOutlineClose} from "react-icons/ai"
import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"


const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const loggedIn = false
    const { data: session } = useSession()

    const handleShowDropdown = () => setShowDropdown(prev => true)
    const handleHideDropdown = () => setShowDropdown(prev => false)

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.left}>
            <Link href="/">ShariFy</Link>
        </h2>
        <ul className={classes.right}>
            {
            session?.user
            ? (
            <div>
                <Image
                    src="/person.svg"
                    alt=""
                    width={45}
                    height={45}
                    onClick={handleShowDropdown}
                />
                {showDropdown && (
                    <div className={classes.dropdown}>
                      <AiOutlineClose className={classes.closeIcon} onClick={handleHideDropdown} />
                      <button onClick={() => {
                        signOut();
                        handleHideDropdown()
                        }} className={classes.logout}>Logout</button>
                      <Link onClick={handleHideDropdown} href="/createBlog" className={classes.create}>Create a post</Link>
                    </div>
                )}
            </div>
            )
            : (
                <>
                <button
                  onClick={() => signIn()} className={classes.login}>LogIn</button>
                <Link href="/register" className={classes.register}>Register</Link>
                </>
            )
            }
        </ul>
      </div>
    </div>
  )
}

export default Navbar
