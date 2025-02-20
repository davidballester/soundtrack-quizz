import Confetti from "react-confetti";

export function QuizzSuccess() {
  return (
    <>
      <Confetti recycle={false} />
      <audio src="/fanfare.mp3" style={{ visibility: "hidden" }} autoPlay />
    </>
  );
}
