import { useState, useRef, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../utils/storage";
import Inventory from "./Inventory";
import TicTacToe from "./Tictactoe";
import "./Vardagsrummet.css";

type LivingRoomProps = {
  setCurrentRoom: (room: "hall" | "livingroom" | "nursery") => void;
  setHasKeyPart1: (hasKey: boolean) => void;
  hasKeyPart1: boolean;
};

const LivingRoom = ({ setCurrentRoom, setHasKeyPart1, hasKeyPart1 }: LivingRoomProps) => {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("/vardagsrummet/vardagsrum start.jpg");
  const [nextImage, setNextImage] = useState<string | null>(null); // Bild för fade
  const [isFading, setIsFading] = useState(false); // För fade-effekt
  const [pillows, setPillows] = useState({ left: false, middle: false, right: false });
  const [showTicTacToe, setShowTicTacToe] = useState(false);
  const [keyCollected, setKeyCollected] = useState(() => loadFromStorage("keyPart1"));
  const [showNotification, setShowNotification] = useState(false);

  const roomRef = useRef<HTMLDivElement>(null);
  const [roomRect, setRoomRect] = useState<DOMRect | null>(null);
  const [fact, setFact] = useState<string | null>(null);

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

   // Byter bild med fade-effekt när gardinerna öppnas
   const handleCurtainClick = () => {
    if (imageSrc === "/vardagsrummet/vardagsrum start.jpg") {
      setCurtainsOpen(true); // Uppdatera curtainsOpen när vi öppnar gardinerna
      setNextImage("/vardagsrummet/vardagsrum curtains-open.jpg");
      setIsFading(true);
  
      setTimeout(() => {
        setImageSrc("/vardagsrummet/vardagsrum curtains-open.jpg");
        setNextImage(null);
        setIsFading(false);
      }, 1000); // 1 sekund fade
    }
  };

  // Dynamisk bildväxling baserat på kuddarnas status
  const getImageSrc = () => {
    if (!isFading) {
    if (!curtainsOpen) return "/vardagsrummet/vardagsrum start.jpg";
    if (pillows.left && pillows.middle && pillows.right) return "/vardagsrummet/vardagsrum all-pillows.jpg";
    if (pillows.left && pillows.middle) return "/vardagsrummet/vardagsrum left-middle-pillow.jpg";
    if (pillows.left && pillows.right) return "/vardagsrummet/vardagsrum middle-right-pillow.jpg";
    if (pillows.left) return "/vardagsrummet/vardagsrum left-pillow.jpg";
    if (pillows.middle && pillows.right) return "/vardagsrummet/vardagsrum middle-right-pillow.jpg";
    if (pillows.middle) return "/vardagsrummet/vardagsrum middle-pillow.jpg";
    if (pillows.right) return "/vardagsrummet/vardagsrum right-pillow.jpg";
    return "/vardagsrummet/vardagsrum curtains-open.jpg";
  }
  return imageSrc; // Om fade-effekten är aktiv, behåll nuvarande bild
};

  return (
    <div ref={roomRef} className="living-room">
      <Inventory />

      {showNotification && <div className="notification">✅ Nyckeldelen har lagts till i din ficka!</div>}

      {showTicTacToe ? (
        <TicTacToe onWin={() => {
          setKeyCollected(true);
          saveToStorage("keyPart1", true);
          setHasKeyPart1(true);
          setShowTicTacToe(false);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }} />
      ) : (
        <>
          <img src={getImageSrc()} alt="Living Room Scene" className="living-room-image" />

          {!curtainsOpen && (
            <div className="message">Oj vad mörkt det var här inne, vi kanske borde dra isär gardinerna?</div>
          )}

           {/* Bilden som fade:ar in */}
           {nextImage && <img src={nextImage} alt="Transition" className="living-room-image fade-in" />}

{!isFading && imageSrc === "/vardagsrummet/vardagsrum start.jpg" && (
  <div className="message">Oj vad mörkt det var här inne, vi kanske borde dra isär gardinerna?</div>
)}

          {roomRect && (
            <>
              {!curtainsOpen && !isFading && imageSrc === "/vardagsrummet/vardagsrum start.jpg" && (
                <div
                  className="living-room-hotspot curtain-click"
                  style={{
                    top: roomRect.top + roomRect.height * 0.35 + "px",
                    left: roomRect.left + roomRect.width * 0.19 + "px",
                    width: roomRect.width * 0.15 + "px",
                    height: roomRect.height * 0.5 + "px",
                  }}
                  onClick={handleCurtainClick}
                ></div>
              )}

                {/* Tavlorna */}
                <div
                className="living-room-hotspot sun-painting"
                style={{
                  top: roomRect.top + roomRect.height * 0.35 + "px",
                  left: roomRect.left + roomRect.width * 0.45 + "px",
                  width: roomRect.width * 0.04 + "px",
                  height: roomRect.height * 0.12 + "px",
                }}
                onClick={() => setFact("🔥 Solen är ungefär 15 miljoner grader varm i mitten!")}
              ></div>

              <div
                className="living-room-hotspot earth-painting"
                style={{
                  top: roomRect.top + roomRect.height * 0.51 + "px",
                  left: roomRect.left + roomRect.width * 0.45 + "px",
                  width: roomRect.width * 0.04 + "px",
                  height: roomRect.height * 0.11 + "px",
                }}
                onClick={() => setFact("🌎 Visste du att jorden snurrar runt sin egen axel med 1670 km/h?")}
              ></div>

              <div
                className="living-room-hotspot moon-painting"
                style={{
                  top: roomRect.top + roomRect.height * 0.50 + "px",
                  left: roomRect.left + roomRect.width * 0.49 + "px",
                  width: roomRect.width * 0.038 + "px",
                  height: roomRect.height * 0.12 + "px",
                }}
                onClick={() => setFact("🌕 På månen väger du bara en sjättedel av vad du gör på jorden!")}
              ></div>

              <div
                className="living-room-hotspot blackhole-painting"
                style={{
                  top: roomRect.top + roomRect.height * 0.35 + "px",
                  left: roomRect.left + roomRect.width * 0.49 + "px",
                  width: roomRect.width * 0.038 + "px",
                  height: roomRect.height * 0.12 + "px",
                }}
                onClick={() => setFact("⚫ Inget kan fly från ett svart hål, inte ens ljus!")}
              ></div>

              {/* Popup för fakta */}
              {fact && (
                <div className="fact-popup" onClick={() => setFact(null)}>
                  {fact}
                </div>
              )}

              {curtainsOpen && (
                <>
                  {!pillows.left && (
                    <div
                      className="living-room-hotspot left-pillow"
                      style={{
                        top: roomRect.top + roomRect.height * 0.64 + "px",
                        left: roomRect.left + roomRect.width * 0.38 + "px",
                        width: roomRect.width * 0.06 + "px",
                        height: roomRect.height * 0.14 + "px",
                      }}
                      onClick={() => setPillows({ ...pillows, left: true })}
                    ></div>
                  )}

                  {!pillows.middle && (
                    <div
                      className="living-room-hotspot middle-pillow"
                      style={{
                        top: roomRect.top + roomRect.height * 0.64 + "px",
                        left: roomRect.left + roomRect.width * 0.44 + "px",
                        width: roomRect.width * 0.05 + "px",
                        height: roomRect.height * 0.14 + "px",
                      }}
                      onClick={() => setPillows({ ...pillows, middle: true })}
                    ></div>
                  )}

                  {!pillows.right && (
                    <div
                      className="living-room-hotspot right-pillow"
                      style={{
                        top: roomRect.top + roomRect.height * 0.64 + "px",
                        left: roomRect.left + roomRect.width * 0.48 + "px",
                        width: roomRect.width * 0.06 + "px",
                        height: roomRect.height * 0.14 + "px",
                      }}
                      onClick={() => setPillows({ ...pillows, right: true })}
                    ></div>
                  )}
                </>
              )}

              {pillows.middle && pillows.right && !keyCollected && !hasKeyPart1 && (
                <div
                  className="clue-message"
                  style={{
                    top: roomRect.top + roomRect.height * 0.55 + "px",
                    left: roomRect.left + roomRect.width * 0.5 + "px",
                  }}
                  onClick={() => setShowTicTacToe(true)}
                >
                  🗝️ Du hittade en ledtråd! Klicka för att spela Tic-Tac-Toe och vinna nyckeldelen!
                </div>
              )}

              {hasKeyPart1 && (
                <div className="clue-message">
                  ✅ Du har redan plockat upp nyckeldelen!
                </div>
              )}

              <div
                className="living-room-hotspot nursery-door"
                style={{
                  top: roomRect.top + roomRect.height * 0.4 + "px",
                  left: roomRect.left + roomRect.width * 0.70 + "px",
                  width: roomRect.width * 0.1 + "px",
                  height: roomRect.height * 0.45 + "px",
                }}
                onClick={() => setCurrentRoom("nursery")}
              ></div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LivingRoom;
