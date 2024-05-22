import Countdown from "react-countdown";

export default function ListingCountdown({ endTime }) {
  // Random component
  const Completionist = () => <span>This listing has ended</span>;

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {days} days {hours} hours {minutes} minutes {seconds} seconds
        </span>
      );
    }
  };
  return (
    <>
      <Countdown date={endTime} renderer={renderer} />
    </>
  );
}
