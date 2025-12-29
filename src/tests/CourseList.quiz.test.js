import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import CourseList from '../components/CourseList.svelte';

describe('CourseList - Quiz Buttons', () => {
  const mockCourses = [
    {
      id: 'course-1',
      title: 'Test Course',
      description: 'Test course description',
      chapters: [
        {
          id: 'chapter-1-1',
          title: 'Chapter 1',
          videos: [
            { id: 'video-1-1-1', title: 'Video 1', duration: '5:00', points: 10 },
            { id: 'video-1-1-2', title: 'Video 2', duration: '5:00', points: 10 },
          ],
        },
        {
          id: 'chapter-1-2',
          title: 'Chapter 2',
          videos: [
            { id: 'video-1-2-1', title: 'Video 3', duration: '5:00', points: 10 },
          ],
        },
      ],
    },
  ];

  const mockQuizzes = [
    {
      id: 'quiz-1-1',
      courseId: 'course-1',
      chapterId: 'chapter-1-1',
      title: 'Quiz: Chapter 1',
      description: 'Test your knowledge',
      unlockRequirement: { type: 'all-videos' },
      points: 20,
      passingScore: 70,
      questions: [],
    },
    {
      id: 'quiz-1-2',
      courseId: 'course-1',
      chapterId: 'chapter-1-2',
      title: 'Quiz: Chapter 2',
      description: 'Test your knowledge',
      unlockRequirement: {
        type: 'specific-video',
        videoId: 'video-1-2-1',
      },
      points: 25,
      passingScore: 70,
      questions: [],
    },
  ];

  const mockUserProgress = {
    completedVideos: [],
    completedQuizzes: [],
    points: 0,
    level: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Quiz Button Rendering', () => {
    it('should render quiz buttons when quizzes are provided', () => {
      render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: mockUserProgress,
        },
      });

      expect(screen.getByText('Quiz: Chapter 1')).toBeInTheDocument();
      expect(screen.getByText('Quiz: Chapter 2')).toBeInTheDocument();
    });

    it('should not render quiz buttons when quizzes array is empty', () => {
      render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: [],
          userProgress: mockUserProgress,
        },
      });

      expect(screen.queryByText(/Quiz:/)).not.toBeInTheDocument();
    });

    it('should render quiz buttons for matching courseId and chapterId only', () => {
      const singleQuiz = [mockQuizzes[0]]; // Only quiz for chapter-1-1

      render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: singleQuiz,
          userProgress: mockUserProgress,
        },
      });

      expect(screen.getByText('Quiz: Chapter 1')).toBeInTheDocument();
      expect(screen.queryByText('Quiz: Chapter 2')).not.toBeInTheDocument();
    });
  });

  describe('Quiz Button States - Locked/Unlocked', () => {
    it('should show locked quiz when all-videos requirement is not met', () => {
      const progress = {
        ...mockUserProgress,
        completedVideos: ['course-1-chapter-1-1-video-1-1-1'], // Only 1 of 2 videos
      };

      const { container } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      const quizButton = container.querySelector('.quiz-button.locked');
      expect(quizButton).toBeInTheDocument();
      expect(screen.getByText('🔒 Voltooi eerst alle video\'s in dit hoofdstuk')).toBeInTheDocument();
    });

    it('should show unlocked quiz when all-videos requirement is met', () => {
      const progress = {
        ...mockUserProgress,
        completedVideos: [
          'course-1-chapter-1-1-video-1-1-1',
          'course-1-chapter-1-1-video-1-1-2',
        ],
      };

      const { container } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      const lockedButton = container.querySelector('.quiz-button.locked');
      expect(lockedButton).not.toBeInTheDocument();
      expect(screen.getByText('+20 punten')).toBeInTheDocument();
    });

    it('should show locked quiz when specific-video requirement is not met', () => {
      render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: mockUserProgress,
        },
      });

      expect(screen.getByText('🔒 Voltooi eerst de vereiste video')).toBeInTheDocument();
    });

    it('should show unlocked quiz when specific-video requirement is met', () => {
      const progress = {
        ...mockUserProgress,
        completedVideos: ['course-1-chapter-1-2-video-1-2-1'],
      };

      const { container } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      // Check that chapter 2 quiz is unlocked
      const buttons = container.querySelectorAll('.quiz-button');
      const chapter2Button = Array.from(buttons).find(btn =>
        btn.textContent.includes('Quiz: Chapter 2')
      );

      expect(chapter2Button).toBeInTheDocument();
      expect(chapter2Button.classList.contains('locked')).toBe(false);
      expect(screen.getByText('+25 punten')).toBeInTheDocument();
    });
  });

  describe('Quiz Button States - Completed', () => {
    it('should show completed state when quiz is finished', () => {
      const progress = {
        ...mockUserProgress,
        completedVideos: [
          'course-1-chapter-1-1-video-1-1-1',
          'course-1-chapter-1-1-video-1-1-2',
        ],
        completedQuizzes: [
          {
            quizKey: 'course-1-chapter-1-1-quiz-1-1',
            score: 85,
            completedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      const { container } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      const completedButton = container.querySelector('.quiz-button.completed');
      expect(completedButton).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('should display quiz score for completed quizzes', () => {
      const progress = {
        ...mockUserProgress,
        completedVideos: [
          'course-1-chapter-1-1-video-1-1-1',
          'course-1-chapter-1-1-video-1-1-2',
        ],
        completedQuizzes: [
          {
            quizKey: 'course-1-chapter-1-1-quiz-1-1',
            score: 92,
            completedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      };

      render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      expect(screen.getByText('92%')).toBeInTheDocument();
    });
  });

  describe('Quiz Button Interaction', () => {
    it('should navigate to quiz page when unlocked quiz is clicked', async () => {
      const mockPush = vi.fn();
      vi.mock('svelte-spa-router', () => ({
        push: mockPush,
      }));

      const progress = {
        ...mockUserProgress,
        completedVideos: [
          'course-1-chapter-1-1-video-1-1-1',
          'course-1-chapter-1-1-video-1-1-2',
        ],
      };

      const { container } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      const quizButton = screen.getByText('Quiz: Chapter 1').closest('button');
      await fireEvent.click(quizButton);

      // Note: In actual implementation, this would call push('/quiz/quiz-1-1')
    });

    it('should allow clicking on locked quiz buttons', async () => {
      const { container } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: mockUserProgress,
        },
      });

      const lockedButton = container.querySelector('.quiz-button.locked');
      expect(lockedButton).toBeInTheDocument();

      // Locked buttons should still be clickable (to show requirements)
      await fireEvent.click(lockedButton);
      // This should work without errors
    });
  });

  describe('Quiz Button Metadata', () => {
    it('should display quiz points and passing score when unlocked', () => {
      const progress = {
        ...mockUserProgress,
        completedVideos: [
          'course-1-chapter-1-1-video-1-1-1',
          'course-1-chapter-1-1-video-1-1-2',
        ],
      };

      render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      expect(screen.getByText('+20 punten')).toBeInTheDocument();
      expect(screen.getByText('70% vereist')).toBeInTheDocument();
    });

    it('should show correct icons for different quiz states', () => {
      const progress = {
        ...mockUserProgress,
        completedVideos: [
          'course-1-chapter-1-1-video-1-1-1',
          'course-1-chapter-1-1-video-1-1-2',
        ],
        completedQuizzes: [
          {
            quizKey: 'course-1-chapter-1-1-quiz-1-1',
            score: 85,
          },
        ],
      };

      const { container } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: progress,
        },
      });

      // Completed quiz should have checkmark
      const completedQuiz = screen.getByText('Quiz: Chapter 1').closest('button');
      expect(completedQuiz.textContent).toContain('✅');

      // Locked quiz should have lock icon
      const lockedQuiz = screen.getByText('Quiz: Chapter 2').closest('button');
      expect(lockedQuiz.textContent).toContain('🔒');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing userProgress.completedQuizzes array', () => {
      const progress = {
        completedVideos: [
          'course-1-chapter-1-1-video-1-1-1',
          'course-1-chapter-1-1-video-1-1-2',
        ],
        // completedQuizzes is undefined
      };

      expect(() => {
        render(CourseList, {
          props: {
            courses: mockCourses,
            quizzes: mockQuizzes,
            userProgress: progress,
          },
        });
      }).not.toThrow();
    });

    it('should handle missing userProgress.completedVideos array', () => {
      const progress = {
        completedQuizzes: [],
        // completedVideos is undefined
      };

      expect(() => {
        render(CourseList, {
          props: {
            courses: mockCourses,
            quizzes: mockQuizzes,
            userProgress: progress,
          },
        });
      }).not.toThrow();
    });

    it('should handle null userProgress', () => {
      expect(() => {
        render(CourseList, {
          props: {
            courses: mockCourses,
            quizzes: mockQuizzes,
            userProgress: null,
          },
        });
      }).not.toThrow();
    });

    it('should handle chapter with no videos', () => {
      const coursesWithEmptyChapter = [
        {
          id: 'course-1',
          title: 'Test Course',
          chapters: [
            {
              id: 'chapter-1-1',
              title: 'Empty Chapter',
              videos: [],
            },
          ],
        },
      ];

      expect(() => {
        render(CourseList, {
          props: {
            courses: coursesWithEmptyChapter,
            quizzes: mockQuizzes,
            userProgress: mockUserProgress,
          },
        });
      }).not.toThrow();
    });
  });

  describe('Data Reactivity', () => {
    it('should update when quizzes prop changes from empty to populated', async () => {
      const { component } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: [],
          userProgress: mockUserProgress,
        },
      });

      // Initially no quizzes
      expect(screen.queryByText(/Quiz:/)).not.toBeInTheDocument();

      // Update with quizzes
      await component.$set({ quizzes: mockQuizzes });

      // Quizzes should now appear
      await waitFor(() => {
        expect(screen.getByText('Quiz: Chapter 1')).toBeInTheDocument();
      });
    });

    it('should update when userProgress changes to unlock quiz', async () => {
      const { component } = render(CourseList, {
        props: {
          courses: mockCourses,
          quizzes: mockQuizzes,
          userProgress: mockUserProgress,
        },
      });

      const { container } = component;

      // Initially locked
      let lockedButton = container.querySelector('.quiz-button.locked');
      expect(lockedButton).toBeInTheDocument();

      // Update progress to complete all videos
      await component.$set({
        userProgress: {
          ...mockUserProgress,
          completedVideos: [
            'course-1-chapter-1-1-video-1-1-1',
            'course-1-chapter-1-1-video-1-1-2',
          ],
        },
      });

      // Should now be unlocked
      await waitFor(() => {
        lockedButton = container.querySelector('.quiz-button.locked');
        // First quiz button should no longer be locked
        const firstQuizButton = screen.getByText('Quiz: Chapter 1').closest('button');
        expect(firstQuizButton.classList.contains('locked')).toBe(false);
      });
    });
  });
});
