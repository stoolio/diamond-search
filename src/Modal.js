import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ showModal, setShowModal, ModalContent }) {
  useEffect(() => {
    setTimeout(() => {
      document
        .querySelector(".modal-container .modal")
        ?.classList.add("active");
    }, 100);
    return () => {
      document
        .querySelector(".modal-container .modal")
        ?.classList.remove("active");
    };
  });

  return (
    <>
      {showModal &&
        createPortal(
          <div className="modal-container">
            <div className="modal active">
              {!ModalContent ? <div>Sample Content</div> : <ModalContent />}
              <span className="close-modal" onClick={() => setShowModal(false)}>
                X
              </span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
