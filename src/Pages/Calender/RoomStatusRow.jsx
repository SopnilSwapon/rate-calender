import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
const RoomStatusRow = ({roomRates}) => {
    console.log(roomRates);
   const rates = roomRates?.calendar.map(rates =>rates?.rate);
   console.log(rates);
//    const rate = rates.map(rate =>rate)
//    console.log(rate);
    return (
        
           <>
            {
                rates.map((rate, idx) =><StyledTableCell key={idx}>{rate}</StyledTableCell>)
            }
           </>
    );
};

export default RoomStatusRow;