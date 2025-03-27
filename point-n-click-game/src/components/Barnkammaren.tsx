import { useState, useEffect, useRef } from "react";
import { saveToStorage, loadFromStorage } from "../utils/storage";
import Inventory from "./Inventory";
import "./Barnkammaren.css";

type NurseryProps = {
  setCurrentRoom: (room: 'hall' | 'livingroom' | 'nursery' | 'nursery-part2') => void;
  setHasKeyPart2: (hasKey: boolean) => void;
  hasKeyPart2: boolean;
};

const Nursery = ({ setCurrentRoom, setHasKeyPart2, hasKeyPart2 }: NurseryProps) => {
  const [imageSrc, setImageSrc] = useState("/barnkammaren/nursery-start.jpg");
  const [trainRunning, setTrainRunning] = useState(false);
  const [sackOpened, setSackOpened] = useState(false);
  const [keyCollected, setKeyCollected] = useState(loadFromStorage("keyPart2") || false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Typa Timeout korrekt för web (inte NodeJS)
  const trainTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const [roomRect, setRoomRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (roomRef.current) {
        setRoomRect(roomRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  const trainFrames = sackOpened
    ? [
        "/barnkammaren/train-start-yes-key.jpg",
        "/barnkammaren/train-second-yes-key.jpg",
        "/barnkammaren/train-third-yes-key.jpg",
        "/barnkammaren/train-forth-yes-key.jpg",
        "/barnkammaren/train-start-yes-key.jpg"
      ]
    : [
        "/barnkammaren/train-start-no-key.jpg",
        "/barnkammaren/train-second-no-key.jpg",
        "/barnkammaren/train-third-no-key.jpg",
        "/barnkammaren/train-forth-no-key.jpg",
        "/barnkammaren/train-start-no-key.jpg"
      ];

  const playTrainAnimation = () => {
    if (trainRunning) return;

    setTrainRunning(true);
    let i = 0;

    trainTimer.current = setInterval(() => {
      setImageSrc(trainFrames[i]);
      i++;
      if (i >= trainFrames.length) {
        clearInterval(trainTimer.current!);
        setTrainRunning(false);
        setImageSrc(sackOpened ? "/barnkammaren/train-start-yes-key.jpg" : "/barnkammaren/train-start-no-key.jpg");
      }
    }, 500);
  };

  
  const handleSackClick = () => {
    setSackOpened(true);
    saveToStorage("sackOpened", true);
    setImageSrc("/barnkammaren/train-start-yes-key.jpg");
    setShowMessage(true);
    setShowNotification(false);
  };

  const handleCollectKey = () => {
    setKeyCollected(true);
    setHasKeyPart2(true);
    saveToStorage("keyPart2", true);
    setShowMessage(false);
    setShowNotification(true);
  };

  const handleBoingClick = () => {
    const audio = new Audio("/sounds/boing.mp3");
    audio.play();
  };

  const handleToRoom2 = () => {
    setCurrentRoom("nursery-part2");
  };

  return (
    <div ref={roomRef} className="nursery-container">
      <Inventory />
      {showNotification && <div className="notification">✅ Nyckeldelen har lagts till i din ficka! Nu kan vi öppna skattkistan!</div>}
      <img src={imageSrc} alt="Barnkammaren" className="nursery-image" />

      {roomRect && (
        <>
      {/* Klickbar säck */}
      {!sackOpened && (
        <div className="nursery-hotspot sack" onClick={handleSackClick}></div>
      )}

{/* Nyckeldel 2 blir synlig efter säcken välts */}
{sackOpened && !keyCollected && (
        <>
          <div className="nursery-message" onClick={() => setShowMessage(false)}>
            {showMessage && "Åh, sista delen av nyckeln!"}
          </div>
          <div className="nursery-hotspot sack-key"
          style={{
            top: roomRect.top + roomRect.height * 0.79 + "px",
            left: roomRect.left + roomRect.width * 0.30 + "px",
            width: roomRect.width * 0.08 + "px",
            height: roomRect.height * 0.1 + "px",
          }} onClick={handleCollectKey}></div>
        </>
      )}

      {/* Tåget */}
      {!trainRunning && (
        <div className="nursery-hotspot train" onClick={playTrainAnimation}></div>
      )}

      {/* Bilen */}
      <div className="nursery-hotspot car" onClick={handleBoingClick}></div>

      {/* Till vänster (del 2) */}
      <div className="nursery-hotspot to-room-2" onClick={handleToRoom2}></div>
      </>
      )}
    </div>
  );
};

export default Nursery;
