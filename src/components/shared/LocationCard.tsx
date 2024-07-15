import { PropsWithChildren, FC } from 'react';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { LocationList, LocationObj, Pathes, getDynamicPath } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';
import { usePaginationList } from '../../hooks';
import { useNavigate } from 'react-router-dom';

interface LocationCardImportation extends PropsWithChildren {
  location: LocationObj;
  index: number;
  listInstance: ReturnType<typeof usePaginationList<LocationList>>;
}

const LocationCard: FC<LocationCardImportation> = ({ location, index, listInstance }) => {
  const navigate = useNavigate();

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
      onClick={() => navigate(getDynamicPath(Pathes.LOCATION, { id: location.id }))}
    >
      <ListItemButton>
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="8px">
            <Box component="div">
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 'bold' }}
                sx={{ margin: '0' }}
                primary={location.name}
              />
            </Box>

            <Box component="div" alignSelf="end">
              <ListItemText
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  new Date(location.updatedAt) > new Date(location.createdAt)
                    ? `updated at ${moment(location.updatedAt).fromNow()}`
                    : `${moment(location.createdAt).fromNow()}`
                }
              />
            </Box>
          </Box>

          <CountBadge index={index} page={listInstance.getPage()} take={listInstance.getTake()} />
        </ListItem>
      </ListItemButton>
    </Card>
  );
};

export default LocationCard;
