import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RichTextEditor.css"; // Custom styles for dark mode

const RichTextEditor = ({ value, onChange, theme }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headings
      [{ font: [] }], // Font styles
      [{ size: ["small", false, "large", "huge"] }], // Font sizes
      ["bold", "italic", "underline", "strike"], // Basic formatting
      [{ script: "sub" }, { script: "super" }], // Subscript / superscript
      [{ color: [] }, { background: [] }], // Font colors and highlights
      [{ list: "ordered" }, { list: "bullet" }], // Ordered & unordered lists
      [{ indent: "-1" }, { indent: "+1" }], // Indentation
      [{ align: [] }], // Text alignment
      ["blockquote", "code-block"], // Blockquote & code block
      ["link", "image", "video"], // Links, images, videos
      ["clean"], // Remove formatting
    ],
  };

  return (
    <div className={`rich-text-editor ${theme}`}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
      />
    </div>
  );
};

export default RichTextEditor;
