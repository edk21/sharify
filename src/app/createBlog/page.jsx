'use client'

import { useState } from "react"
import classes from "./createBlog.module.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Loading from "@/components/loading/Loading"

const CreateBlog = () => {

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [category, setCategory] = useState("Nextjs")
  const [photo, setPhoto] = useState("")

  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!photo || !title || !category || !desc){
        toast.error("All fields are required")
        return
    }

    try {
      const imageUrl = await uploadImage()
      
      const res = await fetch("https://sharify-pi.vercel.app/api/blog", {
        headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${session?.user?.accessToken}` 
        },
        method: 'POST',
        body: JSON.stringify({title,desc,category,imageUrl,authorId: session?.user?._id})
      })

      if(!res.ok){
        throw new Error("Error occured")
      }

      const blog = await res.json()

      router.push(`/blog/${blog?._id}`)
    } catch (error) {
      console.log(error)
    }
}

  const uploadImage = async () => {
    if (!photo) return

    const formData = new FormData()

    formData.append("file", photo)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      const imageUrl = data['secure_url']

      return imageUrl
    } catch (error) {
        console.log(error)
    }
  }

  if (status === "loading") {
    return <Loading />
  }

  if (status === "unauthenticated") {
    return <p className={classes.accessDenied}>Access Denied: Not authenticated!!</p>
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Create Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 w-2/3">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
            <input
              type="text"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Title..."
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6 w-2/3">     
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your message
            </label>
            <textarea
              id="message"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your text here..."
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-6 w-2/3"> 
            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select your country</label>
            <select
              id="countries"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Nextjs">Nextjs</option>
              <option value="Reactjs">Reactjs</option>
              <option value="Javascript">Javascript</option>
              <option value="Css/Sass">Css/Sass</option>
              <option value="WebDev">WebDev</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Tips">Tips</option>
            </select>
            <label
                className="block mb-2 mt-5 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="image">
                  Upload file
            </label>
            <input
              className="block w-[300px] p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="user_avatar_help"
              id="image"
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <div
              className="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="user_avatar_help">A picture is useful to well illustrate your post
            </div>
          </div>
          <button className={classes.createBlog}>Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CreateBlog
