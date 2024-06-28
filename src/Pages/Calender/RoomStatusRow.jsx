import { TableCell, tableCellClasses } from "@mui/material";
import styled from "styled-components";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
const RoomStatusRow = ({roomStatus}) => {
    console.log(roomStatus.status);
    return (
        <div>
            {/* <h2></h2> */}
            <StyledTableCell align="right">Room Status: {roomStatus?.status ==true ? 'Open' : 'Close'}</StyledTableCell>
        </div>
    );
};

export default RoomStatusRow;