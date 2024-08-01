import { Box } from '@mui/material';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { wait } from '../../lib';

const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100px',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    'div[data-arrow="carousel-left-arrow"]': {
      opacity: 1,
    },
    'div[data-arrow="carousel-right-arrow"]': {
      opacity: 1,
    },
  },
}));

const Content = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  '& > div': {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    transition: 'left 0.6s cubic-bezier(0.47, 0.13, 0.15, 0.89);',
  },
}));

interface Props extends PropsWithChildren {
  infinity?: boolean;
  timer?: number;
  showArrows?: boolean;
}

const Carousel: FC<Props> = ({ children, infinity = false, timer = 2000, showArrows = true }) => {
  const screenSizeRef = useRef(0);
  const containerElRef = useRef<HTMLElement | null>(null);
  const contentElRef = useRef<HTMLElement | null>(null);
  const slideWidthRef = useRef(0);
  const movingRef = useRef(true);

  function getContainerEl() {
    return containerElRef.current!;
  }

  function getContentEl() {
    return contentElRef.current!;
  }

  function getFirstElementChild() {
    return getContentEl().firstElementChild!;
  }

  function getLastElementChild() {
    return getContentEl().lastElementChild!;
  }

  function getFirstChild() {
    return getContentEl().firstChild!;
  }

  function getLastChild() {
    return getContentEl().lastChild!;
  }

  function setScreenSize() {
    // if (window.innerWidth >= 1200) {
    //   screenSizeRef.current = 3;
    // } else if (window.innerWidth >= 500) {
    //   screenSizeRef.current = 2;
    // } else {
    //   screenSizeRef.current = 1;
    // }
    screenSizeRef.current = 1;
  }

  function setSlides() {
    slideWidthRef.current = getContainerEl().offsetWidth / screenSizeRef.current;
    let left = -slideWidthRef.current;
    Array.from(getContentEl().children).forEach((child) => {
      // @ts-ignore
      child.style.width = `${slideWidthRef.current}px`;
      // @ts-ignore
      child.style.left = `${left}px`;
      left += slideWidthRef.current;
    });
  }

  function initResize() {
    setScreenSize();
    setSlides();
    moveSlidesRight();
  }

  function onResize() {
    setScreenSize();
    setSlides();
  }

  useEffect(() => {
    if (containerElRef.current && contentElRef.current && contentElRef.current.children.length > 0) {
      initResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  function addClone() {
    const clonedLastSlide = getLastElementChild().cloneNode(true);
    // @ts-ignore
    clonedLastSlide.style.left = `-${slideWidthRef.current}px`;
    getContentEl().insertBefore(clonedLastSlide, getFirstChild());
  }

  function removeClone() {
    getContentEl().removeChild(getFirstElementChild());
  }

  /**
   *
   * next
   *
   */

  function next() {
    if (movingRef.current) {
      movingRef.current = false;
      removeClone();
      getFirstElementChild().addEventListener('transitionend', replaceToEnd);
      moveSlidesLeft();
    }
  }

  function replaceToEnd() {
    const firstSlide = getFirstElementChild();
    getContentEl().removeChild(firstSlide);
    getContentEl().appendChild(firstSlide);
    // @ts-ignore
    firstSlide.style.left = `${(getContentEl().children.length - 1) * slideWidthRef.current}px`;
    addClone();
    movingRef.current = true;
    firstSlide.removeEventListener('transitionend', replaceToEnd);
  }

  function moveSlidesLeft() {
    let maxWidth = (getContentEl().children.length - 1) * slideWidthRef.current;
    Array.from(getContentEl().children)
      .reverse()
      .forEach((child) => {
        maxWidth -= slideWidthRef.current;
        // @ts-ignore
        child.style.left = `${maxWidth}px`;
      });
  }

  /**
   *
   * prev
   *
   */

  function prev() {
    if (movingRef.current) {
      movingRef.current = false;
      const lastSlide = getLastChild();
      getContentEl().removeChild(lastSlide);
      getContentEl().insertBefore(lastSlide, getFirstChild());
      removeClone();
      getFirstElementChild().addEventListener('transitionend', activateAgain);
      moveSlidesRight();
    }
  }

  function activateAgain() {
    movingRef.current = true;
    getFirstElementChild().removeEventListener('transitionend', activateAgain);
  }

  function moveSlidesRight() {
    let left = 0;
    Array.from(getContentEl().children).forEach((child) => {
      // @ts-ignore
      child.style.left = `${left}px`;
      left += slideWidthRef.current;
    });
    addClone();
  }

  useEffect(() => {
    if (!infinity) return;

    (async () => {
      for (;;) {
        await wait(timer);
        next();
      }
    })();
  }, []);

  return (
    <Container ref={containerElRef}>
      {showArrows && (
        <Box
          onClick={() => prev()}
          data-arrow="carousel-left-arrow"
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            zIndex: 2,
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            opacity: 0,
            transition: 'opacity 0.2s',
            boxShadow: '0px 0px 2px 0px rgba(143,143,143,1)',
          }}
        >
          <ChevronLeftIcon color="action" fontSize="small" />
        </Box>
      )}
      <Content ref={contentElRef}>{children}</Content>
      {showArrows && (
        <Box
          onClick={() => next()}
          data-arrow="carousel-right-arrow"
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            zIndex: 2,
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            opacity: 0,
            transition: 'opacity 0.2s',
            boxShadow: '0px 0px 2px 0px rgba(143,143,143,1)',
          }}
        >
          <ChevronRightIcon color="action" fontSize="small" />
        </Box>
      )}
    </Container>
  );
};

export default Carousel;
