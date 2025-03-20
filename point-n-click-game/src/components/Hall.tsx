import { useState, useEffect, useRef } from "react";
import "./Hall.css"; // Importera CSS-filen

type HallProps = {
  setCurrentRoom: (room: "hall" | "livingroom" | "nursery") => void;
};

const Hall = ({ setCurrentRoom }: HallProps) => {
  const [imageSrc, setImageSrc] = useState("/hallen/hallen start.jpg");
  const [nextImage, setNextImage] = useState<string | null>(null); // För övergångsbilden
  const [isFading, setIsFading] = useState(false); // För fade-effekt
  const [showMessage, setShowMessage] = useState("start");
  const [extraMessage, setExtraMessage] = useState<string | null>(null);
  const [clothesPickedUp, setClothesPickedUp] = useState(false);
  const [clueRevealed, setClueRevealed] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);

  // Uppdatera bildens position vid fönsterstorleksändring
  useEffect(() => {
    const updateRect = () => {
      if (imageRef.current) {
        setImageRect(imageRef.current.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  const handleClothesClick = () => {
    setNextImage("/hallen/hallen clue-visible.jpg"); // Ställ in den nya bilden
    setIsFading(true); // Starta fade-effekten

    setTimeout(() => {
      setImageSrc("/hallen/hallen clue-visible.jpg");
      setNextImage(null); // Rensa den övergående bilden
      setIsFading(false); // Sluta faden efter bytet
      setShowMessage("clue");
      setClothesPickedUp(true);
    }, 1000); // 1 sekunders fade-effekt
  };

  const handleClueClick = () => {
    setShowMessage("clueText");
    setClueRevealed(true);
  };

  const handleDoorClick = (door: string) => {
    if (!clueRevealed) return;

    if (door === "kitchen") {
      setExtraMessage("Köket är ett expansionspaket för 199:- som förväntas släppas september 2027!");
    } else if (door === "bedroom") {
      setExtraMessage("Sovrummet är för närvarande under renovering. Återkom 2028!");
    } else if (door === "livingroom") {
      setCurrentRoom("livingroom");
    }
  };

  return (
    <div className="hall-container">
      {/* Bakgrundsbilden med ref */}
      <img ref={imageRef} src={imageSrc} alt="Hallway scene" className="hall-image" />

      {/* Bilden som tonar in över den gamla */}
      {nextImage && <img src={nextImage} alt="Transition" className={`hall-image fade-in`} />}

      {/* Klickbara områden om vi har bildens position */}
      {imageRect && (
        <>
          {/* 1: Gå vidare till vardagsrummet */}
          <div
            className="hall-hotspot"
            style={{
              top: imageRect.top + imageRect.height * 0.25 + "px",
              left: imageRect.left + imageRect.width * 0.40 + "px",
              width: imageRect.width * 0.12 + "px",
              height: imageRect.height * 0.25 + "px",
            }}
            onClick={() => handleDoorClick("livingroom")}
          ></div>

          {/* 2: Sovrummet */}
          <div
            className="hall-hotspot"
            style={{
              top: imageRect.top + imageRect.height * 0.20 + "px",
              left: imageRect.left + imageRect.width * 0.52 + "px",
              width: imageRect.width * 0.08 + "px",
              height: imageRect.height * 0.30 + "px",
            }}
            onClick={() => handleDoorClick("bedroom")}
          ></div>

          {/* 3: Köket */}
          <div
            className="hall-hotspot"
            style={{
              top: imageRect.top + imageRect.height * 0.1 + "px",
              left: imageRect.left + imageRect.width * 0.60 + "px",
              width: imageRect.width * 0.08 + "px",
              height: imageRect.height * 0.25 + "px",
            }}
            onClick={() => handleDoorClick("kitchen")}
          ></div>

          {/* 4: Ytterkläderna */}
          {!clothesPickedUp && (
            <div
              className="hall-hotspot"
              style={{
                top: imageRect.top + imageRect.height * 0.65 + "px",
                left: imageRect.left + imageRect.width * 0.4 + "px",
                width: imageRect.width * 0.20 + "px",
                height: imageRect.height * 0.20 + "px",
              }}
              onClick={handleClothesClick}
            ></div>
          )}
        </>
      )}

      {/* Klickbar ledtråd efter att kläderna är borta */}
{clothesPickedUp && !clueRevealed && imageRect && (
  <div
    className="hall-hotspot clue-click"
    style={{
      top: imageRect.top + imageRect.height * 0.73 + "px",  // Justera så det hamnar över lappen
      left: imageRect.left + imageRect.width * 0.48 + "px", // Justera horisontellt
      width: imageRect.width * 0.08 + "px", // Gör zonen tillräckligt stor
      height: imageRect.height * 0.06 + "px",
    }}
    onClick={handleClueClick}
  >
    Läs ledtråden
  </div>
)}

      {/* 🔥 Meddelande fixat: Flyttat till botten av bilden! */}
      {showMessage !== "" && (
        <div className="hall-message" onClick={() => setShowMessage("")}>
          {showMessage === "start" && "Oj, vi måste hänga upp våra ytterkläder på kroken först!"}
          {showMessage === "clue" && "Oj, titta! En ledtråd!"}
          {showMessage === "clueText" && "En nyckel är gömd någonstans i huset... hitta de 2 delarna för att låsa upp skattkistan i barnkammaren!"}
        </div>
      )}

      {/* Extra meddelanden för dörrarna */}
      {extraMessage && <div className="hall-extra-message">{extraMessage}</div>}
    </div>
  );
};

export default Hall;
