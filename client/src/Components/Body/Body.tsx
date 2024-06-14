import axios from "axios";
import { useEffect, useState, useContext } from "react";
import swal from "sweetalert";
import Modal from "react-modal";
import "./Body.scss";
import { MainContext } from "../Layout/Layout";

interface Items {
  id: number;
  title: string;
  image: string;
  creat_at: string;
  status: string;
}

Modal.setAppElement("#root");

export default function Body() {
  const { listPost } = useContext(MainContext);
  const [listItem, setListItem] = useState<Items[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Items | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedImage, setEditedImage] = useState<string>("");

  useEffect(() => {
    const getItem = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8200/languages");
        setListItem(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getItem();
  }, []);

  const handleBlock = async (id: number) => {
    const item = listItem.find((item) => item.id === id);
    if (!item) return;

    const newStatus = item.status === "true" ? "false" : "true";

    swal({
      title: "Are you sure?",
      text: "Do you want to change the status of this item?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willUpdate) => {
      if (willUpdate) {
        try {
          await axios.patch(`http://localhost:8200/languages/${id}`, {
            status: newStatus,
          });
          setListItem((prevItems) =>
            prevItems.map((i) =>
              i.id === id ? { ...i, status: newStatus } : i
            )
          );
          swal("Success! The status has been updated!", {
            icon: "success",
          });
        } catch (err) {
          console.log(err);
          swal("Error! The status could not be updated.", {
            icon: "error",
          });
        }
      } else {
        swal("The status remains unchanged.");
      }
    });
  };

  const handleDelete = (id: number) => {
    const find = listItem.filter((item) => item.id !== id);
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this item?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willUpdate) => {
      if (willUpdate) {
        try {
          await axios.delete(`http://localhost:8200/languages/${id}`);
          swal("Success! The item has been deleted!", {
            icon: "success",
          });
          setListItem(find);
        } catch (err) {
          console.log(err);
          swal("Error! The item could not be deleted.", {
            icon: "error",
          });
        }
      } else {
        swal("The item remains unchanged.");
      }
    });
  };

  const openModal = (item: Items) => {
    setCurrentItem(item);
    setEditedTitle(item.title);
    setEditedImage(item.image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentItem(null);
  };

  const handleEdit = async () => {
    if (!currentItem) return;

    try {
      await axios.patch(`http://localhost:8200/languages/${currentItem.id}`, {
        title: editedTitle,
        image: editedImage,
      });

      setListItem((prevItems) =>
        prevItems.map((i) =>
          i.id === currentItem.id
            ? { ...i, title: editedTitle, image: editedImage }
            : i
        )
      );

      closeModal();
      swal("Success! The item has been updated!", {
        icon: "success",
      });
    } catch (err) {
      console.log(err);
      swal("Error! The item could not be updated.", {
        icon: "error",
      });
    }
  };

  const filteredList = listItem.filter((item) =>
    item.title.toLowerCase().includes(listPost.toLowerCase())
  );

  return (
    <div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Hình ảnh</th>
                <th>Ngày viết</th>
                <th>Trạng thái</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={item.image}
                      alt=""
                    />
                  </td>
                  <td>{item.creat_at}</td>
                  <td>
                    {item.status === "false" ? (
                      <div>Đang xuất bản</div>
                    ) : (
                      <div>Ngừng xuất bản</div>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleBlock(item.id)}>
                      {item.status === "true" ? "Bỏ chặn" : "Chặn"}
                    </button>
                    <button onClick={() => openModal(item)}>Sửa</button>
                    <button onClick={() => handleDelete(item.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Item"
      >
        <h2>Edit Item</h2>
        <form>
          <label>
            Title:
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              value={editedImage}
              onChange={(e) => setEditedImage(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleEdit}>
            Save
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}
