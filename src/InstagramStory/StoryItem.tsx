import { useEffect, useState } from "react";
import { Story } from "../utils/interface";

// Component for a single story
export const StoryItem: React.FC<{ story: Story; onNext: () => void; onPrev: () => void }> = ({
    story,
    onNext,
    onPrev,
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isActive, setIsActive] = useState(false);
  
    useEffect(() => {
      let interval: ReturnType<typeof setInterval> | null = null;
  
      if (isActive) {
        interval = setInterval(() => {
          setProgress((prev) => prev + 1000 / story.duration);
          if (progress >= 100) {
            onNext();
            setProgress(0);
          }
        }, 1000);
      }
  
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [story.duration, onNext, progress, isActive]);
  
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, currentTarget } = e;
      const halfWidth = currentTarget.offsetWidth / 2;
      if (clientX < halfWidth) {
        onPrev();
      } else {
        onNext();
      }
      setIsActive(true);
    };
  
    return (
      <div
        className={`story-item active`}
        onClick={handleClick}
        // onMouseEnter={() => setIsActive(true)}
        // onMouseLeave={() => setIsActive(false)}
      >
        {isLoading && <div className="loading-overlay">Loading...</div>}
        <img
          src={story.imageUrl}
          alt={`Story ${story.id}`}
          onLoad={() => setIsLoading(false)}
          className={isLoading ? 'hidden' : ''}
        />
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    );
};