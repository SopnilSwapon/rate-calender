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
      const ReservationRow = ({reservationInfo}) => {
    console.log(reservationInfo);
    const reservationData = reservationInfo?.calendar.map(minLength =>minLength?.reservation_deadline);
    return (
        <>
            {
                reservationData.map((minLength, idx) =><StyledTableCell key={idx}>{minLength == null ? '0' : minLength}</StyledTableCell>)
            }
        </>
    );
};

export default ReservationRow;
ReservationRow.propTypes = {
    reservationInfo: PropTypes.object,
  };