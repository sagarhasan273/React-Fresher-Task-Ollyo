/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-array-index-key */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import './App.scss';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import Checkbox from './components/Checkbox';
import keyValue from './components/GenerateKey';

const images = require.context('../public/images/', false, /\.(png|jpg|gif|jpeg|webp|svg)$/);

function App() {
  const imgs = [];
  const imageFiles = images.keys();
  imageFiles.map((imageFile) => (
    imgs.push(imageFile.replace('./', '/images/'))
  ));

  const [boxes, setBoxes] = useState(imgs);
  const [draggedBox, setDraggedBox] = useState(null);
  const [allchecked, setAllChecked] = useState([]);
  const [key, setKey] = useState('');
  const [hover, setHover] = useState(false);

  const handleDragStart = (e, box) => {
    e.dataTransfer.setData('text/plain', box);
    setDraggedBox(box);
  };

  // eslint-disable-next-line no-unused-vars
  const handleDragOver = (e, box) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetBox) => {
    e.preventDefault();

    if (draggedBox === targetBox) {
      return;
    }

    const newBoxes = [...boxes];
    const draggedIndex = newBoxes.indexOf(draggedBox);
    const targetIndex = newBoxes.indexOf(targetBox);

    newBoxes.splice(draggedIndex, 1);
    newBoxes.splice(targetIndex, 0, draggedBox);

    setBoxes(newBoxes);
    setDraggedBox(null);
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBoxes([...boxes, event.target.result]);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleChangeCheckbox = (e) => {
    if (e.target.checked) {
      setAllChecked([...allchecked, e.target.value]);
    } else {
      setAllChecked(allchecked.filter((item) => item !== e.target.value));
    }
  };
  const deleteButtonHandle = () => {
    const numberArray = allchecked.map((str) => Number(str));
    numberArray.sort((a, b) => b - a);
    const arr = [...boxes];
    for (const index of numberArray) {
      arr.splice(index, 1);
    }
    setAllChecked([]);
    setBoxes(arr);
    setKey(keyValue());
  };

  const handleAllChanges = () => {
    console.log(allchecked);
  };

  return (
    <div className="App">
      <div className="headingBar">{(allchecked.length === 0) ? 'Gallary' : (
        <div>
          <input type="checkbox" className="checkboxInput" onChange={handleAllChanges} checked />
          <label>{`${allchecked.length} Files Selected`}</label>
        </div>
      )}
        {(allchecked.length) ? (
          <button className="labelbutton" type="button" onClick={deleteButtonHandle}>Delete files</button>
        ) : ''}
      </div>
      <div className="boxes">
        {boxes.map((box, index) => (
          <div
            key={index}
            className={`box ${index === 0 ? 'first' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, box)}
            onDragOver={(e) => handleDragOver(e, box)}
            onDrop={(e) => handleDrop(e, box)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(index)}
          >
            <Checkbox
              key={`${key}${index}`}
              index={index}
              handleChange={handleChangeCheckbox}
              allchecked={allchecked}
              hover={hover}
            />

            <img src={process.env.PUBLIC_URL + box} alt="Preview" />
          </div>
        ))}
        {(boxes.length > 11) ? null : (
          <div className="addImage">
            <FontAwesomeIcon icon={faImage} style={{ color: '#000000' }} />
            <label htmlFor="file-upload" className="custom-file-button">Add Images</label>
            <input type="file" id="file-upload" className="file-input" accept="image/*" onChange={handleImageUpload} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
