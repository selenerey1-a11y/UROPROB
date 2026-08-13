import {useEffect, useState} from 'react';

const MESSAGES = [
  <>
    Envío gratuito a partir de <strong>39,99€</strong>
  </>,
  <>Envíos Nacionales en 24-48 h</>,
];

const ROTATE_MS = 4000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      ROTATE_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar">
      <p className="announcement-bar-message" key={index}>
        {MESSAGES[index]}
      </p>
    </div>
  );
}
