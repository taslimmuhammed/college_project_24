import React, { useState, useContext } from "react"
import { Col, Row } from "react-bootstrap";
import { Web3Storage } from "web3.storage";
import Loader from "../Components/Loader";
import { EthersContext } from "../Context/EthersContext";
import '../Styles/Create.css'

function Create() {

    const { createCase } = useContext(EthersContext)
    async function main() {
        try {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhDRmRhYjQ2NUE4QzAwRWE0ZWE5YTMzY2Y1N0NkQzdhRmUzMTllMzUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTAwNDc1MzU5NjksIm5hbWUiOiJ0ZXN0In0.H0u5Ktl7sXELTGAYxAkQRzw5uh_JHsxzJtN5mbepLhE"
            const storage = new Web3Storage({ token })
            let cid = await storage.put(Files)
            console.log(cid);
            // console.log(Files[0].name)
            // setBlocks("Hi")
            return cid;
        } catch (e) {
            alert(e)
            return null;
        }

    }


    const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";
    const inputStyle = "my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    const [Name, setName] = useState(null)
    const [Files, setFiles] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        const cid = await main()
        if (cid) {
            const count = await createCase(cid,Name)
            if (count == null) {
                alert("Sorry, faced some technichal issues please try again later")
            }
            else { alert(`Upload Succeful . Please note the Id for your case : ${count}`) }
            console.log(count)
        }
        setIsLoading(false)
    }


    return (
        <div className='gradient-bg-welcome flex w-full min-h-screen justify-center items-center'>
            <div className="container1">
                <h2>Create</h2>
                <div className="p-5  flex flex-col justify-start items-center text-left blue-glassmorphism  border-gray-400">
                    <div>
                        <div className="text-white w-full text-sm ">Type of proof required </div><br />
                        <div className="flex">
                            <div className="text-white w-full text-sm mt-3">Name of your work  </div>
                            <input placeholder="Name of your work" className={inputStyle} type="text" onChange={(e) => { setName(e.target.value) }} />
                            <div className="text-white w-full text-sm mt-3">Upload files (* including large documents, designs, musics, photos etc ) </div>
                            <input className={inputStyle} type="file" multiple onChange={(e) => { setFiles(e.target.files) }} />
                            <div className="h-[1px] w-full bg-gray-400 my-2" />
                            {isLoading
                                ? <Loader />
                                : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                    >
                                        Proceed to create
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
            )
}

export default Create 