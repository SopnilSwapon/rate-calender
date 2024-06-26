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
const MinLenghtRow = ({ minLengthInfo }) => {
    const minLengths = minLengthInfo?.calendar.map(minLength => minLength?.min_length_of_stay);
    return (
        <>
            {
                minLengths?.map((minLength, idx) => <StyledTableCell key={idx}>{minLength == null ? '0' : minLength}</StyledTableCell>)
            }
        </>
    );
};

export default MinLenghtRow;
MinLenghtRow.propTypes = {
    minLengthInfo: PropTypes.object,
};