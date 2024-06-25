"use client";
import { DownloadCloudIcon, Loader, X } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import JsonViewer from "./json-viewer";
const ExcelOutputGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<any>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      const allowedExtensions = /(\.xlsx|\.xls)$/i;
      if (!allowedExtensions.exec(selectedFile.name)) {
        alert("Invalid File Type");
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsProcessing(true);
      await axios.post(
        "https://llmstandardization.azurewebsites.net/send/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { data } = await axios.get(
        "https://llmstandardization.azurewebsites.net/process/file"
      );
      setJsonData(data);
    } catch (error) {
      console.log(error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white rounded-md p-7">
      <h2 className="font-bold text-base antialiased">
        Upload Your Excel File
      </h2>

      <label
        htmlFor={"file"}
        className="flex relative  justify-center flex-col border-dotted border-2 px-64 py-52 border-gray-300"
      >
        {file ? (
          <div className=" w-full h-full">
            <span className="p-4 bg-zinc-400/25 rounded-md">{file.name}</span>
            <X
              className="w-5 h-5 top-2 right-2 cursor-pointer absolute text-rose-500"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            />
          </div>
        ) : (
          <>
            {" "}
            <input
              type="file"
              className="h-0 w-0"
              id="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
            <div className="text-blue-500 font-bold text-3xl flex items-center gap-1">
              Drop <DownloadCloudIcon className="w-6 h-6" />{" "}
            </div>
            <div className=" text-2xl">your excel files here</div>
          </>
        )}
      </label>

      <button
        className={`p-4 bg-blue-500 flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed rounded-md text-white font-bold`}
        disabled={isProcessing}
        onClick={(e) => handleSubmit(e)}
      >
        {isProcessing ? (
          <Loader className="w-5 h-5 text-center animate-spin duration-200 ease-in-out" />
        ) : (
          "Upload and Process"
        )}
      </button>
      {jsonData && (
        <div className="mt-3">
          Result:
          <JsonViewer json={jsonData || ""} />
        </div>
      )}
    </div>
  );
};

export default ExcelOutputGenerator;
