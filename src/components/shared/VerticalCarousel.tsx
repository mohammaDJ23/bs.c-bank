import { Box } from '@mui/material';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { wait } from '../../lib';

const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    'div[data-arrow="carousel-up-arrow"]': {
      opacity: 1,
    },
    'div[data-arrow="carousel-down-arrow"]': {
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
    transition: 'top 0.6s cubic-bezier(0.47, 0.13, 0.15, 0.89);',
  },
}));

interface Props extends PropsWithChildren {
  infinity?: boolean;
  timer?: number;
  showArrows?: boolean;
  height?: string;
}

const VerticalCarousel: FC<Props> = ({
  children,
  infinity = false,
  timer = 2000,
  showArrows = true,
  height = '100px',
}) => {
  const screenSizeRef = useRef(0);
  const containerElRef = useRef<HTMLElement | null>(null);
  const contentElRef = useRef<HTMLElement | null>(null);
  const slideHeightRef = useRef(0);
  const movingRef = useRef(true);
  const infinityRef = useRef(infinity);

  function getContainerEl() {
    return containerElRef.current!;
  }

  function getContentEl() {
    return contentElRef.current!;
  }

  function IsChildrenExist() {
    const contentEl = getContentEl();
    return contentEl && contentEl.children.length > 2;
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
    slideHeightRef.current = getContainerEl().offsetHeight / screenSizeRef.current;
    let top = -slideHeightRef.current;
    Array.from(getContentEl().children).forEach((child) => {
      // @ts-ignore
      child.style.height = `${slideHeightRef.current}px`;
      // @ts-ignore
      child.style.top = `${top}px`;
      top += slideHeightRef.current;
    });
  }

  function initResize() {
    setScreenSize();
    setSlides();
    moveSlidesUp();
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
    clonedLastSlide.style.top = `-${slideHeightRef.current}px`;
    getContentEl().insertBefore(clonedLastSlide, getFirstChild());
  }

  function removeClone() {
    getContentEl().removeChild(getFirstElementChild());
  }

  /**
   *
   * down
   *
   */

  function down() {
    if (movingRef.current && IsChildrenExist()) {
      movingRef.current = false;
      removeClone();
      getFirstElementChild().addEventListener('transitionend', replaceToEnd);
      moveSlidesDown();
    }
  }

  function replaceToEnd() {
    const firstSlide = getFirstElementChild();
    getContentEl().removeChild(firstSlide);
    getContentEl().appendChild(firstSlide);
    // @ts-ignore
    firstSlide.style.top = `${(getContentEl().children.length - 1) * slideHeightRef.current}px`;
    addClone();
    movingRef.current = true;
    firstSlide.removeEventListener('transitionend', replaceToEnd);
  }

  function moveSlidesDown() {
    let maxHeight = (getContentEl().children.length - 1) * slideHeightRef.current;
    Array.from(getContentEl().children)
      .reverse()
      .forEach((child) => {
        maxHeight -= slideHeightRef.current;
        // @ts-ignore
        child.style.top = `${maxHeight}px`;
      });
  }

  /**
   *
   * up
   *
   */

  function up() {
    if (movingRef.current && IsChildrenExist()) {
      movingRef.current = false;
      const lastSlide = getLastChild();
      getContentEl().removeChild(lastSlide);
      getContentEl().insertBefore(lastSlide, getFirstChild());
      removeClone();
      getFirstElementChild().addEventListener('transitionend', activateAgain);
      moveSlidesUp();
    }
  }

  function activateAgain() {
    movingRef.current = true;
    getFirstElementChild().removeEventListener('transitionend', activateAgain);
  }

  function moveSlidesUp() {
    let top = 0;
    Array.from(getContentEl().children).forEach((child) => {
      // @ts-ignore
      child.style.top = `${top}px`;
      top += slideHeightRef.current;
    });
    addClone();
  }

  useEffect(() => {
    if (!infinity) return;

    (async () => {
      for (; IsChildrenExist(); ) {
        await wait(timer);
        if (infinityRef.current) {
          down();
        }
      }
    })();
  }, []);

  return (
    <Container
      sx={{ height }}
      ref={containerElRef}
      onMouseEnter={() => (infinityRef.current = false)}
      onMouseLeave={() => (infinityRef.current = infinity)}
    >
      {showArrows && IsChildrenExist() && (
        <Box
          onClick={() => up()}
          data-arrow="carousel-up-arrow"
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            zIndex: 2,
            left: '50%',
            top: '10px',
            transform: 'translateX(-50%)',
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
          <ExpandLessIcon color="action" fontSize="small" />
        </Box>
      )}
      <Content ref={contentElRef}>{children}</Content>
      {showArrows && IsChildrenExist() && (
        <Box
          onClick={() => down()}
          data-arrow="carousel-down-arrow"
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            zIndex: 2,
            left: '50%',
            bottom: '10px',
            transform: 'translateX(-50%)',
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
          <ExpandMoreIcon color="action" fontSize="small" />
        </Box>
      )}
    </Container>
  );
};

export default VerticalCarousel;
