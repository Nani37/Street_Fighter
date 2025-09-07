import React from "react";
import ReactDOM from "react-dom/client";
import "./Fighter.css";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router";

const Fighter = () => {
  const p1_logo = new URL("./utils/p1.gif", import.meta.url).href;
  const p2_logo = new URL("./utils/p2.gif", import.meta.url).href;
  const kamehaga = new URL("./utils/attack-removebg-preview.png", import.meta.url).href;
  const logo = new URL("./utils/logo.png", import.meta.url).href;
  const logo_name = new URL("./utils/logo_name.png", import.meta.url).href;
  const p1_attack = new URL("./utils/p1_attack.png", import.meta.url).href;
  const p2_attack = new URL("./utils/p2_attack.png", import.meta.url).href;
  const victory_sound = new URL("./sfx/victory.mp3", import.meta.url).href;
  const p1_attack_sound = new URL("./sfx/punch-140236.mp3", import.meta.url).href;
  const p2_attack_sound = new URL("./sfx/punch-140236.mp3", import.meta.url).href;
  const time = new URL("./sfx/three-two-one-fight-deep-voice-38382.mp3", import.meta.url).href;
  const rasengan = new URL("./utils/rasengan-removebg-preview.png", import.meta.url).href;

  const Max_Health = 100;
  const Time_Limit = 60;
  const [p1_health, setP1_Health] = useState(Max_Health);
  const [p2_health, setP2_Health] = useState(Max_Health);
  const [timer, setTimer] = useState(Time_Limit);
  const [p1Position, setP1Position] = useState("idle");
  const [p2Position, setP2Position] = useState("idle");
  const [p1_strike, setP1_strike] = useState(0);
  const [p2_strike, setP2_strike] = useState(0);
  const[gameOver, setGameOver] = useState(false);

  const attack = (player) => {
    let damage = Math.floor(Math.random() * 3) + 3;
    if (player === 1) {
      setP1_strike((s) => {
        const newStrike = s + 1;
        if (newStrike > 3) {
          damage = Math.floor(Math.random() * 3) + 7;
          play_sound("./utils/streak.wav", 1);
        }
        setP2_Health((h) => Math.max(h - damage, 0));
        return newStrike;
      });

      setP2_strike(0);
      setP1Position("attack");
      setP2Position("hit");
      play_sound(p1_attack_sound, 1);
      setTimeout(() => {
        setP1Position("idle");
        setP2Position("idle");
      }, 500);
    } else {
      setP2_strike((s) => {
        const newStrike = s + 1;
        if (newStrike > 3) {
          damage = Math.floor(Math.random() * 5) + 7;
          play_sound("./utils/streak.wav", 1);
        }
        setP1_Health((h) => Math.max(h - damage, 0));
        return newStrike;
      });
      setP1_strike(0);
      setP1Position("hit");
      setP2Position("attack");
      play_sound(p2_attack_sound, 1);
      setTimeout(() => {
        setP1Position("idle");
        setP2Position("idle");
      }, 600);
    }
  };
  const p1Ref = useRef(p1_health);
  const p2Ref = useRef(p2_health);
  useEffect(() => {
    p1Ref.current = p1_health;
    p2Ref.current = p2_health;
  }, [p1_health, p2_health]);

useEffect(() => {
  if (gameOver) return; // Stop the timer if the game is over

  const startTimer = setTimeout(() => {
    const timerId = setInterval(() => {
      setTimer((s) => {
        if (s > 0 && p1Ref.current > 0 && p2Ref.current > 0) {
          return s - 1;
        } else {
          setGameOver(true); // End the game when the timer reaches 0
          clearInterval(timerId);
          return s; // stop decreasing
        }
      });
    }, 1000);

    // cleanup for interval
    return () => clearInterval(timerId);
  }, 4000);

  // cleanup for timeout
  return () => clearTimeout(startTimer);
}, [gameOver]);


  useEffect(() => {
    const handleKeys = (e) => {
      if (gameOver) return; // Ignore key presses if the game is over
      if (e.key === "x" || e.key === "X") {
        attack(1);
      }
      if (e.key === "n" || e.key === "N") {
        attack(2);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [gameOver]);
  const winner =
    p1_health <= 0 || p2_health <= 0 || timer <= 0
      ? p1_health > p2_health
        ? "Player 1 Wins!"
        : p2_health > p1_health
        ? "Player 2 Wins!"
        : "It's a Draw!"
      : null;

    useEffect(() => {
    play_sound(time, 0.2);
  }, []);
 
  useEffect(() => {
    if (winner) {
      //     alert(`${winner} 🎉 Refresh to play again.`);
      play_sound(victory_sound, 1);
      setGameOver(true);
    }
  }, [winner]);


  const play_sound = (soundFile, volume = 1.0) => {
    const sound = new Audio(new URL(soundFile, import.meta.url).href);
    sound.volume = volume;
    sound.play();
  };

  return (
    <div className="fighter_main">
      <div className="fighter_main_inner">
        <div className="fighter_name">
          <Link to="/fighter">
            <img src={logo_name} alt="logo_name" />
          </Link>
        </div>
        <div className="fighter_logo">
          <img src={logo} alt="fighter_logo" />
        </div>
        <div className="fighter_time">Time: {timer}</div>
      </div>
      <div className="fighter_main_outer">
        <div className="fighter_outer">
          <div className="p1">
            <div className="fighter_main1">
              <div className="fighter_player"> Player 1</div>
              <div className="fighter_health_bar">
                <div
                  className={`fighter_health ${
                    p1_health <= 20 ? "low-health" : ""
                  }`}
                  style={{
                    width: `${(p1_health / Max_Health) * 100 + 50}%`,
                    backgroundColor: p1_health < 30 ? "red" : "#58ff5650",
                    transition: "width 0.5s ease-in-out",
                    marginTop: "15px",
                  }}
                >
                  {p1_health}
                </div>
              </div>
            </div>
            <div className="fighter_main2">
              <div className="player_1">
                {p1Position === "attack" ? (
                  <img src={p1_attack} alt="p1_attack" className="kamehaga-players" />
                ) : (
                  <img src={p1_logo} alt="player_1" />
                )}
              </div>
              {p1Position === "attack" && (
                <div className="p1_kamehaga">
                  {" "}
                  <img src={kamehaga} alt="p1_kamehameha" className="kamehaga" />{" "}
                </div>
              )}
            </div>
            <div className="controls">
              <h3>Controls:</h3>
              <p>Press 'X' to Attack</p>
            </div>
          </div>
          <div className="p2">
            <div className="fighter_main1">
              <div className="fighter_player"> Player 2</div>
              <div className="fighter_health_bar">
                <div
                  className={`fighter_health ${
                    p2_health <= 20 ? "low-health" : ""
                  }`}
                  style={{
                    width: `${(p2_health / Max_Health) * 100 + 50}%`,
                    backgroundColor: p2_health < 30 ? "red" : "#58ff56",
                    transition: "width 0.5s ease-in-out",
                    marginTop: "15px",
                  }}
                >
                  {p2_health}
                </div>
              </div>
            </div>
            <div className="fighter_main2">
              {p2Position === "attack" && (
                <div className="p2_kamehaga">
                  {" "}
                  <img src={rasengan} alt="p2_kamehameha" className="kamehaga" />{" "}
                </div>
              )}
              <div className="player_2">
                {p2Position === "attack" ? (
                  <img src={p2_attack} alt="p2_attack" className="kamehaga-players" />
                ) : (
                  <img src={p2_logo} alt="player_2" />
                )}
              </div>
            </div>
            <div className="controls">
              <h3>Controls:</h3>
              <p>Press 'N' to Attack</p>
            </div>
          </div>
        </div>
      </div>
      <div className="Winner">
        {winner && <div className="winner_message">{winner}</div>}
      </div>
    </div>
  );
};
export default Fighter;
