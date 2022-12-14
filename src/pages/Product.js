/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Reorder } from "framer-motion"
import { useEffect, useState, useContext, useLayoutEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { BsPlusCircle } from "react-icons/bs"
import useDynamicFetch from "../hooks/useDynamicFetch"
import { motion } from "framer-motion"
import addNotification from "../functions/addNotification"
import notificationContext from "../contexts/notificationContext"
import { AiFillDelete } from "react-icons/ai"

// Yup scheme for validation
const schema = yup.object().shape({
  name: yup.string().required("You have to write a name."),
  description: yup.string().required("You have to write a description."),
  price: yup
    .number()
    .required("You have to write a price.")
    .min(1, "Are you trying making us bankrupt?!"),
  weight: yup
    .number()
    .required("You have to write a weight.")
    .min(1, "Weight cannot be 0."),
  stock: yup.number().required("You have to write a stock."),
})

const Product = () => {
  let navigate = useNavigate()

  // productForm grid
  const style = css`
    grid-template-columns: 1fr 2fr 1fr;
  `

  // Importing notification context to send to addNotification function
  const { setNotification } = useContext(notificationContext)

  // Button data state
  const [buttonData, setButtonData] = useState({ isShown: false, text: "bidi" })

  const [imageArray, setImageArray] = useState([])

  // Handling all fetchParams, when changes happen, the useDynamicFetch runs
  const [fetchParams, setFetchParams] = useState({
    params: null,
    method: null,
    data: null,
  })

  // Gettings params
  const { id: param } = useParams()

  // Yup resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { price: 0, weight: 0, stock: 0 },
  })

  // // On form change
  // const watchFields = watch()

  // On param change
  useEffect(() => {
    // If on specific product
    if (param !== "add") {
      setButtonData({ text: "Submit Changes" })
      setFetchParams({
        params: `/products/${param}`,
        method: "GET",
        data: null,
      })
      // If on add product
    } else {
      // Set default images for product added
      setImageArray([
        "https://i.imgur.com/udl4HZL.jpeg",
        "https://i.imgur.com/WA4VdpF.jpg",
        "https://i.imgur.com/O7AzbV8.jpg",
      ])
      setButtonData({ text: "Add product" })
      reset({ name: "", description: "", price: 0, weight: 0, stock: 0 })
    }
  }, [param, reset])

  // On submit
  const onSubmitHandler = (data) => {
    // If on add page
    if (param === "add") {
      // Post data from form to api
      setFetchParams({
        params: "/products",
        method: "POST",
        data: { ...data, sold: 0, images: imageArray },
      })
      // If on specific product, patch data
    } else {
      setFetchParams({
        params: `/products/${param}`,
        method: "PATCH",
        data: { ...data, images: imageArray },
      })
    }
  }

  // Serving fetching (methods used: GET, POST, PATCH)
  const { fetchData, isLoading, error } = useDynamicFetch(fetchParams)

  // On fetchData change
  useEffect(() => {
    // On specific product get
    if (fetchParams.method === "GET") {
      if (error) {
        navigate("/products")
        addNotification({
          text: "Product not found - find it here, please.",
          bgColor: "#FF9898",
          setNotification,
        })
      }
      // Adding product data to form
      setValue("name", fetchData.name)
      setValue("description", fetchData.description)
      setValue("price", fetchData.price)
      setValue("weight", fetchData.weight)
      setValue("stock", fetchData.stock)
      setImageArray(fetchData.images)
      // If add new product
    } else if (fetchParams.method === "POST") {
      // Navigate client to product
      addNotification({ text: "Product added succesfully!", setNotification })
      navigate(`/product/${fetchData.id}`)
      // If patch product
    } else if (fetchParams.method === "PATCH") {
      addNotification({ text: "Product update sucessful!", setNotification })
      setButtonData({ ...buttonData, isShown: false })
    }
    // eslint-disable-next-line
  }, [fetchData, isLoading, error])

  // On imageArray change, show button (but not first render)
  useLayoutEffect(() => {
    setButtonData((prevState) => ({ ...prevState, isShown: true }))
  }, [imageArray])

  return (
    <form
      noValidate
      className="flex flex-col relative"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <h2 className="mt-[140px] mb-9 text-2xl font-medium text-primary-text">
        {param === "add"
          ? "Now adding new product..."
          : `Now editing product - ${fetchData.name} - (${fetchData.id})`}
      </h2>
      <div css={style} className="formTop grid gap-[1.5vw]">
        <div className="h-300 w-300 grid">
          {imageArray.length > 0 ? (
            <img className="w-full h-full" src={imageArray[0]} alt="Alt" />
          ) : (
            <p className="place-self-center">No images...</p>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <label htmlFor="name" className="text-primary-text mb-6">
              Name
            </label>
            <input
              {...register("name")}
              className="p-2 border w-full border-[rgba(19,19,19,0.25)] outline-none rounded-[3px] font-light focus:border-primary-placeholder placeholder:text-primary-placeholder bg-primary-input text-primary-placeholder"
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              onChange={() => setButtonData({ ...buttonData, isShown: true })}
            />
            <p className="text-[1rem] text-red-600">{errors.name?.message}</p>
          </div>
          <div>
            <label htmlFor="description" className="text-primary-text mb-6">
              Description
            </label>
            <textarea
              {...register("description")}
              className="p-2 h-[176px] overflow-auto border w-full border-[rgba(19,19,19,0.25)] outline-none rounded-[3px] font-light focus:border-primary-placeholder placeholder:text-primary-placeholder bg-primary-input text-primary-placeholder"
              type="text"
              id="description"
              name="description"
              onChange={() => setButtonData({ ...buttonData, isShown: true })}
            />
            <p className="text-[1rem] text-red-600">
              {errors.description?.message}
            </p>
          </div>
        </div>
        <div className="formMiddle flex flex-col justify-between">
          <div>
            <label htmlFor="price" className="text-primary-text mb-6">
              Price
            </label>
            <input
              {...register("price")}
              className="p-2 border w-full border-[rgba(19,19,19,0.25)] outline-none rounded-[3px] font-light focus:border-primary-placeholder placeholder:text-primary-placeholder bg-primary-input text-primary-placeholder"
              type="number"
              id="price"
              name="price"
              onChange={() => setButtonData({ ...buttonData, isShown: true })}
            />
            <p className="text-[1rem] text-red-600">{errors.price?.message}</p>
          </div>
          <div>
            <label htmlFor="weight" className="text-primary-text mb-6">
              Weight (In Grams)
            </label>
            <input
              {...register("weight")}
              className="p-2 border w-full border-[rgba(19,19,19,0.25)] outline-none rounded-[3px] font-light focus:border-primary-placeholder placeholder:text-primary-placeholder bg-primary-input text-primary-placeholder"
              type="number"
              id="weight"
              name="weight"
              onChange={() => setButtonData({ ...buttonData, isShown: true })}
            />
            <p className="text-[1rem] text-red-600">{errors.weight?.message}</p>
          </div>
          <div>
            <label htmlFor="stock" className="text-primary-text mb-6">
              Stock Amount
            </label>
            <input
              {...register("stock")}
              className="p-2 border w-full border-[rgba(19,19,19,0.25)] outline-none rounded-[3px] font-light focus:border-primary-placeholder placeholder:text-primary-placeholder bg-primary-input text-primary-placeholder"
              type="number"
              id="stock"
              name="stock"
              onChange={() => setButtonData({ ...buttonData, isShown: true })}
            />
            <p className="text-[1rem] text-red-600">{errors.stock?.message}</p>
          </div>
        </div>
      </div>
      <p className="text-primary-text mb-1 mt-8">Image control</p>
      <div className="p-5 max-w-fit border w-full border-[rgba(19,19,19,0.25)] outline-none rounded-[3px] font-light focus:border-primary-placeholder placeholder:text-primary-placeholder bg-primary-input text-primary-placeholder">
        <div className="flex justify-between gap-7">
          <p>Images ({imageArray.length}) - drag to change index</p>
          <p className="flex items-center gap-2 cursor-pointer">
            Click here to upload
            <BsPlusCircle size="20px" />
          </p>
        </div>
        <Reorder.Group
          className="flex gap-5 mt-5"
          axis="x"
          values={imageArray}
          onReorder={setImageArray}
        >
          {imageArray.map((image) => (
            <Reorder.Item key={image} value={image}>
              <div className="w-[100px] h-[100px] shadow-lg cursor-grab relative">
                <AiFillDelete
                  onClick={() =>
                    setImageArray(imageArray.filter((img) => img !== image))
                  }
                  className="absolute right-2 top-2 cursor-pointer p-1 box-content hover:scale-125 hover:text-primary-color transition-all"
                />
                <img
                  className="pointer-events-none"
                  src={image}
                  alt="Alt tag"
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
      {buttonData.isShown && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.1 },
          }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          aria-label="submit form button"
          spellCheck="false"
          className="absolute border-black right-0 bottom-0 bg-primary-color text-white px-10 py-6 font-semibold tracking-wider mt-5 focus:bg-primary-background focus:text-primary-color hover:bg-primary-background hover:text-primary-color border-2 transition-colors outline-none"
        >
          {buttonData.text}
        </motion.button>
      )}
    </form>
  )
}

export default Product
