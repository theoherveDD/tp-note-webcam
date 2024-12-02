import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { io } from 'socket.io-client';
import ReactWebcam from 'react-webcam';

const URL = 'http://localhost:3000';

    const socket = io(URL, {
        transport : ['websocket']
    });

const FPS = 3;
    
export function Webcam() {
    // const [imageSrc, setImageSrc] = useState();
    const [result, setResult] = useState();
    const [happyScore, setHappyScore] = useState(0);
    const [emoji, setEmoji] = useState('😊');
    const [rotate, setRotate] = useState(0);
    const [yaw, setYaw] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [distance, setDistance] = useState(0);
    const [centerX, setCenterX] = useState(0);
    const [centerY, setCenterY] = useState(0);
    const [gender, setGender] = useState();
    const [centerXRighthand, setCenterXRighthand] = useState(0);
    const [centerYRighthand, setCenterYRighthand] = useState(0);
    const [rightDisplay, setRightDisplay] = useState('none');
    const [centerYLefthand, setCenterYLefthand] = useState(0);
    const [conterXLefthand, setConterXLefthand] = useState(0);
    const [leftDisplay, setLeftDisplay] = useState('none');
    const webcamRef = useRef();

    

    useEffect(() => {
        const snap = () => {
            const imageSrc = webcamRef?.current.getScreenshot();
            // setImageSrc(imageSrc);
            return imageSrc
        }
    
        const intervalId = setInterval(async () => {
            const img = snap();
            const data = await fetch(img);
            const blob = await data.blob();
            const arraybuffer = await blob.arrayBuffer();
    
            socket.emit("image", arraybuffer);

        }, 1000 / FPS);
    
        return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
        setInterval(() => {

        socket.on("result", (data) => {
            setResult(data);
            const Emotion = data.face[0]?.emotion
            const rotation = data.face[0]?.rotation.angle.roll;
            setRotate(rotation*100);
            console.log(rotation);
            const yaww = data.face[0]?.rotation.angle.yaw;
            setYaw(yaww*100);
            console.log(yaw);
            const pitchh = data.face[0]?.rotation.angle.pitch;
            console.log(pitchh);
            setPitch(pitchh*100);
            const box = data.face[0]?.box;
            console.log(box);
            const centerX = (box[0] + box[2]) / 2;
            const centerY = (box[1] + box[3]) / 2;

            // hands 

            
            const rightHand = data.hand[0]?.box;
            if (rightHand) {
            setRightDisplay('block');
            const conterXRighthand = (rightHand[0] + rightHand[2]) / 2;
            setCenterXRighthand(conterXRighthand*2);
            const centerYRighthand = (rightHand[1] + rightHand[3]) / 2;
            setCenterYRighthand(centerYRighthand*2);
            } else {
                setRightDisplay('none');
            }
            const leftHand = data.hand[1]?.box;

            if (leftHand) {
                setLeftDisplay('block');
                const conterXLefthand = (leftHand[0] + leftHand[2]) / 2;
                setConterXLefthand(conterXLefthand*2);
                const centerYLefthand = (leftHand[1] + leftHand[3]) / 2;
                setCenterYLefthand(centerYLefthand*2);
            } else {
                setLeftDisplay('none');
            }




            const genderr = data.face[0]?.gender;
            console.log(genderr);
            if (genderr === "male") {
                setGender('👨');
            } else {
                setGender('👩');
            }



            setCenterX(centerX*1.5);
            setCenterY(centerY*1.5);

            const distancee = data.face[0]?.distance;
            console.log(distance);
            setDistance(distancee*100);
  
            console.log(rotate);
            console.log(Emotion);

            const firstEmotion = Emotion[0];

            console.log(firstEmotion);

            if (firstEmotion.emotion === 'happy') {
                setEmoji('😊');
            }
            else if (firstEmotion.emotion === 'angry') {
                setEmoji('😡');
            }
            else if (firstEmotion.emotion === 'sad') {
                setEmoji('😢');
            }
            else if (firstEmotion.emotion  === 'neutral') {
                setEmoji('😐');
            }
            else if (firstEmotion.emotion  === 'surprised') {
                setEmoji('😲');
            }
            else if  (firstEmotion.emotion  === 'disgusted') {
                setEmoji('🤢');
            }
            else if  (firstEmotion.emotion  === 'fearful') {
                setEmoji('😨');
            }
            else if (firstEmotion.emotion  === 'calm') {
                setEmoji('😌');
            }
            else if (firstEmotion.emotion  === 'confused') {
                setEmoji('😕');
            }
            else if (firstEmotion.emotion  === 'unknown') {
                setEmoji('🤔');
            }
            else {
                setEmoji('🤔');
            }
        });
    }, 1000 / FPS);
    }, []);

    return (
      <>
        <ReactWebcam ref={webcamRef} screenshotFormat='image/jpeg'/>
        {/* <button onClick={snap}>Capture photo</button> */}
        {/* <img src={imageSrc}/> */}
        <div style={{position: 'absolute', width: '100vw', height: '100vh', top: '0', left: '0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{position: 'relative', width: '640px', height: '480px'}}>
        <p style={{ color: 'white', fontWeight: '800', fontSize: `200px`, marginTop: '-5rem', transform: `rotate(${rotate}deg) rotateY(${yaw}deg) rotateX(${pitch}deg)`, position: 'absolute', left: `${centerX}px`, top: `${centerY}px`, marginLeft: '-100px', marginTop: '-200px'}}>{emoji}</p>
        {/* Right hand  */}
        <p style={{display: `${rightDisplay}`, color: 'white', fontWeight: '800', fontSize: `100px`, marginTop: '-5rem', position: 'absolute', left: `${centerXRighthand}px`, top: `${centerYRighthand}px`, marginLeft: '-100px', marginTop: '-200px'}}>✋</p>

        {/* Left hand */}
        <p style={{ display: `${leftDisplay}`,color: 'white', fontWeight: '800', fontSize: `100px`, marginTop: '-5rem', position: 'absolute', left: `${conterXLefthand}px`, top: `${centerYLefthand}px`, transform:'rotateY(180deg)', marginLeft: '-100px', marginTop: '-200px'}}>✋</p>
        </div>
        </div>
        <p>Genre: {gender}</p>
      </>
    );
}