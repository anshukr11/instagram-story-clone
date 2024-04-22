import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InstagramStories } from './InstagramStory/InstagramStory';
import { dummyStories } from './utils/data';

describe('InstagramStories', () => {
  test('renders the component with thumbnails of stories', () => {
    render(<InstagramStories />);
    dummyStories.forEach((story) => {
      const storyThumbnail = screen.getByAltText(`Story ${story.id}`);
      expect(storyThumbnail).toBeInTheDocument();
      expect(storyThumbnail.getAttribute('src')).toBe(story.imageUrl);
    });
  });

  test('clicking on a story thumbnail should display the story', async () => {
    render(<InstagramStories />);
    const firstStoryThumbnail = screen.getByAltText('Story 1');
    fireEvent.click(firstStoryThumbnail);

    await waitFor(() => {
      const activeStory = screen.getByAltText('Story 1');
      expect(activeStory).toBeInTheDocument();
    });
  });

  test('stories should auto-transition to the next story after 3 seconds', async () => {
    jest.useFakeTimers();
    render(<InstagramStories />);
    const firstStoryThumbnail = screen.getByAltText('Story 1');
    fireEvent.click(firstStoryThumbnail);

    await waitFor(() => {
      const activeStory = screen.getByAltText('Story 1');
      expect(activeStory).toBeInTheDocument();
    });

    jest.advanceTimersByTime(3000); // Move to next story
    await waitFor(() => {
      const activeStory = screen.getByAltText('Story 2');
      expect(activeStory).toBeInTheDocument();
    });
  });
});
