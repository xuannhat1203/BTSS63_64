import React, { useContext, useState } from "react";
import axios from "axios";
import "./Header.css";
import { MainContext } from "../Layout/Layout";

export default function Header() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const { listPost, setListPost } = useContext(MainContext);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addNew = () => {
    openModal();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    const newItem = {
      title: name,
      image: image,
      creat_at: "12/6/2024",
      status: "false",
    };
    const getItem = async () => {
      const value = await axios.post(
        "http://localhost:8200/languages",
        newItem
      );
    };
    getItem();
    closeModal();
  };

  const getInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListPost(e.target.value);
  };

  return (
    <div className="header-container">
      <div className="header-content">
        <div className="search">
          <input
            onChange={getInputValue}
            type="text"
            placeholder="Nhập từ khóa cần tìm kiếm"
          />
          <select>
            <option value="">Lọc bài viết</option>
            <option value="">ID từ bé đến lớn</option>
            <option value="">ID từ lớn đến bé</option>
          </select>
        </div>
        <button onClick={addNew}>Thêm mới bài viết</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Modal Thêm Mới</h2>
            <div>
              <label htmlFor="name">Tên:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div>
              <label htmlFor="image">Hình ảnh:</label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={handleImageChange}
              />
            </div>
            <div>
              <label htmlFor="comment">Bình luận:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
              />
            </div>
            <button onClick={handleSubmit}>Thêm mới</button>
          </div>
        </div>
      )}
    </div>
  );
}
