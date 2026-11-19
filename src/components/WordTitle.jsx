export function WordTitle({ text, className = '' }) {
  const words = text.split(' ');
  return (
    <h2 className={`section-title ${className}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
          <span className="word-reveal inline-block">{word}</span>
        </span>
      ))}
    </h2>
  );
}
