import { Box, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { getDynamicPath, Location, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { DeleteLocationApi } from '../../apis';
import { useSnackbar } from 'notistack';
import ResetStyleWithAnimation from '../shared/ResetStyleWithAnimation';

interface DetailsImporation {
  location: Location;
}

const Details: FC<DetailsImporation> = ({ location }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const actions = useAction();
  const selectors = useSelector();
  const request = useRequest();
  const snackbar = useSnackbar();
  const isDeleteLocationApiProcessing = request.isApiProcessing(DeleteLocationApi);
  const isDeleteLocationApiFailed = request.isProcessingApiFailed(DeleteLocationApi);
  const isDeleteLocationApiSuccessed = request.isProcessingApiSuccessed(DeleteLocationApi);
  const deleteLocationApiExceptionMessage = request.getExceptionMessage(DeleteLocationApi);
  const options = [{ label: 'Update', path: getDynamicPath(Pathes.UPDATE_LOCATION, { id: location.id }) }];

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onMenuClick = useCallback(
    (option: (typeof options)[number]) => {
      return function () {
        onMenuClose();
        navigate(option.path);
      };
    },
    [onMenuClose, navigate]
  );

  const onDeleteLocation = useCallback(() => {
    actions.showModal(ModalNames.CONFIRMATION);
  }, []);

  const deleteLocation = useCallback(() => {
    actions.deleteLocation(location.id);
  }, [location]);

  useEffect(() => {
    if (isDeleteLocationApiSuccessed) {
      actions.hideModal(ModalNames.CONFIRMATION);
      navigate(Pathes.LOCATIONS);
    } else if (isDeleteLocationApiFailed) {
      snackbar.enqueueSnackbar({ message: deleteLocationApiExceptionMessage, variant: 'error' });
    }
  }, [isDeleteLocationApiFailed, isDeleteLocationApiSuccessed]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px" overflow="hidden">
        <Box overflow="hidden" mb="15px" width="100%">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
              }}
              width="100%"
              display="flex"
              gap="8px"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography component={'p'} fontSize="14px" fontWeight={'bold'}>
                {location.name}
              </Typography>
              <IconButton onClick={onMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClick={onMenuClose}>
                {options.map((option) => (
                  <MenuItem key={option.path} onClick={onMenuClick(option)}>
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </ResetStyleWithAnimation>
        </Box>

        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Typography
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.02s',
              }}
              component={'p'}
              fontSize="12px"
              color="rgba(0, 0, 0, 0.6)"
            >
              <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                Created at:
              </Typography>{' '}
              {moment(location.createdAt).format('LLLL')}
            </Typography>
          </ResetStyleWithAnimation>
        </Box>

        {new Date(location.updatedAt) > new Date(location.createdAt) && (
          <Box overflow="hidden">
            <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
              <Typography
                sx={{
                  transform: 'translateY(100%)',
                  transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                  transitionDelay: '0.04s',
                }}
                component={'p'}
                fontSize="12px"
                color="rgba(0, 0, 0, 0.6)"
              >
                <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
                  Last update:
                </Typography>{' '}
                {moment(location.updatedAt).format('LLLL')}
              </Typography>
            </ResetStyleWithAnimation>
          </Box>
        )}
        <Box overflow="hidden">
          <ResetStyleWithAnimation sx={{ transform: 'translateY(0)' }}>
            <Box
              mt="30px"
              sx={{
                transform: 'translateY(100%)',
                transition: 'cubic-bezier(.41,.55,.03,.96) 1s',
                transitionDelay: '0.06s',
              }}
            >
              <Button
                disabled={isDeleteLocationApiProcessing}
                onClick={onDeleteLocation}
                variant="contained"
                color="error"
                size="small"
                sx={{ textTransform: 'capitalize' }}
              >
                Delete the Location
              </Button>
            </Box>
          </ResetStyleWithAnimation>
        </Box>
      </Box>
      <Modal
        title="Deleting the location"
        body="Are you sure do delete the location?"
        isLoading={isDeleteLocationApiProcessing}
        isActive={selectors.modals[ModalNames.CONFIRMATION]}
        onCancel={() => actions.hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteLocation()}
      />
    </>
  );
};

export default Details;
