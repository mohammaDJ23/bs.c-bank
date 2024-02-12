import { FC, useEffect, useRef, PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ModalNames } from '../../store';
import { useAction, useSelector } from '../../hooks';

interface FiltersWrapperAttr {
  isactive: 'true' | 'false';
}

const FiltersWrapper = styled(Box)<FiltersWrapperAttr>(({ theme, isactive }) => ({
  position: 'fixed',
  bottom: '20px',
  right: isactive === 'true' ? '20px' : '-500px',
  zIndex: '2',
  transition: 'bottom 0.3s, right 0.3s',
  width: 'calc(100% - 40px)',
  maxWidth: '330px',
  height: 'calc(100% - 40px - 64px)',
  maxHeight: '360px',
  overflowY: 'auto',
  boxShadow: '0px 5px 15px 0px rgba(0,0,0,0.2)',
  backgroundColor: 'white',
  borderRadius: '4px',
  padding: '8px 16px',
}));

const FiltersContent = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
}));

interface FilterImporation extends PropsWithChildren {
  name: ModalNames;
}

const Filter: FC<FilterImporation> = ({ children, name }) => {
  const touchStartXPositionRef = useRef<number>(0);
  const actions = useAction();
  const selectors = useSelector();
  const isFilterOpened = !!selectors.modals[name];

  useEffect(() => {
    function touchStartProcess(event: TouchEvent) {
      touchStartXPositionRef.current = event.changedTouches[0].clientX;
    }

    function touchMoveProcess(event: TouchEvent) {}

    function touchEndProcess(event: TouchEvent) {
      if (event.changedTouches[0].clientX < touchStartXPositionRef.current) {
        if (touchStartXPositionRef.current - event.changedTouches[0].clientX > 50) {
          actions.showModal(name);
        }
      } else {
        if (event.changedTouches[0].clientX - touchStartXPositionRef.current > 20) {
          actions.hideModal(name);
        }
      }
      touchStartXPositionRef.current = 0;
    }

    function keyupProcess(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        actions.hideModal(name);
      }
    }

    document.addEventListener('keyup', keyupProcess, false);
    document.addEventListener('touchstart', touchStartProcess, false);
    document.addEventListener('touchmove', touchMoveProcess, false);
    document.addEventListener('touchend', touchEndProcess, false);
    return () => {
      document.removeEventListener('keyup', keyupProcess, false);
      document.removeEventListener('touchstart', touchStartProcess, false);
      document.removeEventListener('touchmove', touchMoveProcess, false);
      document.removeEventListener('touchend', touchEndProcess, false);
    };
  }, []);

  return (
    <FiltersWrapper isactive={isFilterOpened ? 'true' : 'false'}>
      <FiltersContent>
        <Box display="flex" alignItems="center" justifyContent="end" onClick={() => actions.hideModal(name)}>
          <Close />
        </Box>
        {children}
      </FiltersContent>
    </FiltersWrapper>
  );
};

export default Filter;
