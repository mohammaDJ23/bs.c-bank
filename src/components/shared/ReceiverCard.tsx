import { PropsWithChildren, FC } from 'react';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { Pathes, ReceiverList, ReceiverObj, getDynamicPath } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';
import { usePaginationList } from '../../hooks';
import { useNavigate } from 'react-router-dom';

interface ReceiverCardImportation extends PropsWithChildren {
  receiver: ReceiverObj;
  index: number;
  listInstance: ReturnType<typeof usePaginationList<ReceiverList>>;
}

const ReceiverCard: FC<ReceiverCardImportation> = ({ receiver, index, listInstance }) => {
  const navigate = useNavigate();

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
      onClick={() => navigate(getDynamicPath(Pathes.RECEIVER, { id: receiver.id }))}
    >
      <ListItemButton>
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="8px">
            <Box component="div">
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 'bold' }}
                sx={{ margin: '0' }}
                primary={receiver.name}
              />
            </Box>

            <Box component="div" alignSelf="end">
              <ListItemText
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  new Date(receiver.updatedAt) > new Date(receiver.createdAt)
                    ? `updated at ${moment(receiver.updatedAt).fromNow()}`
                    : `${moment(receiver.createdAt).fromNow()}`
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

export default ReceiverCard;
