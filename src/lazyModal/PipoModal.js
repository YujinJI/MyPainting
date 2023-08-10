import {useEffect, useState} from "react";
import {originImage, previewImage, processedImage, processPipo, uploadFile} from "../api";
import Modal from "react-modal";
import yesIcon from "../images/yes.png";
import noIcon from "../images/no.png";
import ClipLoader from "react-spinners/ClipLoader";
import PacmanLoader from "react-spinners/PacmanLoader";
import './pipoModal.css';
import { IoCloseOutline } from "react-icons/io5";

function PipoModal({showModal, setShowModal, file}) {
  const [originBlob, setOriginBlob] = useState(null);
  const [previewBlob, setPreviewBlob] = useState(null);
  const [processedBlob, setProcessedBlob] = useState(null);
  const [pipo, setPipo] = useState(null);
  const [showingProcessed, setShowingProcessed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const customStyles = {
    content: {
      width: '80%',
      maxWidth: '1080px',
      minHeight: '720px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      paddingTop: '40px',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const modalUploadFile = () => {
    setIsLoading(true);
    uploadFile(file, retPipo => {
      setPipo(retPipo);
      getOrigin(retPipo);
      setIsLoading(false);
    }, (reason) => {
      closeAndResetModal();
      setIsLoading(false);
      console.log('파일 업로드 실패', reason);
    });
  };

  const getOrigin = (retPipo) => {
    originImage(retPipo, blob => {
      setOriginBlob(blob);
    }, () => {
      closeAndResetModal();
      console.log('등록된 오리지널 이미지를 찾을 수 없음', pipo);
    });
  };

  const getProcessed = () => {
    processedImage(pipo, blob => {
      setProcessedBlob(blob);
    }, () => {
      closeAndResetModal();
      console.log('요청한 처리된 이미지를 찾을 수 없음', pipo);
    });
    previewImage(pipo, blob => {
      setPreviewBlob(blob);
    }, () => {
      closeAndResetModal();
      console.log('요청한 처리된 이미지를 찾을 수 없음', pipo);
    });
  }

  const setDifficulty = event => {
    console.log(event);
    if (!pipo) {
      closeAndResetModal();
      console.log('pipo 가 선택되지 않음', pipo);
      return;
    }
    let newPipo = {...pipo};
    newPipo.difficulty = Number(event.target.value);
    setPipo(newPipo);
  };

  const doProcess = () => {
    setIsLoading(true);
    processPipo(pipo, newPipo => {
      setPipo(newPipo);
      setShowingProcessed(true);
      setIsLoading(false);
      getProcessed();
    }, () => {
      setIsLoading(false);
      closeAndResetModal();
      console.log("해당 오리지널로부터 진행 불가", pipo);
    });
  };

  const closeAndResetModal = () => {
    setIsLoading(false);
    setShowingProcessed(false);
    setShowModal(false);
  }

  useEffect(() => {
    modalUploadFile();
  }, [file]);

  const drawLoading = () => {
    if (isLoading)
      return (
        <div id="loading">
          <PacmanLoader
            loading={isLoading}
            color="#3ad5be"
            size={50}
            aria-label="열심히 그리는중..."
            className="loading"
          />
          <p>열심히 그리는 중...</p>
        </div>
      )
    return null;
  };

  const drawController = () => {
    if (isLoading) return null;
    return (
      <div>
        {(!showingProcessed && originBlob) &&
          <div>
            <div className="origin-wrap">
              <div id="origin">
                <img src={URL.createObjectURL(originBlob)} alt="origin-img" className="origin-img"/>
              </div>
              {drawDifficulty()}
            </div>
            <div className="preview-submit">
              <p>이 사진으로 도안 보러가기</p>
              <div className="answer-icon-wrap">
                <button type="submit" onClick={doProcess} className="preview-button">
                  <img src={yesIcon}/>
                </button>
                <button type="submit" onClick={closeAndResetModal} className="preview-button">
                  <img src={noIcon}/>
                </button>
              </div>
            </div>
          </div>
        }
        <div id="result-wrap">
          {(showingProcessed && processedBlob) &&
            <div id="processed">
              <img src={URL.createObjectURL(processedBlob)} alt="processed-img" className="processed-img"/>
              <p>도안</p>
            </div>
          }
          {(showingProcessed && previewBlob) &&
            <div id="preview">
              <img src={URL.createObjectURL(previewBlob)} alt="preview-img" className="preview-img"/>
              <p>완성본 미리보기</p>
            </div>
          }
        </div>
      </div>
    )
  };

  const drawDifficulty = () => {
    if (isLoading || !pipo || showingProcessed) return null;
    const difficulty = pipo.difficulty || (pipo.difficulty = 1);
    return (
      <div className="difficulty-wrap" onChange={setDifficulty}>
        <p>난이도 설정</p>
        <input id="difficulty-1" type="radio" name="쉬움" value={1} checked={difficulty === 1}/>
        <label htmlFor="difficulty-1">쉬움</label>
        <input id="difficulty-2" type="radio" name="보통" value={2} checked={difficulty === 2}/>
        <label htmlFor="difficulty-2">보통</label>
        <input id="difficulty-3" type="radio" name="어려움" value={3} checked={difficulty === 3}/>
        <label htmlFor="difficulty-3">어려움</label>
      </div>
    );
  }

  return (
    <Modal isOpen={showModal} onRequestClose={closeAndResetModal} style={customStyles}>
      <button onClick={closeAndResetModal} className="close-btn"><IoCloseOutline size={25}/></button>
      {drawLoading()}
      {drawController()}
    </Modal>
  );
}

export default PipoModal;