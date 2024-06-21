import { Typography } from "@mui/material";
import { useAction, usePaginationList, useRequest } from "../../hooks";
import ListContainer from "../../layout/ListContainer"
import Navigation from "../../layout/Navigation"
import { ModalNames } from "../../store";
import { ReceiverList } from "../../lib";
import { ReceiversApi } from "../../apis";
import List from "./List";

const ReceiversContent = () => {
  const actions = useAction();
  const request = useRequest();
  const receiverListInstance = usePaginationList(ReceiverList);
  const isInitialReceiversApiProcessing = request.isInitialApiProcessing(ReceiversApi);
  const receiversTotal = receiverListInstance.getTotal();

  const menuOptions = [<Typography onClick={() => actions.showModal(ModalNames.RECEIVER_FILTERS)}>Filters</Typography>];

  return (
    <Navigation title={`Receivers ${!isInitialReceiversApiProcessing ? `(${receiversTotal})` : ''}`} menuOptions={menuOptions}>
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
}

export default ReceiversContent;