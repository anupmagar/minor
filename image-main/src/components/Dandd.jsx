import { useState, useRef } from "react";

const Dandd = () => {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  // send files to the server
  const handleUpload = () => {
    // const formData = new FormData();
    // formData.append("Files", files);
    // console.log(formData.getAll());
    // fetch(
    //   "link", {
    //     method: "POST",
    //     body: formData
    //   }
    // )
  };

  if (files) {
    return (
      <div className="flex flex-col justify-center items-center rounded-2xl absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]  w-80 shadow-2xl h-60">
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            onClick={() => setFiles(null)}
            className="bg-blue-500 mr-5 py-2 px-4 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-500 px-4 py-2 rounded-xl "
          >
            Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center items-center rounded-2xl absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]  w-80 shadow-2xl h-60"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p>Drag and Drop Files to Upload</p>
      <p>Or</p>
      <input
        type="file"
        multiple
        onChange={(event) => setFiles(event.target.files)}
        hidden
        accept="image/png, image/jpeg"
        ref={inputRef}
      />
      <button
        onClick={() => inputRef.current.click()}
        className="bg-blue-800 text-white font-bold rounded-full px-4 py-2"
      >
        Select Files
      </button>
    </div>
  );
};

export default Dandd;
