import styled from 'styled-components';
import { BiSearchAlt2 as Icon } from 'react-icons/bi';

const ListItemComponent = ({ sickNm }) => {
  return (
    <ListItem>
      <Icon size="20px" />
      <ItemText>{sickNm}</ItemText>
    </ListItem>
  );
};

export default ListItemComponent;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
`;

const ItemText = styled.p`
  margin-left: 10px;
`;
