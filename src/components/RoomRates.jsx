import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
const RoomRates = ({roomRates}) => {
    console.log(roomRates);
   const rates = roomRates?.calendar.map(rates =>rates?.rate);
   console.log(rates);
    return (
        
           <>
            {
                rates?.map((rate, idx) =><StyledTableCell key={idx}>{rate}</StyledTableCell>)
            }
           </>
    );
};


export default RoomRates;
RoomRates.propTypes = {
  roomRates: PropTypes.object,
};