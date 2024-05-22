import Countdown from "react-countdown";

export default function ListingCountdown({ endTime }) {
  console.log("endtime ", endTime);
  // Random component
  const Completionist = () => <span>You are good to go!</span>;

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };
  return (
    <>
      <Countdown date={endTime} renderer={renderer} />
      <span>hello</span>
    </>
  );
}
