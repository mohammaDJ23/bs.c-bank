import { Box, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { getDynamicPath, Location, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { DeleteLocationApi } from '../../apis';

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
  const isDeleteLocationApiProcessing = request.isApiProcessing(DeleteLocationApi);
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
    request
      .build<Location, string>(new DeleteLocationApi(location.id))
      .then(() => {
        actions.hideModal(ModalNames.CONFIRMATION);
        navigate(Pathes.LOCATIONS);
      })
      .catch((err) => actions.hideModal(ModalNames.CONFIRMATION));
  }, [location, request]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
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
        <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
          <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
            Created at:
          </Typography>{' '}
          {moment(location.createdAt).format('LLLL')}
        </Typography>
        {new Date(location.updatedAt) > new Date(location.createdAt) && (
          <Typography component={'p'} fontSize="12px" color="rgba(0, 0, 0, 0.6)">
            <Typography component={'span'} fontSize="12px" fontWeight={'bold'} color={'black'}>
              Last update:
            </Typography>{' '}
            {moment(location.updatedAt).format('LLLL')}
          </Typography>
        )}
        <Box mt="30px">
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
