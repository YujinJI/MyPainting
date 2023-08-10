import React, {useState} from 'react';
import Modal from "react-modal";
import yesIcon from "../images/yes.png";
import noIcon from "../images/no.png";


function LazyModal({showModal, setShowModal, imageSrc}) {
  const [difficulty, setDifficulty] = useState(1);

  const closeModal = () => {
    setShowModal(false);
  }

  const onRadioChangeHandler = (e) => {
    setDifficulty(Number(e.target.value));
  }

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
    >
      <div id="preview">
        {imageSrc &&
          <div>
            <img src={imageSrc} alt="preview-img" className="preview-img"/>
          </div>
        }
        {imageSrc &&
          <div className="preview-submit">
            <p>이 사진으로</p>
            <p>도안 보러가기</p>
            <div className="answer-icon-wrap">
              <button
                type="submit"
                // onClick={uploadFileHandler}
                className="preview-button"
              >
                <img src={yesIcon}/>
              </button>
              <button
                type="submit"
                className="preview-button"
              >
                <img src={noIcon}/>
              </button>
            </div>
            <div className="difficulty-wrap" onChange={onRadioChangeHandler}>
              <input id="difficulty-1" type="radio" name="쉬움" value={1} checked={difficulty === 1}/>
              <label for="difficulty-1">쉬움</label>
              <input id="difficulty-2" type="radio" name="보통" value={2} checked={difficulty === 2}/>
              <label for="difficulty-2">보통</label>
              <input id="difficulty-3" type="radio" name="어려움" value={3} checked={difficulty === 3}/>
              <label for="difficulty-3">어려움</label>
            </div>
          </div>
        }
      </div>
      <button onClick={closeModal}>x</button>
    </Modal>
  );
}

export default LazyModal;