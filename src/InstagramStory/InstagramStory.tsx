import { useEffect, useRef, useState } from "react";
import { dummyStories } from "../utils/data";
import { Story } from "../utils/interface";
import './InstagramStory.css';
import { StoryItem } from "./StoryItem";

  // Main component for the stories feature
export const InstagramStories: React.FC = () => {
const [stories, setStories] = useState<Story[]>(dummyStories);
const [currentIndex, setCurrentIndex] = useState<number | null>(null);
const wrapperRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    if (currentIndex === null && wrapperRef.current) {
      if (typeof wrapperRef.current.scrollIntoView === 'function') {
        wrapperRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, [currentIndex]);

useEffect(() => {
    let autoTransitionTimer: NodeJS.Timeout | null = null;

    // Function to handle automatic transitioning
    const handleAutoTransition = () => {
    if (currentIndex !== null) {
        const nextIndex = (currentIndex + 1) % stories.length;
        setCurrentIndex(nextIndex);
    }
    };

    // Start automatic transitioning timer when currentIndex changes
    if (currentIndex !== null) {
    autoTransitionTimer = setInterval(() => {
        handleAutoTransition();
    }, 3000);
    }

    // Cleanup function to clear the timer when currentIndex changes or component unmounts
    return () => {
    if (autoTransitionTimer) {
        clearInterval(autoTransitionTimer);
    }
    };
}, [currentIndex, stories]);

const handleNext = () => {
    setCurrentIndex((prev) => (prev !== null ? (prev + 1) % stories.length : 0));
};

const handlePrev = () => {
    setCurrentIndex((prev) =>
    prev !== null ? (prev - 1 + stories.length) % stories.length : null
    );
};

const handleStoryClick = (index: number) => {
    setCurrentIndex(index);
};

return (
    <div ref={wrapperRef} className="instagram-stories">
    <div className="stories-list">
        {stories.map((story, index) => (
        <div
            key={story.id}
            className={`story-thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleStoryClick(index)}
        >
            <img src={story.imageUrl} alt={`Story ${story.id}`} />
            
        </div>
        ))}
    </div>
    {currentIndex !== null && (
        <div className="story-container">
        <StoryItem       
            story={stories[currentIndex]}
            onNext={handleNext}
            onPrev={handlePrev}
        />
        </div>
    )}
    </div>
);
};
  