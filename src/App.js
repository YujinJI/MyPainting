import React, {useCallback, useState} from 'react';
import './App.css';
import Dropzone from 'react-dropzone';
import Header from "./header/Header";
import { FcAddImage } from "react-icons/fc";
import yesIcon from './images/yes.png';
import noIcon from './images/no.png';
import {UserAuthSingleTone, uploadFile, processPipo, originImage, processedImage, previewImage} from './api';
import LazyModal from "./lazyModal/LazyModal";
import PipoModal from "./lazyModal/PipoModal"

function App(callback, deps) {
  const [accessToken, setAccessToken] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [userName, setUserName] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [userImageId, setUserImageId] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formData = new FormData();

  const pipo = {
    'id': userImageId,
    'difficulty': difficulty,
  }

  const onFileChangedHandler = (event) => {
    setShowModal(true);
    console.log(event[0]);
    setImageFile(event[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event[0]);
    reader.onload = () => {
      setImageSrc(reader.result);
    }
  }

  function onSuccess() {
    console.log('success');
  }

  function onError() {
    console.log('error');
  }

  const uploadFileHandler = () => {
    // uploadFile(imageFile, setUserImageId, onError);
    console.log('');
  }


  // processPipo(pipo, onSuccess, onError);

  // originImage(pipo, onSuccess, onError);



  const userUploadImage = async (event) => {
    event.preventDefault();
    formData.append("file", imageFile);
    console.log(formData);
    await fetch('http://localhost:8080/pipo/new', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + jwtToken,
      },
      body: formData,
    }).then(res => {
      return res.json();
    }).then(res => {
      console.log(res);
      setUserImageId(res['data'].id);
    });
  }

  const userSetImageProcess = async () => {
    console.log(userImageId);
    await fetch('http://localhost:8080/pipo/process', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + jwtToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'id': userImageId,
        'difficulty': 3,
      })
    }).then(res => {
      console.log(res);
    });
  }

  const process = ['preview', 'processed'];

  const userProcessedImage = async () => {
    for (const value of process) {
      await fetch(`http://localhost:8080/pipo/${value}/${userImageId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwtToken,
          'Content-Type': 'application/json',
        }
      }).then(async res => {
        console.log(res);
        let blob = await res.blob();
        console.log(blob);
        let div = document.createElement('div');
        div.classList.add(value);

        let img = document.createElement('img');
        img.classList.add(`${value}-img`);
        img.src = URL.createObjectURL(blob);

        let p = document.createElement('p');
        p.innerText = value;

        div.appendChild(img);
        div.appendChild(p);

        let result = document.getElementById('result');
        result.appendChild(div);
      })
    }
  }

  return (
    <div className="App">
      <Header />
      {/*<form action="http://localhost:8080/pipo/new" method="POST" encType="multipart/form-data">*/}
        <Dropzone
          onDrop={onFileChangedHandler}
        >
          {({getRootProps, getInputProps}) => (
            <section className="dropzone">
              <div {...getRootProps()}>
                {/*<input {...getInputProps()} accept="image/*" onChange={onFileChangedHandler}/>*/}
                <FcAddImage size="60"/>
                <p className="input-p">Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      {/*</form>*/}
      {/*<LazyModal showModal={showModal} setShowModal={setShowModal} imageSrc={imageSrc}/>*/}
      <PipoModal showModal={showModal} setShowModal={setShowModal} file={imageFile}/>
      {/*<div id="preview">*/}
      {/*  {imageSrc &&*/}
      {/*    <div>*/}
      {/*      <img src={imageSrc} alt="preview-img" className="preview-img"/>*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*  {imageSrc &&*/}
      {/*    <div className="preview-submit">*/}
      {/*      <p>이 사진으로</p>*/}
      {/*      <p>도안 보러가기</p>*/}
      {/*      <div className="answer-icon-wrap">*/}
      {/*        <button*/}
      {/*          type="submit"*/}
      {/*          // onClick={uploadFileHandler}*/}
      {/*          className="preview-button"*/}
      {/*        >*/}
      {/*          <img src={yesIcon}/>*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          type="submit"*/}
      {/*          className="preview-button"*/}
      {/*        >*/}
      {/*          <img src={noIcon}/>*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*</div>*/}
      {/*<button onClick={userSetImageProcess} id="process">process</button>*/}
      {/*<button onClick={userProcessedImage}>get processed Image</button>*/}
      <div id="result">
      </div>
    </div>
  );
}

export default App;