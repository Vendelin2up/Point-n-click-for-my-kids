import { useRef, useEffect, useState } from "react";
import { loadFromStorage } from "../utils/storage";
import Inventory from "./Inventory";
import "./Barnkammaren.css";


type NurseryPartTwoProps = {
  setCurrentRoom: (room: "hall" | "livingroom" | "nursery" | "nursery-part2") => void;
};

const NurseryPartTwo = ({ setCurrentRoom }: NurseryPartTwoProps) => {
  const [imageSrc, setImageSrc] = useState("/barnkammaren/bed-white.jpg");
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [bedClicked, setBedClicked] = useState(false);
  const [chestOpened, setChestOpened] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const roomRef = useRef<HTMLDivElement | null>(null);
  const [roomRect, setRoomRect] = useState<DOMRect | null>(null);
  const [isFading, setIsFading] = useState(false);
  const hasKeyPart1 = loadFromStorage("keyPart1");
  const hasKeyPart2 = loadFromStorage("keyPart2");

  useEffect(() => {
    if (roomRef.current) {
      setRoomRect(roomRef.current.getBoundingClientRect());
    }
    const handleResize = () => {
      if (roomRef.current) {
        setRoomRect(roomRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBedClick = () => {
    const newImage = imageSrc.includes("white") 
      ? "/barnkammaren/bed-blue.jpg" 
      : "/barnkammaren/bed-white.jpg";
  
    setNextImage(newImage);
    setIsFading(true);
  
    setTimeout(() => {
      setImageSrc(newImage);
      setNextImage(null);
      setIsFading(false);
    }, 500); // matchar CSS-transition
  };

  const handleChestClick = () => {
    setImageSrc("/barnkammaren/treasurechest.jpg");
    setChestOpened(true);
  };

  const handleScreenClick = () => {
    if (!chestOpened) return;
    if (hasKeyPart1 && hasKeyPart2) {
      setShowCongrats(true);
    } else {
      setShowMessage(true);
      setTimeout(() => {
        setCurrentRoom("livingroom");
      }, 2000);
    }
  };

  useEffect(() => {
    if (showCongrats) {
      const audio = new Audio("/sounds/fanfare.mp3");
      audio.play();
    }
  }, [showCongrats]);

  return (
    <div ref={roomRef} className="nursery-container" onClick={handleScreenClick}>
      <Inventory />
      <img src={imageSrc} alt="Sängvy" className="nursery-image" />
{nextImage && <img src={nextImage} alt="Sängvy nästa" className="nursery-image fade-in" />}


      {roomRect && (
        <>
          {/* Klickzon för säng */}
          {!bedClicked && (
            <div
              className="nursery-hotspot"
              style={{
                top: roomRect.top + roomRect.height * 0.49 + "px",
                left: roomRect.left + roomRect.width * 0.52 + "px",
                width: roomRect.width * 0.28 + "px",
                height: roomRect.height * 0.3 + "px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleBedClick();
              }}
            ></div>
          )}

          {/* Klickzon för skattkistan */}
          {!chestOpened && (
            <div
              className="nursery-hotspot"
              style={{
                top: roomRect.top + roomRect.height * 0.45 + "px",
                left: roomRect.left + roomRect.width * 0.25 + "px",
                width: roomRect.width * 0.1 + "px",
                height: roomRect.height * 0.25 + "px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleChestClick();
              }}
            ></div>
          )}
        </>
      )}

      {/* Meddelanden */}
      {showCongrats && (
  <>
    <div className="congrats-popup">
      🎉 Grattis! Du har hittat skatten! 🎉
      Nu blir det glass!
    </div>

    {/* Confetti i olika riktningar */}
    <div className="confetti" style={{ '--x': '50px', '--y': '-80px' } as React.CSSProperties}></div>
    <div className="confetti" style={{ '--x': '-60px', '--y': '-60px' } as React.CSSProperties}></div>
    <div className="confetti" style={{ '--x': '80px', '--y': '-30px' } as React.CSSProperties}></div>
    <div className="confetti" style={{ '--x': '-40px', '--y': '-100px' } as React.CSSProperties}></div>
    <div className="confetti" style={{ '--x': '0px', '--y': '-120px' } as React.CSSProperties}></div>
    <div className="confetti" style={{ '--x': '100px', '--y': '-50px' } as React.CSSProperties}></div>
  </>
)}

      {showMessage && (
        <div className="nursery-message">
          Du behöver båda nyckeldelarna för att öppna kistan!
        </div>
      )}
    </div>
  );
};

export default NurseryPartTwo;
