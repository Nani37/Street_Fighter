import { useEffect, useRef } from "react";
import { Link } from "react-router";
import "./Homepage.css";

const Homepage = () => {
  const logo = new URL("./utils/logo.png", import.meta.url).href;
  const bgm = new URL("./sfx/bg_music.m4a", import.meta.url).href;
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(bgm);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;

    // cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [bgm]);

  // starts music after user clicks anywhere on the page
  const enableMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Audio play blocked:", err);
      });
    }
    // remove listener after first interaction
    window.removeEventListener("click", enableMusic);
  };

  useEffect(() => {
    window.addEventListener("click", enableMusic);
    return () => window.removeEventListener("click", enableMusic);
  }, []);

  return (
    <div className="homepage">
      <div className="homepage_inner">
        <div className="homepage_logo">
          <Link to="/"><img src={logo} alt="logo" /></Link>
        </div>
        <div className="homepage_text">
          <h1>Welcome to the Ultimate Fighting Game!</h1>
          <p>Get ready to battle it out in an epic showdown.</p>
          <button className="btn">
            <Link to="/fighter" className="start_button">Start Fighting</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
